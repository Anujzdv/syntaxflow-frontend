// src/pages/QuizResult.jsx
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import './Quiz.css'; // We will add new styles to this

const QuizResult = () => {
  const location = useLocation();
  const { result, questions } = location.state || {}; // Get both from state

  // If no result data, redirect to quiz selection
  if (!result || !questions) {
    return <Navigate to="/quiz" replace />;
  }

  const { score, correctAnswers, totalQuestions, timeTaken, accuracy, detailedResults } = result;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  // Helper to get the full question text from the questionId
  const getQuestionById = (id) => {
    return questions.find(q => q._id === id);
  };

  return (
    <div className="quiz-container">
      <div className="result-card">
        <h2>Quiz Complete! 🥳</h2>
        <p className="result-score">Your Score: {score}</p>
        
        <div className="result-grid">
          <div className="result-item">
            <h4>Correct Answers ✅</h4>
            <p>{correctAnswers} / {totalQuestions}</p>
          </div>
          <div className="result-item">
            <h4>Accuracy 🎯</h4>
            <p>{accuracy}%</p>
          </div>
          <div className="result-item">
            <h4>Time Taken ⏱️</h4>
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

      {/* --- NEW: Answer Review Section --- */}
      <div className="answer-review">
        <h3>Your Review</h3>
        {detailedResults.map((item, index) => {
          const question = getQuestionById(item.questionId);
          return (
            <div key={item.questionId} className="review-item">
              <p className="review-question">
                {index + 1}. {question.question}
              </p>
              <div className="review-options">
                {question.options.map((option, i) => {
                  let btnClass = 'option-btn-review';
                  if (i === item.correctAnswer) {
                    btnClass += ' correct'; // This is the correct answer
                  } else if (i === item.yourAnswer) {
                    btnClass += ' incorrect'; // This was your wrong choice
                  }

                  return (
                    <button key={i} className={btnClass} disabled>
                      {option}
                      {i === item.correctAnswer && " ✅"}
                      {i === item.yourAnswer && !item.isCorrect && " ❌"}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResult;
