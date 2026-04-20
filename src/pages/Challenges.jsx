import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Check, X, Shield, History, Loader2, ArrowRight } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useNavigate } from 'react-router-dom';

const Challenges = () => {
  const { incoming, outgoing, history, loading, fetchChallenges, respondToChallenge } = useChallenges();
  const [activeTab, setActiveTab] = useState('incoming');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleRespond = async (id, status) => {
    try {
      await respondToChallenge(id, status);
      // You could add a toast notification here
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Swords className="w-8 h-8 text-indigo-400" />
              Challenge Arena
            </h1>
            <p className="text-slate-400 mt-2 font-mono">Face off against your peers.</p>
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-lg w-full md:w-auto overflow-x-auto">
          {['incoming', 'outgoing', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none uppercase tracking-widest text-xs font-bold px-6 py-3 rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-slate-800 text-indigo-400 shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab} 
              {tab === 'incoming' && incoming.length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {incoming.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[400px]">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                
                {/* Incoming Tab */}
                {activeTab === 'incoming' && (
                  incoming.length === 0 ? (
                    <EmptyState icon={Shield} text="No pending challenges. You are safe... for now." />
                  ) : (
                    incoming.map(c => (
                      <ChallengeCard 
                        key={c._id} 
                        challenge={c} 
                        user={c.challenger} 
                        isIncoming={true}
                        onAccept={() => handleRespond(c._id, 'accepted')}
                        onDecline={() => handleRespond(c._id, 'declined')}
                        navigate={navigate}
                      />
                    ))
                  )
                )}

                {/* Outgoing Tab */}
                {activeTab === 'outgoing' && (
                  outgoing.length === 0 ? (
                    <EmptyState icon={Swords} text="You haven't challenged anyone recently." />
                  ) : (
                    outgoing.map(c => (
                      <ChallengeCard 
                        key={c._id} 
                        challenge={c} 
                        user={c.targetUser} 
                        isIncoming={false} 
                        navigate={navigate}
                      />
                    ))
                  )
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  history.length === 0 ? (
                    <EmptyState icon={History} text="No challenge history found." />
                  ) : (
                    history.map(c => (
                      <HistoryCard key={c._id} challenge={c} />
                    ))
                  )
                )}

              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

// UI sub-components
const EmptyState = ({ icon: Icon, text }) => (
  <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
    <Icon className="w-16 h-16 text-slate-500 mb-4" />
    <p className="text-sm font-mono text-slate-400">{text}</p>
  </div>
);

const ChallengeCard = ({ challenge, user, isIncoming, onAccept, onDecline, navigate }) => (
  <div className="group flex flex-col md:flex-row md:items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800 gap-4 transition-colors hover:border-slate-700">
    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
        <img src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
          {isIncoming ? `Challenged by ${user.name}` : `Challenging ${user.name}`}
        </h3>
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
          {challenge.topic} • {challenge.difficulty}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-2 md:mt-0">
      {isIncoming ? (
        <>
          <button 
            onClick={onDecline}
            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow border border-red-500/20"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={onAccept}
            className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white rounded-xl font-bold uppercase tracking-wide text-xs flex items-center gap-2 transition-all shadow"
          >
            <Check className="w-4 h-4" /> Accept
          </button>
        </>
      ) : (
        <span className="px-4 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-2">
          Waiting <Loader2 className="w-3 h-3 animate-spin" />
        </span>
      )}
    </div>
  </div>
);

const HistoryCard = ({ challenge }) => {
  const isAccepted = challenge.status === 'accepted';
  const isCompleted = challenge.status === 'completed';
  const statusColor = 
    isAccepted ? 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' :
    isCompleted ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
    'text-red-400 border-red-500/20 bg-red-500/10';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-950/50 p-4 rounded-2xl border border-slate-800 gap-4">
      <div className="flex items-center gap-3">
        <Swords className="w-5 h-5 text-slate-500" />
        <div>
          <h3 className="text-base font-bold text-slate-200">
            {challenge.challenger.name} <span className="text-slate-500 font-mono text-sm mx-1">vs</span> {challenge.targetUser.name}
          </h3>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            {challenge.topic} • {challenge.difficulty}
          </p>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColor}`}>
        {challenge.status}
      </div>
    </div>
  );
};

export default Challenges;
