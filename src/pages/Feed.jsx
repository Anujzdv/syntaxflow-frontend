import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import CreateSnippet from '../components/snippets/CreateSnippet';
import SnippetItem from '../components/snippets/SnippetItem';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Code2 } from 'lucide-react';

const Feed = () => {
  const [snippets, setSnippets] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  const fetchSnippets = async (pageNum) => {
    if (loading || (!hasMore && pageNum > 1)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/snippets?page=${pageNum}&limit=10`);
      const fetchedData = res.data.data || [];
      
      if (pageNum === 1) {
        setSnippets(fetchedData);
      } else {
        setSnippets((prev) => {
          // ensure no duplicates
          const currentIds = new Set(prev.map(s => s._id));
          const additions = fetchedData.filter(s => !currentIds.has(s._id));
          return [...prev, ...additions];
        });
      }
      
      setHasMore(res.data.hasMore !== undefined ? res.data.hasMore : false);
      setPage(pageNum + 1);
    } catch (err) {
      console.error('Error fetching snippets', err);
      setError(err.response?.data?.msg || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchSnippets(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          fetchSnippets(page);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  const handleSnippetCreated = (newSnippet) => {
    setSnippets([newSnippet, ...snippets]);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-slate-950 overflow-y-scroll snap-y snap-mandatory relative custom-scrollbar">
      <div className="max-w-2xl mx-auto w-full h-full relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 snap-start">
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

        <div className="flex flex-col w-full pb-24">
          {error && <div className="p-4 m-6 border border-red-500/50 bg-red-500/10 text-red-200 rounded-xl text-center text-sm">{error}</div>}
          
          {snippets.length === 0 && !loading && !error ? (
            <div className="h-[calc(100vh-160px)] snap-start flex flex-col items-center justify-center p-6">
              <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-4 w-full">
                <Code2 className="w-12 h-12 text-slate-700" />
                <p className="text-slate-500 font-mono">No data snippets found. Be the first to post!</p>
              </div>
            </div>
          ) : (
            snippets.map((snippet) => (
              <div key={snippet._id} className="snap-start min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-8 px-4 w-full">
                <SnippetItem snippet={snippet} onLike={() => {}} />
              </div>
            ))
          )}

          {/* Infinite Scroll Sentinel */}
          {loading && (
            <div className="py-12 flex justify-center items-center snap-start w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          )}
          <div ref={observerTarget} className="h-10 w-full snap-start" />
          
          {!hasMore && snippets.length > 0 && (
            <div className="text-center py-12 text-slate-500 font-mono snap-start w-full">
              You've reached the end of the feed!
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
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
