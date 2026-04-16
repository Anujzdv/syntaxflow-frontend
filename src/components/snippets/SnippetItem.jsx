import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, Code2 } from 'lucide-react';
import api from '../../services/api';

const SnippetItem = ({ snippet, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(snippet.likes?.length || 0);

  const handleLike = async () => {
    try {
      await api.post(`/snippets/${snippet._id}/like`);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      if (onLike) onLike();
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-lg mb-6 group hover:border-slate-700 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-inner">
            {snippet.user?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h4 className="font-bold text-slate-200">@{snippet.user?.username || 'anonymous'}</h4>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Code2 className="w-3 h-3" /> {snippet.language || 'javascript'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-xl p-4 mb-4 overflow-x-auto border border-slate-800/50">
        <pre className="font-mono text-sm text-slate-300">
          <code>{snippet.code}</code>
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-2">
        <div className="flex gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${liked ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500' : ''}`} />
            <span className="text-sm font-medium font-mono">{likes}</span>
          </motion.button>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-2">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
export default SnippetItem;
