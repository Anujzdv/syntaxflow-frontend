import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Code2 } from 'lucide-react';
import api from '../../services/api';

const CreateSnippet = ({ onSnippetCreated }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      const res = await api.post('/snippets', { code, language });
      setCode('');
      if (onSnippetCreated) onSnippetCreated(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-2xl border border-cyan-500/20 p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Code2 className="w-5 h-5 text-cyan-400" /> Share Your Flow
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write or paste your elegant code here..."
          className="w-full h-32 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none mb-4"
        />
        <div className="flex justify-between items-center">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="react">React</option>
            <option value="css">CSS</option>
          </select>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Send className="w-4 h-4" /> Share
          </motion.button>
        </div>
      </form>
    </div>
  );
};
export default CreateSnippet;
