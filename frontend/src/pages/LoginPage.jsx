import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

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
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Bot size={24} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: 6,
            }}
          >
            Sign in
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--accent-text)', fontWeight: 500 }}
            >
              Create one
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-email"
                type="email"
                className="input"
                style={{ paddingLeft: 36 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className="input"
                style={{ paddingLeft: 36, paddingRight: 40 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            {loading ? 'Signing in…' : <>Sign in <ArrowRight size={15} /></>}
          </button>
        </form>

        {/* Demo shortcut */}
        <div
          style={{
            marginTop: 20,
            padding: '12px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            Demo credentials
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>demo@interviewai.com</div>
            <div>demo1234</div>
          </div>
          <button
            onClick={() => { setEmail('demo@interviewai.com'); setPassword('demo1234'); }}
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8, padding: '4px 0', color: 'var(--accent-text)', fontSize: '0.75rem' }}
          >
            Fill credentials
          </button>
        </div>
      </div>
    </div>
  );
};
