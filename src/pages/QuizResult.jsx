// src/pages/QuizResult.jsx
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const QuizResult = () => {
  const location = useLocation();
  const { result } = location.state || {}; 

  // If no result data, redirect to quiz selection
  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  const { score, maxScore, accuracy, passed, xpEarned, timeTaken, flagged, flagReason, msg } = result;

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  const passFailColor = passed ? 'text-green-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h2 className={`text-3xl font-bold mb-2 ${passFailColor}`}>
          {passed ? '🎉 Quiz Passed!' : '❌ Quiz Failed'}
        </h2>
        <p className="text-slate-400 mb-6">{msg}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm text-slate-400 font-medium mb-1">Score</h4>
            <p className="text-2xl font-bold text-white">{score} / {maxScore}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm text-slate-400 font-medium mb-1">Accuracy 🎯</h4>
            <p className="text-2xl font-bold text-cyan-400">{accuracy}%</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm text-slate-400 font-medium mb-1">XP Earned 🏆</h4>
            <p className="text-2xl font-bold text-emerald-400">+{xpEarned || 0}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <h4 className="text-sm text-slate-400 font-medium mb-1">Time Taken ⏱️</h4>
            <p className="text-2xl font-bold text-white">{formatTime(timeTaken)}</p>
          </div>
        </div>

        {flagged && (
          <div className="mb-8 p-4 bg-amber-950/30 border border-amber-500/50 rounded-xl text-left">
            <p className="text-amber-400 font-bold flex items-center">
              <span className="mr-2">⚠️</span> Alert
            </p>
            <p className="text-amber-200/80 text-sm mt-1">
              Your attempt was flagged: <strong className="text-amber-200">{flagReason}</strong>. It may not be counted for leaderboards.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/quiz" className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700">
            Take Another Quiz
          </Link>
          <Link to="/feed" className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
