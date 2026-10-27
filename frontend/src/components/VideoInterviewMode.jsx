import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, CameraOff, Mic, MicOff, Maximize, Minimize, Volume2, Bot,
  AlertCircle, Play, Sparkles, HelpCircle, Activity, MessageSquare,
  Clock, CheckCircle, Shield, Award, FastForward, Check
} from 'lucide-react';

const PERSONAS_CONFIG = {
  Professional: {
    name: 'Sarah Chen',
    title: 'VP of Engineering',
    voicePitch: 1.05,
    voiceRate: 0.95,
    color: '#3b82f6',
    avatarSvg: (speaking) => (
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ borderRadius: '50%' }}>
        <defs>
          <linearGradient id="bgSarah" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bgSarah)" stroke="#3b82f6" strokeWidth="2" />
        {/* Head & Neck */}
        <path d="M50 78 L70 78 L68 90 L52 90 Z" fill="#fbcfe8" />
        <ellipse cx="60" cy="54" rx="20" ry="24" fill="#fde047" opacity="0.1" />
        <ellipse cx="60" cy="52" rx="19" ry="22" fill="#fcd34d" opacity="0.9" />
        {/* Hair */}
        <path d="M38 50 C38 30 82 30 82 50 C82 56 80 66 78 72 C74 72 74 60 72 54 C66 48 54 48 48 54 C46 60 46 72 42 72 C40 66 38 56 38 50 Z" fill="#1e1b4b" />
        {/* Eyes */}
        <ellipse cx="53" cy="50" rx="2.5" ry="3" fill="#1e293b" />
        <ellipse cx="67" cy="50" rx="2.5" ry="3" fill="#1e293b" />
        <circle cx="54" cy="49" r="1" fill="#ffffff" />
        <circle cx="68" cy="49" r="1" fill="#ffffff" />
        {/* Glasses */}
        <rect x="47" y="45" width="11" height="9" rx="2" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="62" y="45" width="11" height="9" rx="2" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
        <line x1="58" y1="49" x2="62" y2="49" stroke="#60a5fa" strokeWidth="1.5" />
        {/* Mouth */}
        {speaking ? (
          <ellipse cx="60" cy="63" rx="4" ry="4" fill="#dc2626">
            <animate attributeName="ry" values="2;5;2" dur="0.25s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <path d="M55 63 Q60 66 65 63" stroke="#b91c1c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {/* Suit */}
        <path d="M35 110 L45 88 L75 88 L85 110 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
        <path d="M54 88 L60 98 L66 88 Z" fill="#ffffff" />
      </svg>
    )
  },
  Technical: {
    name: 'Alex Rivera',
    title: 'Lead Systems Architect',
    voicePitch: 0.95,
    voiceRate: 0.95,
    color: '#10b981',
    avatarSvg: (speaking) => (
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ borderRadius: '50%' }}>
        <defs>
          <linearGradient id="bgAlex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#040d1a" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bgAlex)" stroke="#10b981" strokeWidth="2" />
        {/* Neck */}
        <path d="M52 76 L68 76 L68 90 L52 90 Z" fill="#f5d0b5" />
        {/* Face */}
        <ellipse cx="60" cy="52" rx="20" ry="23" fill="#fcd9bd" />
        {/* Hair */}
        <path d="M39 46 C41 28 79 28 81 46 C77 38 65 34 55 35 C47 36 41 40 39 46 Z" fill="#292524" />
        {/* Eyes */}
        <ellipse cx="52" cy="50" rx="2.5" ry="3" fill="#1c1917" />
        <ellipse cx="68" cy="50" rx="2.5" ry="3" fill="#1c1917" />
        {/* Beard / Stubble */}
        <path d="M48 60 Q60 74 72 60 Q68 76 60 76 Q52 76 48 60 Z" fill="#44403c" opacity="0.7" />
        {/* Mouth */}
        {speaking ? (
          <ellipse cx="60" cy="63" rx="5" ry="4" fill="#991b1b">
            <animate attributeName="ry" values="2;5;2" dur="0.22s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <path d="M55 63 Q60 65 65 63" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        )}
        {/* Jacket */}
        <path d="M30 110 L44 86 L76 86 L90 110 Z" fill="#1c1917" stroke="#10b981" strokeWidth="1" />
        <path d="M53 86 L60 98 L67 86 Z" fill="#047857" />
      </svg>
    )
  },
  Challenging: {
    name: 'Marcus Vance',
    title: 'Principal Staff Engineer',
    voicePitch: 0.9,
    voiceRate: 0.98,
    color: '#ef4444',
    avatarSvg: (speaking) => (
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ borderRadius: '50%' }}>
        <defs>
          <linearGradient id="bgMarcus" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#450a0a" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bgMarcus)" stroke="#ef4444" strokeWidth="2" />
        {/* Neck */}
        <path d="M50 78 L70 78 L70 92 L50 92 Z" fill="#fed7aa" />
        {/* Head */}
        <ellipse cx="60" cy="52" rx="21" ry="24" fill="#ffedd5" />
        {/* Clean Shaven Short Hair */}
        <path d="M40 44 C42 26 78 26 80 44 C76 34 68 32 60 32 C52 32 44 34 40 44 Z" fill="#3f3f46" />
        {/* Eyes (Focused) */}
        <line x1="49" y1="44" x2="57" y2="46" stroke="#27272a" strokeWidth="2" />
        <line x1="71" y1="44" x2="63" y2="46" stroke="#27272a" strokeWidth="2" />
        <circle cx="53" cy="50" r="2.5" fill="#18181b" />
        <circle cx="67" cy="50" r="2.5" fill="#18181b" />
        {/* Mouth */}
        {speaking ? (
          <ellipse cx="60" cy="64" rx="4.5" ry="4" fill="#991b1b">
            <animate attributeName="ry" values="1.5;4.5;1.5" dur="0.2s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <line x1="55" y1="64" x2="65" y2="64" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />
        )}
        {/* Suit */}
        <path d="M30 110 L44 88 L76 88 L90 110 Z" fill="#18181b" stroke="#ef4444" strokeWidth="1" />
      </svg>
    )
  },
  Friendly: {
    name: 'Elena Rostova',
    title: 'Head of Talent & Culture',
    voicePitch: 1.1,
    voiceRate: 0.95,
    color: '#8b5cf6',
    avatarSvg: (speaking) => (
      <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ borderRadius: '50%' }}>
        <defs>
          <linearGradient id="bgElena" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#bgElena)" stroke="#8b5cf6" strokeWidth="2" />
        {/* Face */}
        <path d="M52 76 L68 76 L68 90 L52 90 Z" fill="#fde68a" />
        <ellipse cx="60" cy="52" rx="19" ry="22" fill="#fef08a" />
        {/* Hair */}
        <path d="M38 52 C36 28 84 28 82 52 C82 64 78 74 76 80 C74 70 70 54 60 54 C50 54 46 70 44 80 C42 74 38 64 38 52 Z" fill="#713f12" />
        {/* Eyes (Smiling) */}
        <path d="M49 49 Q53 46 57 49" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M63 49 Q67 46 71 49" stroke="#1c1917" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Mouth */}
        {speaking ? (
          <ellipse cx="60" cy="63" rx="4" ry="4" fill="#b91c1c">
            <animate attributeName="ry" values="2;4.5;2" dur="0.24s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          <path d="M54 62 Q60 67 66 62" stroke="#b91c1c" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {/* Outfit */}
        <path d="M32 110 L44 88 L76 88 L88 110 Z" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1" />
      </svg>
    )
  }
};

