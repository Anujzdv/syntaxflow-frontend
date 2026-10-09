import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Cpu, Terminal, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

const quizzes = [
  { id: 'javascript', title: 'JavaScript Mastery', level: 'EASY', color: 'emerald', icon: Code2, path: '/quiz/javascript' },
  { id: 'python', title: 'Python Architect', level: 'MEDIUM', color: 'yellow', icon: Cpu, path: '/quiz/python' },
  { id: 'java', title: 'Java Enterprise', level: 'HARD', color: 'red', icon: Terminal, path: '/quiz/java' },
  { id: 'cpp', title: 'C++ Systems Pro', level: 'HARD', color: 'cyan', icon: Code2, path: '/quiz/c%2B%2B' },
  { id: 'c', title: 'C Low-Level Core', level: 'MEDIUM', color: 'yellow', icon: Terminal, path: '/quiz/c' },
];

const QuizSelection = () => {
  const navigate = useNavigate();

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]';
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-300 font-mono text-sm mb-6">
          <ShieldAlert className="w-4 h-4 text-cyan-400" /> Select a Challenge
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
          Challenge Arena & Practice
        </h1>
        <p className="text-slate-400 font-mono text-sm">Test your skills, adapt your level, and climb the ranks.</p>
      </motion.div>

      {/* FEATURED: Adaptive AI Practice Mode Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate('/adaptive')}
        className="w-full max-w-5xl mb-12 bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-purple-950/60 border border-cyan-500/40 hover:border-cyan-400/80 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] cursor-pointer text-left relative overflow-hidden group transition-all z-10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Adaptive AI Practice Mode
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Intelligent Skill-Adaptive Training
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Real-time difficulty adaptation driven by deterministic performance analytics. Answer consecutive questions correctly to elevate difficulty, or reinforce foundational concepts when you stumble.
            </p>
          </div>
          <button className="shrink-0 py-3.5 px-6 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
            Launch Adaptive Mode <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Standard Timed Quizzes Section */}
      <div className="w-full max-w-5xl text-left mb-6 z-10">
        <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" /> Standard Timed Quizzes
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl z-10 perspective-1000">
        {quizzes.map((quiz, index) => {
          const Icon = quiz.icon;
          return (
            <motion.div 
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(quiz.path)}
              className={`bg-[#0f172a] rounded-2xl p-6 border ${getColorClasses(quiz.color)} transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden group text-left`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(quiz.color).split(' ')[1]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full font-mono ${getColorClasses(quiz.color).split(' ')[0]} border border-current`}>
                  {quiz.level}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-colors">
                {quiz.title}
              </h3>
              <button className="mt-4 w-full py-2.5 rounded-lg font-bold border border-current transition-colors hover:bg-current hover:text-slate-950 font-mono text-sm">
                Start Quiz
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizSelection;
