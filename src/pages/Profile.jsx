import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Medal, Star, Cpu, Terminal, ArrowLeft } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSnippets: 0, totalLikes: 0 });

  useEffect(() => {
    // Optionally fetch more detailed user stats here if the API provides it
  }, [user]);

  if (!user) return <div className="text-center mt-20 font-mono text-cyan-400">Loading Profile Data...</div>;

  return (
    <div className="min-h-[85vh] bg-slate-950 py-12 px-4 flex flex-col items-center relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8 font-mono text-sm group">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0f172a] rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-purple-500 to-cyan-500" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Terminal className="w-16 h-16 text-cyan-500" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-xs font-bold text-purple-400 font-mono uppercase tracking-widest">Active User</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">@{user.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-mono text-sm mb-8">
                <Mail className="w-4 h-4" /> {user.email}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 flex flex-col items-center justify-center">
                  <Star className="w-6 h-6 text-emerald-400 mb-2" />
                  <span className="text-2xl font-bold text-white">{user.xp || 0}</span>
                  <span className="text-xs text-slate-500 font-mono uppercase mt-1">Total XP</span>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/50 flex flex-col items-center justify-center">
                  <Medal className="w-6 h-6 text-yellow-400 mb-2" />
                  <span className="text-2xl font-bold text-white">Lvl {Math.floor((user.xp || 0) / 100) + 1}</span>
                  <span className="text-xs text-slate-500 font-mono uppercase mt-1">Rank</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Profile;
