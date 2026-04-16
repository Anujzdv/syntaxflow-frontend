import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreateSnippet from '../components/snippets/CreateSnippet';
import SnippetItem from '../components/snippets/SnippetItem';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

const Feed = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await api.get('/snippets');
      setSnippets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSnippetCreated = (newSnippet) => {
    setSnippets([newSnippet, ...snippets]);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <LayoutDashboard className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Snippets Feed</h1>
          <p className="text-slate-400 font-mono text-sm">See what other developers are sharing</p>
        </div>
      </motion.div>

      <CreateSnippet onSnippetCreated={handleSnippetCreated} />

      <h2 className="text-xl font-bold text-slate-300 mb-6 border-b border-slate-800 pb-2">Recent Snippets</h2>
      <div className="space-y-6">
        {snippets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 font-mono">No data snippets found in the database. Be the first to share!</p>
          </div>
        ) : (
          snippets.map((snippet) => (
            <SnippetItem key={snippet._id} snippet={snippet} onLike={fetchSnippets} />
          ))
        )}
      </div>
    </div>
  );
};
export default Feed;
