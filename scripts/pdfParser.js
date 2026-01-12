const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');

class ExamPaperParser {
  constructor() {
    // Topic patterns for Mathematics
    this.mathTopics = {
      'Algebra': [
        /algebraic expression/i,
        /factoris/i,
        /simplif/i,
        /expand/i,
        /equation/i,
        /inequalit/i
      ],
      'Functions': [
        /function/i,
        /f\(x\)/,
        /domain/i,
        /range/i,
        /inverse/i,
        /parabola/i,
        /hyperbola/i
      ],
      'Trigonometry': [
        /sin|cos|tan/i,
        /trigonometric/i,
        /angle/i,
        /triangle/i
      ],
      'Calculus': [
        /derivative/i,
        /differentiate/i,
        /gradient/i,
        /rate of change/i,
        /maxim|minim/i
      ],
      'Geometry': [
        /circle/i,
        /theorem/i,
        /prove|proof/i,
        /angle/i,
        /similar|congruent/i
      ],
      'Statistics': [
        /mean|median|mode/i,
        /standard deviation/i,
        /probability/i,
        /histogram/i,
        /data/i
      ],
      'Finance': [
        /compound interest/i,
        /simple interest/i,
        /annuity/i,
        /loan/i,
        /investment/i
      ]
    };

    // Topic patterns for Physical Sciences
    this.physicsTopics = {
      'Mechanics': [
        /force/i,
        /newton/i,
        /motion/i,
        /velocity/i,
        /acceleration/i,
        /momentum/i
      ],
      'Waves': [
        /wave/i,
        /sound/i,
        /light/i,
        /frequency/i,
        /wavelength/i,
        /doppler/i
      ],
      'Electricity': [
        /circuit/i,
        /current/i,
        /voltage/i,
        /resistance/i,
        /ohm/i,
        /capacitor/i
      ],
      'Chemistry': [
        /reaction/i,
        /chemical/i,
        /acid|base/i,
        /electrolysis/i,
        /organic/i,
        /molecule/i
      ]
    };

    // Topic patterns for Life Sciences
    this.lifeScienceTopics = {
      'Cell Biology': [
        /cell/i,
        /mitosis|meiosis/i,
        /organelle/i,
        /membrane/i
      ],
      'Genetics': [
        /DNA|RNA/i,
        /gene/i,
        /chromosome/i,
        /heredit/i,
        /mutation/i
      ],
      'Evolution': [
        /evolution/i,
        /natural selection/i,
        /fossil/i,
        /species/i
      ],
      'Human Biology': [
        /heart|lung|kidney/i,
        /blood/i,
        /nervous system/i,
        /hormone/i,
        /digestion/i
      ],
      'Ecology': [
        /ecosystem/i,
        /food chain/i,
        /population/i,
        /biome/i
      ]
    };
  }

  async parsePDF(filepath) {
    try {
      const dataBuffer = await fs.readFile(filepath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error(`Error parsing ${filepath}:`, error.message);
      return null;
    }
  }

  extractQuestions(text) {
    const questions = [];
    
    // Split by question numbers (e.g., "1.1", "2.3", "QUESTION 1")
    const questionPattern = /(?:QUESTION\s+\d+|(?:\d+\.)+\d+)/gi;
    const matches = [...text.matchAll(questionPattern)];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const startIndex = match.index;
      const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length;
      
      const questionText = text.substring(startIndex, endIndex).trim();
      
      if (questionText.length > 20) { // Filter out very short matches
        questions.push({
          number: match[0],
          text: questionText,
          startIndex,
          endIndex
        });
      }
    }
    
    return questions;
  }

  categorizeQuestion(questionText, subject) {
    let topics;
    
    switch (subject.toLowerCase()) {
      case 'mathematics':
        topics = this.mathTopics;
        break;
      case 'physical sciences':
        topics = this.physicsTopics;
        break;
      case 'life sciences':
        topics = this.lifeScienceTopics;
        break;
      default:
        return ['General'];
    }

    const matchedTopics = [];
    
    for (const [topic, patterns] of Object.entries(topics)) {
      for (const pattern of patterns) {
        if (pattern.test(questionText)) {
          matchedTopics.push(topic);
          break;
        }
      }
    }
    
    return matchedTopics.length > 0 ? matchedTopics : ['General'];
  }

  extractMarks(questionText) {
    // Extract marks like (3), [5], (10 marks)
    const markPattern = /[\(\[](\d+)\s*(?:marks?)?[\)\]]/i;
    const match = questionText.match(markPattern);
    return match ? parseInt(match[1]) : null;
  }

  async parseExamPaper(paperMetadata) {
    console.log(`Parsing: ${paperMetadata.filename}`);
    
    const text = await this.parsePDF(paperMetadata.localPath);
    if (!text) return null;

    const questions = this.extractQuestions(text);
    
    const parsedQuestions = questions.map(q => ({
      ...paperMetadata,
      questionNumber: q.number,
      questionText: q.text,
      topics: this.categorizeQuestion(q.text, paperMetadata.subject),
      marks: this.extractMarks(q.text),
      rawText: q.text
    }));

    return parsedQuestions;
  }

  async parseAllPapers() {
    console.log('Starting paper parsing...');
    
    // Load paper metadata
    const metadataPath = './data/papers/download-results.json';
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
    
    const allQuestions = [];
    
    for (const paper of metadata) {
      if (!paper.downloaded) continue;
      
      try {
        const questions = await this.parseExamPaper(paper);
        if (questions) {
          allQuestions.push(...questions);
        }
      } catch (error) {
        console.error(`Error parsing ${paper.filename}:`, error.message);
      }
    }
    
    console.log(`Extracted ${allQuestions.length} questions`);
    
    // Save parsed questions
    await fs.mkdir('./data/questions', { recursive: true });
    await fs.writeFile(
      './data/questions/all-questions.json',
      JSON.stringify(allQuestions, null, 2)
    );
    
    // Group by subject and topic
    await this.organizeByTopics(allQuestions);
    
    return allQuestions;
  }

  async organizeByTopics(questions) {
    const organized = {};
    
    for (const question of questions) {
      const { subject, grade, topics } = question;
      
      if (!organized[subject]) {
        organized[subject] = {};
      }
      
      if (!organized[subject][grade]) {
        organized[subject][grade] = {};
      }
      
      for (const topic of topics) {
        if (!organized[subject][grade][topic]) {
          organized[subject][grade][topic] = [];
        }
        
        organized[subject][grade][topic].push(question);
      }
    }
    
    // Save organized structure
    await fs.writeFile(
      './data/questions/organized-by-topic.json',
      JSON.stringify(organized, null, 2)
    );
    
    // Generate summary
    const summary = {};
    for (const [subject, grades] of Object.entries(organized)) {
      summary[subject] = {};
      for (const [grade, topics] of Object.entries(grades)) {
        summary[subject][grade] = {};
        for (const [topic, qs] of Object.entries(topics)) {
          summary[subject][grade][topic] = qs.length;
        }
      }
    }
    
    await fs.writeFile(
      './data/questions/summary.json',
      JSON.stringify(summary, null, 2)
    );
    
    console.log('Questions organized by topic');
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    const parser = new ExamPaperParser();
    await parser.parseAllPapers();
    console.log('\nParsing complete!');
  })();
}

module.exports = ExamPaperParser;
