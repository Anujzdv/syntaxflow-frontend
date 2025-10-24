// src/services/api.js
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'https://syntaxflow-backend.onrender.com', // Your backend server URL
});


/* This is a powerful interceptor. It will attach the JWT token 
  to the headers of *every single request* if the token exists 
  in localStorage.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;