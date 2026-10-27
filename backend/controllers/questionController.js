const SEEDED_QUESTIONS = require('../data/questionBank');
const Question = require('../models/Question');

const getQuestions = async (req, res) => {
  try {
    const { role, category, difficulty } = req.query;
    let questions = SEEDED_QUESTIONS;

    if (role) {
      questions = questions.filter(q => q.role === role);
    }
    if (category) {
      questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const found = SEEDED_QUESTIONS.find(q => q.questionId === id);
    if (!found) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById
};
