import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-clap-bg/90 backdrop-blur-sm border-b border-clap-muted/30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="font-display text-2xl text-clap-gold font-bold tracking-wider">
          Clap!
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/"          className="text-clap-light hover:text-clap-gold transition-colors">Home</Link>
          <Link to="/catalogue" className="text-clap-light hover:text-clap-gold transition-colors">Catalog</Link>
          <Link to="/discover"  className="text-clap-light hover:text-clap-gold transition-colors">Discover</Link>
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-clap-light hover:text-clap-gold transition-colors text-sm">
                {user?.username}
              </Link>
              <button onClick={handleLogout} className="btn-outline text-sm py-1">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-clap-light hover:text-clap-gold transition-colors">Login</Link>
              <Link to="/register" className="btn-gold text-sm py-1">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-clap-light hover:text-clap-gold transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-clap-dark border-t border-clap-muted/30 px-4 py-4 flex flex-col gap-4"
          >
            <Link to="/"          onClick={() => setMenuOpen(false)} className="text-clap-light hover:text-clap-gold">Home</Link>
            <Link to="/catalogue" onClick={() => setMenuOpen(false)} className="text-clap-light hover:text-clap-gold">Catalog</Link>
            <Link to="/discover"  onClick={() => setMenuOpen(false)} className="text-clap-light hover:text-clap-gold">Discover</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-clap-light hover:text-clap-gold">Profile</Link>
                <button onClick={handleLogout} className="text-left text-clap-red">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="text-clap-light hover:text-clap-gold">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-clap-gold">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}