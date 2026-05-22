import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

/* ─── Helpers ──────────────────────────────────────────────────── */
const tmdbImg = (path, size = 'original') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const fmtDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};

const fmtDateShort = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

const mediaHref = (item) =>
  item.media_type === 'tv' || item.first_air_date
    ? `/serie/${item.id}`
    : `/film/${item.id}`;

const itemDate = (item) => item.release_date || item.first_air_date;
const itemTitle = (item) => item.title || item.name || '—';

/* ─── Hero article ─────────────────────────────────────────────── */
function HeroArticle({ item }) {
  const href    = mediaHref(item);
  const backdrop = tmdbImg(item.backdrop_path, 'original');
  const poster   = tmdbImg(item.poster_path, 'w500');
  const date     = itemDate(item);
  const title    = itemTitle(item);

  return (
    <Link to={href} className="block relative w-full overflow-hidden group" style={{ height: 'clamp(380px, 55vh, 620px)' }}>
      {/* Backdrop */}
      {backdrop ? (
        <img
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-clap-surface" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,1) 0%, rgba(13,13,13,0.55) 40%, rgba(13,13,13,0.15) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.75) 0%, transparent 55%)' }} />

      {/* Content */}
      <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-10">
        <div className="flex items-end gap-6 max-w-7xl w-full mx-auto">
          {/* Poster */}
          {poster && (
            <div
              className="hidden md:block flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10"
              style={{ width: 120, height: 180 }}
            >
              <img src={poster} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            {/* Tag */}
            <span
              className="inline-block text-clap-gold text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
              style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.35)' }}
            >
              {item.first_air_date ? 'Série' : 'Film'} · À venir
            </span>

            {/* Title */}
            <h1
              className="font-display italic text-white leading-none mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}
            >
              {title}
            </h1>

            {/* Tagline / overview */}
            {(item.overview) && (
              <p className="text-white/75 italic text-sm md:text-base leading-snug line-clamp-2 mb-4 max-w-xl">
                {item.overview}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm">
              {date && (
                <span className="text-clap-gold font-semibold">
                  {fmtDate(date)}
                </span>
              )}
              {item.vote_average > 0 && (
                <span className="text-white/60">
                  ★ {item.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "Lire l'article" hover pill */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span
          className="text-xs font-semibold text-white px-4 py-2 rounded-full flex items-center gap-2"
          style={{ background: 'rgba(201,169,110,0.25)', border: '1px solid rgba(201,169,110,0.5)', backdropFilter: 'blur(8px)' }}
        >
          Voir le film →
        </span>
      </div>
    </Link>
  );
}

/* ─── Featured article card (wide, horizontal) ─────────────────── */
function FeaturedCard({ item, index }) {
  const href     = mediaHref(item);
  const backdrop = tmdbImg(item.backdrop_path, 'w1280');
  const poster   = tmdbImg(item.poster_path, 'w342');
  const date     = itemDate(item);
  const title    = itemTitle(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={href}
        className="group flex overflow-hidden rounded-2xl border border-white/8 hover:border-clap-gold/30 transition-all duration-400 shadow-xl"
        style={{ background: 'rgba(22,22,38,0.7)', backdropFilter: 'blur(4px)' }}
      >
        {/* Left: backdrop image */}
        <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '55%', minHeight: 220 }}>
          {backdrop ? (
            <img
              src={backdrop}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-clap-surface" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(22,22,38,0.95) 100%)' }} />

          {/* Date badge */}
          {date && (
            <div
              className="absolute bottom-3 left-3 text-xs font-semibold text-white px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            >
              {fmtDateShort(date)}
            </div>
          )}
        </div>

        {/* Right: text */}
        <div className="flex-1 flex flex-col justify-center px-5 py-5 gap-3">
          {/* Type badge */}
          <span className="text-clap-gold text-xs font-bold tracking-widest uppercase">
            {item.first_air_date ? 'Série' : 'Film'}
          </span>

          {/* Title */}
          <h3
            className="font-display italic text-white leading-tight group-hover:text-clap-gold/90 transition-colors"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}
          >
            {title}
          </h3>

          {/* Overview */}
          {item.overview && (
            <p className="text-clap-muted text-sm leading-relaxed line-clamp-3">
              {item.overview}
            </p>
          )}

          {/* Poster thumb + rating */}
          <div className="flex items-center justify-between mt-auto pt-2">
            {poster && (
              <img src={poster} alt="" className="w-8 h-12 rounded object-cover opacity-60" />
            )}
            {item.vote_average > 0 && (
              <span className="text-clap-gold text-sm font-semibold ml-auto">
                ★ {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Compact article card — absolutely-positioned panel on hover ── */
function ArticleCard({ item, index, isExpanded, onHover }) {
  const wrapRef  = useRef(null);
  const [flipLeft, setFlipLeft] = useState(false);

  const href     = mediaHref(item);
  const backdrop = tmdbImg(item.backdrop_path, 'w780');
  const poster   = tmdbImg(item.poster_path, 'w342');
  const date     = itemDate(item);
  const title    = itemTitle(item);
  const bg       = backdrop || poster;
  const type     = item.first_air_date ? 'Série' : 'Film';

  const handleEnter = () => {
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      /* flip to the left if there's not enough room to the right */
      setFlipLeft(rect.right + 232 > window.innerWidth - 16);
    }
    onHover(item.id);
  };

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={() => onHover(null)}
    >
      {/* ── Image card ── */}
      <Link
        to={href}
        className="block relative overflow-hidden shadow-xl rounded-2xl"
        style={{ aspectRatio: '2/3' }}
      >
        {bg ? (
          <img
            src={bg}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isExpanded ? 'scale(1.06)' : 'scale(1)' }}
          />
        ) : (
          <div className="absolute inset-0 bg-clap-surface" />
        )}

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(5,5,15,0.95) 0%, rgba(5,5,15,0.4) 50%, transparent 100%)' }}
        />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-bold tracking-widest uppercase text-clap-gold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(13,13,13,0.75)', backdropFilter: 'blur(6px)', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            {type}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3
            className="font-display italic text-white leading-tight line-clamp-2"
            style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)' }}
          >
            {title}
          </h3>
          {item.vote_average > 0 && (
            <span className="text-clap-gold text-xs font-semibold mt-0.5 block">
              ★ {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </Link>

      {/* ── Popup flottant — centré verticalement sur la card ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            className="absolute z-50"
            style={{
              /* côté gauche ou droit selon la colonne */
              [flipLeft ? 'right' : 'left']: 'calc(100% + 12px)',
              /* centrage vertical sur la card */
              top: '50%',
              translateY: '-50%',
              transformOrigin: flipLeft ? 'right center' : 'left center',
              width: 248,
            }}
          >
            {/* ── Flèche / caret pointant vers la card ── */}
            <div
              style={{
                position: 'absolute',
                [flipLeft ? 'right' : 'left']: -9,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                /* outline du caret (couleur border) */
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                [flipLeft ? 'borderLeft' : 'borderRight']: '9px solid rgba(201,169,110,0.30)',
              }}
            />
            {/* caret intérieur (couleur du fond) */}
            <div
              style={{
                position: 'absolute',
                [flipLeft ? 'right' : 'left']: flipLeft ? -7 : -7,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '7px solid transparent',
                borderBottom: '7px solid transparent',
                [flipLeft ? 'borderLeft' : 'borderRight']: '8px solid rgba(10,10,22,0.98)',
                zIndex: 1,
              }}
            />

            {/* ── Corps du popup ── */}
            <div
              className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{
                background: 'rgba(10,10,22,0.98)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(201,169,110,0.28)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(201,169,110,0.08)',
              }}
            >
              {/* Poster + titre */}
              <div className="flex items-start gap-3">
                {poster && (
                  <img
                    src={poster}
                    alt=""
                    className="flex-shrink-0 rounded-xl object-cover shadow-lg"
                    style={{ width: 44, height: 64, border: '1px solid rgba(201,169,110,0.22)' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-clap-gold text-[10px] font-bold tracking-widest uppercase">{type}</span>
                  <h4 className="font-display italic text-white text-sm leading-tight mt-0.5 line-clamp-2">
                    {title}
                  </h4>
                </div>
              </div>

              {/* Overview */}
              {item.overview && (
                <p className="text-white/65 text-[11px] leading-relaxed line-clamp-5">
                  {item.overview}
                </p>
              )}

              {/* Note + date */}
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                {item.vote_average > 0 && (
                  <span className="text-clap-gold text-xs font-semibold">
                    ★ {item.vote_average.toFixed(1)}
                    <span className="text-white/35 font-normal"> /10</span>
                  </span>
                )}
                {date && (
                  <span className="text-white/45 text-[10px] ml-auto">{fmtDateShort(date)}</span>
                )}
              </div>

              {/* CTA */}
              <Link
                to={href}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 hover:bg-clap-gold hover:text-black"
                style={{
                  background: 'rgba(201,169,110,0.10)',
                  border: '1px solid rgba(201,169,110,0.38)',
                  color: '#C9A96E',
                }}
              >
                Voir {type === 'Série' ? 'la série' : 'le film'}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Filter tabs ──────────────────────────────────────────────── */
function FilterTabs({ active, onChange }) {
  const tabs = [
    { key: 'all',   label: 'Tout' },
    { key: 'movie', label: 'Films' },
    { key: 'tv',    label: 'Séries' },
  ];
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={
            active === t.key
              ? { background: '#C9A96E', color: '#0d0d0d' }
              : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)' }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────── */
export default function News() {
  const [filter,     setFilter]     = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const leaveTimer                  = useRef(null);

  /* Debounce collapse so the mouse can cross the 6px gap without flickering */
  const handleHover = useCallback((id) => {
    clearTimeout(leaveTimer.current);
    if (id !== null) {
      setExpandedId(id);
    } else {
      leaveTimer.current = setTimeout(() => setExpandedId(null), 150);
    }
  }, []);

  const { data: upcomingMovies, isLoading: lm } = useQuery({
    queryKey: ['upcoming', 'movie'],
    queryFn:  () => api.get('/movies/upcoming?mediaType=movie').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: upcomingTv, isLoading: lt } = useQuery({
    queryKey: ['upcoming', 'tv'],
    queryFn:  () => api.get('/movies/upcoming?mediaType=tv').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: trending } = useQuery({
    queryKey: ['trending', 'all', 'week'],
    queryFn:  () => api.get('/movies/trending?mediaType=all&timeWindow=week').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = lm || lt;

  /* ── Merge & sort all articles ── */
  const movies = (upcomingMovies?.results ?? []).map((m) => ({ ...m, media_type: 'movie' }));
  const tvShows = (upcomingTv?.results ?? []).map((t) => ({ ...t, media_type: 'tv' }));

  const allArticles = [...movies, ...tvShows]
    .filter((item) => item.backdrop_path && item.overview)
    .sort((a, b) => {
      const da = new Date(itemDate(a) || '9999');
      const db = new Date(itemDate(b) || '9999');
      return da - db;
    });

  const filtered = allArticles.filter((item) => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  /* ── Hero: top trending with backdrop ── */
  const hero = (trending?.results ?? []).find((t) => t.backdrop_path && t.overview)
    ?? filtered[0]
    ?? null;

  /* ── Featured (2 items, horizontal cards) ── */
  const featured = filtered.slice(0, 2);

  /* ── Grid articles (rest) ── */
  const gridArticles = filtered.slice(2, 14);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-clap-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-clap-gold/30 border-t-clap-gold animate-spin" />
          <p className="text-clap-muted text-sm">Chargement des actualités…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-clap-bg min-h-screen">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      {hero && <HeroArticle item={hero} />}

      {/* ══ CONTENT ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2
            className="font-display italic text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', textDecoration: 'underline', textDecorationColor: 'rgba(201,169,110,0.5)', textUnderlineOffset: 6 }}
          >
            News :
          </h2>
          <FilterTabs active={filter} onChange={setFilter} />
        </div>

        {/* Featured row — 2 large horizontal cards */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {featured.map((item, i) => (
              <FeaturedCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(201,169,110,0.3), transparent)' }} />
          <span className="text-clap-gold text-xs tracking-widest uppercase font-semibold">À venir</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(201,169,110,0.3), transparent)' }} />
        </div>

        {/* Article grid — portrait cards */}
        {gridArticles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" style={{ overflow: 'visible' }}>
            {gridArticles.map((item, i) => (
              <ArticleCard
                key={item.id}
                item={item}
                index={i}
                isExpanded={expandedId === item.id}
                onHover={handleHover}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-clap-muted">
            <p className="text-4xl mb-4">🎬</p>
            <p>Aucun contenu disponible pour ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
