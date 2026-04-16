// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import QuizSelection from './pages/QuizSelection';
import QuizPage from './pages/QuizPage';
import QuizResult from './pages/QuizResult';
import Leaderboard from './pages/Leaderboard'; // <-- Import

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Quiz Routes */}
            <Route path="/quiz" element={<QuizSelection />} />
            <Route path="/quiz/:language" element={<QuizPage />} />
            <Route path="/quiz/result" element={<QuizResult />} />
            
            {/* Leaderboard Route */}
            <Route path="/leaderboard" element={<Leaderboard />} /> {/* <-- Add Route */}
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;