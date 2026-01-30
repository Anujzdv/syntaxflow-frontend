import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // <-- THE CRITICAL ADDITION

  useEffect(() => {
    const loadUser = async () => {
      // 1. Check if a token actually exists in localStorage
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // 2. Ask the backend: "Is this token still valid?"
        const res = await api.get('/api/auth');
        
        // 3. If yes, save the user data to state
        setUser(res.data);
      } catch (err) {
        // 4. If the token is fake or expired, clean up
        console.error('Session expired or invalid token');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        // 5. No matter what, stop the loading spinner
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (formData) => {
    const res = await api.post('/api/auth/login', formData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};