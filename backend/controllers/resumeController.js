const mongoose = require('mongoose');
const multer = require('multer');
const { parseResumeFile, extractCandidateProfile } = require('../services/resumeParser');
const Resume = require('../models/Resume');
const inMemoryStore = require('../config/inMemoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('resume');

const uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    if (!req.file && !req.body.text) {
      return res.status(400).json({ message: 'Please upload a resume file or paste text content' });
    }

    try {
      let textContent = '';
      let profile = {};
      let fileName = 'pasted_resume.txt';
      let fileType = 'text/plain';

      if (req.file) {
        fileName = req.file.originalname;
        fileType = req.file.mimetype;
        const parsed = await parseResumeFile(req.file.buffer, fileName, fileType);
        textContent = parsed.textContent;
        profile = parsed.profile;
      } else {
        textContent = req.body.text;
        profile = extractCandidateProfile(textContent);
      }

      let resumeDoc = {
        _id: `res_${Date.now()}`,
        userId: req.user ? req.user.id : 'usr_demo',
        fileName,
        fileType,
        extractedText: textContent,
        candidateProfile: profile,
        createdAt: new Date()
      };

      if (isDbConnected()) {
        try {
          const created = await Resume.create(resumeDoc);
          resumeDoc._id = created._id.toString();
        } catch (e) {
          console.warn('[Resume Controller DB Warning]: Saved to in-memory store');
        }
      }

      inMemoryStore.createResume(resumeDoc);

      res.status(201).json({
        message: 'Resume parsed successfully',
        resumeId: resumeDoc._id,
        candidateProfile: profile
      });
    } catch (error) {
      res.status(500).json({ message: error.message || 'Failed to process resume' });
    }
  });
};

module.exports = {
  uploadResume
};
