const bcrypt = require('bcryptjs');

// In-Memory Data Store for resilient zero-dependency operation
const users = new Map();
const resumes = new Map();
const jobProfiles = new Map();
const interviews = new Map();
const bookmarks = new Map();

// Helper to generate salt and hash synchronously for initial seeds
const generateSeedHash = (password) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (e) {
    return 'demo_hashed_password';
  }
};

// Seed Demo Users
const demoHash = generateSeedHash('demo1234');
const pass123Hash = generateSeedHash('password123');

const defaultDemoUser = {
  _id: 'usr_demo_123',
  name: 'Demo Candidate',
  email: 'demo@interviewai.com',
  passwordHash: demoHash,
  secondaryHash: pass123Hash,
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Intermediate',
  preferredPersonality: 'Professional',
  theme: 'dark',
  createdAt: new Date()
};

const candidateUser = {
  _id: 'usr_candidate_456',
  name: 'Aditya Singh',
  email: 'candidate@interviewai.com',
  passwordHash: pass123Hash,
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Intermediate',
  preferredPersonality: 'Professional',
  theme: 'dark',
  createdAt: new Date()
};

const testUser = {
  _id: 'usr_test_789',
  name: 'Test Engineer',
  email: 'test@example.com',
  passwordHash: pass123Hash,
  targetRole: 'Full Stack Developer',
  experienceLevel: 'Intermediate',
  preferredPersonality: 'Professional',
  theme: 'dark',
  createdAt: new Date()
};

users.set(defaultDemoUser._id, defaultDemoUser);
users.set(candidateUser._id, candidateUser);
users.set(testUser._id, testUser);

// Seed Sample Resumes
const seedResume = {
  _id: 'res_seed_001',
  userId: 'usr_demo_123',
  fileName: 'Aditya_Singh_Resume.pdf',
  fileType: 'application/pdf',
  extractedText: 'Full Stack Engineer with 3+ years experience across React, Node.js, TypeScript, PostgreSQL, and Docker.',
  candidateProfile: {
    name: 'Aditya Singh',
    skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Git', 'System Design'],
    projects: [
      {
        title: 'InterviewAI Platform',
        description: 'AI-driven interview simulation engine with adaptive voice evaluation',
        techStack: ['React', 'Node.js', 'Express', 'Vite']
      },
      {
        title: 'High-Throughput Microservices Gateway',
        description: 'Distributed API gateway with token-bucket rate limiting',
        techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker']
      }
    ],
    education: ['B.Tech Computer Science & Engineering'],
    experience: ['Full Stack Developer (3+ Years)'],
    certifications: ['AWS Certified Solutions Architect']
  },
  createdAt: new Date(Date.now() - 86400000 * 3)
};
resumes.set(seedResume._id, seedResume);

// Seed Sample Job Profile
const seedJob = {
  _id: 'jd_seed_001',
  userId: 'usr_demo_123',
  title: 'Senior Full Stack Engineer Job Profile',
  rawText: 'Looking for a Senior Full Stack Developer proficient in React, Node.js, PostgreSQL, Distributed Caching, and Docker.',
  extractedProfile: {
    role: 'Full Stack Developer',
    requiredSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'PostgreSQL', 'REST APIs', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'Redis', 'Microservices', 'System Design'],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker']
  },
  createdAt: new Date(Date.now() - 86400000 * 3)
};
jobProfiles.set(seedJob._id, seedJob);

