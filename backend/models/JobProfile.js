const mongoose = require('mongoose');

const jobProfileSchema = new mongoose.Schema({
  _id: { type: String, default: () => `jd_${Date.now()}` },
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, default: 'Target Job Description' },
  rawText: { type: String, required: true },
  extractedProfile: {
    role: { type: String },
    responsibilities: [{ type: String }],
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    technologies: [{ type: String }],
    experienceYears: { type: String },
    domain: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobProfile', jobProfileSchema);
