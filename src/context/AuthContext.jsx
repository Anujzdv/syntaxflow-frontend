// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetches user data based on the token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const res = await api.get('/api/auth/me');
        setUser(res.data); // Set the user in state
      } catch (err) {
        console.error('Failed to load user', err);
        // If token is invalid, log them out
        logout();
      }
    }
    setLoading(false);
  };

  // Now calls loadUser on app start
  useEffect(() => {
    loadUser();
  }, []); // Empty dependency array, runs once on mount

  // Register function (FINAL, ROBUST VERSION)
  const register = async (userData) => {
    try {
      await api.post('/api/auth/register', userData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      let errorMsg = 'An unexpected error occurred.';
      if (err.response && err.response.data && err.response.data.msg) {
        // We have a proper JSON error from the server (e.g., "User already exists")
        errorMsg = err.response.data.msg;
      } else if (err.request) {
        // The server is not responding at all
        errorMsg = 'Cannot connect to the server. Is it running?';
      } else if (err.response && err.response.data) {
        // The server sent an error, but not in our expected {msg: ...} format
        // This is what's happening now (err.response.data is "Server error")
        errorMsg = err.response.data;
      }
      
      console.error('Registration failed:', err);
      alert('Registration failed: ' + errorMsg);
    }
  };

  // Login function
  const login = async (userData) => {
    try {
      const res = await api.post('/api/auth/login', userData);
      const { token } = res.data;

      setToken(token);
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await loadUser();
      
      navigate('/feed');
    } catch (err) {
      if (err.response) {
        console.error('Login failed (server error):', err.response.data);
        alert('Login failed: ' + err.response.data.msg);
      } else if (err.request) {
        console.error('Login failed (no response):', err.request);
        alert('Login failed: Cannot connect to the server. Is it running?');
      } else {
        console.error('Login failed (general error):', err.message);
        alert('An unexpected error occurred.');
      }
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;