// Seed Sample Interviews
const seedInterview1 = {
  _id: 'int_seed_001',
  userId: 'usr_demo_123',
  role: 'Full Stack Developer',
  experienceLevel: 'Intermediate',
  interviewType: 'Technical',
  difficulty: 'Intermediate',
  personality: 'Professional',
  status: 'completed',
  timerSecondsPerQuestion: 120,
  overallScore: 84,
  categoryScores: {
    technical: 86,
    communication: 82,
    problemSolving: 85,
    behavioral: 80,
    technicalDepth: 86,
    communicationClarity: 82,
    starStructure: 78,
    relevance: 88,
    confidence: 84
  },
  resumeMatchScore: 88,
  jdMatchScore: 82,
  strengths: [
    'Deep understanding of React state management and selector memoization',
    'Clear explanation of REST idempotency keys and concurrency handling',
    'Structured problem formulation using architectural trade-offs'
  ],
  weaknesses: [
    'Quantify performance metrics (e.g. latency, throughput, memory impact)',
    'Elaborate on edge-case fallback strategies for network partitions'
  ],
  learningPlan7Days: [
    { day: 'Day 1', topic: 'React Fiber & Reconciliation Engine', task: 'Deep dive into workLoopSync and commit phase mechanics.' },
    { day: 'Day 2', topic: 'State Management Benchmark', task: 'Build a benchmark app comparing Context, Zustand, and Jotai re-renders.' },
    { day: 'Day 3', topic: 'Idempotent API Architecture', task: 'Implement distributed locking with Redis Redlock in Node.js.' },
    { day: 'Day 4', topic: 'PostgreSQL Indexing & Execution Plans', task: 'Analyze EXPLAIN (ANALYZE, BUFFERS) on high-volume queries.' },
    { day: 'Day 5', topic: 'STAR Behavioral Articulation', task: 'Draft 5 STAR stories focusing on measurable metrics and outcomes.' },
    { day: 'Day 6', topic: 'Distributed Rate Limiting', task: 'Code a sliding-window rate limiter using Redis Lua scripts.' },
    { day: 'Day 7', topic: 'Full Mock Technical Simulation', task: 'Complete a full timed mock interview session.' }
  ],
  questions: [
    {
      questionId: 'fe_001',
      questionText: 'Your React dashboard has 5 child components subscribed to the same context. When one field changes, all 5 re-render. How do you isolate re-renders and structure state efficiently?',
      category: 'React & State Architecture',
      difficulty: 'Intermediate',
      candidateAnswer: 'I would isolate re-renders by splitting context into smaller domain-specific providers or using external state stores with fine-grained selectors like Zustand or Jotai. Additionally, React.memo and useMemo can be used on child leaves.',
      evaluation: {
        overallScore: 88,
        rubric: {
          technicalAccuracy: 9,
          relevance: 9,
          completeness: 8,
          clarity: 9,
          communication: 9,
          problemSolving: 9,
          confidence: 9,
          practicalUnderstanding: 9
        },
        qualityLevel: 'Excellent',
        humanizedFeedback: 'Excellent response! You clearly identified the fundamental context re-render behavior and offered modern architectural solutions.',
        whatDidWell: 'Directly recommended context splitting and selector-based state isolation (Zustand).',
        whatWasMissing: 'Could mention React 18 useSyncExternalStore or useTransition.',
        idealAnswer: 'Split context into granular stores, employ selector subscriptions (Zustand/Redux), and memoize child components.'
      },
      timeSpentSeconds: 45
    },
    {
      questionId: 'be_001',
      questionText: 'How do you design an idempotent payment charging endpoint to prevent double-charging during network timeouts and aggressive client retries?',
      category: 'System Design & APIs',
      difficulty: 'Advanced',
      candidateAnswer: 'We assign a unique client-generated Idempotency-Key header. On the backend, we acquire a distributed lock in Redis for that key, query an idempotent transactions table, and if already processed, return the cached response with HTTP 200/201.',
      evaluation: {
        overallScore: 92,
        rubric: {
          technicalAccuracy: 10,
          relevance: 9,
          completeness: 9,
          clarity: 9,
          communication: 9,
          problemSolving: 9,
          confidence: 9,
          practicalUnderstanding: 9
        },
        qualityLevel: 'Exceptional',
        humanizedFeedback: 'Exceptional system design response! You covered key generation, distributed locking, atomic database checks, and cached HTTP responses.',
        whatDidWell: 'Comprehensive coverage of idempotency keys, Redis locking, and transaction idempotency.',
        whatWasMissing: 'Briefly mention TTL expiry on the idempotency lock.',
        idealAnswer: 'Use client idempotency keys, atomic DB upserts or distributed Redis locks, and return identical transaction receipts on duplicates.'
      },
      timeSpentSeconds: 58
    }
  ],
  createdAt: new Date(Date.now() - 86400000 * 2)
};

