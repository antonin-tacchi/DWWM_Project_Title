import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const GOLD = '#C9A96E';
const CREAM = '#E8DCBF';

/* ─── Animation variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

/* ─── Film strip ─────────────────────────────────────────────── */
function FilmStrip() {
  return (
    <div
      className="w-full flex items-center overflow-hidden"
      style={{ height: 32, background: 'rgba(0,0,0,0.55)' }}
    >
      <div className="flex w-full">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 flex items-center justify-center"
            style={{ borderRight: '1px solid rgba(201,169,110,0.12)' }}
          >
            <div
              className="w-4 h-5 rounded-[2px]"
              style={{
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(201,169,110,0.25)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section label ──────────────────────────────────────────── */
function SectionLabel({ number, label }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span
        className="font-mono text-xs tracking-[0.3em]"
        style={{ color: `${GOLD}80` }}
      >
        {number}
      </span>
      <div className="h-px flex-1" style={{ background: `${GOLD}25` }} />
      <span
        className="font-mono text-xs tracking-[0.3em] uppercase"
        style={{ color: `${GOLD}80` }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Feature card ───────────────────────────────────────────── */
function FeatureCard({ icon, title, desc, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className="group relative rounded-2xl p-6 transition-all duration-300"
      style={{
        background: 'rgba(201,169,110,0.04)',
        border: '1px solid rgba(201,169,110,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.08)';
        e.currentTarget.style.borderColor = `${GOLD}35`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(201,169,110,0.04)';
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.1)';
      }}
    >
      {/* Ghost number */}
      <span
        className="absolute top-3 right-4 font-mono text-5xl font-black pointer-events-none select-none"
        style={{ color: 'rgba(201,169,110,0.06)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
        style={{
          background: 'rgba(201,169,110,0.08)',
          color: GOLD,
        }}
      >
        {icon}
      </div>

      <h3
        className="font-display italic text-lg mb-2 leading-snug"
        style={{ color: CREAM }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,220,191,0.55)' }}>
        {desc}
      </p>
    </motion.div>
  );
}

/* ─── Tech badge ─────────────────────────────────────────────── */
function TechBadge({ name, color, category, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}25`,
      }}
    >
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
      />
      <div>
        <div className="text-sm font-semibold" style={{ color: CREAM }}>
          {name}
        </div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: `${color}80` }}>
          {category}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function About() {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* Feature data */
  const FEATURES = [
    {
      icon: <FilmIcon />,
      title: t('about.feat_catalogue'),
      desc: t('about.feat_catalogue_desc'),
    },
    {
      icon: <CompassIcon />,
      title: t('about.feat_discover'),
      desc: t('about.feat_discover_desc'),
    },
    {
      icon: <StarFilledIcon />,
      title: t('about.feat_ratings'),
      desc: t('about.feat_ratings_desc'),
    },
    {
      icon: <ListIcon />,
      title: t('about.feat_lists'),
      desc: t('about.feat_lists_desc'),
    },
    {
      icon: <NewsIcon />,
      title: t('about.feat_news'),
      desc: t('about.feat_news_desc'),
    },
    {
      icon: <BellIcon />,
      title: t('about.feat_notifs'),
      desc: t('about.feat_notifs_desc'),
    },
    {
      icon: <UserIcon />,
      title: t('about.feat_profile'),
      desc: t('about.feat_profile_desc'),
    },
    {
      icon: <GlobeIcon />,
      title: t('about.feat_lang'),
      desc: t('about.feat_lang_desc'),
    },
  ];

  const TECH = [
    { name: 'React / Vite', color: '#61DAFB', category: 'Frontend' },
    { name: 'Framer Motion', color: '#BB4FFF', category: 'Frontend' },
    { name: 'Tailwind CSS', color: '#38BDF8', category: 'Frontend' },
    { name: 'Spring Boot', color: '#6DB33F', category: 'Backend' },
    { name: 'Java 17', color: '#ED8B00', category: 'Backend' },
    { name: 'MySQL', color: '#4479A1', category: 'Database' },
    { name: 'Docker', color: '#2496ED', category: 'DevOps' },
    { name: 'Spring Cloud Gateway', color: '#6DB33F', category: 'Architecture' },
    { name: 'Consul', color: '#F24C53', category: 'Architecture' },
    { name: 'JWT Auth', color: GOLD, category: 'Security' },
    { name: 'TMDB API', color: '#01D277', category: 'Data' },
    { name: 'Microservices', color: '#A78BFA', category: 'Architecture' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-clap-bg, #0c0c0f)' }}>

      {/* ══════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {/* Cinematic grid poster wall */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(201,169,110,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(201,169,110,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          {/* Radial vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 70% at 50% 40%, transparent 20%, rgba(12,12,15,0.7) 70%, rgba(12,12,15,0.98) 100%)',
            }}
          />
          {/* Warm spotlight */}
          <div
            className="absolute"
            style={{
              top: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(201,169,110,0.09) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>

        {/* Film strip top */}
        <FilmStrip />

        {/* Hero content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-10"
            style={{
              border: `1px solid ${GOLD}30`,
              background: 'rgba(201,169,110,0.07)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: GOLD }}>
              {t('about.badge')}
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display italic leading-[0.92] mb-8"
            style={{
              color: CREAM,
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              textShadow: `0 0 80px rgba(201,169,110,0.15)`,
              whiteSpace: 'pre-line',
            }}
          >
            {t('about.heroTitle')}
          </motion.h1>

          {/* Divider with star */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 w-full max-w-xs mb-8"
          >
            <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
            <svg width="14" height="14" viewBox="0 0 16 16" fill={GOLD}>
              <path d="M8 0l1.8 5.5H16l-4.9 3.6 1.8 5.5L8 11l-4.9 3.6 1.8-5.5L0 5.5h6.2z" />
            </svg>
            <div className="flex-1 h-px" style={{ background: `${GOLD}50` }} />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-base max-w-lg leading-relaxed"
            style={{ color: 'rgba(232,220,191,0.6)' }}
          >
            {t('about.heroSubtitle')}
          </motion.p>

          {/* Back link */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-colors duration-200"
              style={{ color: `${GOLD}80` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}80`)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t('about.backHome')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center pb-8 gap-2"
          style={{ color: `${GOLD}50` }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Film strip bottom */}
        <FilmStrip />
      </section>

      {/* ══════════════════════════════════════════════════
          LE PROJET
          ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6">
        {/* Decorative left accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}30, transparent)` }}
        />

        <div className="max-w-6xl mx-auto">
          <SectionLabel number="01" label={t('about.projectTitle')} />

          <div className="grid md:grid-cols-2 gap-16 items-center mt-10">
            {/* Text side */}
            <div>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="font-display italic text-4xl lg:text-5xl mb-8 leading-tight"
                style={{ color: CREAM }}
              >
                {t('about.projectTitle')}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={1}
                viewport={{ once: true }}
                className="text-base leading-relaxed mb-5"
                style={{ color: 'rgba(232,220,191,0.65)' }}
              >
                {t('about.projectText1')}
              </motion.p>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={2}
                viewport={{ once: true }}
                className="text-base leading-relaxed"
                style={{ color: 'rgba(232,220,191,0.65)' }}
              >
                {t('about.projectText2')}
              </motion.p>
            </div>

            {/* Stats side */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '8', label: t('about.statFeatures') },
                { value: '12', label: t('about.statTech') },
                { value: '2', label: t('about.statLang') },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  custom={i}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center rounded-2xl py-10 px-4 text-center"
                  style={{
                    border: `1px solid ${GOLD}20`,
                    background: 'rgba(201,169,110,0.04)',
                  }}
                >
                  <span
                    className="font-display italic text-5xl"
                    style={{ color: GOLD, lineHeight: 1 }}
                  >
                    {value}
                  </span>
                  <span
                    className="mt-2 text-xs uppercase tracking-widest"
                    style={{ color: 'rgba(232,220,191,0.45)' }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}

              {/* TMDB attribution */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="col-span-3 rounded-2xl px-5 py-4 text-center"
                style={{
                  border: `1px solid ${GOLD}15`,
                  background: 'rgba(1,210,119,0.04)',
                }}
              >
                <p className="text-xs" style={{ color: 'rgba(1,210,119,0.7)' }}>
                  Données cinématographiques fournies par{' '}
                  <a
                    href="https://www.themoviedb.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 transition-colors"
                    style={{ color: '#01D277' }}
                  >
                    The Movie Database (TMDB)
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FONCTIONNALITÉS
          ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,169,110,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          <SectionLabel number="02" label={t('about.featuresTitle')} />

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display italic text-4xl lg:text-5xl mb-14 leading-tight"
            style={{ color: CREAM }}
          >
            {t('about.featuresTitle')}
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Film strip divider */}
      <FilmStrip />

      {/* ══════════════════════════════════════════════════
          ARCHITECTURE TECHNIQUE
          ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionLabel number="03" label={t('about.techTitle')} />

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="font-display italic text-4xl lg:text-5xl mb-5 leading-tight"
                style={{ color: CREAM }}
              >
                {t('about.techTitle')}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={1}
                viewport={{ once: true }}
                className="text-base leading-relaxed mb-10"
                style={{ color: 'rgba(232,220,191,0.55)' }}
              >
                {t('about.techSubtitle')}
              </motion.p>

              {/* Architecture diagram (simplified) */}
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-2xl p-6 font-mono text-xs"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${GOLD}20`,
                  color: 'rgba(201,169,110,0.6)',
                  lineHeight: 2,
                }}
              >
                <div style={{ color: '#01D277' }}>TMDB API</div>
                <div style={{ paddingLeft: 16 }}>↓</div>
                <div style={{ color: '#38BDF8' }}>React / Vite (Frontend)</div>
                <div style={{ paddingLeft: 16 }}>↕ HTTP / REST</div>
                <div style={{ color: '#6DB33F' }}>Spring Cloud Gateway</div>
                <div style={{ paddingLeft: 16 }}>↓ Service Discovery</div>
                <div style={{ color: '#F24C53' }}>Consul</div>
                <div style={{ paddingLeft: 16 }}>↓ Routes vers</div>
                <div style={{ color: '#6DB33F' }}>
                  {'['} movies-service {'|'} auth-service {'|'} user-service {']'}
                </div>
                <div style={{ paddingLeft: 16 }}>↓</div>
                <div style={{ color: '#4479A1' }}>MySQL (par service)</div>
              </motion.div>
            </div>

            {/* Tech badges grid */}
            <div className="grid grid-cols-2 gap-3">
              {TECH.map((tech, i) => (
                <TechBadge key={tech.name} {...tech} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LE CRÉATEUR
          ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6">
        {/* Right accent */}
        <div
          className="absolute right-0 top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}30, transparent)` }}
        />

        <div className="max-w-4xl mx-auto">
          <SectionLabel number="04" label={t('about.creatorTitle')} />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(201,169,110,0.04)',
              border: `1px solid ${GOLD}20`,
            }}
          >
            {/* Card top strip */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

            <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(201,169,110,0.1)',
                    border: `2px solid ${GOLD}30`,
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>

                {/* Social / contact */}
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="mailto:antonin.tacchi2005@gmail.com"
                    className="flex items-center gap-2 text-xs transition-colors duration-200 group"
                    style={{ color: 'rgba(201,169,110,0.6)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,169,110,0.6)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="truncate max-w-[120px]">antonin.tacchi2005</span>
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-display italic text-3xl md:text-4xl mb-1" style={{ color: CREAM }}>
                  {t('about.creatorName')}
                </h2>
                <p className="text-sm tracking-widest uppercase mb-1" style={{ color: GOLD }}>
                  {t('about.creatorRole')}
                </p>
                <p className="text-xs mb-6" style={{ color: 'rgba(201,169,110,0.5)' }}>
                  {t('about.creatorFormation')}
                </p>

                <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(232,220,191,0.6)' }}>
                  {t('about.creatorText')}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['React', 'Spring Boot', 'Docker', 'MySQL', 'Java', 'Tailwind'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider"
                      style={{
                        background: 'rgba(201,169,110,0.08)',
                        border: `1px solid ${GOLD}25`,
                        color: `${GOLD}90`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="mailto:antonin.tacchi2005@gmail.com"
                  className="inline-flex items-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-all duration-200"
                  style={{
                    background: 'rgba(201,169,110,0.12)',
                    border: `1px solid ${GOLD}40`,
                    color: GOLD,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201,169,110,0.2)';
                    e.currentTarget.style.borderColor = `${GOLD}70`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(201,169,110,0.12)';
                    e.currentTarget.style.borderColor = `${GOLD}40`;
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {t('about.contactCta')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Film strip */}
      <FilmStrip />

      {/* ══════════════════════════════════════════════════
          CLOSING QUOTE
          ══════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 80% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Quote mark */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display italic text-[8rem] leading-none select-none mb-4"
            style={{ color: `${GOLD}15`, lineHeight: 0.8 }}
          >
            &ldquo;
          </motion.div>

          <motion.blockquote
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-display italic text-2xl md:text-3xl lg:text-4xl leading-snug mb-6"
            style={{ color: CREAM }}
          >
            {t('about.closingQuote')}
          </motion.blockquote>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
            className="text-sm tracking-widest uppercase"
            style={{ color: `${GOLD}80` }}
          >
            {t('about.closingBy')}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center gap-4 mt-12 max-w-xs mx-auto"
          >
            <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
            <svg width="12" height="12" viewBox="0 0 16 16" fill={GOLD} opacity={0.5}>
              <path d="M8 0l1.8 5.5H16l-4.9 3.6 1.8 5.5L8 11l-4.9 3.6 1.8-5.5L0 5.5h6.2z" />
            </svg>
            <div className="flex-1 h-px" style={{ background: `${GOLD}30` }} />
          </motion.div>

          {/* Links back */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {[
              { to: '/', label: t('nav.home') },
              { to: '/catalogue', label: t('nav.movies') },
              { to: '/news', label: t('nav.news') },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs tracking-[0.2em] uppercase transition-colors duration-200"
                style={{ color: 'rgba(232,220,191,0.4)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,220,191,0.4)')}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}

/* ─── SVG Icons ──────────────────────────────────────────────── */
function FilmIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18"/>
      <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
      <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
      <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
      <line x1="17" y1="7" x2="22" y2="7"/>
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}
function StarFilledIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
function NewsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <line x1="16" y1="8" x2="10" y2="8"/><line x1="16" y1="12" x2="10" y2="12"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
