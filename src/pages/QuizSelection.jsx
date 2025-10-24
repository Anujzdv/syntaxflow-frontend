// src/pages/QuizSelection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Quiz.css'; // We'll create this CSS file

const languages = ['JavaScript', 'Python', 'Java', 'C++', 'C'];

const QuizSelection = () => {
  return (
    <div className="quiz-container">
      <h1>Select a Language</h1>
      <p>Choose a topic to start your 10-question quiz.</p>
      <div className="language-grid">
        {languages.map((lang) => (
          <Link
            key={lang}
            to={`/quiz/${lang}`}
            className="language-card"
            style={{ '--lang-color': getLangColor(lang) }}
          >
            <h3>{lang}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper function to give each card a unique color
const getLangColor = (lang) => {
  switch (lang) {
    case 'JavaScript': return '#f0db4f';
    case 'Python': return '#3572A5';
    case 'Java': return '#B07219';
    case 'C++': return '#00599C';
    case 'C': return '#A8B9CC';
    default: return '#3b82f6';
  }
};

export default QuizSelection;