import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import { useNotifications, titleFromType } from '../../hooks/useNotifications';
import { NOTIF_TYPES } from '../ui/NotificationToast';
import Logo3D from '../ui/Logo3D';
import api from '../../services/api';

/* ─── Icons ──────────────────────────────────────────────────── */
const HamburgerDesktop = () => (
  <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden="true">
    <rect y="0"    width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="7.75" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
    <rect y="15.5" width="26" height="2.5" rx="1.25" fill="#C9A96E" />
  </svg>
);

const HamburgerMobile = () => (
  <div className="flex flex-col gap-[5px]" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <div key={i} className="w-9 h-[10px] bg-clap-gold rounded-full" />
    ))}
  </div>
);

const SearchIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="9.5" cy="9.5" r="7.5" stroke="#C9A96E" strokeWidth="2" />
    <path d="M15 15L20.5 20.5" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg aria-hidden="true" width="20" height="24" viewBox="0 0 20 24" fill="none">
    <path d="M10 0C10 0 2 4.5 2 12V18H18V12C18 4.5 10 0 10 0Z" fill="#C9A96E" />
    <rect x="7.5" y="18" width="5" height="3" rx="1.5" fill="#C9A96E" />
    <circle cx="10" cy="1.5" r="1.5" fill="#C9A96E" />
  </svg>
);

const HistoryIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v4h4" />
    <path d="M12 8v4l3 3" />
  </svg>
);

