const SEEDED_QUESTIONS = require('../data/questionBank');
const { getRoleBlueprint } = require('./roleIntelligence');

// Evaluation & Mock Engine Helper
const evaluateAnswerMock = (questionText, candidateAnswer, category, difficulty) => {
  const answer = (candidateAnswer || '').trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  // Detect filler words
  const fillerWordsList = ['uh', 'um', 'like', 'you know', 'basically', 'actually', 'sort of'];
  const fillerWordsDetected = [];
  let fillerCount = 0;
  
  fillerWordsList.forEach(fw => {
    const regex = new RegExp(`\\b${fw}\\b`, 'gi');
    const matches = answer.match(regex);
    if (matches) {
      fillerCount += matches.length;
      fillerWordsDetected.push(`${fw} (${matches.length}x)`);
    }
  });

  // Basic quality scoring logic
  let baseScore = 70;
  if (wordCount < 10) baseScore = 35;
  else if (wordCount < 25) baseScore = 55;
  else if (wordCount > 60) baseScore = 88;

  // Key concept matching bonus
  const techTerms = ['state', 'component', 'props', 'context', 'cache', 'redis', 'database', 'index', 'event loop', 'async', 'promise', 'security', 'token', 'star', 'situation', 'action', 'result'];
  const matchedTerms = techTerms.filter(term => answer.toLowerCase().includes(term));
  baseScore += Math.min(matchedTerms.length * 3, 12);
  baseScore = Math.min(Math.max(baseScore, 20), 98);

  const rubricScore = Math.round(baseScore / 10);

  // Quality Level
  let qualityLevel = 'Good';
  if (baseScore >= 88) qualityLevel = 'Excellent';
  else if (baseScore >= 78) qualityLevel = 'Strong';
  else if (baseScore >= 65) qualityLevel = 'Good';
  else if (baseScore >= 45) qualityLevel = 'Needs Improvement';
  else qualityLevel = 'Weak';

  // Humanized feedback
  let feedback = `Your response correctly identified key concepts around ${category}, but could be expanded with more practical architectural trade-offs.`;
  if (wordCount < 25) {
    feedback = `Your answer provided a concise overview, but in a senior technical interview, the interviewer would expect you to walk through concrete execution steps and failure edge-cases.`;
  } else if (baseScore >= 85) {
    feedback = `Excellent response! You clearly articulated the core principles, trade-offs, and design patterns associated with this scenario.`;
  }

  // STAR Analysis
  const lowerAns = answer.toLowerCase();
  const starAnalysis = {
    situation: lowerAns.includes('situation') || lowerAns.includes('when') || lowerAns.includes('project') || lowerAns.includes('company'),
    task: lowerAns.includes('task') || lowerAns.includes('needed to') || lowerAns.includes('goal') || lowerAns.includes('challenge'),
    action: lowerAns.includes('i implemented') || lowerAns.includes('i built') || lowerAns.includes('i created') || lowerAns.includes('action'),
    result: lowerAns.includes('result') || lowerAns.includes('improved') || lowerAns.includes('reduced') || lowerAns.includes('percent') || lowerAns.includes('%'),
    recommendation: 'Ensure your response follows: Situation → Task → Action → Measurable Result.'
  };

  return {
    overallScore: baseScore,
    rubric: {
      technicalAccuracy: Math.min(10, rubricScore + 1),
      relevance: Math.min(10, rubricScore),
      completeness: Math.max(1, rubricScore - 1),
      clarity: Math.min(10, rubricScore),
      communication: Math.max(1, 10 - Math.min(fillerCount, 4)),
      problemSolving: rubricScore,
      confidence: Math.min(10, rubricScore),
      practicalUnderstanding: rubricScore
    },
    qualityLevel: qualityLevel,
    humanizedFeedback: feedback,
    whatDidWell: 'Good technical clarity and direct focus on the core scenario.',
    whatWasMissing: 'Detailed explanation of edge-case error handling and measurable outcome numbers.',
    idealAnswer: `An ideal response clearly defines the architectural goal, evaluates alternative trade-offs (e.g., Context API vs Zustand or SQL vs NoSQL), explains step-by-step implementation, and highlights measurable results.`,
    interviewTip: 'When answering scenario questions, frame your response with clear trade-offs: why you chose your specific approach over competing options.',
    starAnalysis: starAnalysis,
    fillerWordsCount: fillerCount,
    fillerWordsDetected: fillerWordsDetected
  };
};

