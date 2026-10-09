import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RotateCcw, 
  Award, 
  BrainCircuit, 
  Code2, 
  Terminal, 
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LANGUAGES = [
  { id: 'JavaScript', label: 'JavaScript' },
  { id: 'Python', label: 'Python' },
  { id: 'C++', label: 'C++' },
  { id: 'Java', label: 'Java' },
  { id: 'C', label: 'C' }
];

const TOPICS = [
  { id: 'general', label: 'General / Core' },
  { id: 'arrays', label: 'Arrays & Data Structures' },
  { id: 'functions', label: 'Functions & Scope' },
  { id: 'memory', label: 'Memory & References' }
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', color: 'emerald' },
  { id: 'medium', label: 'Medium', color: 'yellow' },
  { id: 'hard', label: 'Hard', color: 'red' }
];

export const AdaptivePractice = () => {
  const navigate = useNavigate();

  // Setup state
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [startingDifficulty, setStartingDifficulty] = useState('medium');

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Feedback & Adaptation state
  const [feedback, setFeedback] = useState(null); // { isCorrect, explanation, correctOptionId, adaptation, stats }
  const [summary, setSummary] = useState(null);

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'hard':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'medium':
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/quizzes/adaptive/sessions', {
        language: selectedLanguage,
        topic: selectedTopic,
        startingDifficulty
      });

      setSessionId(res.data.sessionId);
      setCurrentDifficulty(res.data.currentDifficulty);
      setCurrentQuestion(res.data.question);
      setSelectedOptionId('');
      setFeedback(null);
      setSummary(null);
    } catch (err) {
      console.error('Failed to start adaptive session:', err);
      setError(err.response?.data?.message || 'Failed to start adaptive session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOptionId || !currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post(`/api/quizzes/adaptive/sessions/${sessionId}/answers`, {
        questionId: currentQuestion.id,
        selectedOptionId,
        idempotencyKey: `ans-${sessionId}-${currentQuestion.id}-${Date.now()}`
      });

      setFeedback({
        isCorrect: res.data.result.isCorrect,
        explanation: res.data.result.explanation,
        correctOptionId: res.data.result.correctOptionId,
        adaptation: res.data.adaptation,
        nextQuestion: res.data.nextQuestion,
        stats: res.data.stats,
        sessionStatus: res.data.sessionStatus
      });

      if (res.data.adaptation?.nextDifficulty) {
        setCurrentDifficulty(res.data.adaptation.nextDifficulty);
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!feedback) return;

    if (feedback.nextQuestion) {
      setCurrentQuestion(feedback.nextQuestion);
      setSelectedOptionId('');
      setFeedback(null);
    } else {
      // Session finished
      handleFinishSession();
    }
  };

  const handleFinishSession = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      await api.post(`/api/quizzes/adaptive/sessions/${sessionId}/finish`);
      const summaryRes = await api.get(`/api/quizzes/adaptive/sessions/${sessionId}/summary`);
      setSummary(summaryRes.data);
      setCurrentQuestion(null);
      setFeedback(null);
    } catch (err) {
      console.error('Failed to finish session:', err);
      setError('Failed to fetch session summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setSessionId(null);
    setCurrentQuestion(null);
    setFeedback(null);
    setSummary(null);
    setSelectedOptionId('');
    setError(null);
  };

  // 1. SUMMARY VIEW
  if (summary) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-slate-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Award className="w-12 h-12" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Adaptive Practice Complete
          </h2>
          <p className="text-slate-400 text-center font-mono text-sm mb-8">
            {summary.language} • {summary.topic}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Answered</div>
              <div className="text-2xl font-bold text-white">{summary.totalAnswered}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Correct</div>
              <div className="text-2xl font-bold text-emerald-400">{summary.totalCorrect}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-xs font-mono text-slate-400 uppercase mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-cyan-400">{summary.accuracy}%</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 mb-8">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <BrainCircuit className="w-4 h-4" /> Algorithmic Recommendation
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{summary.recommendation}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetAll}
              className="flex-1 py-3 px-6 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-mono flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="py-3 px-6 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all font-mono"
            >
              Back to Quizzes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. ACTIVE QUESTION VIEW
  if (currentQuestion) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-slate-100 max-w-4xl mx-auto">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">{selectedLanguage} Adaptive Mode</div>
              <div className="text-sm font-bold text-white">Interactive Practice Session</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full font-mono border uppercase ${getDifficultyBadge(currentDifficulty)}`}>
              {currentDifficulty}
            </span>
            <button
              onClick={handleFinishSession}
              disabled={isLoading}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              Finish
            </button>
          </div>
        </div>

        {error && (
          <div className="w-full mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        {/* Main Question Card */}
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            Question • Topic: {currentQuestion.topic}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.questionText}
          </h2>

          {/* Optional Code Snippet */}
          {currentQuestion.codeSnippet && (
            <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 overflow-x-auto">
              <pre>{currentQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Options */}
          <div className="grid gap-3 mb-8">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isAnswered = !!feedback;
              const isCorrectOpt = feedback && feedback.correctOptionId === opt.id;
              const isWrongSelection = feedback && isSelected && !feedback.isCorrect;

              let optionStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';
              if (isSelected && !isAnswered) {
                optionStyle = 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
              }
              if (isAnswered) {
                if (isCorrectOpt) {
                  optionStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-300';
                } else if (isWrongSelection) {
                  optionStyle = 'bg-rose-500/15 border-rose-500 text-rose-300';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800/60 opacity-60 text-slate-400';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswered || isSubmitting}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${optionStyle}`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm border ${
                    isSelected ? 'border-current bg-current/10' : 'border-slate-700 bg-slate-800'
                  }`}>
                    {opt.id}
                  </span>
                  <span className="flex-1 text-sm md:text-base font-medium">{opt.text}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isAnswered && isWrongSelection && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Adaptation Section */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-6 border-t border-slate-800"
              >
                {/* Result Alert */}
                <div className={`p-4 rounded-2xl border mb-4 flex items-start gap-3 ${
                  feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-white mb-1">
                      {feedback.isCorrect ? 'Correct Answer!' : 'Incorrect'}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.explanation}</p>
                  </div>
                </div>

                {/* Adaptation Pill */}
                {feedback.adaptation && (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {feedback.adaptation.change === 'increase' && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      )}
                      {feedback.adaptation.change === 'decrease' && (
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <TrendingDown className="w-4 h-4" />
                        </div>
                      )}
                      {feedback.adaptation.change === 'maintain' && (
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                          <Minus className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-mono uppercase text-slate-400">
                          Adaptive Engine: {feedback.adaptation.change}
                        </div>
                        <div className="text-sm text-slate-200">{feedback.adaptation.reason}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full border border-slate-700 bg-slate-900">
                      Next: {feedback.adaptation.nextDifficulty}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button (only when unsubmitted) */}
          {!feedback && (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                selectedOptionId && !isSubmitting
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Answer...
                </>
              ) : (
                'Submit Answer'
              )}
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  // 3. SETUP VIEW (Select language, topic, difficulty)
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              Adaptive Practice Mode
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dynamic Skill Mastery</h1>
          </div>
        </div>

        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Questions dynamically scale in difficulty as you answer. Two consecutive correct answers elevate difficulty, while mistakes lower it to reinforce learning.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        {/* 1. Language Selection */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            1. Select Programming Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all font-mono flex items-center justify-center gap-2 ${
                  selectedLanguage === lang.id
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-4 h-4" /> {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Topic Selection */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            2. Select Topic Area
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICS.map((top) => (
              <button
                key={top.id}
                onClick={() => setSelectedTopic(top.id)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all font-mono text-left flex items-center gap-2 ${
                  selectedTopic === top.id
                    ? 'bg-purple-500/10 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4 text-purple-400" /> {top.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Starting Difficulty */}
        <div className="mb-8">
          <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            3. Starting Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setStartingDifficulty(diff.id)}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all font-mono text-center uppercase ${
                  startingDifficulty === diff.id
                    ? `${getDifficultyBadge(diff.id)} border-current shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleStartSession}
          disabled={isLoading}
          className="w-full py-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Preparing Adaptive Session...
            </>
          ) : (
            <>
              Launch Adaptive Session <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AdaptivePractice;
