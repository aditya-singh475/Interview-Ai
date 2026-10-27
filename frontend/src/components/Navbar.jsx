import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bot, Sun, Moon, LayoutDashboard, BookOpen, Code2,
  FileSearch, LogOut, User, Menu, X, ChevronDown,
  BarChart2, Clock,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/practice',  label: 'Practice',  icon: BookOpen },
  { path: '/coding',    label: 'Code Lab',  icon: Code2 },
  { path: '/history',   label: 'History',   icon: Clock },
  { path: '/progress',  label: 'Progress',  icon: BarChart2 },
  { path: '/analyzer',  label: 'Analyzer',  icon: FileSearch },
];

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, activeTheme, toggleTheme } = useTheme();
  const currentTheme = activeTheme || theme;
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`main-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          background: scrolled
            ? 'var(--navbar-scrolled-bg)'
            : 'var(--navbar-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid var(--navbar-border)' : '1px solid var(--border)',
          boxShadow: scrolled ? 'var(--navbar-shadow)' : 'none',
          transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <div
          className="page-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '62px',
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Bot size={20} color="#fff" />
            </div>
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              InterviewAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Main navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="desktop-nav"
          >
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path ||
                (path !== '/' && location.pathname.startsWith(path));
              return (
                <Link
                  key={path}
                  to={path}
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-subtle)' : 'transparent',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="btn btn-ghost btn-icon"
              aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-subtle)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentTheme === 'dark' ? (
                <Sun size={17} style={{ color: 'var(--warning)' }} />
              ) : (
                <Moon size={17} style={{ color: 'var(--accent)' }} />
              )}
            </button>

            {/* User or Sign In */}
            {user ? (
              <>
                <Link
                  to="/interviews/new"
                  id="navbar-new-interview-btn"
                  className="btn btn-primary btn-sm"
                >
                  New interview
                </Link>
                <div style={{ position: 'relative' }}>
                  <button
                    id="user-menu-btn"
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="btn btn-outline btn-sm"
                    style={{ gap: '6px' }}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                  >
                    <div
                      style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.6875rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}
                    >
                      {(user.name || 'U')[0].toUpperCase()}
                    </div>
                    <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name || 'Account'}
                    </span>
                    <ChevronDown size={13} style={{ opacity: 0.6, transition: 'transform 200ms', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div
                      role="menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        minWidth: 190,
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden',
                        zIndex: 300,
                      }}
                      className="animate-fade-in"
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {user.name || 'Candidate'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </div>
                      </div>
                      <Link
                        to="/settings"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', fontSize: '0.875rem',
                          color: 'var(--text-secondary)', textDecoration: 'none',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <User size={15} /> Settings
                      </Link>
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px', fontSize: '0.875rem',
                          color: 'var(--danger)', background: 'none', border: 'none',
                          cursor: 'pointer', width: '100%', textAlign: 'left',
                          transition: 'background var(--transition)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <Link to="/login" className="btn btn-outline btn-sm">Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="btn btn-ghost btn-icon mobile-menu-btn"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-subtle)',
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              padding: '12px 24px 20px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 0',
                    fontSize: '0.9375rem',
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: isActive ? 600 : 400,
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={16} /> {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Overlay to close user menu */}
      {userMenuOpen && (
        <div
          onClick={() => setUserMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 199 }}
        />
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
};

