import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Play, CheckCircle, Zap, Brain, BarChart3,
  Cpu, FileText, ChevronRight
} from 'lucide-react';

/* ─── Demo data ─────────────────────────────────── */
const DEMO_ROLES = {
  'Frontend Engineer': {
    q: 'Your React dashboard has 5 child components all subscribing to the same user-data API. After any update, all 5 re-render even when only one uses the changed field. How do you fix this?',
    hint: "Try mentioning: selector patterns, useMemo, Zustand slices, or context splitting…",
  },
  'Backend Engineer': {
    q: 'Design an idempotent payment endpoint that safely handles duplicate POST requests caused by a client retry loop. What are the failure modes?',
    hint: "Consider: idempotency keys, database constraints, distributed locks…",
  },
  'Data Analyst': {
    q: 'Using window functions, write SQL to find the top-3 spending customers per country from an orders table. Explain your partitioning strategy.',
    hint: "DENSE_RANK vs ROW_NUMBER, partition by country, tie-breaking…",
  },
};

const CAPABILITIES = [
  { icon: Brain, title: 'Adaptive Questioning', desc: 'Questions adapt to your answers in real-time using a rubric-based probing engine.' },
  { icon: Cpu,   title: 'Role Blueprints',      desc: '25+ role-specific question banks built from real interview patterns.' },
  { icon: BarChart3, title: '8-Axis Evaluation', desc: 'Technical depth, STAR structure, communication clarity, and more — scored instantly.' },
  { icon: FileText, title: 'Resume Matching',   desc: 'JD + resume analysis generates hyper-personalized questions before your interview starts.' },
];

const ROLES = [
  'Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer',
  'React Developer','Node.js Developer','Python Developer','Java Developer',
  'Data Analyst','Data Scientist','ML Engineer','DevOps Engineer',
  'Cloud Engineer','QA Engineer','Product Manager','Cybersecurity Analyst',
];