const seedInterview2 = {
  _id: 'int_seed_002',
  userId: 'usr_demo_123',
  role: 'Backend Developer',
  experienceLevel: 'Senior',
  interviewType: 'System Design',
  difficulty: 'Advanced',
  personality: 'Professional',
  status: 'completed',
  timerSecondsPerQuestion: 120,
  overallScore: 79,
  categoryScores: {
    technical: 82,
    communication: 78,
    problemSolving: 80,
    behavioral: 76,
    technicalDepth: 82,
    communicationClarity: 78,
    starStructure: 74,
    relevance: 84,
    confidence: 78
  },
  resumeMatchScore: 84,
  jdMatchScore: 80,
  strengths: ['Solid database indexing concepts', 'Familiarity with event loop phases'],
  weaknesses: ['Add quantifiable throughput metrics in system scale answers'],
  learningPlan7Days: [
    { day: 'Day 1', topic: 'Distributed System Bottlenecks', task: 'Analyze read/write amplification in relational databases.' },
    { day: 'Day 2', topic: 'Caching Strategies', task: 'Implement Cache-Aside with Redis and TTL expiration.' },
    { day: 'Day 3', topic: 'Message Queues', task: 'Study BullMQ and RabbitMQ for asynchronous worker tasks.' },
    { day: 'Day 4', topic: 'Database Sharding', task: 'Review consistent hashing and shard keys.' },
    { day: 'Day 5', topic: 'Behavioral STAR Framing', task: 'Practice STAR answers on challenging production incidents.' },
    { day: 'Day 6', topic: 'System Design Mock', task: 'Practice designing a distributed URL shortener.' },
    { day: 'Day 7', topic: 'Full Simulation Review', task: 'Complete mock technical session with strict timers.' }
  ],
  questions: [
    {
      questionId: 'be_002',
      questionText: 'Compare PostgreSQL B-tree indexing with BRIN and GIN indexes. When would an index actually degrade query performance?',
      category: 'Databases & Query Optimization',
      difficulty: 'Advanced',
      candidateAnswer: 'B-tree is ideal for high cardinality equality and range queries. GIN is designed for composite items like JSONB or full-text search. BRIN works best for block ranges on naturally sorted append-only data like timestamps. Indexes degrade performance during write-heavy workloads because every insert and update requires re-indexing.',
      evaluation: {
        overallScore: 84,
        rubric: {
          technicalAccuracy: 9,
          relevance: 8,
          completeness: 8,
          clarity: 8,
          communication: 8,
          problemSolving: 8,
          confidence: 8,
          practicalUnderstanding: 9
        },
        qualityLevel: 'Strong',
        humanizedFeedback: 'Great breakdown of PostgreSQL index types and the write amplification trade-off.',
        whatDidWell: 'Accurately compared B-Tree, GIN, and BRIN indexes.',
        whatWasMissing: 'Could mention HOT (Heap-Only Tuples) updates.',
        idealAnswer: 'Analyze read vs write ratio, use EXPLAIN ANALYZE, and pick B-tree for general lookups and BRIN for large time-series.'
      },
      timeSpentSeconds: 65
    }
  ],
  createdAt: new Date(Date.now() - 86400000 * 5)
};

interviews.set(seedInterview1._id, seedInterview1);
interviews.set(seedInterview2._id, seedInterview2);

module.exports = {
  // Users
  getUserByEmail: (email) => {
    const lower = (email || '').toLowerCase().trim();
    for (const u of users.values()) {
      if (u.email && u.email.toLowerCase() === lower) return u;
    }
    return null;
  },
  getUserById: (id) => users.get(id) || null,
  createUser: (userObj) => {
    users.set(userObj._id, userObj);
    return userObj;
  },
  updateUser: (id, updates) => {
    const existing = users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    users.set(id, updated);
    return updated;
  },

  // Resumes
  getResumeById: (id) => resumes.get(id) || null,
  createResume: (resumeObj) => {
    resumes.set(resumeObj._id, resumeObj);
    return resumeObj;
  },

  // Job Profiles
  getJobProfileById: (id) => jobProfiles.get(id) || null,
  createJobProfile: (jobObj) => {
    jobProfiles.set(jobObj._id, jobObj);
    return jobObj;
  },

  // Interviews
  getInterviewById: (id) => interviews.get(id) || null,
  getInterviewsByUserId: (userId) => {
    const list = [];
    for (const inv of interviews.values()) {
      if (!userId || inv.userId === userId || userId === 'usr_demo' || userId === 'usr_demo_123') {
        list.push(inv);
      }
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  createInterview: (interviewObj) => {
    interviews.set(interviewObj._id, interviewObj);
    return interviewObj;
  },
  updateInterview: (id, updates) => {
    const existing = interviews.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    interviews.set(id, updated);
    return updated;
  },
  deleteInterview: (id) => {
    return interviews.delete(id);
  },

  // Bookmarks
  getBookmarksByUserId: (userId) => {
    const list = [];
    for (const b of bookmarks.values()) {
      if (b.userId === userId) list.push(b);
    }
    return list;
  },
  createBookmark: (bObj) => {
    bookmarks.set(bObj._id, bObj);
    return bObj;
  },
  deleteBookmark: (id) => bookmarks.delete(id)
};
