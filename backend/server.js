const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const questionRoutes = require('./routes/questionRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// Database Connection
connectDB();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job-description', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api', progressRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'InterviewAI API Server', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[InterviewAI Server] running on port ${PORT}`);
});
