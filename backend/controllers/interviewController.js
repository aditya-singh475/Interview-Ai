const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const JobProfile = require('../models/JobProfile');
const aiService = require('../services/aiService');
const inMemoryStore = require('../config/inMemoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const createInterview = async (req, res) => {
  try {
    const {
      role = 'Full Stack Developer',
      experienceLevel = 'Intermediate',
      interviewType = 'Technical',
      difficulty = 'Intermediate',
      personality = 'Professional',
      resumeId,
      jobProfileId,
      timerSecondsPerQuestion = 120
    } = req.body;

    const userId = req.user ? req.user.id : 'usr_demo_123';

    let candidateSkills = [];
    let candidateProjects = [];
    if (resumeId) {
      let resDoc = null;
      if (isDbConnected()) {
        try {
          resDoc = await Resume.findById(resumeId);
        } catch (e) {}
      }
      if (!resDoc) {
        resDoc = inMemoryStore.getResumeById(resumeId);
      }
      if (resDoc && resDoc.candidateProfile) {
        candidateSkills = resDoc.candidateProfile.skills || [];
        candidateProjects = resDoc.candidateProfile.projects || [];
      }
    }

    let jdSkills = [];
    if (jobProfileId) {
      let jdDoc = null;
      if (isDbConnected()) {
        try {
          jdDoc = await JobProfile.findById(jobProfileId);
        } catch (e) {}
      }
      if (!jdDoc) {
        jdDoc = inMemoryStore.getJobProfileById(jobProfileId);
      }
      if (jdDoc && jdDoc.extractedProfile) {
        jdSkills = jdDoc.extractedProfile.requiredSkills || [];
      }
    }

    // Pick first question dynamically (Stage 1: Warmup & Foundational Basic)
    const firstQ = await aiService.selectNextQuestion({
      role,
      difficulty,
      askedQuestionIds: [],
      candidateSkills,
      candidateProjects,
      jdSkills,
      questionIndex: 0
    });

    const initialQuestionObj = {
      questionId: firstQ.questionId,
      questionText: firstQ.questionText,
      category: firstQ.category,
      difficulty: firstQ.difficulty,
      scenarioBrief: firstQ.scenarioBrief || '',
      constraints: firstQ.constraints || [],
      matchedResumeKeywords: firstQ.matchedResumeKeywords || [],
      matchedJdKeywords: firstQ.matchedJdKeywords || [],
      source: firstQ.source || 'Role Knowledge Base',
      sourceRationale: firstQ.sourceRationale || `Selected for ${role} profile`,
      expectedConcepts: firstQ.expectedConcepts || [],
      candidateAnswer: '',
      audioTranscript: '',
      timeSpentSeconds: 0
    };

    let newInterview = {
      _id: `int_${Date.now()}`,
      userId,
      role,
      experienceLevel,
      interviewType,
      difficulty,
      personality,
      resumeId,
      jobProfileId,
      candidateSkills,
      candidateProjects,
      jdSkills,
      status: 'in-progress',
      timerSecondsPerQuestion,
      questions: [initialQuestionObj],
      currentQuestionIndex: 0,
      createdAt: new Date()
    };

    if (isDbConnected()) {
      try {
        const created = await Interview.create(newInterview);
        newInterview._id = created._id.toString();
      } catch (e) {
        console.warn('[Interview Controller DB Warning]: Saved to in-memory store');
      }
    }

    inMemoryStore.createInterview(newInterview);
    return res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating interview session' });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    let interviewDoc = null;

    if (isDbConnected()) {
      try {
        interviewDoc = await Interview.findById(id);
      } catch (e) {}
    }

    if (!interviewDoc) {
      interviewDoc = inMemoryStore.getInterviewById(id);
    }

    if (!interviewDoc) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    res.json(interviewDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllInterviews = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'usr_demo_123';
    let interviews = [];

    if (isDbConnected()) {
      try {
        interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {}
    }

    if (!interviews || interviews.length === 0) {
      interviews = inMemoryStore.getInterviewsByUserId(userId);
    }

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerText, answer, audioTranscript, timeSpentSeconds = 30 } = req.body;
    const finalAnswer = answerText || answer || audioTranscript || '';

    let interview = null;
    if (isDbConnected()) {
      try {
        interview = await Interview.findById(id);
      } catch (e) {}
    }

    if (!interview) {
      interview = inMemoryStore.getInterviewById(id);
    }

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    const currIdx = interview.currentQuestionIndex || 0;
    const currentQuestion = interview.questions[currIdx];

    if (!currentQuestion) {
      return res.status(400).json({ message: 'No active question found' });
    }

    // Evaluate answer
    const evalResult = await aiService.evaluateAnswer({
      questionText: currentQuestion.questionText,
      candidateAnswer: finalAnswer,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty
    });

    // Check if adaptive follow-up is needed
    let followUpObj = { asked: false };
    if (evalResult.overallScore < 75 && currIdx < 4) {
      const followUpText = await aiService.generateFollowUp({
        questionText: currentQuestion.questionText,
        candidateAnswer: finalAnswer,
        expectedConcepts: currentQuestion.expectedConcepts
      });
      followUpObj = {
        asked: true,
        questionText: followUpText,
        candidateAnswer: ''
      };
    }

    // Update question evaluation
    currentQuestion.candidateAnswer = finalAnswer;
    currentQuestion.audioTranscript = audioTranscript || '';
    currentQuestion.timeSpentSeconds = timeSpentSeconds;
    currentQuestion.evaluation = evalResult;
    currentQuestion.followUp = followUpObj;

    // Determine next question or complete
    const totalQuestionsAsked = interview.questions.length;
    let nextQuestion = null;

    if (totalQuestionsAsked < 5) {
      const askedIds = interview.questions.map(q => q.questionId);
      const nextQData = await aiService.selectNextQuestion({
        role: interview.role,
        difficulty: evalResult.overallScore > 80 ? 'Advanced' : 'Intermediate',
        askedQuestionIds: askedIds,
        candidateSkills: interview.candidateSkills || [],
        candidateProjects: interview.candidateProjects || [],
        jdSkills: interview.jdSkills || [],
        questionIndex: totalQuestionsAsked
      });

      nextQuestion = {
        questionId: nextQData.questionId,
        questionText: nextQData.questionText,
        category: nextQData.category,
        difficulty: nextQData.difficulty,
        scenarioBrief: nextQData.scenarioBrief || '',
        constraints: nextQData.constraints || [],
        matchedResumeKeywords: nextQData.matchedResumeKeywords || [],
        matchedJdKeywords: nextQData.matchedJdKeywords || [],
        source: nextQData.source || 'Role Knowledge Base',
        sourceRationale: nextQData.sourceRationale || `Adaptive question for ${interview.role}`,
        expectedConcepts: nextQData.expectedConcepts || []
      };

      interview.questions.push(nextQuestion);
      interview.currentQuestionIndex = totalQuestionsAsked;
    } else {
      interview.status = 'completed';
    }

    // Save session
    if (isDbConnected()) {
      try {
        if (typeof interview.save === 'function') {
          await interview.save();
        }
      } catch (e) {}
    }

    inMemoryStore.updateInterview(id, interview);

    res.json({
      message: 'Answer evaluated successfully',
      evaluation: evalResult,
      followUp: followUpObj,
      nextQuestion: nextQuestion,
      isCompleted: interview.status === 'completed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error evaluating answer' });
  }
};

const completeInterview = async (req, res) => {
  try {
    const { id } = req.params;
    let interview = null;

    if (isDbConnected()) {
      try {
        interview = await Interview.findById(id);
      } catch (e) {}
    }

    if (!interview) {
      interview = inMemoryStore.getInterviewById(id);
    }

    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Compute metrics
    const evaluatedQuestions = interview.questions.filter(q => q.evaluation && q.evaluation.overallScore !== undefined);
    const count = evaluatedQuestions.length || 1;
    
    const avgScore = Math.round(evaluatedQuestions.reduce((acc, q) => acc + (q.evaluation.overallScore || 70), 0) / count);
    
    const catScores = {
      technical: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.technicalAccuracy || 8) * 10), 0) / count),
      communication: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.communication || 8) * 10), 0) / count),
      problemSolving: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.problemSolving || 8) * 10), 0) / count),
      behavioral: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.relevance || 8) * 10), 0) / count),
      technicalDepth: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.technicalAccuracy || 8) * 10), 0) / count),
      communicationClarity: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.communication || 8) * 10), 0) / count),
      starStructure: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.clarity || 8) * 10), 0) / count),
      relevance: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.relevance || 8) * 10), 0) / count),
      confidence: Math.round(evaluatedQuestions.reduce((acc, q) => acc + ((q.evaluation.rubric?.confidence || 8) * 10), 0) / count)
    };

    interview.status = 'completed';
    interview.overallScore = avgScore;
    interview.categoryScores = catScores;
    interview.resumeMatchScore = 85;
    interview.jdMatchScore = 80;
    interview.strengths = ['Strong technical terminology', 'Clear scenario framing', 'Direct problem approach'];
    interview.weaknesses = ['Could elaborate on edge-case error handling', 'Mention concrete performance metrics'];
    interview.learningPlan7Days = aiService.generate7DayPlan({ role: interview.role, weaknesses: interview.weaknesses });

    if (isDbConnected()) {
      try {
        if (typeof interview.save === 'function') {
          await interview.save();
        }
      } catch (e) {}
    }

    inMemoryStore.updateInterview(id, interview);

    res.json({
      message: 'Interview completed successfully',
      interview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      try {
        await Interview.findByIdAndDelete(id);
      } catch (e) {}
    }
    inMemoryStore.deleteInterview(id);
    res.json({ message: 'Interview record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviewById,
  getAllInterviews,
  submitAnswer,
  completeInterview,
  deleteInterview
};
