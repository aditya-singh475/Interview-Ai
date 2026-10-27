const express = require('express');
const router = express.Router();
const { analyzeJobDescription } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeJobDescription);

module.exports = router;
