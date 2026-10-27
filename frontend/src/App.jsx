import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { LiveInterviewPage } from './pages/LiveInterviewPage';
import { InterviewReportPage } from './pages/InterviewReportPage';
import { InterviewHistoryPage } from './pages/InterviewHistoryPage';
import { PracticePage } from './pages/PracticePage';
import { CodingInterviewPage } from './pages/CodingInterviewPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProgressPage } from './pages/ProgressPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/interviews/new" element={<InterviewSetupPage />} />
                <Route path="/interviews/:id/live" element={<LiveInterviewPage />} />
                <Route path="/interviews/:id/report" element={<InterviewReportPage />} />
                <Route path="/history" element={<InterviewHistoryPage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/coding" element={<CodingInterviewPage />} />
                <Route path="/analyzer" element={<ResumeAnalyzerPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