const CloseIcon = () => (
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M6 18L18 6" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ─── Helpers ─────────────────────────────────────────────────── */
const IMG_BASE = 'https://image.tmdb.org/t/p/w92';

function StarRating({ score }) {
  const stars = Math.round((score / 10) * 5);
  return (
    <div className="flex gap-0.5" aria-hidden="true">
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
  const { t }                        = useTranslation();
  const [query, setQuery]           = useState('');
  const [debounced, setDebounced]   = useState('');
  const [open, setOpen]             = useState(false);
  const wrapperRef                  = useRef(null);
  const navigate                    = useNavigate();

  /* debounce */
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(timer);
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
        placeholder={t('nav.search')}
        aria-label={t('nav.searchLabel')}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-clap-muted/20">
              {results.map((item) => {
                const title    = item.title ?? item.name ?? 'Sans titre';
                const type     = item.media_type === 'tv' ? 'tv' : 'movie';
                const score    = item.vote_average ?? 0;
                const year     = (item.release_date ?? item.first_air_date ?? '').slice(0, 4);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    aria-label={t('nav.searchResultLabel', { title })}
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
                type="button"
                onClick={() => {
                  navigate(`/catalogue?q=${encodeURIComponent(query)}`);
                  setQuery('');
                  setOpen(false);
                  onClose?.();
                }}
                className="text-clap-gold text-xs hover:text-white transition-colors"
              >
                {t('nav.seeAllResults', { query })}
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
  { to: '/',          key: 'home' },
  { to: '/catalogue', key: 'movies' },
  { to: '/catalogue', key: 'series' },
  { to: '/news',      key: 'news' },
  { to: '/discover',  key: 'discover' },
  { to: '/community', key: 'community' },
  { to: '/about',     key: 'about' },
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

/* ─── Bell panel ─────────────────────────────────────────────── */
function BellPanel() {
  const { t }                               = useTranslation();
  const { notifications, remove, clearAll } = useNotifications();

  /* date relative courte — traduite */
  function relativeTime(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return t('notifications.justNow');
    if (m < 60) return t('notifications.minutesAgo', { count: m });
    const h = Math.floor(m / 60);
    if (h < 24) return t('notifications.hoursAgo', { count: h });
    return t('notifications.daysAgo', { count: Math.floor(h / 24) });
  }

  return (
    <motion.div
      id="notifications-panel"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1     }}
      exit={{    opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-[calc(100%+10px)] w-80 max-w-[calc(100vw-16px)] rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(12,12,20,0.98)',
        backdropFilter: 'blur(28px)',
        border: '1px solid rgba(201,169,110,0.22)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
        zIndex: 200,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <span className="text-white text-sm font-semibold tracking-wide">{t('notifications.panelTitle')}</span>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-clap-gray text-xs hover:text-clap-gold transition-colors"
          >
            {t('notifications.clearAll')}
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-clap-gray">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="text-xs">{t('notifications.empty')}</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map((n) => {
              const cfg = NOTIF_TYPES[n.type] ?? NOTIF_TYPES.info;
              const title = t(`notifications.types.${n.type}`, { defaultValue: titleFromType(n.type) });
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
                  className="flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors"
                  style={{ background: n.isRead ? 'transparent' : `${cfg.color}08` }}
                >
                  {/* Dot coloré */}
                  <div
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: cfg.bg }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                  </div>

                  {/* Texte */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="text-white text-xs font-semibold leading-tight">{title}</p>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                      )}
                    </div>
                    {n.message && (
                      <p className="text-white/50 text-[11px] leading-snug mt-0.5 line-clamp-2">{n.message}</p>
                    )}
                    {n.createdAt && (
                      <p className="text-white/25 text-[10px] mt-1">{relativeTime(n.createdAt)}</p>
                    )}
                  </div>

                  {/* Supprimer */}
                  <button
                    onClick={() => remove(n.id)}
                    className="flex-shrink-0 text-white/20 hover:text-white/60 transition-colors mt-0.5"
                    aria-label={t('notifications.deleteItem', { title })}
                  >
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen,         setMenuOpen]         = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [bellOpen,         setBellOpen]         = useState(false);
  const bellRef                                 = useRef(null);
  const { isAuthenticated, user, logout }       = useAuthStore();
  const { unreadCount, markAllRead }            = useNotifications();
  const { t, i18n }                            = useTranslation();
  const navigate                                = useNavigate();
  const queryClient                             = useQueryClient();

  const toggleLanguage = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(next).then(() => {
      /* Invalidate all TMDB-backed queries so they refetch in the new language */
      queryClient.invalidateQueries();
    });
  };

  /* Fermer le panel bell sur clic extérieur */
  useEffect(() => {
    function handler(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setMobileSearchOpen(false); setBellOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-clap-bg/90 backdrop-blur-sm" aria-label={t('nav.mainNavigation')}>
        <div className="flex items-center h-16 px-4 md:px-5">

          {/* Logo — all screens */}
          <Link to="/" className="flex-shrink-0" aria-label={t('nav.homeLink')}>
            <Logo3D />
          </Link>

          {/* ── DESKTOP layout ── */}
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="main-menu-overlay"
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

          {/* Bell + Admin + Avatar (desktop right) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <Link
                to="/history"
                title={t('nav.history')}
                aria-label={t('nav.historyLabel')}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <HistoryIcon />
              </Link>
            )}
            {isAuthenticated && (
              <div ref={bellRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setBellOpen((v) => !v); if (!bellOpen) markAllRead(); }}
                  className="relative"
                  aria-label={
                    unreadCount > 0
                      ? t('notifications.openPanelWithUnread', { count: unreadCount })
                      : t('notifications.openPanel')
                  }
                  aria-expanded={bellOpen}
                  aria-controls="notifications-panel"
                >
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                      style={{ background: '#f87171', padding: '0 4px' }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {bellOpen && <BellPanel />}
                </AnimatePresence>
              </div>
            )}
            {/* Admin shortcut — visible only for admins */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-xs px-2.5 py-1 rounded border border-clap-gold/30 text-clap-gold/70 hover:text-clap-gold hover:border-clap-gold/60 transition-colors font-medium tracking-wide"
              >
                {t('nav.admin')}
              </Link>
            )}
            {isAuthenticated ? (
              <Link to="/profile" aria-label={t('nav.profileLink')}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  className="w-9 h-9 rounded-full bg-clap-muted border-2 border-clap-gold overflow-hidden flex items-center justify-center flex-shrink-0"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-clap-gold font-display text-sm font-bold">
                      {user?.username?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  )}
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"    className="text-clap-light hover:text-clap-gold transition-colors text-sm">{t('nav.login')}</Link>
                <Link to="/register" className="btn-gold text-sm py-1 px-4">{t('nav.register')}</Link>
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
            aria-label={mobileSearchOpen ? t('nav.closeSearch') : t('nav.openSearch')}
            aria-expanded={mobileSearchOpen}
            aria-controls="mobile-search-panel"
          >
            <SearchIcon />
          </motion.button>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="main-menu-overlay"
            className="md:hidden flex items-center"
          >
            <HamburgerMobile />
          </motion.button>
        </div>

        {/* Mobile slide-down search bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              id="mobile-search-panel"
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
            id="main-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menuDialog')}
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[100] bg-clap-bg/96 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-label={t('nav.closeMenu')}
              className="absolute top-5 right-6"
            >
              <CloseIcon />
            </motion.button>

            <nav className="flex flex-col items-center gap-7" aria-label={t('nav.mainLinks')}>
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.key}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl sm:text-4xl md:text-5xl text-clap-light hover:text-clap-gold transition-colors duration-200 tracking-[0.15em]"
                  >
                    {t(`nav.${link.key}`).toUpperCase()}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.55 } }}
              className="absolute bottom-6 flex flex-wrap justify-center gap-4 sm:gap-8 text-clap-gray text-sm tracking-widest px-4"
            >
              {/* Bouton langue */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={i18n.language === 'fr' ? t('nav.switchToEnglish') : t('nav.switchToFrench')}
                className="flex items-center gap-2 hover:text-clap-gold transition-colors uppercase font-semibold"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                {t('nav.language')}
              </button>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-clap-gold transition-colors uppercase"
                >
                  {t('nav.admin')}
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-clap-gold transition-colors uppercase"
                >
                  {t('nav.history')}
                </Link>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="hover:text-clap-red transition-colors uppercase">{t('nav.logout')}</button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setMenuOpen(false)} className="hover:text-clap-gold transition-colors uppercase">{t('nav.login')}</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-clap-gold transition-colors uppercase">{t('nav.register')}</Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
