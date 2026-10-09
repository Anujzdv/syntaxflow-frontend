import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Terminal, Lock, Mail, User, ChevronRight, 
  Eye, EyeOff, Check, X, ShieldAlert, ShieldCheck 
} from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  // Password Strength Evaluation
  const strengthChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (strengthChecks.length) score += 1;
    if (strengthChecks.hasLower && strengthChecks.hasUpper) score += 1;
    if (strengthChecks.hasNumber) score += 1;
    if (strengthChecks.hasSpecial) score += 1;
    return score;
  }, [password, strengthChecks]);

  const strengthInfo = useMemo(() => {
    switch (strengthScore) {
      case 0:
        return { label: 'Empty', color: 'bg-slate-700', text: 'text-slate-500', width: 'w-0' };
      case 1:
        return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400', width: 'w-1/4' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400', width: 'w-2/4' };
      case 3:
        return { label: 'Good', color: 'bg-cyan-500', text: 'text-cyan-400', width: 'w-3/4' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400', width: 'w-full' };
      default:
        return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400', width: 'w-1/4' };
    }
  }, [strengthScore]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation Rules
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (register) await register(name.trim(), email.trim(), password);
      navigate('/feed');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.msg || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] py-12 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#0f172a] rounded-3xl border border-slate-800 p-8 sm:p-10 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Terminal className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Create Account</h2>
        <p className="text-center text-slate-400 mb-8 font-mono text-sm">Join the real-time competitive developer arena.</p>
        
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans text-sm"
                placeholder="Ada Lovelace"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans text-sm"
                placeholder="dev@syntaxflow.io"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Password</label>
              {password && (
                <span className={`text-xs font-mono font-bold ${strengthInfo.text}`}>
                  {strengthInfo.label}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans text-sm"
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

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-2.5 space-y-2">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${strengthInfo.color} ${strengthInfo.width} transition-all duration-300`} />
                </div>
                
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-mono">
                  <div className={`flex items-center gap-1.5 ${strengthChecks.length ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {strengthChecks.length ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthChecks.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {strengthChecks.hasNumber ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthChecks.hasUpper && strengthChecks.hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {strengthChecks.hasUpper && strengthChecks.hasLower ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>Upper & lowercase</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${strengthChecks.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {strengthChecks.hasSpecial ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>Special symbol (!@#)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-slate-900/90 border ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' 
                    : confirmPassword && passwordsMatch 
                      ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500' 
                      : 'border-slate-700/80 focus:border-purple-500 focus:ring-purple-500'
                } text-slate-200 rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:ring-1 transition-all font-sans text-sm`}
                placeholder="••••••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-[11px] font-mono text-red-400 mt-1 flex items-center gap-1">
                <X className="w-3 h-3" /> Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }} 
            type="submit" 
            disabled={loading}
            className={`w-full py-3.5 ${
              loading 
                ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            } font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] mt-6 font-mono text-sm uppercase tracking-wide cursor-pointer`}
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                Create Account <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
