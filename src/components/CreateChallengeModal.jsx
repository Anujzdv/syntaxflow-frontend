import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Code2, Zap, Loader2 } from 'lucide-react';
import api from '../services/api';

const TOPICS = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'react', name: 'React' },
  { id: 'python', name: 'Python' },
  { id: 'nodejs', name: 'Node.js' }
];

const DIFFICULTIES = [
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' }
];

const CreateChallengeModal = ({ isOpen, onClose, targetUser }) => {
  const [topic, setTopic] = useState('javascript');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChallenge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // We will define this endpoint in the backend
      await api.post('/api/challenges', {
        targetUserId: targetUser._id,
        topic,
        difficulty
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Aesthetic Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Issue a Challenge</h2>
              <p className="text-sm border-slate-400 font-mono text-slate-400">vs @{targetUser?.username}</p>
            </div>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Challenge Sent!</h3>
              <p className="text-sm text-slate-400">Waiting for {targetUser?.name} to accept.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleChallenge} className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Select Topic
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        topic === t.id 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id)}
                      className={`p-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        difficulty === d.id 
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                          : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-black text-lg transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Challenge'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateChallengeModal;
