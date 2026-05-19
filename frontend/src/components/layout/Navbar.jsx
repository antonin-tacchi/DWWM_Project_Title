import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import Logo3D from '../ui/Logo3D';

/* ─── Icons ──────────────────────────────────────────────────── */
const HamburgerDesktop = () => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
    <rect y="0"    width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="7.75" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="15.5" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
  </svg>
);

/* Mobile hamburger — thick golden pills like the mockup */
const HamburgerMobile = () => (
  <div className="flex flex-col gap-[5px]">
    {[0, 1, 2].map((i) => (
      <div key={i} className="w-9 h-[10px] bg-clap-gold rounded-full" />
    ))}
  </div>
);

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="9.5" cy="9.5" r="7.5" stroke="#C9A96E" strokeWidth="2" />
    <path d="M15 15L20.5 20.5" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
    <path d="M10 0C10 0 2 4.5 2 12V18H18V12C18 4.5 10 0 10 0Z" fill="#C9A96E" />
    <rect x="7.5" y="18" width="5" height="3" rx="1.5" fill="#C9A96E" />
    <circle cx="10" cy="1.5" r="1.5" fill="#C9A96E" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M6 18L18 6" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── Nav links ──────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/',          label: 'HOME' },
  { to: '/catalogue', label: 'MOVIES' },
  { to: '/catalogue', label: 'SERIES' },
  { to: '/discover',  label: 'DISCOVER' },
  { to: '/',          label: 'COMMUNITY' },
  { to: '/',          label: 'ABOUT' },
];

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};

const linkVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

/* ─── Component ──────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-clap-bg/90 backdrop-blur-sm">
        <div className="flex items-center h-16 px-4 md:px-5">

          {/* Logo 3D — all screens */}
          <Link to="/" className="flex-shrink-0">
            <Logo3D />
          </Link>

          {/* ── DESKTOP layout ── */}
          {/* Hamburger (desktop, left of search) */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className="hidden md:flex items-center ml-4 flex-shrink-0"
          >
            <HamburgerDesktop />
          </motion.button>

          {/* Search bar (desktop center) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="relative w-full max-w-md group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Rechercher films, séries, acteurs…"
                className="w-full bg-clap-card border border-clap-muted/50 rounded-full py-2 pl-11 pr-4 text-sm text-clap-light placeholder-clap-gray outline-none transition-all duration-300 focus:border-clap-gold focus:ring-1 focus:ring-clap-gold/40"
              />
            </div>
          </div>

          {/* Bell + Avatar (desktop right) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <BellIcon />
              </motion.button>
            )}
            {isAuthenticated ? (
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  className="w-9 h-9 rounded-full bg-clap-muted border-2 border-clap-gold overflow-hidden flex items-center justify-center"
                >
                  <span className="text-clap-gold font-display text-sm font-bold">
                    {user?.username?.[0]?.toUpperCase() ?? 'U'}
                  </span>
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-clap-light hover:text-clap-gold transition-colors text-sm">Login</Link>
                <Link to="/register" className="btn-gold text-sm py-1 px-4">Register</Link>
              </div>
            )}
          </div>

          {/* ── MOBILE layout ── */}
          {/* Spacer pushes hamburger to the right */}
          <div className="flex-1 md:hidden" />

          {/* Mobile hamburger — right side */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center"
          >
            <HamburgerMobile />
          </motion.button>
        </div>
      </nav>

      {/* ── Full-screen menu overlay (all screens) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[100] bg-clap-bg/96 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-6"
            >
              <CloseIcon />
            </motion.button>

            <nav className="flex flex-col items-center gap-7">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl md:text-5xl text-clap-light hover:text-clap-gold transition-colors duration-200 tracking-[0.15em]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.55 } }}
              className="absolute bottom-10 flex gap-8 text-clap-gray text-sm tracking-widest"
            >
              {isAuthenticated ? (
                <button onClick={handleLogout} className="hover:text-clap-red transition-colors uppercase">Logout</button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="hover:text-clap-gold transition-colors uppercase">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-clap-gold transition-colors uppercase">Register</Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
