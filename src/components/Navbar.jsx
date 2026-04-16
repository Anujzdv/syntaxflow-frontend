import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, User, LogOut, Zap, Trophy, LayoutDashboard, Menu, X } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const NavLinks = ({ mobile }) => {
    if (user || localStorage.getItem('token')) {
      return (
        <>
          <Link to="/feed" onClick={closeMenu} className={`flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium ${mobile ? 'py-3 border-b border-slate-800' : ''}`}>
            <LayoutDashboard className="w-4 h-4" /> Feed
          </Link>
          <Link to="/quiz" onClick={closeMenu} className={`flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium ${mobile ? 'py-3 border-b border-slate-800' : ''}`}>
            <Zap className="w-4 h-4" /> Quizzes
          </Link>
          <Link to="/leaderboard" onClick={closeMenu} className={`flex items-center gap-2 text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium ${mobile ? 'py-3 border-b border-slate-800' : ''}`}>
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          {!mobile && <div className="w-px h-6 bg-slate-800 mx-2"></div>}
          <Link to="/profile" onClick={closeMenu} className={`flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors text-sm font-medium ${mobile ? 'py-3 border-b border-slate-800' : ''}`}>
            <User className="w-4 h-4" /> Profile
          </Link>
          <motion.button 
            whileHover={{ scale: mobile ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            className={`flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all ${mobile ? 'mt-4 py-3' : ''}`}
          >
            <LogOut className="w-4 h-4" /> Logout
          </motion.button>
        </>
      );
    }
    return (
      <>
        <Link to="/login" onClick={closeMenu} className={`text-slate-300 hover:text-white transition-colors text-sm font-medium ${mobile ? 'py-3 border-b border-slate-800 text-center w-full block' : ''}`}>Login</Link>
        <Link to="/register" onClick={closeMenu} className={mobile ? 'w-full block mt-4' : ''}>
          <motion.button 
            whileHover={{ scale: mobile ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow ${mobile ? 'w-full py-3' : ''}`}
          >
            Register
          </motion.button>
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group z-50">
            <Terminal className="w-8 h-8 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
            <span className="font-bold text-xl tracking-tighter text-white">
              Syntax<span className="text-cyan-500 group-hover:text-cyan-400 transition-colors">|</span>Flow
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks mobile={false} />
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white z-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 px-4 overflow-hidden absolute w-full"
          >
            <div className="flex flex-col py-6">
              <NavLinks mobile={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
