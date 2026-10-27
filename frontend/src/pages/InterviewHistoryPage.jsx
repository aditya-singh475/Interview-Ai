import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Calendar, ArrowRight, PlayCircle, Trash2, RotateCcw,
} from 'lucide-react';

/* ─── Score Badge ─────────────────────── */
const ScoreBadge = ({ score }) => {
  const color =
    score >= 80 ? 'var(--success)' :
    score >= 60 ? 'var(--warning)' :
    'var(--danger)';
  return (
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <div
        style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}
      >
        {score}
      </div>
      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</div>
    </div>
  );
};

/* ─── Interview Row ────────────────────── */
const InterviewRow = ({ interview, onDelete }) => {
  const score = interview.overallScore ?? 76;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        transition: 'border-color var(--transition-md)',
        flexWrap: 'wrap',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
          <span className="badge badge-accent">{interview.role || 'Full Stack Developer'}</span>
          <span className="badge badge-muted">{interview.interviewType || 'Technical'}</span>
          {interview.experienceLevel && (
            <span className="badge badge-muted">{interview.experienceLevel}</span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <Calendar size={12} />
          {new Date(interview.createdAt || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
          {interview.questions?.length > 0 && (
            <span>· {interview.questions.length} questions</span>
          )}
        </div>
      </div>

      {/* Score + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <ScoreBadge score={score} />
        <div style={{ display: 'flex', gap: 6 }}>
          <Link
            to={`/interviews/${interview._id}/report`}
            className="btn btn-outline btn-sm"
            title="View report"
          >
            Report <ArrowRight size={13} />
          </Link>
          <Link
            to="/interviews/new"
            className="btn btn-ghost btn-icon btn-sm"
            title="Retry this type"
            style={{ padding: '6px' }}
          >
            <RotateCcw size={14} />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(interview._id)}
              className="btn btn-ghost btn-icon btn-sm"
              title="Delete"
              style={{ padding: '6px', color: 'var(--danger)' }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Interview History Page ────────────── */
export const InterviewHistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.getAllInterviews()
      .then(data => setInterviews(data || []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview session?')) return;
    try {
      await api.deleteInterview(id);
    } catch {}
    setInterviews(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 4,
            }}
          >
            Interview History
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Review past sessions, scores, and detailed question replays.
          </p>
        </div>
        <Link to="/interviews/new" className="btn btn-primary" id="history-new-btn">
          <PlayCircle size={16} /> New interview
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 82 }} />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '64px 24px' }}
        >
          <Calendar
            size={36}
            style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.5 }}
          />
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 8,
            }}
          >
            No interviews yet
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 24 }}>
            Start your first session to begin building your history.
          </p>
          <Link to="/interviews/new" className="btn btn-primary btn-sm" id="history-empty-start">
            Start first interview
          </Link>
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: 12,
            }}
          >
            {interviews.length} session{interviews.length !== 1 ? 's' : ''} recorded
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {interviews.map((int, i) => (
              <InterviewRow
                key={int._id || i}
                interview={int}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
