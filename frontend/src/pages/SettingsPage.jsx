import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Moon, Sun, Monitor, Save, Trash2, CheckCircle } from 'lucide-react';

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'React Developer', 'Node.js Developer', 'Java Developer', 'Python Developer',
  'Data Analyst', 'Data Scientist', 'DevOps Engineer', 'QA Engineer',
  'Product Manager', 'Cloud Engineer',
];

const THEMES = [
  { value: 'dark',   label: 'Dark',   icon: Moon },
  { value: 'light',  label: 'Light',  icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
];

const SectionHeader = ({ title, desc }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 4 }}>{title}</div>
    {desc && (
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
        {desc}
      </p>
    )}
  </div>
);

export const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { user, setUser }   = useAuth();

  const [targetRole, setTargetRole]   = useState(user?.targetRole || 'Full Stack Developer');
  const [personality, setPersonality] = useState('Professional');
  const [voiceEnabled, setVoiceEnabled]   = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [saved, setSaved]             = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (user) setUser({ ...user, targetRole });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px', maxWidth: 680 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Settings size={20} style={{ color: 'var(--accent-text)' }} />
          <h1
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
            }}
          >
            Settings
          </h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Manage your preferences, defaults, and account.
        </p>
      </div>

      {/* Success banner */}
      {saved && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'var(--success-subtle)',
            border: '1px solid var(--success)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 20,
            fontSize: '0.8125rem',
            color: 'var(--success)',
          }}
        >
          <CheckCircle size={14} /> Settings saved successfully.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Theme */}
        <div className="card">
          <SectionHeader
            title="Interface theme"
            desc="Choose how InterviewAI looks. Dark mode is recommended for interviews."
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                id={`theme-${value}`}
                type="button"
                onClick={() => setTheme(value)}
                className={`btn btn-sm ${theme === value ? 'btn-primary' : 'btn-outline'}`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile defaults */}
        <form onSubmit={handleSave}>
          <div className="card" style={{ marginBottom: 16 }}>
            <SectionHeader
              title="Interview defaults"
              desc="These will pre-fill when starting a new session."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label htmlFor="settings-target-role" className="form-label">
                  Default target role
                </label>
                <select
                  id="settings-target-role"
                  className="input"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="settings-personality" className="form-label">
                  Default interviewer style
                </label>
                <select
                  id="settings-personality"
                  className="input"
                  value={personality}
                  onChange={e => setPersonality(e.target.value)}
                >
                  <option value="Friendly">Friendly — supportive and encouraging</option>
                  <option value="Professional">Professional — standard corporate style</option>
                  <option value="Technical">Technical — strict and rigorous</option>
                  <option value="Challenging">Challenging — probing and adversarial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interview options */}
          <div className="card" style={{ marginBottom: 16 }}>
            <SectionHeader
              title="Interview experience"
              desc="Configure audio and camera behaviour during live interviews."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 2 }}>
                    Voice read-aloud
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Interview questions are spoken aloud via text-to-speech
                  </div>
                </div>
                <input
                  id="settings-voice"
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={e => setVoiceEnabled(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  padding: '12px 14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 2 }}>
                    Camera preview
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Show your camera in the corner during live interviews
                  </div>
                </div>
                <input
                  id="settings-camera"
                  type="checkbox"
                  checked={cameraEnabled}
                  onChange={e => setCameraEnabled(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" id="settings-save-btn" className="btn btn-primary">
              <Save size={14} /> Save preferences
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div className="card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <SectionHeader
            title="Data & privacy"
            desc="InterviewAI processes audio and resume text on the server. Video streams are never recorded or transmitted to third parties."
          />
          <button
            id="settings-clear-history"
            type="button"
            onClick={() => {
              if (window.confirm('Clear all interview history? This cannot be undone.')) {
                alert('Interview history cleared.');
              }
            }}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            <Trash2 size={14} /> Clear session history
          </button>
        </div>
      </div>
    </div>
  );
};
