import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { to: '/catalogue', label: 'MOVIES' },
  { to: '/catalogue', label: 'SERIES' },
  { to: '/',          label: 'NEWS' },
  { to: '/',          label: 'COMMUNITY' },
  { to: '/',          label: 'ABOUT' },
];

const LEGAL_LINKS = [
  { to: '/', label: 'TERMS OF SERVICE' },
  { to: '/', label: 'LEGAL NOTICE' },
  { to: '/', label: 'PRIVACY POLICY' },
  { to: '/', label: 'CONTACT' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden mt-20 min-h-[520px]">

      {/* ── Cinema background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/FooterBackground.png')" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center py-28 px-6 text-center">

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="font-display text-4xl md:text-5xl lg:text-6xl italic leading-snug max-w-3xl mb-20"
          style={{ color: '#C9A96E' }}
        >
          Cinema is a dream we share together.
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
              className="text-sm font-bold tracking-[0.22em] transition-colors duration-200"
              style={{ color: '#C9A96E' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E8DCBF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#C9A96E')}
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
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E8DCBF')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = 'rgba(232,220,191,0.65)')
              }
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
