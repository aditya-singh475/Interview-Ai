import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  TrendingUp, ArrowRight, BookOpen, Target,
  BarChart2, AlertCircle,
} from 'lucide-react';

/* ─── Score Bar ─────────────────────────── */
const ScoreBar = ({ label, score, max = 100 }) => {
  const color =
    score >= 80 ? 'var(--success)' :
    score >= 60 ? 'var(--warning)' :
    'var(--danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ minWidth: 160, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${(score / max) * 100}%`, background: color }}
        />
      </div>
      <div
        style={{
          minWidth: 28,
          textAlign: 'right',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color,
        }}
      >
        {score}
      </div>
    </div>
  );
};

/* ─── Mini Trend ────────────────────────── */
const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.score), 100);
  const min = Math.max(0, Math.min(...data.map(d => d.score)) - 10);
  const range = max - min || 1;
  const H = 80;
  const W = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.score - min) / range) * H;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `0,${H} ${polyline} ${W},${H}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: H, display: 'block' }}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((d.score - min) / range) * H;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2.5"
            fill="var(--accent)"
          />
        );
      })}
    </svg>
  );
};

/* ─── Weak Topic Row ───────────────────── */
const WeakTopicRow = ({ topic, score }) => {
  const pct = score;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{topic}</div>
      <div className="progress-bar" style={{ width: 100 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'var(--warning)' }} />
      </div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--warning)', minWidth: 28, textAlign: 'right' }}>
        {pct}
      </div>
    </div>
  );
};

/* ─── Progress Page ────────────────────── */
export const ProgressPage = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProgress()
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const progress = data || {
    readinessScore: 79,
    scoreChangeText: '+7% improvement across your last 3 interviews',
    stats: { completedCount: 4, questionsAnswered: 20, bestScore: 88, currentStreak: 5, averageScore: 79 },
    categoryScores: { technical: 82, communication: 78, problemSolving: 84, behavioral: 75 },
    weeklyTrend: [
      { week: 'W1', score: 65 },
      { week: 'W2', score: 70 },
      { week: 'W3', score: 74 },
      { week: 'W4', score: 79 },
    ],
  };

  const categoryScores = progress.categoryScores || {};
  const weakTopics = Object.entries(categoryScores)
    .filter(([, v]) => v < 80)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 4);

  const strongTopics = Object.entries(categoryScores)
    .filter(([, v]) => v >= 80)
    .sort(([, a], [, b]) => b - a);

  const labelMap = {
    technical: 'Technical Depth',
    communication: 'Communication',
    problemSolving: 'Problem Solving',
    behavioral: 'Behavioral / STAR',
    technicalDepth: 'Technical Depth',
    communicationClarity: 'Communication Clarity',
    starStructure: 'STAR Structure',
    relevance: 'Relevance',
    confidence: 'Confidence',
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <BarChart2 size={20} style={{ color: 'var(--accent-text)' }} />
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
            }}
          >
            Progress
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Track your improvement, identify weak areas, and plan your next steps.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score trend */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      marginBottom: 4,
                    }}
                  >
                    Score trend
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                    {progress.stats?.averageScore ?? 79}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100 avg</span>
                  </div>
                </div>
                {progress.scoreChangeText && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.8125rem',
                      color: 'var(--success)',
                      fontWeight: 500,
                    }}
                  >
                    <TrendingUp size={14} />
                    {progress.scoreChangeText}
                  </div>
                )}
              </div>
              <TrendChart data={progress.weeklyTrend} />
              {progress.weeklyTrend && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  {progress.weeklyTrend.map(d => (
                    <div key={d.week} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.week}</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{d.score}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skill breakdown */}
            <div className="card">
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 18 }}>
                Skill breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(categoryScores).map(([key, val]) => (
                  <ScoreBar
                    key={key}
                    label={labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    score={val}
                  />
                ))}
              </div>
            </div>

            {/* Weak topics */}
            {weakTopics.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <AlertCircle size={15} style={{ color: 'var(--warning)' }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Areas to improve</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                  Focus practice on these topics to improve your overall score.
                </p>
                <div>
                  {weakTopics.map(([key, val]) => (
                    <WeakTopicRow
                      key={key}
                      topic={labelMap[key] || key}
                      score={val}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Overall readiness */}
            <div className="card" style={{ textAlign: 'center', padding: 24 }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 16,
                }}
              >
                Readiness
              </div>
              {(() => {
                const score = progress.readinessScore || 79;
                const r = 52;
                const circ = 2 * Math.PI * r;
                const offset = circ - (circ * score) / 100;
                return (
                  <svg width={120} height={120} viewBox="0 0 120 120" style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }}>
                    <circle cx="60" cy="60" r={r} fill="none" stroke="var(--bg-overlay)" strokeWidth="9" />
                    <circle
                      cx="60" cy="60" r={r}
                      fill="none"
                      stroke={score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent)' : 'var(--warning)'}
                      strokeWidth="9"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
                    />
                    <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)" fontFamily="Inter, sans-serif" dominantBaseline="middle">
                      {score}
                    </text>
                    <text x="60" y="74" textAnchor="middle" fontSize="10" fill="var(--text-muted)" fontFamily="Inter, sans-serif">
                      / 100
                    </text>
                  </svg>
                );
              })()}
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 4 }}>
                {progress.readinessScore >= 80 ? 'Interview ready' :
                 progress.readinessScore >= 60 ? 'Getting there' : 'Keep practicing'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Based on recent session scores
              </p>
              <Link
                to="/interviews/new"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Practice now
              </Link>
            </div>

            {/* Stats */}
            <div className="card">
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 14 }}>
                Session stats
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Sessions completed', value: progress.stats?.completedCount ?? 4 },
                  { label: 'Questions answered', value: progress.stats?.questionsAnswered ?? 20 },
                  { label: 'Personal best', value: `${progress.stats?.bestScore ?? 88}/100` },
                  { label: 'Practice streak', value: `${progress.stats?.currentStreak ?? 5} days` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strong topics */}
            {strongTopics.length > 0 && (
              <div className="card" style={{ borderLeft: '3px solid var(--success)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12 }}>
                  Strong areas
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {strongTopics.map(([key]) => (
                    <span key={key} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      {labelMap[key] || key}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended practice */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <BookOpen size={15} style={{ color: 'var(--accent-text)' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Recommended</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  weakTopics[0] ? `Practice ${labelMap[weakTopics[0][0]] || weakTopics[0][0]}` : 'SQL Window Functions',
                  'Behavioral STAR structure',
                  weakTopics[1] ? `Improve ${labelMap[weakTopics[1][0]] || weakTopics[1][0]}` : 'System Design basics',
                ].map((item, i) => (
                  <Link
                    key={i}
                    to="/practice"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                      transition: 'background var(--transition)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-overlay)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  >
                    {item}
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