export const VideoInterviewMode = ({
  currentQuestion,
  onAnswerSubmit,
  isSubmitting,
  personality = 'Professional'
}) => {
  const persona = PERSONAS_CONFIG[personality] || PERSONAS_CONFIG.Professional;

  // Video and Speech States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [thinkTimeLeft, setThinkTimeLeft] = useState(30); // 30s prep countdown
  const [isThinking, setIsThinking] = useState(true);
  const [answerTimeLeft, setAnswerTimeLeft] = useState(120); // 120s answer timer
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Live Biometrics & Audio Analysis
  const [liveWpm, setLiveWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(88);
  const [audioLevel, setAudioLevel] = useState(0);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const speechStartTimeRef = useRef(null);

  // Initialize Camera & Web Audio API
  useEffect(() => {
    let localStream = null;
    const initHardware = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = localStream;
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
        setCameraActive(true);
        setCameraError(null);

        // Setup Web Audio Analyser for live oscilloscope
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(localStream);
        source.connect(analyser);

        const drawWaveform = () => {
          if (!canvasRef.current || !analyserRef.current) return;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / bufferLength) * 1.8;
          let x = 0;
          let sum = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
            sum += dataArray[i];
            ctx.fillStyle = isListening ? 'rgba(16, 185, 129, 0.85)' : 'rgba(99, 102, 241, 0.4)';
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
            x += barWidth;
          }
          setAudioLevel(Math.min(100, Math.round((sum / bufferLength / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(drawWaveform);
        };
        drawWaveform();

      } catch (err) {
        console.warn('[Camera Access Warning]:', err.message);
        setCameraActive(false);
        setCameraError('Webcam not active. Audio/Text interview mode is active.');
      }
    };

    if (!textMode) {
      initHardware();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(t => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [textMode]);

  // When a new question loads: reset timers, speak question, and initiate 30s prep countdown
  useEffect(() => {
    setTranscript('');
    setThinkTimeLeft(25);
    setIsThinking(true);
    setAnswerTimeLeft(120);
    setValidationError('');

    // Speak question aloud
    speakQuestionAloud();
  }, [currentQuestion]);

  // Think time countdown
  useEffect(() => {
    if (!isThinking) return;
    if (thinkTimeLeft <= 0) {
      startAnsweringNow();
      return;
    }
    const timer = setInterval(() => {
      setThinkTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isThinking, thinkTimeLeft]);

  // Answer time countdown
  useEffect(() => {
    if (isThinking) return;
    const timer = setInterval(() => {
      setAnswerTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isThinking]);

  // Track live Words Per Minute (WPM) & Filler Words
  useEffect(() => {
    const fwList = ['uh', 'um', 'like', 'basically', 'actually', 'sort of', 'you know'];
    let count = 0;
    fwList.forEach(fw => {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi');
      const matches = transcript.match(regex);
      if (matches) count += matches.length;
    });
    setFillerCount(count);

    const words = transcript.split(/\s+/).filter(Boolean);
    if (speechStartTimeRef.current && words.length > 0) {
      const minutes = (Date.now() - speechStartTimeRef.current) / 60000;
      if (minutes > 0.05) {
        setLiveWpm(Math.round(words.length / minutes));
      }
    }

    if (words.length > 35) setConfidenceScore(94);
    else if (words.length > 15) setConfidenceScore(86);
    else setConfidenceScore(75);
  }, [transcript]);

  // Text-to-Speech (TTS) via Browser Web Speech API (100% Free)
  const speakQuestionAloud = () => {
    if (!('speechSynthesis' in window) || !currentQuestion?.questionText) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onstart = () => setIsInterviewerSpeaking(true);
    utterance.onend = () => setIsInterviewerSpeaking(false);
    utterance.onerror = () => setIsInterviewerSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start Answering Now (Bypasses remaining think time and starts recording)
  const startAnsweringNow = () => {
    setIsThinking(false);
    speechStartTimeRef.current = Date.now();
    toggleSpeechRecognition(true);
  };

  // Speech-to-Text (STT) Recognition (100% Free Browser Native)
  const toggleSpeechRecognition = (forceStart = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer directly in the text box.');
      return;
    }

    if (isListening && !forceStart) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(prev => (prev ? prev + ' ' + currentTranscript : currentTranscript));
        setValidationError('');
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (e) {
      setIsListening(false);
    }
  };

  // Answer Submit with Strict Gating
  const handleAnswerSubmit = (e) => {
    if (e) e.preventDefault();
    const words = (transcript || '').trim().split(/\s+/).filter(Boolean);

    // Strict Gating: At least 15 words required
    if (words.length < 15) {
      setValidationError(`Your response is too brief (${words.length} words). Real interviews require explaining your methodology, architectural trade-offs, and examples. Please provide at least 15 words.`);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onAnswerSubmit({
      answerText: transcript,
      audioTranscript: transcript,
      timeSpentSeconds: 120 - answerTimeLeft
    });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentAvatarState = isSubmitting ? 'evaluating' : isInterviewerSpeaking ? 'speaking' : isListening ? 'listening' : 'idle';

  return (
    <div className={`glass-panel ${isFullscreen ? 'fullscreen-mode' : ''}`} style={{
      padding: 24, borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 20
    }}>
      {/* ── Top Status Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Prep or Recording Timer */}
          {isThinking ? (
            <div style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid #eab308', fontWeight: 800, fontSize: '0.85rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Clock size={16} /> Think Time: {thinkTimeLeft}s
            </div>
          ) : (
            <div style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)',
              background: answerTimeLeft < 30 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
              border: `1px solid ${answerTimeLeft < 30 ? 'var(--accent-danger)' : 'var(--accent-primary)'}`,
              fontWeight: 800, fontSize: '0.85rem', color: answerTimeLeft < 30 ? 'var(--accent-danger)' : 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              🔴 Recording: {formatTime(answerTimeLeft)}
            </div>
          )}

          {/* Persona Badge */}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Interviewer: <strong style={{ color: persona.color }}>{persona.name} ({persona.title})</strong>
          </span>

          {/* Live Biometrics Telemetry */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-success)', fontWeight: 700 }}>
              🎯 Live Confidence: {confidenceScore}%
            </span>
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              ⚡ Pace: {liveWpm} WPM
            </span>
            <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: fillerCount > 2 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.06)', color: fillerCount > 2 ? 'var(--accent-danger)' : 'var(--text-muted)', fontWeight: 700 }}>
              🗣️ Fillers: {fillerCount}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={speakQuestionAloud} className="btn btn-secondary btn-sm" title="Replay Question Voice">
            <Volume2 size={15} /> Replay Audio
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn btn-outline btn-sm">
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </div>

      {/* ── Split Screen: AI Avatar & Candidate Webcam ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Left: AI Interviewer Avatar & State Engine */}
        <div style={{
          background: 'var(--gradient-card)', borderRadius: 'var(--radius-md)', border: `1px solid ${persona.color}40`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 20px',
          position: 'relative', overflow: 'hidden', minHeight: 280
        }}>
          {/* Animated State Ring */}
          <div style={{
            width: 124, height: 124, borderRadius: '50%', padding: 4,
            background: isInterviewerSpeaking
              ? `conic-gradient(from 0deg, ${persona.color}, #f59e0b, ${persona.color})`
              : isListening
                ? 'conic-gradient(from 0deg, #10b981, #06b6d4, #10b981)'
                : 'var(--bg-overlay)',
            boxShadow: isInterviewerSpeaking || isListening ? `0 0 25px ${persona.color}40` : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            transition: 'all 300ms'
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
              {persona.avatarSvg(isInterviewerSpeaking)}
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 2px' }}>{persona.name}</h3>
          <span style={{ fontSize: '0.78rem', color: persona.color, fontWeight: 700 }}>{persona.title}</span>

          {/* Status Indicator Pill */}
          <div style={{ marginTop: 12, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isInterviewerSpeaking ? '#f59e0b' : isListening ? '#10b981' : isSubmitting ? '#a855f7' : '#64748b' }} />
            <span style={{ fontWeight: 600 }}>
              {isSubmitting ? 'Evaluating Depth & Rubrics…' : isInterviewerSpeaking ? 'Interviewer is Speaking' : isListening ? 'Attentive Listening (Mic Active)' : 'Waiting for Response'}
            </span>
          </div>

          {/* Audio Waveform / Pulsing Spectrum */}
          <div className="audio-wave" style={{ marginTop: 14, height: 16 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="audio-bar" style={{
                background: isInterviewerSpeaking ? persona.color : isListening ? '#10b981' : 'var(--text-muted)',
                animationDuration: isInterviewerSpeaking ? '0.4s' : isListening ? '0.6s' : '1.8s'
              }} />
            ))}
          </div>
        </div>

        {/* Right: Candidate Live Webcam Stream & HUD */}
        <div style={{
          background: '#030508', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-bright)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', minHeight: 280
        }}>
          {!textMode && cameraActive ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
              {/* Face Alignment Oval Guide */}
              <div style={{
                position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
                width: 140, height: 180, borderRadius: '50%', border: '2px dashed rgba(255, 255, 255, 0.25)',
                pointerEvents: 'none'
              }} />
              {/* Real-time Oscilloscope Canvas */}
              <canvas ref={canvasRef} width="160" height="36" style={{ position: 'absolute', bottom: 12, left: 16, borderRadius: 4, background: 'rgba(0,0,0,0.5)' }} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
              <CameraOff size={40} style={{ marginBottom: 8, color: 'var(--text-muted)' }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>{cameraError || 'Webcam stream disabled. Text mode active.'}</p>
            </div>
          )}

          {/* Floating Device Controls */}
          <div style={{
            position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 8,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '6px 12px',
            borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              type="button"
              onClick={() => setTextMode(!textMode)}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title={textMode ? 'Enable Camera' : 'Disable Camera'}
            >
              {textMode ? <CameraOff size={16} color="var(--accent-danger)" /> : <Camera size={16} color="var(--accent-success)" />}
            </button>
            <button
              type="button"
              onClick={() => toggleSpeechRecognition()}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title={isListening ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isListening ? <Mic size={16} color="var(--accent-success)" /> : <MicOff size={16} color="var(--accent-danger)" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Think Time Preparation Banner ── */}
      {isThinking && (
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)', border: '1.5px solid #eab308', borderRadius: 'var(--radius-md)',
          padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={20} color="#eab308" />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#eab308' }}>
                Preparation Time: {thinkTimeLeft} seconds remaining
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Organize your thoughts and key architectural points before answering.
              </div>
            </div>
          </div>
          <button onClick={startAnsweringNow} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FastForward size={14} /> Start Answering Now
          </button>
        </div>
      )}

      {/* ── "Something Different" Scenario & Constraints HUD ── */}
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14
      }}>
        {/* Core Question Headline */}
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Technical Question {currentQuestion?.category ? `· ${currentQuestion.category}` : ''}
            </span>
            <button
              type="button"
              onClick={speakQuestionAloud}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}
            >
              <Volume2 size={14} /> Listen to Question
            </button>
          </div>
          <h2 style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {currentQuestion?.questionText || 'Loading question…'}
          </h2>
        </div>

        {/* Matched Keywords Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {currentQuestion?.stageName || currentQuestion?.difficulty || 'Intermediate Stage'}
          </span>

          {currentQuestion?.matchedResumeKeywords && currentQuestion.matchedResumeKeywords.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              🎯 Matched Resume: {currentQuestion.matchedResumeKeywords.slice(0, 3).join(', ')}
            </span>
          )}

          {currentQuestion?.matchedJdKeywords && currentQuestion.matchedJdKeywords.length > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              💼 Matched JD: {currentQuestion.matchedJdKeywords.slice(0, 3).join(', ')}
            </span>
          )}
        </div>

        {/* Real-World Scenario Brief */}
        {currentQuestion?.scenarioBrief && (
          <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
              📋 Scenario Brief
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {currentQuestion.scenarioBrief}
            </p>
          </div>
        )}

        {/* Constraints Box */}
        {currentQuestion?.constraints && currentQuestion.constraints.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--warning)' }}>⚠️ Constraints:</span>
            {currentQuestion.constraints.map((c, idx) => (
              <span key={idx} style={{ background: 'var(--bg-overlay)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Live Answer Transcript & Submission Area ── */}
      <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare size={16} color="var(--accent)" />
            Your Answer (Speak or Type):
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Word Count: <strong style={{ color: transcript.trim().split(/\s+/).filter(Boolean).length >= 15 ? 'var(--success)' : 'var(--warning)' }}>
              {transcript.trim().split(/\s+/).filter(Boolean).length} / 15 words min
            </strong>
          </span>
        </div>

        <textarea
          className="input"
          rows={5}
          value={transcript}
          onChange={e => { setTranscript(e.target.value); setValidationError(''); }}
          placeholder="Speak into your microphone or type your response here... Structure your answer clearly with your approach, implementation choices, and architectural trade-offs."
          style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
        />

        {/* Validation Error Banner */}
        {validationError && (
          <div style={{ padding: '10px 14px', background: 'var(--danger-subtle)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {validationError}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            type="submit"
            disabled={isSubmitting || isThinking}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontWeight: 700 }}
          >
            {isSubmitting ? 'Submitting & Evaluating…' : 'Submit Response for Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
};
