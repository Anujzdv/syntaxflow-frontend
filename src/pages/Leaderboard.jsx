import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/auth/leaderboard');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />;
      case 1: return <Medal className="w-6 h-6 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.8)]" />;
      default: return <span className="text-slate-500 font-mono w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 max-w-4xl mx-auto relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex justify-center items-center p-4 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
          <Trophy className="w-12 h-12 text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600 mb-4">Leaderboard</h1>
        <p className="text-slate-400 font-mono">The highest ranking users in the Syntax|Flow network.</p>
      </motion.div>

      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-slate-500 text-xs font-mono uppercase tracking-widest font-bold">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">Username</div>
          <div className="col-span-3 text-right pr-4">Total XP</div>
        </div>
        
        <div className="divide-y divide-slate-800/50">
          {users.map((user, index) => (
            <motion.div 
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
              className={`grid grid-cols-12 gap-4 p-5 items-center transition-colors ${index === 0 ? 'bg-yellow-500/5' : ''}`}
            >
              <div className="col-span-2 flex justify-center">{getRankIcon(index)}</div>
              <div className="col-span-7 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <UserAvatar char={user.username?.charAt(0)} isTop={index === 0} />
                </div>
                <span className={`font-bold text-lg ${index === 0 ? 'text-yellow-400' : 'text-slate-200'}`}>
                  @{user.username}
                </span>
              </div>
              <div className="col-span-3 text-right pr-4">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-emerald-400 font-bold">{user.xp || 0} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
          {users.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-mono">No data available in network.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserAvatar = ({ char, isTop }) => (
  <span className={`font-mono font-bold ${isTop ? 'text-yellow-400' : 'text-slate-400'}`}>
    {char?.toUpperCase() || '?'}
  </span>
);

export default Leaderboard;
