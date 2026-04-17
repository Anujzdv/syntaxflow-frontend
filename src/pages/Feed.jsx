import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreateSnippet from '../components/snippets/CreateSnippet';
import SnippetItem from '../components/snippets/SnippetItem';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Code2 } from 'lucide-react';

const Feed = () => {
  const [snippets, setSnippets] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await api.get('/api/snippets');
      // Support both { data: [...] } from axios directly, or res.data.data from new backend wrapper
      setSnippets(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching snippets', err);
    }
  };

  const handleSnippetCreated = (newSnippet) => {
    setSnippets([newSnippet, ...snippets]);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 md:px-8 max-w-2xl mx-auto relative pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Feed</h1>
            <p className="text-slate-400 font-mono text-sm">Discover recent posts</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {snippets.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4">
            <Code2 className="w-12 h-12 text-slate-700" />
            <p className="text-slate-500 font-mono">No data snippets found. Be the first to post!</p>
          </div>
        ) : (
          snippets.map((snippet) => (
            <SnippetItem key={snippet._id} snippet={snippet} onLike={fetchSnippets} />
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) for Instagram-like UX */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsEditorOpen(true)}
        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 p-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-white shadow-[0_0_30px_rgba(6,182,212,0.5)] z-40 flex items-center justify-center group"
      >
        <Plus className="w-8 h-8 transition-transform group-hover:rotate-90 duration-300" />
      </motion.button>

      {/* IDE Editor Modal */}
      <CreateSnippet 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSnippetCreated={handleSnippetCreated} 
      />
    </div>
  );
};
export default Feed;
