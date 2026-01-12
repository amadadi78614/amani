const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
// Note: You'll need to add your serviceAccountKey.json file
let db;

try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
} catch (error) {
  console.log('Firebase not configured. Please add serviceAccountKey.json');
  console.log('You can generate this from Firebase Console > Project Settings > Service Accounts');
}

class DatabaseSeeder {
  constructor() {
    this.db = db;
  }

  async seedQuestions() {
    if (!this.db) {
      console.error('Firebase not initialized');
      return;
    }

    console.log('Loading questions...');
    const questionsPath = './data/questions/all-questions.json';
    const questions = JSON.parse(await fs.readFile(questionsPath, 'utf-8'));

    console.log(`Seeding ${questions.length} questions to Firestore...`);

    const batch = this.db.batch();
    let batchCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      const docRef = this.db.collection('questions').doc();
      batch.set(docRef, {
        ...question,
        id: docRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      batchCount++;

      // Firestore batch limit is 500
      if (batchCount === 500) {
        await batch.commit();
        console.log(`Committed batch ${Math.floor(i / 500) + 1}`);
        batchCount = 0;
      }
    }

    // Commit remaining
    if (batchCount > 0) {
      await batch.commit();
      console.log('Committed final batch');
    }

    console.log('Questions seeded successfully!');
  }

  async createIndexes() {
    if (!this.db) return;

    console.log('Creating composite indexes...');
    console.log('Note: You may need to manually create these in Firebase Console');
    console.log('Required indexes:');
    console.log('1. Collection: questions, Fields: subject ASC, grade ASC, topics ARRAY');
    console.log('2. Collection: questions, Fields: subject ASC, topics ARRAY, year DESC');
  }

  async seedSubjects() {
    if (!this.db) return;

    const subjects = [
      {
        id: 'mathematics',
        name: 'Mathematics',
        grade: [11, 12],
        topics: [
          'Algebra',
          'Functions',
          'Trigonometry',
          'Calculus',
          'Geometry',
          'Statistics',
          'Finance'
        ]
      },
      {
        id: 'physical-sciences',
        name: 'Physical Sciences',
        grade: [11, 12],
        topics: [
          'Mechanics',
          'Waves',
          'Electricity',
          'Chemistry'
        ]
      },
      {
        id: 'life-sciences',
        name: 'Life Sciences',
        grade: [11, 12],
        topics: [
          'Cell Biology',
          'Genetics',
          'Evolution',
          'Human Biology',
          'Ecology'
        ]
      }
    ];

    for (const subject of subjects) {
      await this.db.collection('subjects').doc(subject.id).set(subject);
    }

    console.log('Subjects seeded successfully!');
  }

  async seedAll() {
    await this.seedSubjects();
    await this.seedQuestions();
    await this.createIndexes();
    console.log('\nDatabase seeding complete!');
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    const seeder = new DatabaseSeeder();
    await seeder.seedAll();
  })();
}

module.exports = DatabaseSeeder;
