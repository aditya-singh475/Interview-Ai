const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('../models/Question');
const questionBank = require('../data/questionBank');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai';
    console.log(`[Seed Script]: Connecting to MongoDB at ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('[Seed Script]: MongoDB Connected successfully.');

    await Question.deleteMany({});
    console.log('[Seed Script]: Cleared existing questions collection.');

    await Question.insertMany(questionBank);
    console.log(`[Seed Script]: Successfully seeded ${questionBank.length} questions into MongoDB.`);

    process.exit(0);
  } catch (error) {
    console.warn(`[Seed Script Notice]: Could not connect to local MongoDB (${error.message}).`);
    console.log(`[Seed Script Notice]: InterviewAI is equipped with an integrated in-memory question bank and data store containing ${questionBank.length} questions. You do not need a running MongoDB instance to use InterviewAI.`);
    process.exit(0);
  }
};

seedDB();
