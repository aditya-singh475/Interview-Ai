# InterviewAI — AI-Powered Realistic Interview Simulator

**InterviewAI** is a production-quality full-stack platform designed to simulate realistic job interviews rather than simply generating generic AI questions. 

Unlike conventional AI chatbots that ask surface-level questions like *"What is React?"*, InterviewAI functions as a personalized senior interview coach. It analyzes your **Resume**, **Job Description**, **Target Role Blueprint**, **Experience Level**, and **Previous Answers** to conduct human-like adaptive video & text interviews with multi-axis evaluation rubrics.

---

## 🌟 Core Product Vision

```
Resume + Job Description + Target Role + Experience Level + Interviewer Persona
                                   ↓
                     Personalized Interview Blueprint
                                   ↓
                   Role-Specific Scenario Questions
                                   ↓
                     Realistic Video/Text Interview
                                   ↓
                    Adaptive Dynamic Follow-up Engine
                                   ↓
                8-Axis Rubric & STAR Behavioral Evaluation
                                   ↓
            Performance Dashboard & Weakness Detection
                                   ↓
              Personalized 7-Day Actionable Prep Plan
```

**The Main Operating Principle:** `PRACTICE → ANALYZE → IMPROVE → REPEAT`

---

## 🚀 Key Features

### 1. Role Intelligence Engine (25 Supported Roles)
Custom weighted topic blueprints for 25 roles including **Software Engineer, Frontend Developer, Backend Developer, Full Stack, React, Node.js, Java, Python, C++, Data Analyst, Data Scientist, ML Engineer, DevOps, QA, Android, iOS, UI/UX Designer, Product Manager, Cybersecurity, Cloud Engineer, Database Developer, HR**, and **Custom Role**.
* *Example (Frontend):* JavaScript (25%), React (25%), HTML/CSS (15%), Browser APIs (10%), Performance (10%), REST APIs (10%), Behavioral (5%).

### 2. Resume & Job Description Intelligence
- **Multi-Format Parsing:** Upload resumes in PDF, DOCX, TXT, RTF format (or paste plain text).
- **Candidate Profile Extractor:** Automatically extracts skills, experience, education, and past projects.
- **Project-Based Interview Questions:** Asks scenario questions about the candidate's actual projects (*"You built an Expense Tracker with LocalStorage... how would you scale this to 10k concurrent users?"*).
- **JD Requirement Matrix:** Extracts required vs. preferred skills and displays question rationale (*"Why am I being asked this? — Based on Node.js + REST API requirement in your target job description"*).

### 3. Human-Like Adaptive Interviewer
- **Interviewer Personas:** Friendly, Professional, Technical, Challenging.
- **Dynamic Difficulty Scaling:** Increases difficulty on strong answers; asks simpler clarification questions on struggling answers.
- **Targeted Follow-Ups:** Probes weak or incomplete answers (*"Why choose Context API over Zustand here? How would your solution handle real-time WebSocket updates?"*).

### 4. Browser Native Video & Speech Subsystem
- **Full-Screen Split Video Layout:** Live webcam preview using native `getUserMedia()`.
- **Hands-Free Speech-to-Text (STT) & Text-to-Speech (TTS):** Browser native Web Speech API reads questions aloud and transcribes candidate answers in real time.
- **Graceful Fallbacks:** Non-breaking transition to Text Mode if camera or microphone permissions are denied.

### 5. Transparent 8-Axis Rubric & STAR Evaluation
Evaluates every response from 0–100 across 8 criteria:
1. Technical Accuracy
2. Relevance
3. Completeness
4. Clarity
5. Communication
6. Problem Solving
7. Confidence
8. Practical Understanding

- **STAR Analyzer:** Evaluates Situation, Task, Action, and Result completeness for behavioral questions.
- **Communication Analysis:** Tracks filler words (`um`, `uh`, `basically`, `like`) and response clarity.

### 6. Dashboard, Analytics & 7-Day Learning Plan
- **Overall Interview Readiness Score:** Formula-driven readiness metric with historical progression tracking (*"+7% improvement over your last 3 interviews"*).
- **Competency Radar:** Visual radar breakdown of Technical, Communication, Problem Solving, and Behavioral scores.
- **7-Day Personalized Prep Plan:** Daily actionable tasks based on detected candidate weaknesses.
- **Coding Interview Mode:** Integrated code editor for JavaScript, Python, Java, and C++ with test runner sandbox.
- **Standalone Resume-JD Match Tool:** Instant compatibility score and missing skill gap analysis.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Vanilla CSS Design System with CSS Variable Tokens (Dark & Light Modes), Lucide React Icons, Web Speech API.
- **Backend:** Node.js, Express.js REST API, MongoDB + Mongoose, JWT Authentication, Multer file parser, `pdf-parse`, `mammoth`.
- **AI Architecture:** AI Service Abstraction (`aiService.js`) with Gemini API provider adapter + **100% Functional Zero-Breakage Mock AI Engine** using a 300+ scenario question bank.

---

## 📁 Project Structure

```
interview-Ai/
├── backend/
│   ├── config/             # MongoDB connection config
│   ├── controllers/        # Auth, Resume, Job, Interview, Question & Progress controllers
│   ├── data/               # Seeded scenario question bank (300+ questions)
│   ├── middleware/         # JWT Auth protection
│   ├── models/             # User, Resume, JobProfile, Question, Interview, Bookmark models
│   ├── routes/             # REST API endpoint definitions
│   ├── services/           # Role Intelligence, Resume Parser, JD Analyzer, AI Service
│   ├── utils/              # Database seed scripts
│   ├── .env                # Environment configuration
│   ├── package.json
│   └── server.js           # Express main server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, VideoInterviewMode, STARBadge, ScoreRadarChart
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/          # Landing, Login, Register, Dashboard, Setup, Live, Report, History, Practice, Coding, Analyzer, Settings
│   │   ├── services/       # API client with REST & mock fallbacks
│   │   ├── styles/         # CSS design tokens, dark/light themes, glassmorphism utilities
│   │   ├── App.jsx         # React router setup
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── package.json            # Root script launcher
└── README.md
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- Node.js v18+ & npm
- MongoDB (Local instance at `mongodb://127.0.0.1:27017/interviewai` or MongoDB Atlas URI)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔒 Security & Performance
- JWT Authentication & `bcryptjs` password hashing.
- API Rate Limiting (`express-rate-limit`) & Security Headers (`helmet`).
- File Upload Validation (MIME type, extension, size limits).
- Zero camera video data recorded or transmitted to third-party servers.

---

## 📄 License
Production Quality Portfolio Reference — Built for realistic AI interview simulation.
