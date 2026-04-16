import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Heart, Share2, Terminal, Cpu, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [snippetLiked, setSnippetLiked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Auto-like animation trigger when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('snippet-section');
      if (section && !snippetLiked) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setTimeout(() => {
            setSnippetLiked(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
          }, 1500); // delay for cursor animation
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [snippetLiked]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 items-center w-full z-10">
          <div className="space-y-8">
            {/* Gamified Element: XP Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-sm font-mono"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Level 1 Developer</span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                />
              </div>
              <span className="text-emerald-400 font-bold">50 XP</span>
            </motion.div>

            {/* Typewriter Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-6">
              Level Up Your Syntax.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                <TypewriterText text="Share Your Flow." />
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-lg">
              The hybrid arena where top-tier developers test their knowledge and share stunning code snippets in real-time.
            </p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg rounded-xl flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              Start Coding <ChevronRight className="w-5 h-5 border-2 border-slate-950 rounded-full p-0.5" />
            </motion.button>
          </div>

          {/* Floating Floating VS Code Window */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-2xl opacity-20" />
            <div className="relative bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-slate-500 text-xs">mastery.js</span>
              </div>
              <div className="p-6 text-slate-300">
                <div className="mb-2"><span className="text-purple-400">function</span> <span className="text-blue-400">masterSyntax</span>() {'{'}</div>
                <div className="pl-4 text-slate-400 mb-2">
                  <span className="text-purple-400">const</span> status = <span className="text-green-400">"learning"</span>;
                </div>
                <div className="pl-4 mb-2">
                  <span className="text-cyan-400">if</span> (status === <span className="text-green-400">"learning"</span>) {'{'}
                </div>
                <div className="pl-8 text-slate-400 mb-2">
                   <span className="text-blue-400">return</span> <span className="text-yellow-300">levelUp</span>();
                </div>
                <div className="pl-4 mb-2">{'}'}</div>
                <div>{'}'}</div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-cyan-400 inline-block mt-1 align-middle"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ANIMATED SNIPPET SHARING SECTION */}
      <section id="snippet-section" className="py-24 px-6 lg:px-12 bg-slate-900/50 relative border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          
          <div className="order-2 lg:order-1 relative h-96 flex items-center justify-center">
            {/* Mock Cursor Animation */}
            {/* The cursor targets the like button which is positioned at bottom right of the card */}
            <motion.div 
              initial={{ x: -150, y: 150, opacity: 0 }}
              whileInView={{ x: 130, y: 70, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute z-50 pointer-events-none drop-shadow-2xl"
              style={{ display: snippetLiked ? 'none' : 'block' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5" className="transform -rotate-12 drop-shadow-md">
                <path d="M4 4l16 5.333-7.556 2.222L10.222 19 4 4z" />
              </svg>
            </motion.div>

            {/* Snippet Card */}
            <div className="w-full max-w-md bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700 p-1 shadow-2xl relative">
              <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm relative h-48">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                    <span className="text-slate-200 font-sans font-medium">@cyber_dev</span>
                  </div>
                  <Share2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="mb-6 space-y-2 text-[15px]">
                  <div>
                    <span className="text-pink-400">const</span>{' '}
                    <span className="text-blue-400">epicAnimation</span> = <span className="text-yellow-300">useMotion</span>();
                  </div>
                  <div className="text-slate-500 italic">// Built for Syntax|Flow 🚀</div>
                </div>
                
                {/* Like Button */}
                <div className="flex justify-end mt-4 absolute bottom-4 right-4">
                  <motion.button 
                    animate={snippetLiked ? { scale: [1, 1.5, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`p-3 rounded-full backdrop-blur-md ${snippetLiked ? 'bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-slate-800 border border-slate-700'}`}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${snippetLiked ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 bg-slate-800 border border-emerald-500/30 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_25px_rgba(52,211,153,0.3)] z-50 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium text-slate-200">
                    <span className="text-emerald-400 font-bold">+5</span> Network XP
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Instagram for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Developers</span>.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Share your most elegant algorithms, discover mind-blowing one-liners, and build your reputation. Every like, share, and fork levels up your profile.
            </p>
            <ul className="space-y-4 font-mono text-sm text-slate-300 mt-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
              <li className="flex items-center gap-3"><Code2 className="w-5 h-5 text-cyan-400"/> Interactive syntax highlighting</li>
              <li className="flex items-center gap-3"><Terminal className="w-5 h-5 text-purple-400"/> Fork and execute directly</li>
              <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-emerald-400"/> Earn XP for community contributions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. GAMIFIED QUIZ SECTION */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">The Challenge <span className="text-cyan-400">Arena</span></h2>
          <p className="text-slate-400 text-lg">Test your skills in real-time battles. Choose your difficulty.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Easy Card */}
          <motion.div 
            whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
            className="group relative bg-[#0f172a] rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            style={{ perspective: 1000 }}
            onClick={() => navigate('/quiz')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Code2 className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">EASY</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10 group-hover:text-emerald-300 transition-colors">Python Basics</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10 h-10">Master loops, lists, and dicts. Perfect warm-up for the daily grind.</p>
            <div className="text-sm font-mono text-emerald-400/80 relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
              <span>+100 XP Potential</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* Medium Card */}
          <motion.div 
            whileHover={{ scale: 1.05, rotateY: 0, rotateX: 5 }}
            className="group relative bg-[#0f172a] rounded-2xl p-8 border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            onClick={() => navigate('/quiz')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <Cpu className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-full">MEDIUM</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10 group-hover:text-yellow-300 transition-colors">React Hooks</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10 h-10">State, Effects, Refs. Prove your component lifecycle mastery.</p>
            <div className="text-sm font-mono text-yellow-500/80 relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
              <span>+250 XP Potential</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* Hard Card */}
          <motion.div 
            whileHover={{ scale: 1.05, rotateY: -5, rotateX: 5 }}
            className="group relative bg-[#0f172a] rounded-2xl p-8 border border-slate-800 hover:border-red-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
            onClick={() => navigate('/quiz')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <Terminal className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">HARD</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white relative z-10 group-hover:text-red-300 transition-colors">Algo Mastery</h3>
            <p className="text-slate-400 text-sm mb-6 relative z-10 h-10">Graphs, Trees, Dynamic Programming. Only the elite survive.</p>
            <div className="text-sm font-mono text-red-400/80 relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
              <span>+500 XP Potential</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="relative py-32 flex flex-col items-center justify-center text-center px-6 border-t border-slate-800/50 overflow-hidden mt-12 bg-slate-950/50">
        {/* Background glow for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-64 bg-cyan-900/20 blur-[100px] rounded-full pointer-events-none" />
        
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 z-10 tracking-tight">Ready to write history?</h2>
        
        <motion.button
          onClick={() => navigate('/register')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.2)", 
              "0 0 60px rgba(6, 182, 212, 0.6)", 
              "0 0 20px rgba(6, 182, 212, 0.2)"
            ] 
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 px-12 py-5 bg-slate-950 border-2 border-cyan-400 text-cyan-400 font-bold text-xl uppercase tracking-widest rounded-xl overflow-hidden group hover:text-white transition-colors duration-300"
        >
          <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-[-1]" />
          Enter The Arena
        </motion.button>
      </section>

    </div>
  );
};

export default Home;
