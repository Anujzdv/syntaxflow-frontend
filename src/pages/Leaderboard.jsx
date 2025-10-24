// src/pages/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' or 'snippet'
  const [quizLeaders, setQuizLeaders] = useState([]);
  const [snippetLeaders, setSnippetLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch both leaderboards on component mount
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        setLoading(true);
        // Fetch quiz leaders
        const quizRes = await api.get('/api/leaderboard/quiz');
        setQuizLeaders(quizRes.data);
        
        // Fetch snippet leaders
        const snippetRes = await api.get('/api/leaderboard/snippet');
        setSnippetLeaders(snippetRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch leaderboards', err);
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  // Content for the Quiz Leaderboard
  const renderQuizLeaderboard = () => (
    <div className="leaderboard-list">
      {quizLeaders.length === 0 && <p>No quiz data yet. Go take a quiz!</p>}
      {quizLeaders.map((user, index) => (
        <div key={user.userId} className="leaderboard-item">
          <span className={`rank ${index < 3 ? 'rank-top' : ''}`}>{index + 1}</span>
          <span className="user-name">{user.name}</span>
          <div className="user-stats">
            <span>Score: <strong>{user.totalScore}</strong></span>
            <span>Accuracy: <strong>{user.avgAccuracy}%</strong></span>
          </div>
        </div>
      ))}
    </div>
  );

  // Content for the Snippet Leaderboard
  const renderSnippetLeaderboard = () => (
    <div className="leaderboard-list">
      {snippetLeaders.length === 0 && <p>No snippet data yet. Go post one!</p>}
      {snippetLeaders.map((user, index) => (
        <div key={user.userId} className="leaderboard-item">
          <span className={`rank ${index < 3 ? 'rank-top' : ''}`}>{index + 1}</span>
          <span className="user-name">{user.name}</span>
          <div className="user-stats">
            <span>Likes: <strong>{user.totalLikes}</strong></span>
            <span>Snippets: <strong>{user.totalSnippets}</strong></span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="leaderboard-container">
      <h1>Leaderboards 🏆</h1>
      
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz Experts
        </button>
        <button
          className={`tab-btn ${activeTab === 'snippet' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippet')}
        >
          Top Contributors
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <p>Loading leaderboard...</p>
        ) : (
          activeTab === 'quiz' ? renderQuizLeaderboard() : renderSnippetLeaderboard()
        )}
      </div>
    </div>
  );
};

export default Leaderboard;