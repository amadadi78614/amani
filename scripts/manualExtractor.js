const fs = require('fs').promises;
const pdf = require('pdf-parse');

class ManualPDFExtractor {
  constructor() {
    // Mathematics Paper 1 typical sections
    this.mathsSections = {
      'Algebra': [
        /simplif/i,
        /factoris/i,
        /expand/i,
        /solve.*equation/i,
        /inequalit/i,
        /expression/i,
        /\bx\^2\b/,
        /quadratic/i
      ],
      'Exponents and Surds': [
        /exponent/i,
        /surd/i,
        /rationalise/i,
        /\b2\^x\b/,
        /\b3\^n\b/,
        /power/i
      ],
      'Number Patterns': [
        /pattern/i,
        /sequence/i,
        /arithmetic.*sequence/i,
        /geometric.*sequence/i,
        /series/i,
        /term/i,
        /\bT_n\b/,
        /nth term/i
      ],
      'Functions': [
        /function/i,
        /f\(x\)/,
        /g\(x\)/,
        /parabola/i,
        /hyperbola/i,
        /exponential/i,
        /domain/i,
        /range/i,
        /axis.*symmetry/i,
        /turning point/i,
        /asymptote/i,
        /intercept/i,
        /inverse/i
      ],
      'Finance': [
        /interest/i,
        /compound/i,
        /investment/i,
        /loan/i,
        /annuity/i,
        /present.*value/i,
        /future.*value/i,
        /depreciat/i,
        /inflat/i
      ],
      'Calculus': [
        /derivative/i,
        /differentiate/i,
        /gradient/i,
        /rate.*change/i,
        /dy\/dx/i,
        /f'\(x\)/,
        /tangent/i,
        /maxim/i,
        /minim/i,
        /turning point/i,
        /concav/i
      ],
      'Probability': [
        /probability/i,
        /P\(/,
        /event/i,
        /sample space/i,
        /independent/i,
        /mutually exclusive/i,
        /venn diagram/i,
        /tree diagram/i
      ],
      'Trigonometry': [
        /sin/i,
        /cos/i,
        /tan/i,
        /trigonometric/i,
        /angle/i,
        /\bθ\b/,
        /identity/i,
        /prove.*trig/i
      ],
      'Analytical Geometry': [
        /distance.*formula/i,
        /midpoint/i,
        /gradient.*line/i,
        /equation.*line/i,
        /parallel/i,
        /perpendicular/i,
        /circle.*equation/i,
        /x\^2.*y\^2/
      ],
      'Statistics': [
        /mean/i,
        /median/i,
        /mode/i,
        /quartile/i,
        /standard deviation/i,
        /variance/i,
        /box.*whisker/i,
        /histogram/i,
        /frequency/i,
        /data/i
      ]
    };
  }

  async extractFromPDF(filepath) {
    try {
      console.log(`\nReading PDF: ${filepath}\n`);
      const dataBuffer = await fs.readFile(filepath);
      const data = await pdf(dataBuffer);
      
      console.log(`Total pages: ${data.numpages}`);
      console.log(`Extracting text...\n`);
      
      return data.text;
    } catch (error) {
      console.error(`Error reading PDF: ${error.message}`);
      return null;
    }
  }

  extractQuestions(text) {
    const questions = [];
    
    // Split by question numbers - handles various formats
    // QUESTION 1, Question 1, 1., 1.1, etc.
    const lines = text.split('\n');
    let currentQuestion = null;
    let currentText = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this line starts a new question
      const questionMatch = line.match(/^(?:QUESTION\s+)?(\d+)(?:\.(\d+))?(?:\s|$)/i);
      
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuestion && currentText.length > 20) {
          questions.push({
            number: currentQuestion,
            text: currentText.trim()
          });
        }
        
        // Start new question
        currentQuestion = questionMatch[0].trim();
        currentText = line;
      } else if (currentQuestion) {
        // Continue building current question
        currentText += '\n' + line;
      }
    }
    
    // Don't forget the last question
    if (currentQuestion && currentText.length > 20) {
      questions.push({
        number: currentQuestion,
        text: currentText.trim()
      });
    }
    
    console.log(`Extracted ${questions.length} questions\n`);
    return questions;
  }

  categorizeQuestion(questionText) {
    const categories = [];
    
    for (const [section, patterns] of Object.entries(this.mathsSections)) {
      for (const pattern of patterns) {
        if (pattern.test(questionText)) {
          if (!categories.includes(section)) {
            categories.push(section);
          }
          break;
        }
      }
    }
    
    return categories.length > 0 ? categories : ['General'];
  }

  extractMarks(questionText) {
    // Look for marks in format: (3), [5], (10 marks), etc.
    const markPatterns = [
      /\[(\d+)\s*marks?\]/i,
      /\((\d+)\s*marks?\)/i,
      /\[(\d+)\]/,
      /\((\d+)\)/
    ];
    
    const marks = [];
    for (const pattern of markPatterns) {
      const matches = questionText.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        marks.push(parseInt(match[1]));
      }
    }
    
    return marks.length > 0 ? Math.max(...marks) : null;
  }

  extractYear(text) {
    // Try to find year in text (2018-2024)
    const yearMatch = text.match(/20(1[8-9]|2[0-4])/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }

  async processFile(filepath, outputPath) {
    console.log('='.repeat(60));
    console.log('MATHEMATICS PAPER 1 - QUESTION EXTRACTOR');
    console.log('='.repeat(60));
    
    // Extract text from PDF
    const text = await this.extractFromPDF(filepath);
    if (!text) return;
    
    // Extract questions
    const questions = this.extractQuestions(text);
    
    // Categorize and structure each question
    const structuredQuestions = questions.map(q => {
      const categories = this.categorizeQuestion(q.text);
      const marks = this.extractMarks(q.text);
      const year = this.extractYear(q.text) || 2023;
      
      return {
        questionNumber: q.number,
        questionText: q.text,
        topics: categories,
        marks: marks,
        year: year,
        subject: 'Mathematics',
        grade: 12,
        source: 'DBE Official',
        type: 'paper'
      };
    });
    
    // Group by topic
    const byTopic = {};
    structuredQuestions.forEach(q => {
      q.topics.forEach(topic => {
        if (!byTopic[topic]) {
          byTopic[topic] = [];
        }
        byTopic[topic].push(q);
      });
    });
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('EXTRACTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total questions extracted: ${structuredQuestions.length}\n`);
    
    console.log('Questions by Topic:');
    console.log('-'.repeat(60));
    for (const [topic, questions] of Object.entries(byTopic)) {
      console.log(`${topic.padEnd(30)} ${questions.length} questions`);
    }
    
    // Save results
    await fs.mkdir('./data/questions', { recursive: true });
    
    // Save all questions
    await fs.writeFile(
      './data/questions/extracted-all.json',
      JSON.stringify(structuredQuestions, null, 2)
    );
    
    // Save grouped by topic
    await fs.writeFile(
      './data/questions/extracted-by-topic.json',
      JSON.stringify(byTopic, null, 2)
    );
    
    // Create the format needed for the website
    const websiteFormat = {
      'Mathematics': {
        '12': byTopic
      }
    };
    
    await fs.writeFile(
      './data/questions/website-format.json',
      JSON.stringify(websiteFormat, null, 2)
    );
    
    console.log('\n' + '='.repeat(60));
    console.log('FILES SAVED');
    console.log('='.repeat(60));
    console.log('✓ data/questions/extracted-all.json');
    console.log('✓ data/questions/extracted-by-topic.json');
    console.log('✓ data/questions/website-format.json');
    
    console.log('\n' + '='.repeat(60));
    console.log('NEXT STEPS');
    console.log('='.repeat(60));
    console.log('1. Review the extracted questions in extracted-all.json');
    console.log('2. If satisfied, copy to your main data file:');
    console.log('   cp data/questions/website-format.json data/questions.json');
    console.log('3. Deploy:');
    console.log('   git add data/questions.json');
    console.log('   git commit -m "Add extracted questions"');
    console.log('   git push origin main');
    console.log('='.repeat(60) + '\n');
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('\nUsage: node scripts/manualExtractor.js <path-to-pdf>\n');
    console.log('Example: node scripts/manualExtractor.js data/papers/pdfs/Maths_P1_Combined.pdf\n');
    process.exit(1);
  }
  
  const extractor = new ManualPDFExtractor();
  extractor.processFile(args[0]);
}

module.exports = ManualPDFExtractor;
