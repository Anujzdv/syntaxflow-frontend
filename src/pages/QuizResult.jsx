// src/pages/QuizResult.jsx
import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Target, Clock, Zap, ChevronDown, 
  ChevronUp, CheckCircle2, XCircle, Lightbulb, 
  RotateCcw, ArrowRight, ShieldAlert 
} from 'lucide-react';

const QuizResult = () => {
  const location = useLocation();
  const { result } = location.state || {}; 
  const [showReview, setShowReview] = useState(true);

  // If no result data, redirect to quiz selection
  if (!result) {
    return <Navigate to="/quiz" replace />;
  }

  const { 
    score, 
    maxScore, 
    accuracy, 
    passed, 
    xpEarned, 
    timeTaken, 
    flagged, 
    flagReason, 
    msg,
    review 
  } = result;

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  const getHeaderTheme = () => {
    if (passed) {
      return {
        title: '🎉 Quiz Passed!',
        subtitle: msg || 'Outstanding performance! You met the passing mark and earned XP.',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]'
      };
    }
    if (score > 0) {
      return {
        title: '📚 Practice Completed',
        subtitle: msg || `You answered ${score}/${maxScore} questions correctly (${accuracy}%). Passing threshold is 60%.`,
        color: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]'
      };
    }
    return {
      title: '💪 Keep Practicing!',
      subtitle: msg || 'No correct answers this time. Review the verified solutions below and try again!',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]'
    };
  };

  const theme = getHeaderTheme();

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        
        {/* Main Result Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-[#0f172a] border border-slate-800 p-8 rounded-3xl ${theme.glow} text-center`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-current">
            {passed ? 'Passed (≥ 60%)' : 'Needs 60% to Pass'}
          </div>

          <h1 className={`text-4xl font-black mb-2 ${theme.color}`}>
            {theme.title}
          </h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
            {theme.subtitle}
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Score
              </span>
              <p className="text-2xl font-bold text-white font-mono">{score} / {maxScore}</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Accuracy
              </span>
              <p className="text-2xl font-bold text-cyan-400 font-mono">{accuracy}%</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" /> XP Earned
              </span>
              <p className="text-2xl font-bold text-emerald-400 font-mono">+{xpEarned || 0}</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time
              </span>
              <p className="text-2xl font-bold text-slate-200 font-mono">{formatTime(timeTaken)}</p>
            </div>
          </div>

          {/* Anti-cheat Alert if flagged */}
          {flagged && (
            <div className="mb-6 p-4 bg-amber-950/30 border border-amber-500/50 rounded-2xl text-left flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-bold text-sm">Attempt Flagged</p>
                <p className="text-amber-200/80 text-xs mt-0.5">
                  Your attempt was flagged for: <strong className="text-amber-200">{flagReason}</strong>. It may not count towards public leaderboards.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link 
              to="/quiz" 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Take Another Quiz
            </Link>
            <Link 
              to="/feed" 
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2 text-sm"
            >
              Go to Feed <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Detailed Solutions & Explanations */}
        {review && review.length > 0 && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div 
              onClick={() => setShowReview(!showReview)}
              className="flex items-center justify-between cursor-pointer select-none pb-2 border-b border-slate-800/80"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Solutions & Explanations</h3>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {review.length} Questions
                </span>
              </div>
              <button className="text-slate-400 hover:text-white p-1">
                {showReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            <AnimatePresence>
              {showReview && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  {review.map((q, idx) => (
                    <div 
                      key={q.questionId || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        q.isCorrect 
                          ? 'bg-emerald-950/20 border-emerald-500/30' 
                          : 'bg-red-950/20 border-red-500/30'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">Q{idx + 1}.</span>
                          <h4 className="text-sm font-semibold text-slate-200">
                            {q.question_text}
                          </h4>
                        </div>
                        {q.isCorrect ? (
                          <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>

                      {/* Code Snippet if present */}
                      {q.code_snippet && (
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-3 overflow-x-auto">
                          <pre className="font-mono text-xs text-cyan-300">
                            <code>{q.code_snippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Options Review */}
                      <div className="space-y-1.5 mb-3">
                        {q.options?.map((opt) => {
                          const isUserChoice = q.userSelectedOptionIds?.includes(opt._id);
                          const isCorrectChoice = opt.is_correct;

                          let optionStyle = 'bg-slate-900/50 border-slate-800 text-slate-400';
                          if (isCorrectChoice) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold';
                          } else if (isUserChoice && !isCorrectChoice) {
                            optionStyle = 'bg-red-500/10 border-red-500/50 text-red-300 line-through';
                          }

                          return (
                            <div 
                              key={opt._id}
                              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{opt.text}</span>
                              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                {isCorrectChoice && (
                                  <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                                    Correct Answer
                                  </span>
                                )}
                                {isUserChoice && (
                                  <span className={`px-1.5 py-0.5 rounded font-bold ${isCorrectChoice ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500 text-white'}`}>
                                    Your Choice
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-yellow-400 mr-1">Explanation:</span>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizResult;
