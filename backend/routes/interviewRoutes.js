const express = require('express');
const router = express.Router();
const {
  createInterview,
  getInterviewById,
  getAllInterviews,
  submitAnswer,
  completeInterview,
  deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createInterview);
router.get('/', protect, getAllInterviews);
router.get('/:id', protect, getInterviewById);
router.post('/:id/answers', protect, submitAnswer);
router.post('/:id/complete', protect, completeInterview);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
