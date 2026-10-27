const mongoose = require('mongoose');
const { analyzeJobDescriptionText } = require('../services/jobAnalyzer');
const JobProfile = require('../models/JobProfile');
const inMemoryStore = require('../config/inMemoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const analyzeJobDescription = async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide valid job description text' });
    }

    const extractedProfile = analyzeJobDescriptionText(text);

    let jobDoc = {
      _id: `jd_${Date.now()}`,
      userId: req.user ? req.user.id : 'usr_demo',
      title: title || `${extractedProfile.role} Job Profile`,
      rawText: text,
      extractedProfile,
      createdAt: new Date()
    };

    if (isDbConnected()) {
      try {
        const created = await JobProfile.create(jobDoc);
        jobDoc._id = created._id.toString();
      } catch (e) {
        console.warn('[Job Controller DB Warning]: Saved to in-memory store');
      }
    }

    inMemoryStore.createJobProfile(jobDoc);

    res.status(201).json({
      message: 'Job description analyzed successfully',
      jobProfileId: jobDoc._id,
      jobProfile: extractedProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing job description' });
  }
};

module.exports = {
  analyzeJobDescription
};
