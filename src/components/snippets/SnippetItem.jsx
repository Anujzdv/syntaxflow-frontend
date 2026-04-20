import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Code2, MessageSquare, Send, Loader2 } from 'lucide-react';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';

const SnippetItem = ({ snippet, onLike }) => {
  const { user } = useContext(AuthContext) || {};
  const [liked, setLiked] = useState(snippet.likes?.some(l => l.user === user?._id || l === user?._id) || false);
  const [likes, setLikes] = useState(snippet.likes?.length || 0);
  const [comments, setComments] = useState(snippet.comments || []);
  const [totalComments, setTotalComments] = useState(snippet.totalComments || snippet.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(snippet.showMoreComments || false);
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/snippets/${snippet._id}/like`);
      setLiked(!liked);
      // Use likesCount from the backend response if available, or fallback
      setLikes(res.data?.likesCount !== undefined ? res.data.likesCount : (liked ? likes - 1 : likes + 1));
      if (onLike) onLike();
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const loadMoreComments = async () => {
    if (loadingComments || !hasMoreComments) return;
    setLoadingComments(true);
    try {
      const nextPage = commentPage + 1;
      const res = await api.get(`/api/snippets/${snippet._id}/comments?page=${nextPage}&limit=10`);
      if (res.data && res.data.data) {
        setComments(prev => {
          const currentIds = new Set(prev.map(c => c._id || c.date));
          const additions = res.data.data.filter(c => !currentIds.has(c._id || c.date));
          return [...prev, ...additions];
        });
        setHasMoreComments(res.data.hasMore);
        setCommentPage(nextPage);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.post(`/api/snippets/${snippet._id}/comment`, { text: newComment });
      if (res.data && res.data.comments) {
        // Backend returns entire comment array or the latest. We will just use it.
        setComments(res.data.comments);
        setTotalComments(res.data.comments.length);
      }
      setNewComment('');
      if (onLike) onLike(); // Optionally refetch feed generally
    } catch (err) {
      console.error('Comment failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-lg group hover:border-slate-700 transition-colors w-full max-w-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-inner">
            {snippet.user?.username?.charAt(0).toUpperCase() || snippet.user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h4 className="font-bold text-slate-200">@{snippet.user?.username || snippet.user?.name || 'anonymous'}</h4>
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
              <Code2 className="w-3 h-3" /> {snippet.language || 'javascript'}
            </span>
          </div>
        </div>
      </div>
      
      {snippet.title && (
        <h3 className="text-xl font-bold text-slate-200 mb-2">{snippet.title}</h3>
      )}
      
      {snippet.description && (
        <p className="text-sm text-slate-400 mb-3">{snippet.description}</p>
      )}
      
      <div className="bg-slate-950 rounded-xl p-4 mb-4 overflow-x-auto border border-slate-800/50 shadow-inner">
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

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${showComments ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 border border-transparent'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium font-mono">{totalComments}</span>
          </motion.button>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-2">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              {/* Existing Comments */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500 font-mono text-center py-4 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {(comment.name || comment.user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-300 text-sm">@{comment.name || comment.user?.name || 'user'}</span>
                        <span className="text-xs text-slate-500">• {new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-400 pl-7">{comment.text}</p>
                    </div>
                  ))
                )}
                {hasMoreComments && (
                  <button 
                    onClick={loadMoreComments} 
                    disabled={loadingComments}
                    className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest flex justify-center items-center gap-2"
                  >
                    {loadingComments ? <Loader2 className="w-4 h-4 animate-spin" /> : `View ${totalComments - comments.length} more comments`}
                  </button>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Post</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default SnippetItem;
