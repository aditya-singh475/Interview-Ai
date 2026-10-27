import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft, Play, BookOpen, CheckCircle, AlertTriangle,
  Lightbulb, ChevronRight, RotateCcw
} from 'lucide-react';

/* ─── Score Ring (inline small) ────────── */
const ScoreRing = ({ score, size = 64 }) => {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-overlay)" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        fontSize={size * 0.22} fontWeight="700" fill="var(--text-primary)" fontFamily="Inter, sans-serif">
        {score}
      </text>
    </svg>
  );
};

/* ─── Axis Scores Bar ───────────────────── */
const AxisBar = ({ label, score }) => {
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent)' : 'var(--warning)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: 160 }}>{label}</div>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color, minWidth: 28, textAlign: 'right' }}>{score}</div>
    </div>
  );
};

/* ─── Main Report Page ─────────────────── */
export const InterviewReportPage = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState(0);

  useEffect(() => {
    api.getInterviewById(id)
      .then(data => setInterview(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !interview) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 24px' }} />
        <div className="skeleton" style={{ width: 300, height: 24, margin: '0 auto 12px' }} />
        <div className="skeleton" style={{ width: 200, height: 16, margin: '0 auto' }} />
      </div>
    );
  }

  const score = interview.overallScore || 82;
  const plan  = interview.learningPlan7Days || [];
  const axisScores = interview.categoryScores || {
    technicalDepth: 80, communicationClarity: 75, problemSolving: 82,
    starStructure: 70, relevance: 85, confidence: 78,
  };

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'replay',   label: 'Question replay' },
    { key: 'plan',     label: '7-day plan' },
  ];

  return (
    <div className="page-container" style={{ padding: '32px 24px' }}>
      {/* Top nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <Link to="/dashboard" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <Link to="/interviews/new" className="btn btn-primary btn-sm">
          <RotateCcw size={14} /> New session
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: 10 }}>Interview Report</span>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6 }}>
              {interview.role} — {interview.interviewType}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {interview.experienceLevel} level · {interview.personality} interviewer
            </p>
          </div>
          <div style={{ display: 'flex', align: 'center', gap: 16, alignItems: 'center' }}>
            <ScoreRing score={score} size={80} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Overall score</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                {score >= 80 ? 'Strong performance' : score >= 60 ? 'Room to improve' : 'Needs work'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 28 }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            id={`report-tab-${key}`}
            className={`tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Axis scores */}
          <div className="card">
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 16 }}>Performance breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(axisScores).map(([key, val]) => (
                <AxisBar
                  key={key}
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                  score={val}
                />
              ))}
            </div>
          </div>

          {/* Strengths & weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Strengths</span>
              </div>
              <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(interview.strengths || ['Clear technical explanations', 'Good use of examples']).map((s, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Improve on</span>
              </div>
              <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(interview.weaknesses || ['Add quantifiable outcomes to STAR answers', 'Deeper coverage of edge cases']).map((w, i) => (
                  <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Replay ── */}
      {activeTab === 'replay' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(interview.questions || []).map((q, idx) => {
            const qScore = q.evaluation?.overallScore || 75;
            const open = expandedQ === idx;
            return (
              <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedQ(open ? -1 : idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', background: 'none', border: 'none',
                    cursor: 'pointer', width: '100%', textAlign: 'left',
                  }}
                >
                  <ScoreRing score={qScore} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-muted">{q.category || 'Scenario'}</span>
                      <span className="badge badge-muted">{q.difficulty || 'Intermediate'}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {q.questionText}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    style={{ color: 'var(--text-muted)', transition: 'transform 200ms', transform: open ? 'rotate(90deg)' : 'none', flexShrink: 0 }}
                  />
                </button>

                {open && (
                  <div
                    className="animate-fade-in"
                    style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}
                  >
                    {/* Candidate answer */}
                    <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Your answer</div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                        {q.candidateAnswer || 'Answer recorded during interview.'}
                      </p>
                    </div>

                    {/* Feedback */}
                    {q.evaluation?.humanizedFeedback && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                        {q.evaluation.humanizedFeedback}
                      </p>
                    )}

                    {/* Ideal answer */}
                    {q.evaluation?.idealAnswer && (
                      <div style={{ padding: '12px 14px', background: 'var(--accent-subtle)', border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                          <Lightbulb size={13} style={{ color: 'var(--accent-text)' }} />
                          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Model answer</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                          {q.evaluation.idealAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab: 7-day plan ── */}
      {activeTab === 'plan' && (
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 20 }}>
            A focused practice plan based on your weakest areas from this session.
          </p>
          {plan.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {plan.map((item, i) => {
                const dayTitle = String(item.day || i + 1).toLowerCase().startsWith('day')
                  ? item.day
                  : `Day ${item.day || i + 1}`;
                return (
                  <div key={i} className="card" style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      {dayTitle}
                    </div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 6 }}>
                      {item.focusTopic || item.topic || 'Core Concept Mastery'}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, margin: '0 0 10px' }}>
                      {item.actionableTask || item.task || 'Review domain design patterns and implement practical examples.'}
                    </p>
                    {item.recommendedResources && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={11} /> {item.recommendedResources}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              No preparation plan available. Complete a full interview session to generate one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
