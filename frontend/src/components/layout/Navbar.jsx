import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import Logo3D from '../ui/Logo3D';
import api from '../../services/api';

/* ─── Icons ──────────────────────────────────────────────────── */
const HamburgerDesktop = () => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
    <rect y="0"    width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="7.75" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="15.5" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
  </svg>
);

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

/* ─── Helpers ─────────────────────────────────────────────────── */
const IMG_BASE = 'https://image.tmdb.org/t/p/w92';

function StarRating({ score }) {
  const stars = Math.round((score / 10) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 1l1.1 2.2L8.5 3.6 6.75 5.3l.4 2.2L5 6.4l-2.15 1.1.4-2.2L1.5 3.6l2.4-.4z"
            fill={i < stars ? '#C9A96E' : '#3a3a3a'}
          />
        </svg>
      ))}
    </div>
  );
}

/* ─── NavSearch ───────────────────────────────────────────────── */
function NavSearch({ inputClassName = '', onClose }) {
  const [query, setQuery]           = useState('');
  const [debounced, setDebounced]   = useState('');
  const [open, setOpen]             = useState(false);
  const wrapperRef                  = useRef(null);
  const navigate                    = useNavigate();

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  /* open dropdown when results arrive */
  useEffect(() => {
    setOpen(debounced.trim().length >= 2);
  }, [debounced]);

  /* close on outside click */
  useEffect(() => {
    function handler(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data } = useQuery({
    queryKey: ['navbar-search', debounced],
    queryFn:  () =>
      api.get('/movies/search', { params: { query: debounced, page: 1 } }).then((r) => r.data),
    enabled: debounced.trim().length >= 2,
    staleTime: 30_000,
  });

  const results = (data?.results ?? []).slice(0, 6);

  function handleSelect(item) {
    const type = item.media_type === 'tv' ? 'serie' : 'film';
    navigate(`/${type}/${item.id}`);
    setQuery('');
    setOpen(false);
    onClose?.();
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <SearchIcon />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => debounced.trim().length >= 2 && setOpen(true)}
        placeholder="Rechercher films, séries, acteurs…"
        className={`w-full bg-clap-card border border-clap-muted/50 rounded-full py-2 pl-11 pr-4 text-sm text-clap-light placeholder-clap-gray outline-none transition-all duration-300 focus:border-clap-gold focus:ring-1 focus:ring-clap-gold/40 ${inputClassName}`}
      />

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] bg-clap-card border border-clap-muted/40 rounded-2xl shadow-2xl overflow-hidden z-[200]"
          >
            <div className="grid grid-cols-3 gap-0 divide-x divide-clap-muted/20">
              {results.map((item) => {
                const title    = item.title ?? item.name ?? 'Sans titre';
                const type     = item.media_type === 'tv' ? 'tv' : 'movie';
                const score    = item.vote_average ?? 0;
                const year     = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="flex flex-col items-center gap-2 p-3 hover:bg-clap-muted/30 transition-colors text-center group"
                  >
                    {/* Poster */}
                    <div className="w-16 h-24 rounded-lg overflow-hidden bg-clap-muted flex-shrink-0">
                      {item.poster_path ? (
                        <img
                          src={`${IMG_BASE}${item.poster_path}`}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-clap-gray text-xs">
                          N/A
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="w-full">
                      <p className="text-clap-light text-xs font-semibold leading-tight line-clamp-2 mb-1">
                        {title}
                      </p>
                      {year && (
                        <p className="text-clap-gray text-[10px] mb-1">{year}</p>
                      )}
                      <div className="flex justify-center">
                        <StarRating score={score} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer link */}
            <div className="border-t border-clap-muted/20 px-4 py-2 text-center">
              <button
                onClick={() => {
                  navigate(`/catalogue?q=${encodeURIComponent(query)}`);
                  setQuery('');
                  setOpen(false);
                  onClose?.();
                }}
                className="text-clap-gold text-xs hover:text-white transition-colors"
              >
                Voir tous les résultats pour « {query} » →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { isAuthenticated, user, logout }       = useAuthStore();
  const navigate                                = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setMobileSearchOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-clap-bg/90 backdrop-blur-sm">
        <div className="flex items-center h-16 px-4 md:px-5">

          {/* Logo — all screens */}
          <Link to="/" className="flex-shrink-0">
            <Logo3D />
          </Link>

          {/* ── DESKTOP layout ── */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className="hidden md:flex items-center ml-4 flex-shrink-0"
          >
            <HamburgerDesktop />
          </motion.button>

          {/* Search bar with autocomplete (desktop center) */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-md">
              <NavSearch />
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
                <Link to="/login"    className="text-clap-light hover:text-clap-gold transition-colors text-sm">Login</Link>
                <Link to="/register" className="btn-gold text-sm py-1 px-4">Register</Link>
              </div>
            )}
          </div>

          {/* ── MOBILE layout ── */}
          <div className="flex-1 md:hidden" />

          {/* Mobile search icon */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="md:hidden flex items-center mr-4"
            aria-label="Rechercher"
          >
            <SearchIcon />
          </motion.button>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center"
          >
            <HamburgerMobile />
          </motion.button>
        </div>

        {/* Mobile slide-down search bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-visible px-4 pb-3 bg-clap-bg/95"
            >
              <NavSearch onClose={() => setMobileSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Full-screen menu overlay ── */}
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
