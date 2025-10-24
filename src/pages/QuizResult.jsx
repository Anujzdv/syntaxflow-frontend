// src/pages/QuizResult.jsx
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import './Quiz.css';

const QuizResult = () => {
  const location = useLocation();
  const { result } = location.state || {}; // Get result from navigation state

  // If no result data, redirect to quiz selection
  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  const { score, correctAnswers, totalQuestions, timeTaken, accuracy } = result;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="quiz-container">
      <div className="result-card">
        <h2>Quiz Complete!</h2>
        <p className="result-score">Your Score: {score}</p>
        
        <div className="result-grid">
          <div className="result-item">
            <h4>Correct Answers</h4>
            <p>{correctAnswers} / {totalQuestions}</p>
          </div>
          <div className="result-item">
            <h4>Accuracy</h4>
            <p>{accuracy}%</p>
          </div>
          <div className="result-item">
            <h4>Time Taken</h4>
            <p>{formatTime(timeTaken)}</p>
          </div>
        </div>

        <div className="result-actions">
          <Link to="/quiz" className="btn btn-outline">
            Take Another Quiz
          </Link>
          <Link to="/feed" className="btn btn-primary">
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;