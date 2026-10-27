import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { VideoInterviewMode } from '../components/VideoInterviewMode';
import {
  Bot, Send, Clock, AlertCircle, CheckCircle, ChevronRight,
  Mic, MicOff, Volume2, ArrowRight, Video, FileText, Sparkles, RotateCcw
} from 'lucide-react';

/* ─── Timer ───────────────────────────── */
const useTimer = (active) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return { seconds, formatted: fmt(seconds), reset: () => setSeconds(0) };
};

/* ─── Loading Screen ──────────────────── */
const LoadingScreen = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14,
      background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Bot size={28} color="#fff" />
    </div>
    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
      Initializing interview session…
    </div>
    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
      Configuring role blueprint and adaptive question engine
    </div>
  </div>
);

/* ─── Evaluation Panel ────────────────── */
const EvalPanel = ({ evaluation, followUp, isCompleted, onNext, onReport }) => {
  const score = evaluation?.overallScore ?? 0;
  const isGood = score >= 75;

  return (
    <div className="animate-fade-in card" style={{
      marginTop: 20,
      padding: '20px 24px',
      background: isGood ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      border: `1px solid ${isGood ? 'var(--success)' : 'var(--warning)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle size={18} style={{ color: isGood ? 'var(--success)' : 'var(--warning)', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: isGood ? 'var(--success)' : 'var(--warning)' }}>
              Score: {score}/100 · {evaluation?.qualityLevel || 'Good'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isCompleted ? (
          <button onClick={onReport} className="btn btn-primary btn-sm" id="live-view-report-btn">
            View Complete Report <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={onNext} className="btn btn-primary btn-sm" id="live-next-q-btn">
            Next Question <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="progress-bar" style={{ marginBottom: 14 }}>
        <div className="progress-bar-fill" style={{ width: `${score}%`, background: isGood ? 'var(--success)' : 'var(--warning)' }} />
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 12 }}>
        {evaluation?.humanizedFeedback || 'Good response.'}
      </p>

      {/* Highlights & Missing */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 14 }}>
        {evaluation?.whatDidWell && (
          <div style={{ padding: '10px 14px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              What went well
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {evaluation.whatDidWell}
            </p>
          </div>
        )}
        {evaluation?.whatWasMissing && (
          <div style={{ padding: '10px 14px', background: 'var(--bg-overlay)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Areas for improvement
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {evaluation.whatWasMissing}
            </p>
          </div>
        )}
      </div>

      {followUp?.asked && (
        <div style={{ padding: '12px 16px', background: 'var(--accent-subtle)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Adaptive Follow-up
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            {followUp.questionText}
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Main Live Interview Page ────────── */
export const LiveInterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview]     = useState(null);
  const [currentQ, setCurrentQ]       = useState(null);
  const [nextQCache, setNextQCache]   = useState(null);
  const [qIndex, setQIndex]           = useState(0);
  const [totalQ, setTotalQ]           = useState(5);
  const [answer, setAnswer]           = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [evaluation, setEvaluation]   = useState(null);
  const [followUp, setFollowUp]       = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [isListening, setIsListening] = useState(false);
  const [mode, setMode]               = useState('video'); // Default to realistic video mode
  const [validationAlert, setValidationAlert] = useState('');

  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const { formatted: elapsed, reset: resetTimer } = useTimer(!loading && !submitting && !evaluation);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getInterviewById(id);
        if (!data) {
          setError('Could not locate session.');
          return;
        }
        setInterview(data);
        setTotalQ(data.questions?.length || 5);
        const idx = data.currentQuestionIndex || 0;
        setQIndex(idx);
        setCurrentQ(data.questions?.[idx] || data.questions?.[0]);
      } catch {
        setError('Could not load session. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Speech-to-Text Support
  const toggleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setAnswer(prev => prev ? `${prev} ${currentText}` : currentText);
      setValidationAlert('');
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window && currentQ?.questionText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.questionText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (overrideAnswer) => {
    let textToSubmit = answer;
    let overrideTime = undefined;

    if (typeof overrideAnswer === 'string') {
      textToSubmit = overrideAnswer;
    } else if (overrideAnswer && typeof overrideAnswer === 'object') {
      textToSubmit = overrideAnswer.answerText || overrideAnswer.answer || overrideAnswer.audioTranscript || '';
      overrideTime = overrideAnswer.timeSpentSeconds;
    }

    const wordCount = (textToSubmit || '').trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 15) {
      setValidationAlert(`Your response is too brief (${wordCount} words). A realistic interview response must explain your technical approach, architecture, and trade-offs (minimum 15 words required).`);
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    setError('');
    setValidationAlert('');

    try {
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      const res = await api.submitAnswer(id, {
        answer: textToSubmit,
        questionId: currentQ?._id || currentQ?.questionId,
        timeSpentSeconds: overrideTime
      });

      setEvaluation(res.evaluation);
      if (res.followUp?.asked) setFollowUp(res.followUp);
      if (res.nextQuestion) setNextQCache(res.nextQuestion);
      if (res.isCompleted) setIsCompleted(true);

    } catch (err) {
      setError(err.message || 'Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const advanceNextQuestion = () => {
    if (nextQCache) {
      setCurrentQ(nextQCache);
      setNextQCache(null);
      setQIndex(i => i + 1);
      setAnswer('');
      setEvaluation(null);
      setFollowUp(null);
      resetTimer();
      textareaRef.current?.focus();
    } else {
      navigate(`/interviews/${id}/report`);
    }
  };

  const handleFinish = async () => {
    await api.completeInterview(id);
    navigate(`/interviews/${id}/report`);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="page-container" style={{ padding: '32px 24px', maxWidth: 920 }}>
      {/* Session Header Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, padding: '12px 18px',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse-dot 2s ease infinite' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {interview?.role || 'Technical Interview'} · {interview?.interviewType || 'Technical'}
          </span>
          <span className="badge badge-accent">{interview?.experienceLevel || 'Intermediate'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setMode('standard')}
              className={`btn btn-sm ${mode === 'standard' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <FileText size={13} /> Text Mode
            </button>
            <button
              onClick={() => setMode('video')}
              className={`btn btn-sm ${mode === 'video' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Video size={13} /> Video Room
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Clock size={14} /> {elapsed}
          </div>

          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Q {qIndex + 1} of {totalQ}
          </span>
        </div>
      </div>

      {/* Progressive Difficulty Ladder Indicator */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginBottom: 18,
        }}
      >
        {[
          { stage: 1, label: 'Stage 1: Warmup & Basics', questions: 'Q1–Q2', color: 'var(--success)', active: qIndex < 2 },
          { stage: 2, label: 'Stage 2: Core Architecture', questions: 'Q3–Q4', color: 'var(--warning)', active: qIndex >= 2 && qIndex < 4 },
          { stage: 3, label: 'Stage 3: Advanced Systems', questions: 'Q5+', color: 'var(--accent)', active: qIndex >= 4 },
        ].map((s) => (
          <div
            key={s.stage}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: s.active ? 'var(--bg-elevated)' : 'var(--bg-surface)',
              border: s.active ? `1px solid ${s.color}` : '1px solid var(--border)',
              opacity: s.active ? 1 : 0.6,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: s.color,
                  boxShadow: s.active ? `0 0 8px ${s.color}` : 'none',
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: s.active ? 700 : 500, color: s.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {s.label}
              </span>
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {s.questions}
            </span>
          </div>
        ))}
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', background: 'var(--danger-subtle)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 16, fontSize: '0.875rem', color: 'var(--danger)' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
        </div>
      )}

      {mode === 'video' ? (
        <>
          <VideoInterviewMode
            currentQuestion={currentQ}
            onAnswerSubmit={handleSubmit}
            isSubmitting={submitting}
            personality={interview?.personality || 'Professional'}
          />
          {evaluation && (
            <EvalPanel
              evaluation={evaluation}
              followUp={followUp}
              isCompleted={isCompleted}
              onNext={advanceNextQuestion}
              onReport={handleFinish}
            />
          )}
        </>
      ) : (
        <>
          {/* Question Card */}
          {currentQ && (
            <div className="card card-3d" style={{ marginBottom: 18, padding: 24 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                }}>
                  <Bot size={22} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{currentQ.category || 'Core Architecture'}</span>
                      {currentQ.difficulty && (
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.6875rem',
                            padding: '2px 8px',
                            background: currentQ.difficulty === 'Beginner' || currentQ.difficulty === 'Basic' || currentQ.difficulty === 'Easy' ? 'var(--success-subtle)' : currentQ.difficulty === 'Intermediate' ? 'var(--warning-subtle)' : 'var(--accent-subtle)',
                            color: currentQ.difficulty === 'Beginner' || currentQ.difficulty === 'Basic' || currentQ.difficulty === 'Easy' ? 'var(--success)' : currentQ.difficulty === 'Intermediate' ? 'var(--warning)' : 'var(--accent-text)',
                            border: '1px solid transparent'
                          }}
                        >
                          {currentQ.difficulty} Tier
                        </span>
                      )}
                    </div>
                    <button
                      onClick={speakQuestion}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Read question aloud"
                      style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    >
                      <Volume2 size={15} /> Listen
                    </button>
                  </div>
                  <h2 style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>
                    {currentQ.questionText || currentQ.text || 'Question loading…'}
                  </h2>
                  {/* Matched Keywords Badges */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, marginBottom: 8 }}>
                    {currentQ.matchedResumeKeywords && currentQ.matchedResumeKeywords.length > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                        🎯 Matched Resume: {currentQ.matchedResumeKeywords.slice(0, 3).join(', ')}
                      </span>
                    )}
                    {currentQ.matchedJdKeywords && currentQ.matchedJdKeywords.length > 0 && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                        💼 Matched JD: {currentQ.matchedJdKeywords.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Scenario Brief */}
                  {currentQ.scenarioBrief && (
                    <div style={{ background: 'var(--bg-overlay)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)', margin: '10px 0' }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--accent-text)', textTransform: 'uppercase', marginBottom: 2 }}>
                        📋 Scenario Brief
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        {currentQ.scenarioBrief}
                      </p>
                    </div>
                  )}

                  {/* Constraints */}
                  {currentQ.constraints && currentQ.constraints.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--warning)' }}>⚠️ Constraints:</span>
                      {currentQ.constraints.map((c, idx) => (
                        <span key={idx} style={{ background: 'var(--bg-overlay)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {currentQ.expectedConcepts?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {currentQ.expectedConcepts.map(c => (
                        <span key={c} className="badge badge-muted">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {validationAlert && (
            <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'var(--danger-subtle)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 14, fontSize: '0.8125rem', color: 'var(--danger)', fontWeight: 600 }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {validationAlert}
            </div>
          )}

          {/* Answer Input Area */}
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label htmlFor="live-answer-input" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Answer (15 Words Min)
              </label>
              <button
                type="button"
                onClick={toggleSpeech}
                className={`btn btn-sm ${isListening ? 'btn-danger' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                {isListening ? <><MicOff size={13} /> Stop Mic</> : <><Mic size={13} /> Speak Answer</>}
              </button>
            </div>

            <textarea
              ref={textareaRef}
              id="live-answer-input"
              className="input"
              rows={7}
              value={answer}
              onChange={e => { setAnswer(e.target.value); setValidationAlert(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Type or speak your answer here… Structure your answer with clear rationale, technical choices, and trade-offs. (⌘/Ctrl + Enter to submit)"
              disabled={submitting || (!!evaluation && !isCompleted)}
              style={{ resize: 'vertical', marginBottom: 14 }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {answer.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <div style={{ display: 'flex', gap: 10 }}>
                {evaluation && !isCompleted && (
                  <button onClick={advanceNextQuestion} className="btn btn-outline" id="live-skip-next-btn">
                    Next Question <ArrowRight size={14} />
                  </button>
                )}
                {evaluation && isCompleted && (
                  <button onClick={handleFinish} className="btn btn-primary" id="live-finish-btn">
                    View Report <ArrowRight size={14} />
                  </button>
                )}
                {!evaluation && (
                  <button
                    id="live-submit-btn"
                    onClick={() => handleSubmit()}
                    disabled={!answer.trim() || submitting}
                    className="btn btn-primary"
                  >
                    {submitting ? 'Evaluating…' : <><Send size={14} /> Submit Answer</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Evaluation Panel */}
          {evaluation && (
            <EvalPanel
              evaluation={evaluation}
              followUp={followUp}
              isCompleted={isCompleted}
              onNext={advanceNextQuestion}
              onReport={handleFinish}
            />
          )}
        </>
      )}
    </div>
  );
};
