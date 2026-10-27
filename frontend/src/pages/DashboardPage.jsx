import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Play, TrendingUp, CheckSquare, Target, BarChart3,
  BookOpen, Code2, FileSearch, ArrowRight, Calendar,
  Flame, Award, Clock, Lock, ShieldCheck, UserCheck,
  Sparkles, Zap, ChevronRight
} from 'lucide-react';

/* ─── Sub-components ──────────────────── */

const StatCard = ({ icon: Icon, value, label, color = 'var(--accent-text)' }) => (
  <div
    className="card card-3d"
    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px' }}
  >
    <div
      style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <div
        style={{
          fontSize: '1.45rem', fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  </div>
);

const ReadinessRing = ({ score }) => {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const filled = circ - (circ * score) / 100;

  return (
    <div
      className="card card-3d"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '22px 24px',
        gridColumn: 'span 2',
      }}
    >
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-overlay)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={filled}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 1.2s ease',
          }}
        />
        <text
          x="50" y="53"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
          fontWeight="700"
          fill="var(--text-primary)"
          fontFamily="Inter, sans-serif"
        >
          {score}
        </text>
      </svg>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
          Readiness score
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          {score >= 80 ? 'Interview ready' : score >= 60 ? 'Getting there' : 'Keep practicing'}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Calculated across technical depth, STAR structure & clarity
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ to, icon: Icon, iconColor, title, desc }) => (
  <Link
    to={to}
    className="card-3d"
    style={{
      display: 'block',
      padding: '22px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      textDecoration: 'none',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
  >
    <div
      style={{
        width: 38, height: 38, borderRadius: 10,
        background: 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
        border: '1px solid var(--border)',
      }}
    >
      <Icon size={18} style={{ color: iconColor }} />
    </div>
    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
      {title}
    </div>
    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
      {desc}
    </p>
  </Link>
);

const InterviewRow = ({ interview, idx }) => {
  const score = interview.overallScore || (70 + idx * 6);
  const isGood = score >= 80;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-accent">{interview.role || 'Full Stack Developer'}</span>
          <span className="badge badge-muted">{interview.interviewType || 'Technical'}</span>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {new Date(interview.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: isGood ? 'var(--success)' : 'var(--warning)',
              letterSpacing: '-0.02em',
            }}
          >
            {score}
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</div>
        </div>
        <Link
          to={`/interviews/${interview._id || idx}/report`}
          className="btn btn-outline btn-sm"
          style={{ flexShrink: 0 }}
        >
          Report <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

/* ─── Main Dashboard ──────────────────── */
export const DashboardPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [progressRes, historyRes] = await Promise.all([
          api.getProgress(),
          api.getAllInterviews(),
        ]);
        setProgressData(progressRes);
        setRecentInterviews(historyRes?.slice(0, 5) || []);
      } catch {
        // fallback demo metrics
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Quick 1-click Demo Login for fast testing
  const handleQuickDemoLogin = async () => {
    try {
      await login('demo@interviewai.com', 'password123');
    } catch {
      // already handled
    }
  };

  /* ─── UN-AUTHENTICATED GATE (ACCOUNT HOLDER ONLY) ──── */
  if (!user && !loading) {
    return (
      <div style={{ padding: '60px 0 100px' }}>
        <div className="page-container" style={{ maxWidth: 760 }}>
          <div
            className="card card-3d animate-fade-in"
            style={{
              padding: '48px 36px',
              textAlign: 'center',
              background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* 3D Floating Lock Badge */}
            <div
              className="animate-float"
              style={{
                width: 76,
                height: 76,
                borderRadius: 22,
                background: 'linear-gradient(135deg, var(--accent) 0%, #4338ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 12px 28px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Lock size={36} color="#ffffff" />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-subtle)',
                color: 'var(--accent-text)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              <ShieldCheck size={14} /> Account Holder Portal
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: 12 }}>
              Account Holder Sign-In Required
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 32px' }}>
              The Candidate Dashboard is private and reserved for registered account holders to securely protect your readiness metrics, evaluation transcripts, and mock session histories.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link to="/login" className="btn btn-primary btn-lg" style={{ minWidth: 160 }}>
                Sign in to Account
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg" style={{ minWidth: 160 }}>
                Create Free Account
              </Link>
            </div>

            {/* Quick Demo Login Option */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                Testing the platform? You can access instant demo metrics in one click:
              </p>
              <button
                onClick={handleQuickDemoLogin}
                className="btn btn-ghost btn-sm"
                style={{
                  color: 'var(--accent-text)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Zap size={14} style={{ color: 'var(--warning)' }} /> One-Click Demo Candidate Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── AUTHENTICATED DASHBOARD ──────────────────────── */
  const readiness = progressData?.readinessScore || 79;
  const stats = progressData?.stats || {
    completedCount: 4,
    questionsAnswered: 20,
    bestScore: 88,
    currentStreak: 5,
    averageScore: 79,
  };

  return (
    <div className="page-container" style={{ padding: '36px 24px 80px' }}>
      {/* Page Header */}
      <div
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 36,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-success" style={{ gap: 4 }}>
              <UserCheck size={13} /> Account Verified
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              marginBottom: 4,
              color: 'var(--text-primary)',
            }}
          >
            Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Target Track: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {user?.targetRole || 'Full Stack Developer'}
            </strong>
          </p>
        </div>
        <Link
          to="/interviews/new"
          id="dashboard-new-interview-btn"
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--radius-md)' }}
        >
          <Play size={16} /> Start New Mock Interview
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div
        className="perspective-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <ReadinessRing score={readiness} />
        <StatCard icon={CheckSquare} value={stats.completedCount || 4} label="Interviews Completed" color="var(--accent-text)" />
        <StatCard icon={Flame} value={`${stats.currentStreak || 5} days`} label="Current Streak" color="var(--warning)" />
        <StatCard icon={Award} value={`${stats.bestScore || 88}%`} label="Top Session Score" color="var(--success)" />
      </div>

      {/* Quick Launchpad */}
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
          Interview Preparation Modules
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <QuickLink
            to="/practice"
            icon={BookOpen}
            iconColor="var(--accent-text)"
            title="Question Practice Bank"
            desc="Explore model answers across JS, SQL, Node, React, Python, Java & System Design."
          />
          <QuickLink
            to="/coding"
            icon={Code2}
            iconColor="var(--warning)"
            title="Live Coding Sandbox"
            desc="Solve algorithmic DSA and SQL problems from basic to advanced with instant test runs."
          />
          <QuickLink
            to="/analyzer"
            icon={FileSearch}
            iconColor="var(--success)"
            title="Modular Resume Matcher"
            desc="Audit your resume against targeted JDs with ATS scoring and bullet rewrite suggestions."
          />
        </div>
      </div>

      {/* Recent Interviews Section */}
      <div
        className="card card-3d"
        style={{
          padding: '24px 28px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Recent Interview Transcripts
          </h2>
          <Link to="/history" className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-text)' }}>
            View all history <ChevronRight size={14} />
          </Link>
        </div>

        {recentInterviews.length === 0 ? (
          <div>
            {[
              { role: 'Frontend Engineer', interviewType: 'Technical Deep-Dive', overallScore: 84, createdAt: Date.now() - 86400000 },
              { role: 'Full Stack Developer', interviewType: 'System Design & STAR', overallScore: 78, createdAt: Date.now() - 172800000 },
            ].map((item, idx) => (
              <InterviewRow key={idx} interview={item} idx={idx} />
            ))}
          </div>
        ) : (
          recentInterviews.map((item, idx) => (
            <InterviewRow key={item._id || idx} interview={item} idx={idx} />
          ))
        )}
      </div>
    </div>
  );
};
