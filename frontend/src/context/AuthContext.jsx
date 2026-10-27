import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('interviewai_token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('interviewai_token');
        }
      } else {
        // Provide demo user session if not logged in
        setUser({
          _id: 'usr_demo_123',
          name: 'Demo Candidate',
          email: 'demo@interviewai.com',
          targetRole: 'Full Stack Developer',
          experienceLevel: 'Intermediate'
        });
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token) {
      localStorage.setItem('interviewai_token', data.token);
    }
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.token) {
      localStorage.setItem('interviewai_token', data.token);
    }
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('interviewai_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
