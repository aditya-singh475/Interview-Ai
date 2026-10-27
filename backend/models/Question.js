const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  skills: [{ type: String }],
  questionText: { type: String, required: true },
  context: { type: String },
  expectedConcepts: [{ type: String }],
  evaluationCriteria: { type: String },
  followUps: [{
    trigger: { type: String },
    followUpText: { type: String }
  }],
  source: { 
    type: String, 
    enum: ['Role Knowledge Base', 'Job Description', 'Resume', 'Question Bank', 'AI Generated'],
    default: 'Question Bank'
  }
});

module.exports = mongoose.model('Question', questionSchema);
