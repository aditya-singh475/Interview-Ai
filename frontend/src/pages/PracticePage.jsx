import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BookOpen, ChevronDown, ChevronUp, Search, CheckCircle2,
  Bookmark, BookmarkCheck, Sparkles, Send, HelpCircle,
  AlertCircle, Code2, Layers, Cpu, Database, Flame, Terminal,
  Lightbulb, ShieldCheck, Zap
} from 'lucide-react';

const TECH_STACKS = [
  { id: 'all', label: 'All Technologies', icon: Layers },
  { id: 'JavaScript', label: 'JavaScript', icon: Code2 },
  { id: 'React', label: 'React', icon: Cpu },
  { id: 'Node.js', label: 'Node.js', icon: Terminal },
  { id: 'SQL', label: 'SQL & Databases', icon: Database },
  { id: 'Python', label: 'Python', icon: Terminal },
  { id: 'Java', label: 'Java & Spring', icon: Cpu },
  { id: 'System Design', label: 'System Design', icon: Layers },
  { id: 'DevOps & Cloud', label: 'DevOps & Cloud', icon: Zap },
  { id: 'Behavioral', label: 'Behavioral & STAR', icon: Sparkles },
];

const DIFFICULTY_COLOR = {
  Beginner: 'var(--success)',
  Intermediate: 'var(--warning)',
  Advanced: 'var(--accent)',
  Expert: 'var(--danger)',
};