// AI Service Implementation
const aiService = {
  selectNextQuestion: async ({
    role = 'Full Stack Developer',
    difficulty = 'Intermediate',
    askedQuestionIds = [],
    candidateSkills = [],
    candidateProjects = [],
    jdSkills = [],
    questionIndex = 0
  }) => {
    const blueprint = getRoleBlueprint(role);

    // Progressive 3-Stage Hierarchy:
    // Q0, Q1 -> Stage 1: Warmup & Foundational Basics (Beginner)
    // Q2, Q3 -> Stage 2: Core Engineering & Architecture (Intermediate)
    // Q4+    -> Stage 3: High Scale, Resiliency & Edge-Cases (Advanced)
    let targetDifficulty = 'Intermediate';
    let stageName = 'Stage 2: Core Architecture & System Mechanics';

    if (questionIndex === 0 || questionIndex === 1) {
      targetDifficulty = 'Beginner';
      stageName = 'Stage 1: Foundational Technical Mastery';
    } else if (questionIndex >= 4) {
      targetDifficulty = 'Advanced';
      stageName = 'Stage 3: High-Scale Systems, Resiliency & Edge-Cases';
    }

    // Normalize candidate resume keywords & JD keywords
    const resumeKeywords = (candidateSkills || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);
    const jobKeywords = (jdSkills || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);

    // Filter out already asked questions
    let pool = SEEDED_QUESTIONS.filter(q => !askedQuestionIds.includes(q.questionId));

    // Calculate dynamic relevance score for each question in pool
    const scoredQuestions = pool.map(q => {
      let score = 0;
      const qText = (q.questionText || '').toLowerCase();
      const qCategory = (q.category || '').toLowerCase();
      const qRole = (q.role || '').toLowerCase();
      const qSkills = (q.skills || []).map(s => String(s).toLowerCase());
      const qDiff = (q.difficulty || '').toLowerCase();

      // Difficulty tier match (+25 points)
      if (qDiff === targetDifficulty.toLowerCase()) {
        score += 25;
      }

      // Role match (+15 points)
      if (qRole === role.toLowerCase() || qRole.includes('software') || qRole.includes('full stack')) {
        score += 15;
      }

      // Match against candidate resume skills (+15 points per match)
      const matchedResume = [];
      resumeKeywords.forEach(rKey => {
        if (qSkills.includes(rKey) || qText.includes(rKey) || qCategory.includes(rKey)) {
          score += 15;
          if (!matchedResume.includes(rKey)) matchedResume.push(rKey);
        }
      });

      // Match against JD skills (+12 points per match)
      const matchedJd = [];
      jobKeywords.forEach(jKey => {
        if (qSkills.includes(jKey) || qText.includes(jKey) || qCategory.includes(jKey)) {
          score += 12;
          if (!matchedJd.includes(jKey)) matchedJd.push(jKey);
        }
      });

      return {
        question: q,
        score,
        matchedResume,
        matchedJd
      };
    });

    // Sort by highest relevance score
    scoredQuestions.sort((a, b) => b.score - a.score);

    let selected = null;
    let matchedResumeKeywords = [];
    let matchedJdKeywords = [];

    // If candidate has projects on resume and we are on question index 1 or 2, optionally craft/inject project question
    if (questionIndex === 2 && candidateProjects && candidateProjects.length > 0 && Math.random() > 0.4) {
      const proj = candidateProjects[0];
      const projTech = (proj.techStack && proj.techStack[0]) || resumeKeywords[0] || 'Web Technologies';
      selected = {
        questionId: `proj_dyn_${Date.now()}`,
        role: role,
        category: 'Project Architecture',
        difficulty: targetDifficulty,
        skills: [projTech, 'Architecture', 'Trade-offs'],
        questionText: `In your resume project "${proj.title}", walk me through how you architected the data flow and state management using ${projTech}. What was the most difficult technical trade-off you had to make, and what would you do differently today?`,
        scenarioBrief: `Candidate specified experience leading or building "${proj.title}". Probing actual project depth, architecture ownership, and retrospective engineering judgment.`,
        constraints: ['Explain data flow & component boundaries', 'Articulate a concrete technical trade-off and alternative evaluated'],
        expectedConcepts: ['Component/Module architecture', 'State synchronization or API layer', 'Engineering trade-offs (e.g. latency vs consistency, build vs buy)', 'Retrospective improvement'],
        evaluationCriteria: 'Demonstrates deep hands-on ownership of the cited project, articulates clear architecture decisions, and justifies design trade-offs.',
        source: 'Resume Project Deep-Dive',
        sourceRationale: `Anchored to Candidate Resume Project: "${proj.title}" (${projTech})`,
        followUps: [
          { trigger: 'mentions trade-off', followUpText: 'If you had to scale that solution to 100x user volume, where would the first performance bottleneck appear?' }
        ]
      };
      matchedResumeKeywords = [projTech, proj.title];
      matchedJdKeywords = jobKeywords.slice(0, 2);
    } else if (scoredQuestions.length > 0) {
      const topMatch = scoredQuestions[0];
      selected = { ...topMatch.question };
      matchedResumeKeywords = topMatch.matchedResume;
      matchedJdKeywords = topMatch.matchedJd;
    } else {
      // Fallback
      selected = SEEDED_QUESTIONS[0];
    }

    // Build comprehensive rationale highlighting exact keywords matched
    const rationaleParts = [`${stageName}`];
    if (matchedResumeKeywords.length > 0) {
      rationaleParts.push(`Matched Resume: ${matchedResumeKeywords.slice(0, 3).join(', ')}`);
    }
    if (matchedJdKeywords.length > 0) {
      rationaleParts.push(`Matched JD: ${matchedJdKeywords.slice(0, 3).join(', ')}`);
    }
    if (matchedResumeKeywords.length === 0 && matchedJdKeywords.length === 0) {
      rationaleParts.push(`Target Role: ${role}`);
    }

    return {
      ...selected,
      stageName,
      matchedResumeKeywords: matchedResumeKeywords.length > 0 ? matchedResumeKeywords : (resumeKeywords.slice(0, 3)),
      matchedJdKeywords: matchedJdKeywords.length > 0 ? matchedJdKeywords : (jobKeywords.slice(0, 3)),
      sourceRationale: rationaleParts.join(' · ')
    };
  },

  generateFollowUp: async ({ questionText, candidateAnswer, expectedConcepts }) => {
    // Optional Gemini API call if key configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert interviewer. The candidate was asked: "${questionText}". Candidate answered: "${candidateAnswer}". Generate one concise, probing follow-up question (under 25 words) that tests deeper edge-case understanding.`
              }]
            }]
          })
        });
        if (response.ok) {
          const data = await response.json();
          const followUp = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (followUp) return followUp;
        }
      } catch (err) {
        // Fall back to rule-based engine
      }
    }

    const lower = (candidateAnswer || '').toLowerCase();
    
    // Concept-aware follow-up probe if expected concepts exist
    if (expectedConcepts && Array.isArray(expectedConcepts) && expectedConcepts.length > 0) {
      const missedConcepts = expectedConcepts.filter(c => !lower.includes(c.toLowerCase().split(' ')[0]));
      if (missedConcepts.length > 0) {
        return `How would you incorporate ${missedConcepts[0]} into your design to ensure high reliability and fault tolerance?`;
      }
    }

    if (lower.includes('jwt')) {
      return 'Good point regarding JWT. How would you handle secret key rotation without forcing all connected users to log in again?';
    } else if (lower.includes('redis') || lower.includes('cache')) {
      return 'How do you handle cache invalidation when underlying database records are updated concurrently?';
    } else if (lower.includes('sql') || lower.includes('database')) {
      return 'What specific indexing strategy would you use to prevent lock contention on high-frequency write operations?';
    } else if (lower.includes('react') || lower.includes('state')) {
      return 'How would you measure and prevent re-render cascading when multiple consumers listen to that state store?';
    } else {
      return 'Can you elaborate on how your approach would change if you had to support 100,000 active concurrent users?';
    }
  },

  evaluateAnswer: async ({ questionText, candidateAnswer, category, difficulty }) => {
    return evaluateAnswerMock(questionText, candidateAnswer, category, difficulty);
  },

  generate7DayPlan: ({ role, weaknesses = [] }) => {
    const defaultWeaknesses = weaknesses.length > 0 ? weaknesses : ['System Architecture', 'Database Query Optimization', 'STAR Behavioral Formatting'];
    
    return [
      { day: 'Day 1', topic: defaultWeaknesses[0] || 'Core Architecture', focusTopic: defaultWeaknesses[0] || 'Core Architecture', task: 'Review fundamental design patterns and state colocation best practices.', actionableTask: 'Review fundamental design patterns and state colocation best practices.', recommendedResources: 'Documentation & Architecture diagrams' },
      { day: 'Day 2', topic: 'Scenario Problem Solving', focusTopic: 'Scenario Problem Solving', task: 'Practice articulating trade-offs out loud using Situation-Action-Result format.', actionableTask: 'Practice articulating trade-offs out loud using Situation-Action-Result format.', recommendedResources: 'System Design Interview guides' },
      { day: 'Day 3', topic: defaultWeaknesses[1] || 'Database Indexing & Performance', focusTopic: defaultWeaknesses[1] || 'Database Indexing & Performance', task: 'Solve 3 analytical SQL queries & review B-Tree vs Hash index performance.', actionableTask: 'Solve 3 analytical SQL queries & review B-Tree vs Hash index performance.', recommendedResources: 'Use The Index, Luke! handbook' },
      { day: 'Day 4', topic: 'Async Flow & Error Handling', focusTopic: 'Async Flow & Error Handling', task: 'Build a sample resilient promise handler with retry & exponential backoff.', actionableTask: 'Build a sample resilient promise handler with retry & exponential backoff.', recommendedResources: 'MDN Web Docs - Async JavaScript' },
      { day: 'Day 5', topic: 'Behavioral STAR Refinement', focusTopic: 'Behavioral STAR Refinement', task: 'Draft 4 stories using STAR method covering conflict, failure, and technical achievement.', actionableTask: 'Draft 4 stories using STAR method covering conflict, failure, and technical achievement.', recommendedResources: 'Behavioral Interview Playbook' },
      { day: 'Day 6', topic: 'Mock Interview Practice', focusTopic: 'Mock Interview Practice', task: 'Complete a 5-question timed mock interview session under strict mode.', actionableTask: 'Complete a 5-question timed mock interview session under strict mode.', recommendedResources: 'InterviewAI Live Simulator' },
      { day: 'Day 7', topic: 'Final Review & Confidence Polish', focusTopic: 'Final Review & Confidence Polish', task: 'Review weak question replays and ideal answer structures.', actionableTask: 'Review weak question replays and ideal answer structures.', recommendedResources: 'InterviewAI Replay Dashboard' }
    ];
  }
};

module.exports = aiService;
