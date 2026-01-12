const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');

class DBEExamScraper {
  constructor() {
    this.sources = [
      {
        name: 'DBE Official',
        url: 'https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx',
        type: 'official'
      },
      {
        name: 'Stanmore Physics',
        url: 'https://stanmorephysics.com',
        type: 'aggregator'
      }
    ];
    
    this.subjects = [
      'Mathematics',
      'Physical Sciences',
      'Life Sciences',
      'Accounting',
      'Business Studies',
      'Economics',
      'English',
      'Geography',
      'History'
    ];
    
    this.grades = [11, 12];
    this.years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  }

  async scrapeDBEOfficial() {
    console.log('Scraping DBE Official site...');
    const papers = [];
    
    try {
      // Note: DBE site structure - adjust based on actual site
      for (const year of this.years) {
        for (const subject of this.subjects) {
          for (const grade of this.grades) {
            const searchUrl = `https://www.education.gov.za/Curriculum/NationalSeniorCertificate(NSC)Examinations/NSCPastExaminationpapers.aspx`;
            
            try {
              const response = await axios.get(searchUrl, {
                timeout: 10000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
              });
              
              const $ = cheerio.load(response.data);
              
              // Find PDF links - adjust selectors based on actual site structure
              $('a[href$=".pdf"]').each((i, elem) => {
                const href = $(elem).attr('href');
                const text = $(elem).text().trim();
                
                if (text.includes(subject) && text.includes(`Grade ${grade}`)) {
                  papers.push({
                    url: href.startsWith('http') ? href : `https://www.education.gov.za${href}`,
                    subject,
                    grade,
                    year,
                    type: text.includes('Memo') ? 'memo' : 'paper',
                    source: 'DBE Official',
                    filename: `${subject}_Grade${grade}_${year}_${text.includes('Memo') ? 'Memo' : 'Paper'}.pdf`
                  });
                }
              });
            } catch (error) {
              console.log(`Error fetching ${subject} Grade ${grade} ${year}:`, error.message);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error scraping DBE:', error.message);
    }
    
    return papers;
  }

  async scrapeStanmorePhysics() {
    console.log('Scraping Stanmore Physics...');
    const papers = [];
    
    try {
      for (const grade of this.grades) {
        for (const subject of this.subjects) {
          const subjectSlug = subject.toLowerCase().replace(/\s+/g, '-');
          const url = `https://stanmorephysics.com/grade-${grade}/${subjectSlug}/`;
          
          try {
            const response = await axios.get(url, {
              timeout: 10000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });
            
            const $ = cheerio.load(response.data);
            
            $('a[href*=".pdf"]').each((i, elem) => {
              const href = $(elem).attr('href');
              const text = $(elem).text().trim();
              
              // Extract year from filename
              const yearMatch = text.match(/20\d{2}/);
              const year = yearMatch ? parseInt(yearMatch[0]) : null;
              
              if (year && this.years.includes(year)) {
                papers.push({
                  url: href.startsWith('http') ? href : `https://stanmorephysics.com${href}`,
                  subject,
                  grade,
                  year,
                  type: text.toLowerCase().includes('memo') ? 'memo' : 'paper',
                  source: 'Stanmore Physics',
                  filename: `${subject}_Grade${grade}_${year}_${text.includes('memo') ? 'Memo' : 'Paper'}.pdf`
                });
              }
            });
          } catch (error) {
            console.log(`Error fetching ${subject} Grade ${grade}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error scraping Stanmore:', error.message);
    }
    
    return papers;
  }

  async downloadPaper(paper, outputDir) {
    try {
      const filepath = path.join(outputDir, paper.filename);
      
      // Check if file already exists
      try {
        await fs.access(filepath);
        console.log(`Skipping ${paper.filename} - already exists`);
        return filepath;
      } catch {
        // File doesn't exist, proceed with download
      }
      
      const response = await axios({
        method: 'get',
        url: paper.url,
        responseType: 'stream',
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      await pipeline(response.data, createWriteStream(filepath));
      console.log(`Downloaded: ${paper.filename}`);
      return filepath;
    } catch (error) {
      console.error(`Error downloading ${paper.filename}:`, error.message);
      return null;
    }
  }

  async scrapeAll() {
    console.log('Starting comprehensive scrape...');
    
    const allPapers = [];
    
    // Scrape from all sources
    const dbepapers = await this.scrapeDBEOfficial();
    const stanmorePapers = await this.scrapeStanmorePhysics();
    
    allPapers.push(...dbepapers, ...stanmorePapers);
    
    // Remove duplicates
    const uniquePapers = this.removeDuplicates(allPapers);
    
    console.log(`Found ${uniquePapers.length} unique papers`);
    
    // Save metadata
    await fs.mkdir('./data/papers', { recursive: true });
    await fs.writeFile(
      './data/papers/metadata.json',
      JSON.stringify(uniquePapers, null, 2)
    );
    
    return uniquePapers;
  }

  removeDuplicates(papers) {
    const seen = new Set();
    return papers.filter(paper => {
      const key = `${paper.subject}_${paper.grade}_${paper.year}_${paper.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async downloadAll(papers, outputDir = './data/papers/pdfs') {
    await fs.mkdir(outputDir, { recursive: true });
    
    const results = [];
    
    for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      console.log(`Downloading ${i + 1}/${papers.length}: ${paper.filename}`);
      
      const filepath = await this.downloadPaper(paper, outputDir);
      
      if (filepath) {
        results.push({
          ...paper,
          localPath: filepath,
          downloaded: true
        });
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save download results
    await fs.writeFile(
      './data/papers/download-results.json',
      JSON.stringify(results, null, 2)
    );
    
    console.log(`Successfully downloaded ${results.length} papers`);
    return results;
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    const scraper = new DBEExamScraper();
    const papers = await scraper.scrapeAll();
    console.log('\nStarting downloads...');
    await scraper.downloadAll(papers);
    console.log('\nScraping complete!');
  })();
}

module.exports = DBEExamScraper;
