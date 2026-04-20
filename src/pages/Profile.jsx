import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { } from 'framer-motion';
import { 
  ArrowLeft, Terminal, Trophy, Star, Target, Zap, 
  Flame, Award, Code2, Database, Layout, Server, 
  Activity, Calendar, Loader2
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import CreateChallengeModal from '../components/CreateChallengeModal';

const Profile = () => {
  const { id } = useParams();
  const { user: authUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  const isOwnProfile = !id || (authUser && id === authUser._id);

  const IconMap = {
    Flame,
    Target,
    Trophy,
    Award,
    Star,
    Zap,
    Code2,
    Database,
    Layout,
    Server,
    Activity,
    Calendar
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (isOwnProfile && authUser) {
          const res = await api.get('/api/auth/me');
          setProfileUser(res.data);
        } else if (id) {
          const res = await api.get(`/api/users/${id}`);
          setProfileUser(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Could not load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, authUser, isOwnProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
          <p className="text-red-400 mb-4">{error || 'User not found'}</p>
          <button onClick={() => navigate('/leaderboard')} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
            Return to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  // Derived stats
  const level = Math.floor((profileUser.xp || 0) / 100) + 1;
  const isTopRanked = profileUser.rank && profileUser.rank <= 10;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Nav Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Identity & Core Stats */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden text-center shadow-xl"
            >
              {isTopRanked && (
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600" />
              )}
              
              <div className="relative inline-block mb-6">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 mx-auto shadow-2xl z-10 relative bg-slate-800 ${isTopRanked ? 'border-yellow-500 text-yellow-400' : 'border-indigo-500 text-indigo-400'}`}>
                  {profileUser.name?.charAt(0).toUpperCase() || profileUser.username?.charAt(0).toUpperCase() || '?'}
                </div>
                {isTopRanked && (
                  <div className="absolute -top-4 -right-4 bg-yellow-500/20 p-2 rounded-full border border-yellow-500/50 backdrop-blur-sm z-20">
                    <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-md" />
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-black text-white mb-1">
                {profileUser.name || profileUser.username}
              </h1>
              <p className="text-indigo-400 font-mono mb-4">@{profileUser.username}</p>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {profileUser.bio || "SyntaxFlow challenger carving their path to the top of the leaderboard."}
              </p>

              <div className="flex justify-center gap-3">
                {isOwnProfile ? (
                  <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 flex-1">
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsChallengeModalOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex-1 flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" /> Challenge
                  </button>
                )}
              </div>
            </motion.div>

            {/* Core Metrics Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <Star className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase tracking-wider font-bold">Total XP</span>
                </div>
                <div className="text-3xl font-black text-white">{profileUser.xp || 0}</div>
                <div className="text-xs text-emerald-400 font-mono mt-1 w-full bg-slate-800 rounded-full overflow-hidden h-1.5 flex">
                  <div className="bg-emerald-400 h-full" style={{ width: `${((profileUser.xp || 0) % 100)}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs uppercase tracking-wider font-bold">Level</span>
                </div>
                <div className="text-3xl font-black text-white">{level}</div>
                <div className="text-xs text-cyan-400 font-mono mt-1">Mastery Rank</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-xs uppercase tracking-wider font-bold">Accuracy</span>
                </div>
                <div className="text-3xl font-black text-white">{profileUser.avgAccuracy || 0}%</div>
                <div className="text-xs text-slate-500 font-mono mt-1">Lifetime Average</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-slate-400">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs uppercase tracking-wider font-bold">Streak</span>
                </div>
                <div className="text-3xl font-black text-white">{profileUser.streak || 0}</div>
                <div className="text-xs text-orange-400 font-mono mt-1">Current Active</div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Graphs, Badges, History */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Skill Graph & Badges Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Skill Radar Chart */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6 text-white">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold">Skill Distribution</h3>
                </div>
                <div className="flex-grow min-h-[220px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profileUser.skillData || []}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Skills"
                        dataKey="A"
                        stroke="#818cf8"
                        strokeWidth={2}
                        fill="#6366f1"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Achievements & Badges */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-6 text-white">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold">Achievements</h3>
                </div>
                <div className="space-y-4">
                  {(profileUser.badges || []).map(badge => {
                    const BadgeIcon = IconMap[badge.icon] || Award;
                    return (
                    <div key={badge.id} className="flex items-center gap-4 bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
                      <div className={`p-3 rounded-xl ${badge.bg}`}>
                        <BadgeIcon className={`w-6 h-6 ${badge.color}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide">{badge.title}</h4>
                        <p className="text-xs text-slate-400 font-mono">{badge.desc}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </motion.div>

            </div>

            {/* Recent Activity Timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold">Combat History</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider font-bold">Total Quizzes: {profileUser.totalQuizzes || 0}</span>
              </div>

              <div className="space-y-4">
                {(profileUser.recentActivity || []).map((act) => (
                  <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800 gap-4 group hover:border-slate-600 transition-colors">
                    
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${act.result === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {act.type === 'quiz' ? <Code2 className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-200">{act.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-mono">
                          <span className={`${act.result === 'Passed' ? 'text-emerald-400' : 'text-red-400'}`}>{act.result}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{act.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                      <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 w-fit">
                        <Star className={`w-3 h-3 ${act.result === 'Passed' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="font-mono text-sm font-bold text-slate-300">{act.xp} XP</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono hidden sm:block">Accuracy: {act.accuracy}</span>
                    </div>

                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 border border-slate-800 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest font-mono">
                View Full History
              </button>
            </motion.div>

          </div>
        </div>
      </div>
      
      {/* Challenge Modal */}
      <CreateChallengeModal 
        isOpen={isChallengeModalOpen} 
        onClose={() => setIsChallengeModalOpen(false)} 
        targetUser={profileUser}
      />
    </div>
  );
};

export default Profile;
