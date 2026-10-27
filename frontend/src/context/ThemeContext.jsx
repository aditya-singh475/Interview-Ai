import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('interviewai_theme') || 'dark';
  });

  // Derived active theme (resolves 'system' → actual dark/light)
  const [activeTheme, setActiveTheme] = useState(() => {
    const stored = localStorage.getItem('interviewai_theme') || 'dark';
    return stored === 'system' ? getSystemTheme() : stored;
  });

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setActiveTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('interviewai_theme', theme);
  }, [theme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const resolved = getSystemTheme();
        setActiveTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme) => setThemeState(newTheme);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
