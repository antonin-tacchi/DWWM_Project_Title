import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

/* ─── Helpers ──────────────────────────────────────────────────── */
const tmdbImg = (path, size = 'original') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const fmtYear = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).getFullYear();
};

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

/* ─── Star rating ──────────────────────────────────────────────── */
function Stars({ value }) {
  const pct = Math.round((value / 10) * 5 * 10) / 10; // 0-5
  return (
    <span className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id={`sg-${i}-${value}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset={`${Math.min(1, Math.max(0, pct - i + 1)) * 100}%`} stopColor="#C9A96E" />
              <stop offset={`${Math.min(1, Math.max(0, pct - i + 1)) * 100}%`} stopColor="#4a4a4a" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={`url(#sg-${i}-${value})`}
          />
        </svg>
      ))}
    </span>
  );
}

/* ─── Known-For card ───────────────────────────────────────────── */
function CreditCard({ credit, mode }) {
  const title = credit.title || credit.name || '—';
  const year = fmtYear(credit.release_date || credit.first_air_date);
  const poster = tmdbImg(credit.poster_path, 'w342');
  const href = credit.media_type === 'tv' ? `/serie/${credit.id}` : `/film/${credit.id}`;
  const sub = mode === 'cast' ? credit.character : credit.job;

  return (
    <Link
      to={href}
      className="flex-shrink-0 w-36 group"
    >
      {/* Poster */}
      <div className="relative w-36 h-52 rounded-xl overflow-hidden bg-clap-surface mb-2 shadow-lg">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-clap-muted text-xs text-center p-2">
            {title}
          </div>
        )}
        {/* Rating badge */}
        {credit.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
            <Stars value={credit.vote_average} />
          </div>
        )}
      </div>
      <p className="text-white text-xs font-semibold leading-tight line-clamp-1 group-hover:text-clap-gold transition-colors">
        {title}
      </p>
      {year && (
        <p className="text-clap-muted text-xs mt-0.5">{year}</p>
      )}
      {sub && (
        <p className="text-clap-gold/70 text-xs mt-0.5 italic line-clamp-1">{sub}</p>
      )}
    </Link>
  );
}

