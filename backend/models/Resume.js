const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  _id: { type: String, default: () => `res_${Date.now()}` },
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  extractedText: { type: String, required: true },
  candidateProfile: {
    name: { type: String },
    skills: [{ type: String }],
    projects: [{
      title: { type: String },
      description: { type: String },
      techStack: [{ type: String }]
    }],
    education: [{ type: String }],
    experience: [{ type: String }],
    certifications: [{ type: String }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
