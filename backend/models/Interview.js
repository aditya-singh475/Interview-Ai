const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  _id: { type: String, default: () => `int_${Date.now()}` },
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  role: { type: String, required: true },
  experienceLevel: { type: String, default: 'Intermediate' },
  interviewType: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Intermediate' },
  personality: { type: String, default: 'Professional' },
  resumeId: { type: mongoose.Schema.Types.Mixed },
  jobProfileId: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  candidateSkills: [{ type: String }],
  candidateProjects: [{ type: mongoose.Schema.Types.Mixed }],
  jdSkills: [{ type: String }],
  
  questions: [{
    questionId: { type: String },
    questionText: { type: String },
    category: { type: String },
    difficulty: { type: String },
    scenarioBrief: { type: String },
    constraints: [{ type: String }],
    matchedResumeKeywords: [{ type: String }],
    matchedJdKeywords: [{ type: String }],
    source: { type: String },
    sourceRationale: { type: String },
    expectedConcepts: [{ type: String }],
    candidateAnswer: { type: String },
    audioTranscript: { type: String },
    timeSpentSeconds: { type: Number, default: 0 },
    
    evaluation: {
      overallScore: { type: Number, default: 0 },
      rubric: {
        technicalAccuracy: { type: Number, default: 0 },
        relevance: { type: Number, default: 0 },
        completeness: { type: Number, default: 0 },
        clarity: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        confidence: { type: Number, default: 0 },
        practicalUnderstanding: { type: Number, default: 0 }
      },
      qualityLevel: { type: String, enum: ['Excellent', 'Strong', 'Good', 'Needs Improvement', 'Weak', 'Competent', 'Exceptional'] },
      humanizedFeedback: { type: String },
      whatDidWell: { type: String },
      whatWasMissing: { type: String },
      idealAnswer: { type: String },
      interviewTip: { type: String },
      starAnalysis: {
        situation: { type: Boolean, default: false },
        task: { type: Boolean, default: false },
        action: { type: Boolean, default: false },
        result: { type: Boolean, default: false },
        recommendation: { type: String }
      },
      fillerWordsCount: { type: Number, default: 0 },
      fillerWordsDetected: [{ type: String }]
    },
    
    followUp: {
      asked: { type: Boolean, default: false },
      questionText: { type: String },
      candidateAnswer: { type: String }
    }
  }],

  currentQuestionIndex: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  categoryScores: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    behavioral: { type: Number, default: 0 },
    technicalDepth: { type: Number, default: 0 },
    communicationClarity: { type: Number, default: 0 },
    starStructure: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  resumeMatchScore: { type: Number, default: 0 },
  jdMatchScore: { type: Number, default: 0 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  learningPlan7Days: [{
    day: { type: mongoose.Schema.Types.Mixed },
    topic: { type: String },
    focusTopic: { type: String },
    task: { type: String },
    actionableTask: { type: String },
    recommendedResources: { type: String }
  }],
  durationSeconds: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
