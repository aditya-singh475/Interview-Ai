const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  _id: { type: String, default: () => `bm_${Date.now()}` },
  userId: { type: mongoose.Schema.Types.Mixed, required: true },
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  role: { type: String },
  category: { type: String },
  difficulty: { type: String },
  idealAnswer: { type: String },
  userNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