/* ─── Question Row Component ────────────────────────────── */
const QuestionCard = ({
  q,
  isOpen,
  onToggle,
  isBookmarked,
  onToggleBookmark,
  isMastered,
  onToggleMastered,
}) => {
  const diffColor = DIFFICULTY_COLOR[q.difficulty] || 'var(--accent)';
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    setEvaluation(null);

    setTimeout(() => {
      const words = userAnswer.trim().split(/\s+/).length;
      const lower = userAnswer.toLowerCase();
      
      // Check for expected concepts in answer
      const matchedConcepts = (q.expectedConcepts || []).filter(c =>
        lower.includes(c.toLowerCase().split(' ')[0])
      );

      const conceptScore = q.expectedConcepts?.length
        ? Math.round((matchedConcepts.length / q.expectedConcepts.length) * 40)
        : 25;
      const depthScore = Math.min(50, Math.round(words * 0.45));
      const totalScore = Math.min(98, Math.max(45, 10 + conceptScore + depthScore));

      setEvaluation({
        score: totalScore,
        matchedConcepts,
        feedback:
          totalScore >= 80
            ? 'Outstanding answer! You covered the core architectural constraints and gave specific, technical details.'
            : totalScore >= 60
            ? 'Solid foundation. To score higher, mention more technical specifics and real-world trade-offs.'
            : 'Good initial attempt. Try adding more concrete examples and addressing the expected concepts below.',
        suggestions: (q.expectedConcepts || [])
          .filter(c => !matchedConcepts.includes(c))
          .slice(0, 3),
      });
      setEvaluating(false);
    }, 900);
  };

  return (
    <div
      className={`card card-3d ${isOpen ? 'glow-border-3d' : ''}`}
      style={{
        padding: 0,
        overflow: 'hidden',
        border: isOpen ? '1px solid var(--border-focus)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          padding: '20px 24px',
          cursor: 'pointer',
          background: isOpen ? 'var(--bg-subtle)' : 'transparent',
        }}
        onClick={onToggle}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
            <span
              className="badge glow-pill"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-text)',
                fontWeight: 600,
              }}
            >
              {q.techStack || q.category || 'General'}
            </span>
            <span
              className="badge"
              style={{
                background: 'transparent',
                border: `1px solid ${diffColor}`,
                color: diffColor,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {q.difficulty}
            </span>
            {q.role && (
              <span className="badge badge-muted" style={{ fontSize: '0.75rem' }}>
                {q.role}
              </span>
            )}
            {isMastered && (
              <span className="badge badge-success" style={{ gap: 4 }}>
                <CheckCircle2 size={12} /> Mastered
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}
          >
            {q.questionText}
          </div>
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="btn btn-ghost btn-icon"
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            style={{
              color: isBookmarked ? 'var(--warning)' : 'var(--text-muted)',
              padding: 6,
            }}
          >
            {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMastered();
            }}
            className="btn btn-ghost btn-icon"
            title={isMastered ? 'Mark as Unmastered' : 'Mark as Mastered'}
            style={{
              color: isMastered ? 'var(--success)' : 'var(--text-muted)',
              padding: 6,
            }}
          >
            <CheckCircle2 size={18} />
          </button>

          <div style={{ color: 'var(--text-muted)', marginLeft: 4 }}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            padding: '0 24px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Context & Rubric */}
          {q.context && (
            <div
              style={{
                marginTop: 18,
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Lightbulb size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Scenario Context: </strong>
                {q.context}
              </div>
            </div>
          )}

          {/* Expected Concepts */}
          {q.expectedConcepts?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 8,
                }}
              >
                Key Concepts Evaluated
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {q.expectedConcepts.map((c, i) => (
                  <span
                    key={i}
                    className="badge"
                    style={{
                      background: 'var(--bg-overlay)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      padding: '4px 10px',
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Self-Practice Area */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={15} style={{ color: 'var(--accent-text)' }} />
                Practice Your Answer
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {userAnswer.trim() ? `${userAnswer.trim().split(/\s+/).length} words` : 'Interactive AI evaluation'}
              </span>
            </div>

            <textarea
              className="input"
              rows={4}
              placeholder="Type your structured answer here (mention trade-offs, architecture, or STAR bullet points)..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <button
                onClick={handleEvaluate}
                disabled={!userAnswer.trim() || evaluating}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {evaluating ? (
                  <>Evaluating...</>
                ) : (
                  <>
                    <Sparkles size={14} /> Evaluate My Answer
                  </>
                )}
              </button>
            </div>

            {/* Evaluation Results Card */}
            {evaluation && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: 14,
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-focus)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    AI Rubric Feedback
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: evaluation.score >= 75 ? 'var(--success-subtle)' : 'var(--warning-subtle)',
                      color: evaluation.score >= 75 ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      padding: '4px 10px',
                    }}
                  >
                    Score: {evaluation.score}/100
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {evaluation.feedback}
                </p>
                {evaluation.suggestions?.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <strong>Concepts to include: </strong> {evaluation.suggestions.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Model Answer Toggle */}
          <div>
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Lightbulb size={15} style={{ color: 'var(--warning)' }} />
              {showModelAnswer ? 'Hide Full Model Answer' : 'View Full Model Answer & Talking Points'}
            </button>

            {showModelAnswer && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: 14,
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Full Sample Answer */}
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Model Solution & Architecture
                  </div>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8125rem',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border)',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.6,
                      overflowX: 'auto',
                    }}
                  >
                    {q.sampleAnswer || q.evaluationCriteria}
                  </pre>
                </div>

                {/* Key Talking Points */}
                {q.keyPoints?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      High-Scoring Talking Points
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {q.keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pitfalls to Avoid */}
                {q.pitfalls?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Common Pitfalls to Avoid
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {q.pitfalls.map((pitfall, idx) => (
                        <li key={idx}>{pitfall}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow up probes */}
                {q.followUps?.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                      Interviewer Follow-Up Questions
                    </div>
                    {q.followUps.map((f, i) => (
                      <div key={i} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        • <em>"{f.followUpText}"</em>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Practice Page Component ──────────────────────── */
export const PracticePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [selectedDiff, setSelectedDiff] = useState('all');
  const [openIds, setOpenIds] = useState(new Set());
  
  // Persistence for bookmarks & mastered items
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('interviewai_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  const [mastered, setMastered] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('interviewai_mastered') || '[]'));
    } catch {
      return new Set();
    }
  });

  const [filterMode, setFilterMode] = useState('all'); // 'all', 'bookmarked', 'mastered'

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await api.getQuestions();
        setQuestions(data || []);
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('interviewai_bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleMastered = (id) => {
    setMastered(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('interviewai_mastered', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleOpen = (id) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtering logic
  const filteredQuestions = questions.filter(q => {
    if (selectedTech !== 'all') {
      const stackMatch = (q.techStack || q.category || '').toLowerCase();
      if (!stackMatch.includes(selectedTech.toLowerCase())) return false;
    }
    if (selectedDiff !== 'all' && q.difficulty !== selectedDiff) {
      return false;
    }
    if (filterMode === 'bookmarked' && !bookmarks.has(q.questionId)) {
      return false;
    }
    if (filterMode === 'mastered' && !mastered.has(q.questionId)) {
      return false;
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchText = (q.questionText || '').toLowerCase().includes(s);
      const matchCategory = (q.category || '').toLowerCase().includes(s);
      const matchTech = (q.techStack || '').toLowerCase().includes(s);
      const matchConcepts = (q.expectedConcepts || []).some(c => c.toLowerCase().includes(s));
      if (!matchText && !matchCategory && !matchTech && !matchConcepts) return false;
    }
    return true;
  });

  const masteryPercentage = questions.length
    ? Math.round((mastered.size / questions.length) * 100)
    : 0;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="page-container">
        {/* Header Hero with 3D aesthetic */}
        <div
          className="card card-3d animate-fade-in"
          style={{
            padding: '36px 32px',
            background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 32,
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent-text)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <Sparkles size={14} /> Comprehensive Tech Stack Practice Bank
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: 0 }}>
                Mastery Question Bank
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: 8, maxWidth: 620 }}>
                Practice real interview questions across JavaScript, SQL, Node.js, React, Python, Java, System Design, and Behavioral STAR scenarios with full model answers and AI evaluation.
              </p>
            </div>

            {/* Mastery Stats Widget */}
            <div
              style={{
                minWidth: 240,
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                <span>Mastery Progress</span>
                <strong style={{ color: 'var(--accent-text)' }}>{masteryPercentage}%</strong>
              </div>
              <div className="progress-bar" style={{ height: 8, marginBottom: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${masteryPercentage}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Mastered: <strong style={{ color: 'var(--success)' }}>{mastered.size}</strong></span>
                <span>Bookmarked: <strong style={{ color: 'var(--warning)' }}>{bookmarks.size}</strong></span>
                <span>Total: <strong>{questions.length}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Horizontal Selector */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 12,
            marginBottom: 20,
            scrollbarWidth: 'none',
          }}
        >
          {TECH_STACKS.map(({ id, label, icon: Icon }) => {
            const isSelected = selectedTech === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedTech(id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 'var(--radius-full)',
                  padding: '8px 16px',
                  fontWeight: isSelected ? 600 : 500,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Controls Bar (Search + Difficulty + Filter Tabs) */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search by keyword, concept (e.g. closures, index, stream)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>

          {/* Difficulty & Quick Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="input"
              value={selectedDiff}
              onChange={e => setSelectedDiff(e.target.value)}
              style={{ width: 140, height: 38, padding: '0 10px', fontSize: '0.8125rem' }}
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <div style={{ display: 'flex', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', padding: 2, border: '1px solid var(--border)' }}>
              <button
                onClick={() => setFilterMode('all')}
                className={`btn btn-sm ${filterMode === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', height: 32 }}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilterMode('bookmarked')}
                className={`btn btn-sm ${filterMode === 'bookmarked' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', height: 32 }}
              >
                Bookmarked ({bookmarks.size})
              </button>
              <button
                onClick={() => setFilterMode('mastered')}
                className={`btn btn-sm ${filterMode === 'mastered' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 12px', fontSize: '0.75rem', height: 32 }}
              >
                Mastered ({mastered.size})
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <HelpCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: 6 }}>
              No questions found
            </h3>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Try adjusting your tech stack, difficulty filter, or search keywords.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredQuestions.map(q => (
              <QuestionCard
                key={q.questionId}
                q={q}
                isOpen={openIds.has(q.questionId)}
                onToggle={() => toggleOpen(q.questionId)}
                isBookmarked={bookmarks.has(q.questionId)}
                onToggleBookmark={() => toggleBookmark(q.questionId)}
                isMastered={mastered.has(q.questionId)}
                onToggleMastered={() => toggleMastered(q.questionId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
