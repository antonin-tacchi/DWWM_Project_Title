import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GOLD  = '#C9A96E';
const CREAM = '#E8DCBF';

/* ─── Film strip top decoration ─────────────────────────────── */
function FilmStrip() {
  return (
    <div className="w-full h-8 flex items-center overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="flex gap-1 w-full px-2">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-sm"
            style={{ width: 14, height: 20, background: i % 4 === 0 ? `${GOLD}30` : '#1a1a2a' }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Scrollspy TOC ──────────────────────────────────────────── */
function TableOfContents({ sections, activeId }) {
  return (
    <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
      <div className="sticky top-24 pt-2">
        <p className="text-[10px] uppercase tracking-[0.25em] mb-5 font-semibold" style={{ color: `${GOLD}60` }}>
          Sommaire
        </p>
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(to bottom, ${GOLD}30, transparent)` }}
          />
          <nav className="pl-5 space-y-0.5">
            {sections.map(({ id, number, title }) => {
              const isActive = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex items-start gap-2 py-2 pr-2 text-xs leading-snug transition-all duration-300 group"
                  style={{ color: isActive ? GOLD : 'rgba(255,255,255,0.28)' }}
                >
                  {/* Active indicator */}
                  <div
                    className="absolute left-0 w-px transition-all duration-300"
                    style={{
                      background: isActive ? GOLD : 'transparent',
                      height: isActive ? 32 : 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  />
                  {number && (
                    <span className="font-mono text-[9px] mt-0.5 flex-shrink-0 opacity-60">
                      {number}
                    </span>
                  )}
                  <span className={isActive ? 'font-semibold' : 'group-hover:text-white/60 transition-colors'}>
                    {title}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Back to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 mt-8 text-[10px] uppercase tracking-widest transition-colors"
          style={{ color: `${GOLD}50` }}
          onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}50`)}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 8V2M2 4l3-3 3 3" />
          </svg>
          Haut de page
        </button>
      </div>
    </aside>
  );
}

/* ─── Section block ──────────────────────────────────────────── */
function LegalSection({ id, number, title, content, index }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
      className="relative scroll-mt-28"
    >
      {/* Ghost number */}
      {number && (
        <div
          className="absolute -top-6 -left-2 text-[7rem] font-black select-none pointer-events-none leading-none"
          style={{ color: 'rgba(201,169,110,0.035)', fontFamily: 'serif' }}
        >
          {number.replace('Art. ', '').replace('.', '')}
        </div>
      )}

      {/* Divider line */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${GOLD}35, transparent)` }} />
        {number && (
          <span className="font-mono text-[10px] tracking-widest" style={{ color: `${GOLD}50` }}>
            {number}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl md:text-3xl italic mb-7" style={{ color: CREAM }}>
        {title}
      </h2>

      {/* Content */}
      <div className="space-y-4 text-[15px] leading-[1.85] text-white/65">
        {content}
      </div>
    </motion.section>
  );
}

/* ─── Main Layout ─────────────────────────────────────────────── */
export default function LegalLayout({ badge, title, subtitle, lastUpdated, sections, backLink }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  /* Scrollspy */
  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-15% 0px -70% 0px' }
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);
    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>

      {/* Film strip top */}
      <FilmStrip />

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden pt-16 pb-20 px-6"
        style={{
          background: 'linear-gradient(180deg, #0e0e1c 0%, #080810 100%)',
          borderBottom: `1px solid ${GOLD}18`,
        }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(to right, ${GOLD} 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Gradient fade left */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Back link */}
          {backLink && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link
                to={backLink.to}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
                style={{ color: `${GOLD}60` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}60`)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                {backLink.label}
              </Link>
            </motion.div>
          )}

          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-5"
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: GOLD }}>
                {badge}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl italic leading-tight mb-4"
            style={{ color: CREAM }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm tracking-wider max-w-xl"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Last updated */}
          {lastUpdated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-xs font-mono"
              style={{ color: `${GOLD}45` }}
            >
              Mise à jour : {lastUpdated}
            </motion.p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="flex gap-10 xl:gap-16 items-start">

          <TableOfContents sections={sections} activeId={activeId} />

          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-20">
            {sections.map((section, i) => (
              <LegalSection key={section.id} {...section} index={i} />
            ))}

            {/* Bottom film strip */}
            <div className="pt-8 border-t" style={{ borderColor: `${GOLD}18` }}>
              <p className="text-xs text-center font-mono" style={{ color: `${GOLD}35` }}>
                — CLAP! · Projet DWWM · {new Date().getFullYear()} —
              </p>
            </div>
          </main>
        </div>
      </div>

      {/* Film strip bottom */}
      <FilmStrip />
    </div>
  );
}