/* ─── Horizontal carousel ──────────────────────────────────────── */
function Carousel({ credits, mode }) {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 600, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => { onScroll(); }, [credits]);

  return (
    <div className="relative">
      {/* Left arrow */}
      <AnimatePresence>
        {canLeft && (
          <motion.button
            key="left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 border border-clap-gold/30 flex items-center justify-center text-clap-gold hover:bg-clap-gold hover:text-black transition-all shadow-xl"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {credits.map((c) => (
          <CreditCard key={`${c.id}-${c.character || c.job}`} credit={c} mode={mode} />
        ))}
      </div>

      {/* Right arrow */}
      <AnimatePresence>
        {canRight && (
          <motion.button
            key="right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 border border-clap-gold/30 flex items-center justify-center text-clap-gold hover:bg-clap-gold hover:text-black transition-all shadow-xl"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Photo mosaic ─────────────────────────────────────────────── */
function PhotoMosaic({ credits, personName }) {
  // Collect unique backdrops from credits (best-voted first)
  const backdrops = credits
    .filter((c) => c.backdrop_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .reduce((acc, c) => {
      if (!acc.find((x) => x.backdrop_path === c.backdrop_path)) acc.push(c);
      return acc;
    }, [])
    .slice(0, 9);

  if (backdrops.length === 0) return null;

  // Pick a title for the vertical strip — the most popular credit
  const stripTitle = (backdrops[0]?.title || backdrops[0]?.name || personName).toUpperCase();

  return (
    <div className="mt-16">
      <h2
        className="text-3xl md:text-4xl font-display italic text-white mb-8"
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
      >
        Galerie
      </h2>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr) 32px',
          gridTemplateRows: 'repeat(3, 180px)',
        }}
      >
        {/* Backdrop tiles — up to 9 */}
        {backdrops.slice(0, 9).map((c, i) => {
          const href = c.media_type === 'tv' ? `/serie/${c.id}` : `/film/${c.id}`;
          return (
            <Link
              key={`${c.id}-${i}`}
              to={href}
              className="relative overflow-hidden rounded-sm group"
              style={{ gridColumn: Math.floor(i / 3) + 1, gridRow: (i % 3) + 1 }}
            >
              <img
                src={tmdbImg(c.backdrop_path, 'w780')}
                alt={c.title || c.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Hover overlay with title */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-2">
                <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-tight">
                  {c.title || c.name}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Vertical text strip — last column, spans all 3 rows */}
        <div
          className="flex flex-col items-center justify-between py-3"
          style={{
            gridColumn: 4,
            gridRow: '1 / 4',
            background: 'linear-gradient(180deg, #1a1508 0%, #0d0d0d 100%)',
            borderLeft: '1px solid rgba(201,169,110,0.2)',
          }}
        >
          {/* Letters */}
          <div className="flex flex-col items-center gap-1 flex-1 justify-center">
            {stripTitle.slice(0, 12).split('').map((ch, i) => (
              <span
                key={i}
                className="text-clap-gold font-display font-bold leading-none select-none"
                style={{ fontSize: '10px', writingMode: 'horizontal-tb', letterSpacing: '0.05em' }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </div>
          {/* Dots */}
          <div className="flex flex-col items-center gap-1.5 pb-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: 4, height: 4,
                  background: i === 0 ? '#C9A96E' : 'rgba(201,169,110,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero section ─────────────────────────────────────────────── */
function PersonHero({ person, heroCredit }) {
  const [expanded, setExpanded] = useState(false);
  const BIO_LIMIT = 400;
  const bio = person.biography || '';
  const truncated = bio.length > BIO_LIMIT && !expanded;
  const displayBio = truncated ? bio.slice(0, BIO_LIMIT) + '…' : bio;

  const heroImg = heroCredit?.backdrop_path
    ? tmdbImg(heroCredit.backdrop_path, 'original')
    : null;

  const avatar = tmdbImg(person.profile_path, 'w342');

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: 600 }}>
        {heroImg ? (
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.55)' }}
          />
        ) : (
          <div className="w-full h-full bg-clap-surface" />
        )}

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 30%, rgba(13,13,13,0.7) 70%, rgba(13,13,13,1) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.4) 40%, transparent 70%)',
          }}
        />

        {/* Content positioned at bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-12">
          <div className="max-w-7xl mx-auto flex items-end gap-8">
            {/* Avatar */}
            <div
              className="flex-shrink-0 rounded-full overflow-hidden shadow-2xl border-2"
              style={{
                width: 140,
                height: 140,
                borderColor: 'rgba(201,169,110,0.4)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              }}
            >
              {avatar ? (
                <img src={avatar} alt={person.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-clap-surface flex items-center justify-center text-clap-gold text-5xl font-display">
                  {person.name?.[0] ?? '?'}
                </div>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pb-1">
              {/* Department badge */}
              {person.known_for_department && (
                <span
                  className="inline-block text-clap-gold text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                  style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}
                >
                  {person.known_for_department}
                </span>
              )}

              {/* Name */}
              <h1
                className="font-display italic text-white leading-none mb-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
              >
                {person.name}
              </h1>

              {/* Birth info */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-clap-muted mb-4">
                {person.birthday && (
                  <span>
                    <span className="text-clap-gold mr-1">Naissance</span>
                    {fmtDate(person.birthday)}
                    {person.place_of_birth && ` — ${person.place_of_birth}`}
                  </span>
                )}
                {person.deathday && (
                  <span>
                    <span className="text-clap-gold mr-1">Décès</span>
                    {fmtDate(person.deathday)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio — below the hero */}
      {bio && (
        <div className="px-6 md:px-16 pt-8 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-clap-muted leading-relaxed text-white text-sm md:text-base">
              {displayBio}
            </p>
            {bio.length > BIO_LIMIT && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 text-clap-gold text-sm font-semibold hover:underline focus:outline-none"
              >
                {expanded ? 'Voir moins ↑' : 'Voir plus ↓'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────── */
/**
 * mode = 'cast'  → /actors/:id  (acting credits)
 * mode = 'crew'  → /crew/:id    (directing / production credits)
 */
export default function ActorProfile({ mode = 'cast' }) {
  const { id } = useParams();

  const { data: person, isLoading: loadingPerson } = useQuery({
    queryKey: ['person', id],
    queryFn: () => api.get(`/actors/${id}`).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: creditsData, isLoading: loadingCredits } = useQuery({
    queryKey: ['person-credits', id],
    queryFn: () => api.get(`/actors/${id}/credits`).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = loadingPerson || loadingCredits;

  /* ── Derived credit lists ── */
  const rawCredits = (() => {
    if (!creditsData) return [];
    if (mode === 'cast') {
      return (creditsData.cast || [])
        .filter((c) => c.poster_path)
        // deduplicate by media id — keep lowest order (= top billing)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .reduce((acc, c) => {
          if (!acc.find((x) => x.id === c.id)) acc.push(c);
          return acc;
        }, [])
        .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
    }
    // crew mode: keep Directing, Production, Writing
    // Priority order: Director wins over Producer wins over Writer etc.
    const DEPT_PRIORITY = ['Directing', 'Writing', 'Production', 'Creator'];
    const JOB_PRIORITY  = ['Director', 'Writer', 'Screenplay', 'Story', 'Producer', 'Executive Producer', 'Creator'];

    const jobRank = (job) => {
      const idx = JOB_PRIORITY.indexOf(job);
      return idx === -1 ? JOB_PRIORITY.length : idx;
    };

    return (creditsData.crew || [])
      .filter((c) => DEPT_PRIORITY.includes(c.department) && c.poster_path)
      // sort by job importance first so the best role "wins" deduplication
      .sort((a, b) => jobRank(a.job) - jobRank(b.job))
      // deduplicate by media id only — keep the most important role per film
      .reduce((acc, c) => {
        if (!acc.find((x) => x.id === c.id)) acc.push(c);
        return acc;
      }, [])
      // final sort by popularity
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  })();

  // Best credit for hero backdrop — highest vote_count with a backdrop_path
  const heroCredit = [...(creditsData?.cast || []), ...(creditsData?.crew || [])]
    .filter((c) => c.backdrop_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))[0] ?? null;

  // Mosaic: all credits with backdrops, deduplicated
  const allCredits = [...(creditsData?.cast || []), ...(creditsData?.crew || [])];

  /* ── Loading skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-clap-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-clap-gold/30 border-t-clap-gold animate-spin" />
          <p className="text-clap-muted text-sm">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-clap-bg flex items-center justify-center">
        <p className="text-clap-muted">Profil introuvable.</p>
      </div>
    );
  }

  const sectionLabel = mode === 'cast' ? 'Filmographie' : 'Réalisations';

  return (
    <div className="bg-clap-bg min-h-screen">
      {/* ── Hero ── */}
      <PersonHero person={person} heroCredit={heroCredit} />

      {/* ── Known-For carousel ── */}
      {rawCredits.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="px-6 md:px-16 mt-12 max-w-7xl mx-auto"
        >
          <h2
            className="text-3xl md:text-4xl font-display italic text-white mb-8"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            {sectionLabel}
          </h2>
          <Carousel credits={rawCredits} mode={mode} />
        </motion.section>
      )}

      {/* ── Photo mosaic ── */}
      {allCredits.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-6 md:px-16 max-w-7xl mx-auto pb-24"
        >
          <PhotoMosaic credits={allCredits} personName={person.name} />
        </motion.section>
      )}
    </div>
  );
}
