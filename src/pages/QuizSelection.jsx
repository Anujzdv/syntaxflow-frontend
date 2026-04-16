import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Cpu, Terminal, ShieldAlert } from 'lucide-react';

const quizzes = [
  { id: 'javascript', title: 'JavaScript Mastery', level: 'EASY', color: 'emerald', icon: Code2, path: '/quiz/javascript' },
  { id: 'python', title: 'Python Architect', level: 'MEDIUM', color: 'yellow', icon: Cpu, path: '/quiz/python' },
  { id: 'react', title: 'React Hooks Pro', level: 'HARD', color: 'red', icon: Terminal, path: '/quiz/react' },
];

const QuizSelection = () => {
  const navigate = useNavigate();

  const getColorClasses = (color) => {
    switch(color) {
      case 'emerald': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]';
      case 'red': return 'text-red-400 bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]';
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-slate-300 font-mono text-sm mb-6">
          <ShieldAlert className="w-4 h-4 text-cyan-400" /> Select a Challenge
        </div>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
          Select Your Quizzes
        </h1>
        <p className="text-slate-400 font-mono">Test your skills and earn XP.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl z-10 perspective-1000">
        {quizzes.map((quiz, index) => {
          const Icon = quiz.icon;
          return (
            <motion.div 
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05, rotateY: index === 0 ? 5 : index === 2 ? -5 : 0 }}
              onClick={() => navigate(quiz.path)}
              className={`bg-[#0f172a] rounded-2xl p-8 border ${getColorClasses(quiz.color)} transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-xl ${getColorClasses(quiz.color).split(' ')[1]}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full font-mono ${getColorClasses(quiz.color).split(' ')[0]} border border-current`}>
                  {quiz.level}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 text-left group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-colors">
                {quiz.title}
              </h3>
              <button className={`mt-6 w-full py-3 rounded-lg font-bold border border-current transition-colors hover:bg-current hover:text-slate-950 font-mono`}>
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
