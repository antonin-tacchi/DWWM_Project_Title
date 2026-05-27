import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/* ─── Data keys (labels resolved with t() inside component) ─── */
const NAV_LINK_DEFS = [
  { to: '/catalogue', key: 'movies',    icon: <FilmIcon /> },
  { to: '/catalogue', key: 'tvShows',   icon: <TvIcon /> },
  { to: '/news',      key: 'news',      icon: <NewsIcon /> },
  { to: '/community', key: 'community', icon: <CommunityIcon /> },
  { to: '/about',     key: 'about',     icon: <StarIcon /> },
];

const LEGAL_LINK_DEFS = [
  { to: '/terms',   key: 'terms',   icon: <ScaleIcon /> },
  { to: '/legal',   key: 'legal',   icon: <DocIcon /> },
  { to: '/privacy', key: 'privacy', icon: <LockIcon /> },
  { to: '/contact', key: 'contact', icon: <MailIcon /> },
];

const GOLD = '#C9A96E';
const CREAM = '#E8DCBF';

/* ─── Component ──────────────────────────────────────────────── */
export default function Footer() {
  const { t } = useTranslation();
  const NAV_LINKS   = NAV_LINK_DEFS.map((l) => ({ ...l, label: t(`footer.${l.key}`) }));
  const LEGAL_LINKS = LEGAL_LINK_DEFS.map((l) => ({ ...l, label: t(`footer.${l.key}`) }));
  return (
    <footer className="relative mt-20">

      {/* ══════════════════════════════════════
          MOBILE  (< md) — vertical cinema layout
          ══════════════════════════════════════ */}
      <div className="block md:hidden relative overflow-hidden min-h-[900px]">
        {/* Mobile background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/FooterBackgroundMobile.png')" }}
        />

        <div className="relative z-10 flex flex-col items-center px-6 py-10">

          {/* Top star divider */}
          <StarDivider />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl italic text-center leading-tight mt-8 mb-6"
            style={{ color: CREAM }}
          >
            {t('footer.tagline')}
          </motion.p>

          {/* Dots */}
          <div className="flex gap-2 mb-10">
            {[0,1,2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }} />
            ))}
          </div>

          {/* Icon nav row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center w-full mb-12"
          >
            {NAV_LINKS.map((link, i) => (
              <div key={link.label} className="flex items-center">
                <Link to={link.to} className="flex flex-col items-center gap-1 px-3 group">
                  <span className="text-3xl" style={{ color: GOLD }}>{link.icon}</span>
                  <span className="font-display italic text-xs" style={{ color: GOLD }}>
                    {link.label}
                  </span>
                </Link>
                {i < NAV_LINKS.length - 1 && (
                  <div className="w-px h-10 self-center" style={{ backgroundColor: `${GOLD}60` }} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Legal card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-sm rounded-2xl overflow-hidden border"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', borderColor: `${GOLD}30` }}
          >
            {LEGAL_LINKS.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-4 px-5 py-4 transition-colors"
                style={{ borderBottom: i < LEGAL_LINKS.length - 1 ? `1px solid ${GOLD}25` : 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{ color: GOLD }}>{link.icon}</span>
                <span
                  className="flex-1 font-display italic text-sm tracking-widest"
                  style={{ color: GOLD }}
                >
                  {link.label}
                </span>
                <ChevronIcon />
              </Link>
            ))}
          </motion.div>

          {/* Bottom star divider */}
          <div className="mt-12">
            <StarDivider />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TABLET + DESKTOP (md+) — wide cinema
          ══════════════════════════════════════ */}
      <div className="hidden md:block relative overflow-hidden min-h-[520px]">
        {/* Desktop background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/FooterBackground.png')" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center py-28 px-6 text-center">

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="font-display text-4xl lg:text-6xl italic leading-snug max-w-3xl mb-20"
            style={{ color: CREAM }}
          >
            {t('footer.tagline')}
          </motion.p>

          {/* Main nav */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-10 mb-8"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-bold tracking-[0.22em] uppercase transition-colors duration-200"
                style={{ color: CREAM }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = CREAM)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          {/* Legal links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-7"
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs tracking-[0.16em] transition-colors duration-200"
                style={{ color: 'rgba(232,220,191,0.65)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,220,191,0.65)')}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Star divider ───────────────────────────────────────────── */
function StarDivider() {
  return (
    <div className="flex items-center gap-3 w-full max-w-xs">
      <div className="flex-1 h-px" style={{ backgroundColor: `#C9A96E60` }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#C9A96E">
        <path d="M8 0l1.8 5.5H16l-4.9 3.6 1.8 5.5L8 11l-4.9 3.6 1.8-5.5L0 5.5h6.2z" />
      </svg>
      <div className="flex-1 h-px" style={{ backgroundColor: `#C9A96E60` }} />
    </div>
  );
}

/* ─── SVG Icons ──────────────────────────────────────────────── */
function FilmIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
      <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
      <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
      <line x1="17" y1="7" x2="22" y2="7"/>
    </svg>
  );
}
function TvIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <line x1="16" y1="8" x2="10" y2="8"/><line x1="16" y1="12" x2="10" y2="12"/>
      <line x1="16" y1="16" x2="10" y2="16"/>
    </svg>
  );
}
function CommunityIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M17 6H5"/><path d="M3 9l9-6 9 6"/>
      <path d="M3 15h6l-3 6-3-6Z"/><path d="M15 15h6l-3 6-3-6Z"/>
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}
