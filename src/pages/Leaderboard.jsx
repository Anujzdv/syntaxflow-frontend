import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Flame, ChevronRight, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useContext(AuthContext) || {};
  
  const [topUsers, setTopUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [type, setType] = useState('global'); // 'global' | 'weekly'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard(type);
  }, [type]);

  const fetchLeaderboard = async (leaderboardType) => {
    setLoading(true);
    setError(null);
    try {
      // The new planned backend endpoint
      const res = await api.get(`/api/leaderboard?type=${leaderboardType}`);
      
      // Fallback handling if backend returns an old array format vs the new object format
      if (Array.isArray(res.data)) {
        setTopUsers(res.data);
        setCurrentUserData(null); // Will compute statically if possible
      } else {
        setTopUsers(res.data.topUsers || []);
        setCurrentUserData(res.data.currentUser || null);
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      // Fallback for legacy route if the new one isn't deployed yet
      if (err.response && err.response.status === 404) {
         try {
            const oldRes = await api.get('/auth/leaderboard');
            setTopUsers(Array.isArray(oldRes.data) ? oldRes.data : []);
         } catch(e) {
            setError('Failed to fetch leaderboard data.');
         }
      } else {
        setError('Failed to fetch leaderboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If currentUserData isn't provided by backend but user is in topUsers array, compute local fallback
  const getActiveUserStats = () => {
    if (currentUserData) return currentUserData;
    if (!user) return null;
    
    const index = topUsers.findIndex(u => u._id === user._id || u.username === user.username);
    if (index !== -1) {
      const active = topUsers[index];
      const nextUser = index > 0 ? topUsers[index - 1] : null;
      const gap = nextUser ? (nextUser.xp || 0) - (active.xp || 0) : 0;
      return {
        rank: index + 1,
        xp: active.xp || 0,
        gapToNext: gap > 0 ? gap : 0,
        nextRankXp: nextUser ? nextUser.xp : active.xp
      };
    }
    return { rank: 'Unranked', xp: 0, gapToNext: null };
  };

  const activeStats = getActiveUserStats();

  const UserAvatar = ({ char, rank }) => {
    let colorClass = "text-slate-400 border-slate-700 bg-slate-800";
    if (rank === 1) colorClass = "text-yellow-400 border-yellow-500/50 bg-yellow-500/20";
    if (rank === 2) colorClass = "text-slate-300 border-slate-400/50 bg-slate-400/20";
    if (rank === 3) colorClass = "text-amber-600 border-amber-600/50 bg-amber-600/20";

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass} font-bold font-mono text-lg shadow-inner`}>
        {char?.toUpperCase() || '?'}
      </div>
    );
  };

  // Extract Podium (Top 3) & List (4+)
  const podiumUsers = topUsers.slice(0, 3);
  const listUsers = topUsers.slice(3);

  // Layout order for visual podium: 2nd, 1st, 3rd
  const orderedPodium = [];
  if (podiumUsers[1]) orderedPodium.push({ user: podiumUsers[1], rank: 2, height: 'h-40', delay: 0.2 });
  if (podiumUsers[0]) orderedPodium.push({ user: podiumUsers[0], rank: 1, height: 'h-52', delay: 0.1 });
  if (podiumUsers[2]) orderedPodium.push({ user: podiumUsers[2], rank: 3, height: 'h-32', delay: 0.3 });

  return (
    <div className="min-h-screen bg-slate-950 pb-32 pt-8 px-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header & Tabs */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex justify-center items-center p-4 bg-indigo-500/10 rounded-full mb-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Trophy className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-6">Hall of Fame</h1>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setType('global')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${type === 'global' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Global Rank
            </button>
            <button 
              onClick={() => setType('weekly')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${type === 'weekly' ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              Weekly Top
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-400 font-mono animate-pulse">Calculating rankings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center max-w-md mx-auto mt-10">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <p className="text-red-200">{error}</p>
            <button onClick={() => fetchLeaderboard(type)} className="mt-4 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-white text-sm transition-colors">
              Retry
            </button>
          </div>
        ) : topUsers.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-mono">No challengers have ascended yet.</p>
          </div>
        ) : (
          <>
            {/* Podium UI (Top 3) */}
            <div className="flex items-end justify-center gap-2 sm:gap-6 lg:gap-10 mb-12 h-72">
              {orderedPodium.map((p, i) => (
                <motion.div 
                  key={p.user._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: p.delay, duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="flex flex-col items-center relative w-24 sm:w-32"
                >
                  {/* Floating Avatar & Details */}
                  <div className="flex flex-col items-center mb-3 absolute -top-24 w-full">
                    {p.rank === 1 && (
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Crown className="w-8 h-8 text-yellow-400 mb-1 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                      </motion.div>
                    )}
                    <UserAvatar char={p.user.username?.charAt(0)} rank={p.rank} />
                    <span className={`mt-2 font-bold text-sm truncate w-full text-center ${p.rank === 1 ? 'text-yellow-400' : p.rank === 2 ? 'text-slate-300' : 'text-amber-600'}`}>
                      @{p.user.username}
                    </span>
                  </div>

                  {/* Pedestal Component */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: p.height === 'h-52' ? '13rem' : p.height === 'h-40' ? '10rem' : '8rem' }}
                    transition={{ delay: p.delay + 0.2, duration: 0.8, ease: "easeOut" }}
                    className={`w-full rounded-t-lg border-t-2 border-x-2 flex flex-col items-center justify-start pt-4 relative overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.3)]
                      ${p.rank === 1 ? 'bg-gradient-to-b from-yellow-500/20 to-slate-900 border-yellow-500/50' : 
                        p.rank === 2 ? 'bg-gradient-to-b from-slate-400/20 to-slate-900 border-slate-400/50' : 
                        'bg-gradient-to-b from-amber-600/20 to-slate-900 border-amber-600/50'}`}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    <span className="text-2xl font-black text-white/90 drop-shadow-md">{p.rank}</span>
                    <div className="mt-2 flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5">
                      <Star className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 font-bold">{p.user.xp || 0}</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* List View (Rank 4+) */}
            {listUsers.length > 0 && (
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 mb-8">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/80 text-slate-500 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-bold">
                  <div className="col-span-2 sm:col-span-1 text-center">#</div>
                  <div className="col-span-6 sm:col-span-7">Challenger</div>
                  <div className="col-span-4 sm:col-span-4 text-right pr-4">Stats</div>
                </div>
                
                <div className="divide-y divide-slate-800/50">
                  {listUsers.map((u, index) => {
                    const actualRank = index + 4;
                    const isMe = user && u._id === user._id;

                    return (
                      <motion.div 
                        key={u._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                        className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors group ${isMe ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''}`}
                      >
                        <div className="col-span-2 sm:col-span-1 flex justify-center text-slate-500 font-mono font-bold text-sm">
                          {actualRank}
                        </div>
                        
                        <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                          <UserAvatar char={u.username?.charAt(0)} rank={actualRank} />
                          <div className="flex flex-col">
                            <span className={`font-bold text-base truncate max-w-[100px] sm:max-w-xs ${isMe ? 'text-indigo-400' : 'text-slate-200'}`}>
                              @{u.username}
                            </span>
                            {u.streak > 2 && (
                              <span className="text-[10px] text-orange-400 flex items-center gap-1 font-mono">
                                <Flame className="w-3 h-3" /> {u.streak} Streak
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="col-span-4 sm:col-span-4 flex justify-end items-center gap-4 pr-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 px-2 sm:px-3 py-1 rounded-full border border-emerald-500/20">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                            <span className="font-mono text-emerald-400 font-bold text-xs sm:text-sm">{u.xp || 0} XP</span>
                          </div>
                          <button onClick={() => {/* Navigate to profile in future phase */}} className="hidden md:flex items-center text-slate-500 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-cyan-500/10">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky Current User Panel (Footer) */}
      {user && activeStats && (
        <AnimatePresence>
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.5, bounce: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center"
          >
            <div className="pointer-events-auto bg-slate-900 border-t border-x border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-t-2xl px-6 py-4 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500 bg-slate-800 flex items-center justify-center font-bold text-xl text-indigo-100">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  {activeStats.rank <= 3 && (
                    <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1 border border-slate-900">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-slate-300 text-sm">Your Standing:</p>
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-white font-black text-xl">#{activeStats.rank}</h4>
                    <span className="text-emerald-400 font-mono text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> {activeStats.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress to next rank */}
              <div className="w-full md:w-1/3 flex flex-col gap-2">
                {activeStats.rank === 1 ? (
                  <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-xl justify-center font-bold text-sm border border-yellow-400/20">
                    <Crown className="w-4 h-4" /> Unstoppable Champion
                  </div>
                ) : activeStats.gapToNext !== null ? (
                  <>
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Next Rank in {activeStats.gapToNext} XP</span>
                      <span className="flex items-center text-indigo-400"><TrendingUp className="w-3 h-3 mr-1" /> Climb</span>
                    </div>
                    {/* Progress Bar Logic based on an assumed tier threshold or simple relative gap */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(10, ((activeStats.xp / activeStats.nextRankXp) * 100)))}%` }} 
                        transition={{ duration: 1, delay: 1 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full relative"
                      >
                         <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm font-mono text-slate-400 text-center border border-slate-700 border-dashed rounded-lg py-2">
                    Complete quizzes to get ranked!
                  </div>
                )}
              </div>
              
            </div>
            {/* Shimmer keyframes injected inline for minimal CSS dependency */}
            <style>{`
              @keyframes shimmer {
                100% { transform: translateX(100%); }
                0% { transform: translateX(-100%); }
              }
            `}</style>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Leaderboard;
