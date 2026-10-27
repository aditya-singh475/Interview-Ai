const express = require('express');
const router = express.Router();
const { getProgressAnalytics, getRecommendations } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/progress', protect, getProgressAnalytics);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
