import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Code2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import api from '../../services/api';

const CreateSnippet = ({ isOpen, onClose, onSnippetCreated }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post('/api/snippets', { title, code, language });
      setCode('');
      setTitle('');
      if (onSnippetCreated) onSnippetCreated(res.data);
      onClose(); // auto close modal after successful post
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl h-full max-h-[85vh] flex flex-col bg-[#0f172a] rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg shadow-inner">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                New Snippet
              </h3>
              <div className="flex-1 px-8 hidden sm:block">
                <input
                  type="text"
                  placeholder="Snippet Title (Optional)"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 transition-all font-mono text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex flex-col flex-1 overflow-hidden p-4 gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 h-full min-h-[300px]">
                {/* Editor Container */}
                <div className="flex-1 border border-slate-800 rounded-xl overflow-hidden shadow-inner bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    width="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      padding: { top: 16, bottom: 16 },
                      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                      suggestOnTriggerCharacters: true
                    }}
                    loading={
                      <div className="flex items-center justify-center h-full text-slate-500 font-mono text-sm">
                        Loading IDE...
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Toolbar line */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-slate-300 text-sm px-3 py-2 font-mono focus:outline-none cursor-pointer appearance-none outline-none"
                    style={{ backgroundImage: 'none' }}
                  >
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="html">HTML</option>
                    <option value="python">Python</option>
                  </select>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  className={`px-6 py-2.5 font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] ${
                    isSubmitting || !code.trim() 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
                  }`}
                >
                  <Send className="w-4 h-4 ml-1" />
                  {isSubmitting ? 'Posting...' : 'Share Snippet'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CreateSnippet;
