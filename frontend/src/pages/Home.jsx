import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import useAuthStore from '../store/authStore';

/* ─── TMDB image helper ──────────────────────────────────────── */
// Backend sends snake_case because of @JsonProperty on Java fields
const tmdbImg = (path, size = 'w1280') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── Star rating ────────────────────────────────────────────── */
function Stars({ value = 0, count = 10, size = 'sm' }) {
  const filled = Math.round(value);
  const sz = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <div className={`flex gap-px ${sz}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? '#C9A96E' : '#3A3A5A' }}>★</span>
      ))}
    </div>
  );
}

/* ─── Favorite button ────────────────────────────────────────── */
function FavoriteButton({ tmdbId, mediaType }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn:  () => api.get('/favorites').then((r) => r.data),
    enabled:  isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const currentFav = (favorites ?? []).find(
    (f) => Number(f.tmdbId) === Number(tmdbId) && f.mediaType === mediaType
  );
  const isFav = Boolean(currentFav);

  const toggle = useMutation({
    mutationFn: () =>
      isFav
        ? api.delete(`/favorites/${currentFav.id}`)
        : api.post('/favorites', { tmdbId: Number(tmdbId), mediaType }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full border border-white/60 text-white hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-1.5"
      >
        <HeartIcon filled={false} />
        {t('home.addToFavorites')}
      </Link>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={() => toggle.mutate()}
      disabled={toggle.isPending}
      className="text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full border transition-colors whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
      style={{
        borderColor:     isFav ? '#e05555' : 'rgba(255,255,255,0.6)',
        backgroundColor: isFav ? 'rgba(224,85,85,0.15)' : 'transparent',
        color:           isFav ? '#e07070' : 'white',
      }}
    >
      <HeartIcon filled={isFav} />
      {isFav ? t('home.favorited') : t('home.addToFavorites')}
    </motion.button>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 18 18" fill={filled ? '#e05555' : 'none'} stroke={filled ? '#e05555' : 'currentColor'} strokeWidth="1.6">
      <path d="M9 15.5S1.5 11 1.5 5.5A4 4 0 019 3a4 4 0 017.5 2.5C16.5 11 9 15.5 9 15.5z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Hero section ───────────────────────────────────────────── */
function Hero({ movies }) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  /* ↓ increments each time the user manually changes slide → resets the interval */
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!movies?.length) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies?.length, resetKey]); // resetKey dependency restarts the timer

  if (!movies?.length) return null;

  const len   = movies.length;
  const prev  = (current - 1 + len) % len;
  const next  = (current + 1) % len;
  const movie = movies[current];
  const title = movie.title || movie.name;
  const type  = movie.media_type || 'movie';

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, transition: { duration: 0.3 } }),
  };

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setResetKey((k) => k + 1); // restart the 8s auto-advance timer
  };

  return (
    <div className="relative flex items-center justify-center gap-2 md:gap-4 px-2 md:px-6 overflow-hidden">

      {/* Prev card peek */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => goTo(prev)}
        className="flex-shrink-0 w-16 md:w-28 cursor-pointer rounded-xl overflow-hidden opacity-50 hover:opacity-70 transition-opacity"
      >
        <img
          src={tmdbImg(movies[prev].backdrop_path, 'w500')}
          alt=""
          className="w-full h-52 md:h-80 object-cover"
        />
      </motion.div>

      {/* Main card */}
      <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[460px]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={movie.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Backdrop */}
            <img
              src={tmdbImg(movie.backdrop_path)}
              alt={title}
              className="w-full h-full object-cover"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-12 md:p-6">
              <h2 className="font-display italic text-white text-xl md:text-3xl font-bold mb-2 drop-shadow">
                {title}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Stars value={movie.vote_average} />
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/${type === 'tv' ? 'serie' : 'film'}/${movie.id}`}
                    className="text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full border border-white/60 text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    {t('home.watchTrailers')}
                  </Link>
                  <FavoriteButton
                    tmdbId={movie.id}
                    mediaType={type === 'tv' ? 'tv' : 'movie'}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next card peek */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => goTo(next)}
        className="flex-shrink-0 w-16 md:w-28 cursor-pointer rounded-xl overflow-hidden opacity-50 hover:opacity-70 transition-opacity"
      >
        <img
          src={tmdbImg(movies[next].backdrop_path, 'w500')}
          alt=""
          className="w-full h-52 md:h-80 object-cover"
        />
      </motion.div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {movies.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width:           i === current ? 20 : 6,
              height:          6,
              backgroundColor: i === current ? '#C9A96E' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Movie card (carousel item) ────────────────────────────── */
function MovieCard({ movie }) {
  const title = movie.title || movie.name;
  const type  = movie.media_type || 'movie';

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-36 md:w-44 cursor-pointer"
    >
      <Link to={`/${type === 'tv' ? 'serie' : 'film'}/${movie.id}`}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
          <img
            src={tmdbImg(movie.poster_path, 'w342')}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white text-xs font-semibold truncate mb-1">{title}</p>
            <Stars value={movie.vote_average} count={10} size="sm" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Horizontal carousel ────────────────────────────────────── */
function Carousel({ movies }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {/* Left arrow */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2"
      >
        ‹
      </button>

      {/* Cards row */}
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2"
      >
        ›
      </button>
    </div>
  );
}

/* ─── Skeleton loader ─────────────────────────────────────────── */
function CarouselSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36 md:w-44 aspect-[2/3] rounded-xl bg-clap-card animate-pulse" />
      ))}
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="flex items-center gap-2 md:gap-4 px-2 md:px-6">
      <div className="flex-shrink-0 w-16 md:w-28 h-52 md:h-80 rounded-xl bg-clap-card animate-pulse" />
      <div className="flex-1 h-[300px] md:h-[460px] rounded-2xl bg-clap-card animate-pulse" />
      <div className="flex-shrink-0 w-16 md:w-28 h-52 md:h-80 rounded-xl bg-clap-card animate-pulse" />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();
  // Trending: use mediaType=all → TMDB returns movies + TV mixed
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api.get('/movies/trending?mediaType=all&timeWindow=week').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  // Popular: fetch movie + tv separately and interleave
  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: async () => {
      const [movieRes, tvRes] = await Promise.all([
        api.get('/movies/popular?mediaType=movie').then((r) => r.data),
        api.get('/movies/popular?mediaType=tv').then((r) => r.data),
      ]);
      const m = (movieRes.results ?? []).map((r) => ({ ...r, media_type: 'movie' }));
      const t = (tvRes.results  ?? []).map((r) => ({ ...r, media_type: 'tv' }));
      const merged = [];
      const len = Math.max(m.length, t.length);
      for (let i = 0; i < len; i++) {
        if (m[i]) merged.push(m[i]);
        if (t[i]) merged.push(t[i]);
      }
      return { results: merged };
    },
    staleTime: 5 * 60 * 1000,
  });

  const trending = trendingData?.results ?? [];
  const popular  = popularData?.results  ?? [];

  return (
    <div className="pt-16 min-h-screen bg-clap-bg">
      <div className="flex flex-col gap-10 py-6">

        {/* ── Hero ── */}
        <section>
          {trendingLoading ? <HeroSkeleton /> : <Hero movies={trending} />}
        </section>

        {/* ── Trending Now ── */}
        <section className="px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display italic text-2xl md:text-3xl text-white">
              {t('home.trendingNow')}
            </h2>
            <Link
              to="/catalogue"
              className="text-xs md:text-sm text-clap-gold hover:text-white transition-colors tracking-wide"
            >
              {t('home.showMore')}
            </Link>
          </div>
          {trendingLoading ? <CarouselSkeleton /> : <Carousel movies={trending} />}
        </section>

        {/* ── Top Rated ── */}
        <section className="px-4 md:px-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display italic text-2xl md:text-3xl text-white">
              {t('home.topRated')}
            </h2>
            <Link
              to="/catalogue"
              className="text-xs md:text-sm text-clap-gold hover:text-white transition-colors tracking-wide"
            >
              {t('home.showMore')}
            </Link>
          </div>
          {popularLoading ? <CarouselSkeleton /> : <Carousel movies={popular} />}
        </section>

      </div>
    </div>
  );
}
