import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

const ROLES = [
  'Software Engineer','Frontend Developer','Backend Developer','Full Stack Developer',
  'React Developer','Data Analyst','Data Scientist','DevOps Engineer',
  'Product Manager','QA Engineer','Cloud Engineer',
];

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', targetRole: '', experienceLevel: 'Junior',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const IconInput = ({ id, icon: Icon, label, type = 'text', value, onChange, placeholder, required, autoComplete, children }) => (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <Icon
          size={15}
          style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)', pointerEvents: 'none',
          }}
        />
        {children || (
          <input
            id={id} type={type} className="input"
            style={{ paddingLeft: 36 }}
            value={value} onChange={onChange}
            placeholder={placeholder} required={required}
            autoComplete={autoComplete}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Bot size={24} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: '1.5rem', fontWeight: 700,
              letterSpacing: '-0.025em', marginBottom: 6,
            }}
          >
            Create account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--accent-text)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div
              className="animate-fade-in"
              style={{
                padding: '10px 14px',
                background: 'var(--danger-subtle)',
                border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          )}

          {/* Name */}
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                id="reg-name" type="text" className="input"
                style={{ paddingLeft: 36 }}
                value={form.name} onChange={set('name')}
                placeholder="Alex Johnson" required autoComplete="name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                id="reg-email" type="email" className="input"
                style={{ paddingLeft: 36 }}
                value={form.email} onChange={set('email')}
                placeholder="you@example.com" required autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                className="input"
                style={{ paddingLeft: 36, paddingRight: 40 }}
                value={form.password} onChange={set('password')}
                placeholder="Min. 8 characters" required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer', padding: 4, display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Role + Level — two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="reg-role" className="form-label">Target role</label>
              <select
                id="reg-role"
                className="input"
                value={form.targetRole}
                onChange={set('targetRole')}
              >
                <option value="">Select role</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reg-level" className="form-label">Experience</label>
              <select
                id="reg-level"
                className="input"
                value={form.experienceLevel}
                onChange={set('experienceLevel')}
              >
                {['Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            id="register-submit-btn"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {loading ? 'Creating account…' : <>Create account <ArrowRight size={15} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};
