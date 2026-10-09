import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stored && stored !== 'undefined' && stored !== 'null' ? stored : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken || storedToken === 'undefined' || storedToken === 'null') {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Session expired or invalid token:', err?.response?.data?.message || err.message);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      if (res.data.user) {
        setUser(res.data.user);
      }
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      if (res.data.user) {
        setUser(res.data.user);
      }
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
