import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Globe, Shield, Terminal } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'New Interview', href: '/interviews/new' },
      { label: 'Practice Bank', href: '/practice' },
      { label: 'Coding Mode', href: '/coding' },
      { label: 'Resume Analyzer', href: '/analyzer' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Settings', href: '/settings' },
      { label: 'History', href: '/history' },
    ],
  },
];

const SOCIAL = [
  { icon: GithubIcon,   label: 'GitHub',   href: 'https://github.com/aditya-singh475/InterviewAI' },
  { icon: TwitterIcon,  label: 'Twitter',  href: '#' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
];

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        padding: '48px 0 28px',
        marginTop: 'auto',
      }}
    >
      <div className="page-container">
        {/* Top row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: 48,
            marginBottom: 40,
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="#fff" />
              </div>
              <span
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                InterviewAI
              </span>
            </Link>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}
            >
              AI-powered interview simulations built for serious candidates.
              Practice smarter, interview better.
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map(section => (
            <div key={section.title}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 14,
                }}
              >
                {section.title}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'color var(--transition)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} InterviewAI. Built for serious candidates.
          </span>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 4 }}>
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