/* ─── Landing Page ──────────────────────────────── */
export const LandingPage = () => {
  const roleKeys = Object.keys(DEMO_ROLES);
  const [activeRole, setActiveRole] = useState(roleKeys[0]);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = () => {
    if (!answer.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const wordCount = answer.trim().split(/\s+/).length;
      const score = Math.min(95, 52 + wordCount * 0.8 + (answer.includes('→') ? 4 : 0));
      setResult({
        score: Math.round(score),
        strengths: wordCount > 25
          ? 'Good depth — you addressed the core constraint clearly.'
          : 'Answer identifies the issue. Try adding more specifics.',
        followUp: 'How would your solution handle a stale-while-revalidate pattern for offline users?',
      });
      setLoading(false);
    }, 1100);
  };

  return (
    <div style={{ flex: 1 }}>
      {/* ─── Hero ─────────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '80px 0 72px',
        }}
      >
        <div className="page-container" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-strong)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              marginBottom: 28,
              letterSpacing: '0.02em',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--success)',
                display: 'inline-block',
              }}
            />
            Now with adaptive follow-up questioning
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 20,
              maxWidth: 800,
              margin: '0 auto 20px',
            }}
          >
            Interview practice that actually{' '}
            <span style={{ color: 'var(--accent-text)' }}>prepares you.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 36px',
              lineHeight: 1.65,
            }}
          >
            InterviewAI reads your resume and job description, then conducts an
            adaptive mock interview — asking probing follow-ups, evaluating STAR
            structure, and giving rubric-based feedback.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/interviews/new"
              id="cta-start-interview"
              className="btn btn-primary btn-lg"
            >
              Start a practice session
              <ArrowRight size={17} />
            </Link>
            <Link
              to="/dashboard"
              id="cta-view-dashboard"
              className="btn btn-outline btn-lg"
            >
              View dashboard
            </Link>
          </div>

          {/* Social proof */}
          <div
            style={{
              marginTop: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '25+', label: 'Role blueprints' },
              { value: '8',   label: 'Scoring axes' },
              { value: '∞',   label: 'Practice sessions' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive Demo ─────────────────────── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="page-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 40,
              alignItems: 'start',
            }}
          >
            {/* Left — context */}
            <div>
              <span
                className="badge badge-accent"
                style={{ marginBottom: 16 }}
              >
                <Zap size={11} /> Live demo
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                Try a real question right now
              </h2>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: 24,
                }}
              >
                Pick a role below. Answer the question. Watch the AI score
                your response across technical depth, clarity, and structure —
                then ask a follow-up.
              </p>

              {/* Role tabs */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {roleKeys.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setActiveRole(r);
                      setAnswer('');
                      setResult(null);
                    }}
                    className={`btn btn-sm ${activeRole === r ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* What happens next */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Scored on technical accuracy + STAR framework',
                  'AI asks an immediate follow-up question',
                  'Full session report at end of interview',
                ].map(item => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <CheckCircle
                      size={15}
                      style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — interactive widget */}
            <div>
              <div className="card" style={{ padding: 24 }}>
                {/* Question */}
                <div
                  style={{
                    padding: '16px 18px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 16,
                    borderLeft: '3px solid var(--accent)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 8,
                    }}
                  >
                    {activeRole} · Scenario Question
                  </div>
                  <p
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {DEMO_ROLES[activeRole].q}
                  </p>
                </div>

                {/* Answer */}
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <textarea
                    id="demo-answer"
                    className="input"
                    rows={4}
                    value={answer}
                    onChange={e => { setAnswer(e.target.value); setResult(null); }}
                    placeholder={DEMO_ROLES[activeRole].hint}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    id="demo-evaluate-btn"
                    onClick={handleEvaluate}
                    disabled={!answer.trim() || loading}
                    className="btn btn-primary btn-sm"
                  >
                    {loading ? 'Evaluating…' : <><Play size={13} /> Evaluate answer</>}
                  </button>
                </div>

                {/* Result */}
                {result && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: 16,
                      padding: '16px 18px',
                      background: 'var(--success-subtle)',
                      border: '1px solid var(--success)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--success)',
                        }}
                      >
                        Score: {result.score}/100
                      </span>
                      <div className="progress-bar" style={{ width: 100 }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${result.score}%`,
                            background: 'var(--success)',
                          }}
                        />
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      {result.strengths}
                    </p>
                    <div
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: 'var(--accent-text)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: 4,
                        }}
                      >
                        AI Follow-up
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                        {result.followUp}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', marginTop: 10 }}>
                <Link
                  to="/interviews/new"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--accent-text)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    textDecoration: 'none',
                  }}
                >
                  Run a full session <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Capabilities ─────────────────────────── */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="page-container">
          <div style={{ marginBottom: 48, maxWidth: 480 }}>
            <h2
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.875rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                marginBottom: 10,
              }}
            >
              Everything a real interviewer does — automated.
            </h2>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Not a question generator. An interview simulator.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 1,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  padding: '28px 24px',
                  background: 'var(--bg-surface)',
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background var(--transition-md)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'var(--accent-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Icon size={18} style={{ color: 'var(--accent-text)' }} />
                </div>
                <div
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 6,
                  }}
                >
                  {title}
                </div>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roles ────────────────────────────────── */}
      <section style={{ padding: '64px 0' }}>
        <div className="page-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr',
              gap: 48,
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  marginBottom: 10,
                }}
              >
                25+ roles supported
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                Each role has a dedicated question bank, topic weights, and
                scenario patterns derived from real interviews.
              </p>
              <Link
                to="/interviews/new"
                className="btn btn-primary btn-sm"
              >
                Choose your role <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ROLES.map(role => (
                <span
                  key={role}
                  className="badge badge-muted"
                  style={{ fontSize: '0.8125rem', padding: '5px 12px' }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
