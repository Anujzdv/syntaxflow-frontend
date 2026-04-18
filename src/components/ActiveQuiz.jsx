import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ActiveQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // State
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> [selectedOptionIds]
  const [timeLeft, setTimeLeft] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch Quiz Data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // Fetch specific endpoint
        const response = await api.get(`/api/quizzes/${quizId}`);
        const data = response.data;
        
        // Ensure data exists and is in correct format.
        // Assuming data is array of questions or an object with a questions array
        const questions = Array.isArray(data) ? data : data.questions || [];
        const timeLimit = data.timeLimit || questions.length * 60;
        
        setQuizData({ questions, title: data.title || `Quiz ${quizId}`, timeLimit });
        setTimeLeft(timeLimit);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
        setError('Failed to load the quiz. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Submit Quiz
  const handleSubmit = useCallback(async (isTimeUp = false) => {
    if (isSubmitted) return;

    if (!isTimeUp && quizData) {
      // Validate if all questions have been answered
      for (let i = 0; i < quizData.questions.length; i++) {
        const qId = quizData.questions[i]._id || quizData.questions[i].id;
        const answersForQ = selectedAnswers[qId];
        if (!answersForQ || answersForQ.length === 0) {
          alert(`Question ${i + 1} is not answered.\nPlease answer all questions before submitting.`);
          // Optionally, jump to that question: setCurrentQuestionIndex(i);
          return;
        }
      }
    }

    setIsSubmitted(true);
    
    // Format answers for submission
    const formattedAnswers = Object.entries(selectedAnswers).map(([qId, ans]) => ({
      questionId: qId,
      selectedOptionIds: ans
    }));

    try {
      const timeTaken = quizData && quizData.timeLimit ? quizData.timeLimit - timeLeft : 0;
      // Use proper specific endpoint
      const response = await api.post(`/api/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
        tabSwitchCount: tabSwitchCount,
        timeTaken: timeTaken
      });
      // Navigate to results
      navigate('/quiz/result', { state: { result: response.data } }); 
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit quiz.');
      setIsSubmitted(false);
    }
  }, [isSubmitted, selectedAnswers, quizId, tabSwitchCount, timeLeft, quizData, navigate]);

  // Timer
  useEffect(() => {
    if (loading || isSubmitted || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, isSubmitted, handleSubmit]);

  // Anti-Cheat: Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted && !loading) {
        setTabSwitchCount(prev => prev + 1);
        alert('Warning: Switching tabs during the quiz is not allowed!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSubmitted, loading]);

  // Handlers
  const handleOptionSelect = (questionId, optionId, isMultipleChoice = false) => {
    setSelectedAnswers(prev => {
      const currentSelected = prev[questionId] || [];
      if (isMultipleChoice) {
        if (currentSelected.includes(optionId)) {
          return { ...prev, [questionId]: currentSelected.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...currentSelected, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleClearSelection = () => {
    if (!quizData) return;
    const currentQ = quizData.questions[currentQuestionIndex];
    if (currentQ) {
      const newAnswers = { ...selectedAnswers };
      delete newAnswers[currentQ._id || currentQ.id];
      setSelectedAnswers(newAnswers);
    }
  };

  // Render Helpers
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-xl animate-pulse text-gray-400">Loading your challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-md w-full text-center">
          <p className="text-red-200 mb-4 font-semibold">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl text-gray-400">No questions found for this quiz.</p>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const qId = currentQuestion._id || currentQuestion.id;
  const currentSelected = selectedAnswers[qId] || [];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  // Assume options are either array of objects {id, text} or just array of strings
  // Normalizing options to { id, text }
  const options = Array.isArray(currentQuestion.options) 
    ? currentQuestion.options.map((opt, i) => typeof opt === 'object' ? { id: opt._id || opt.id || String(i), text: opt.text || String(opt) } : { id: String(i), text: String(opt) })
    : Object.keys(currentQuestion.options || {}).map(k => ({ id: k, text: currentQuestion.options[k] }));

  const isMultipleChoice = currentQuestion.type === 'multi';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Quiz Area */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                {quizData.title}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </p>
            </div>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-mono text-lg font-bold border transition-colors ${
              timeLeft < 60 
                ? 'bg-red-950/50 text-red-400 border-red-500 animate-pulse' 
                : 'bg-indigo-950/50 text-indigo-300 border-indigo-800'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestionIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl flex-grow"
            >
              <h2 className="text-xl md:text-2xl font-medium text-slate-200 mb-6 leading-relaxed">
                {currentQuestion.question_text || currentQuestion.question || "Untitled Question"}
              </h2>

              {currentQuestion.code_snippet && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-4">
                  <pre className="font-mono text-sm text-cyan-300 overflow-x-auto">
                    <code>{currentQuestion.code_snippet}</code>
                  </pre>
                </div>
              )}

              <div className="space-y-3">
                {options.map((op, index) => {
                  const isSelected = currentSelected.includes(op.id);
                  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                  const letter = optionLetters[index] || String(index + 1);

                  return (
                    <motion.button
                      key={op.id}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOptionSelect(qId, op.id, isMultipleChoice)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center space-x-4 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-6 h-6 border-2 transition-all ${
                        isMultipleChoice ? 'rounded-md' : 'rounded-full'
                      } ${
                        isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 bg-transparent text-transparent'
                      }`}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`flex-1 text-base ${isSelected ? 'text-indigo-100 font-medium' : 'text-slate-300'}`}>
                        <span className="font-bold text-slate-500 mr-2">{letter}.</span> {op.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={handleClearSelection}
              disabled={currentSelected.length === 0}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Clear Selection
            </button>

            {isLastQuestion ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-8 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                Submit Quiz
              </motion.button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quizData.questions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Sidebar / Question Palette */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg sticky top-8">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Question Palette
            </h3>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
              {quizData.questions.map((q, idx) => {
                const qKey = q._id || q.id;
                const isAnswered = selectedAnswers[qKey] && selectedAnswers[qKey].length > 0;
                const isCurrent = currentQuestionIndex === idx;
                
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-full aspect-square flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                      isCurrent 
                        ? 'border-indigo-500 text-indigo-100 shadow-[0_0_10px_rgba(99,102,241,0.5)] bg-slate-800' 
                        : isAnswered
                          ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 space-y-3 pt-6 border-t border-slate-800">
              <div className="flex items-center text-sm text-slate-400">
                <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50 mr-3"></div>
                Answered
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <div className="w-4 h-4 rounded bg-slate-800 border-2 border-slate-700 mr-3"></div>
                Unanswered
              </div>
              <div className="flex items-center text-sm text-slate-400">
                <div className="w-4 h-4 rounded bg-slate-800 border-2 border-indigo-500 mr-3"></div>
                Current
              </div>
            </div>

            {tabSwitchCount > 0 && (
              <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 rounded-xl">
                <p className="text-red-400 text-xs text-center font-medium">
                  Tab switches detected: <span className="font-bold text-red-300">{tabSwitchCount}</span>
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveQuiz;
