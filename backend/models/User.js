const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => `usr_${Date.now()}` },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  targetRole: { type: String, default: 'Full Stack Developer' },
  experienceLevel: { type: String, default: 'Intermediate' },
  preferredPersonality: { type: String, default: 'Professional' },
  theme: { type: String, default: 'dark' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
