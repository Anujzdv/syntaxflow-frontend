import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, Mail, ChevronRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      if (login) await login(email.trim(), password);
      navigate('/feed');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.msg || 
        'Invalid email or password. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0f172a] rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-center text-slate-400 mb-8 font-mono text-sm">Sign in to resume challenges and climb rankings.</p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-950/40 border border-red-500/50 rounded-2xl text-red-200 text-sm flex items-start gap-3"
          >
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-sans text-sm"
                placeholder="••••••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }} 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 ${
              loading 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold'
            } rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] mt-6 font-mono text-sm uppercase tracking-wide cursor-pointer`}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                Sign In <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            Register Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
