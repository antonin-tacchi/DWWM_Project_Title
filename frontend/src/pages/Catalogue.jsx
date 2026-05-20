import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

/* ─── Constants ──────────────────────────────────────────────── */
const GENRES = ['Action', 'Drama', 'Thriller', 'Horror', 'Comedy', 'Sci-Fi', 'Romance', 'Animation'];
const TMDB_GENRE_MAP = {
  Action: 28, Drama: 18, Thriller: 53, Horror: 27,
  Comedy: 35, 'Sci-Fi': 878, Romance: 10749, Animation: 16,
};

const PLATFORMS = [
  { id: 'netflix',     tmdbId: 8,   label: 'NETFLIX',     bg: '#E50914', font: '"Arial Black", sans-serif' },
  { id: 'prime',       tmdbId: 119, label: 'prime video', bg: '#00A8E1', font: 'inherit' },
  { id: 'disney',      tmdbId: 337, label: 'Disney+',     bg: '#113CCF', font: 'Georgia, serif' },
  { id: 'crunchyroll', tmdbId: 283, label: 'Crunchyroll', bg: '#F47521', font: 'inherit' },
  { id: 'hbo',         tmdbId: 384, label: 'HBO Max',     bg: '#6B00E6', font: 'inherit' },
  { id: 'apple',       tmdbId: 350, label: 'Apple TV+',   bg: '#2A2A2A', font: 'inherit' },
];

const LANGUAGES = [
  { label: 'English',  code: 'en' },
  { label: 'French',   code: 'fr' },
  { label: 'Korean',   code: 'ko' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Spanish',  code: 'es' },
  { label: 'Italian',  code: 'it' },
];

const CURRENT_YEAR = new Date().getFullYear();
const tmdbImg = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── Star rating ────────────────────────────────────────────── */
function Stars({ value = 0 }) {
  const filled = Math.round(value);
  return (
    <div className="flex gap-px text-xs">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? '#C9A96E' : '#3A3A5A' }}>★</span>
      ))}
    </div>
  );
}

/* ─── Movie card ─────────────────────────────────────────────── */
function MovieCard({ movie }) {
  const title  = movie.title || movie.name;
  const type   = movie.media_type || 'movie';
  const poster = tmdbImg(movie.poster_path);

  return (
    <Link to={`/${type === 'tv' ? 'tv' : 'movies'}/${movie.id}`}>
      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-clap-card">
          {poster
            ? <img src={poster} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-clap-gray text-xs px-2 text-center">{title}</div>
          }
        </div>
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-semibold truncate mb-1">{title}</p>
          <Stars value={movie.vote_average} />
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Checkbox ───────────────────────────────────────────────── */
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group" onClick={onChange}>
      <div
        className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ backgroundColor: checked ? '#C9A96E' : 'transparent', borderColor: checked ? '#C9A96E' : '#4A4A6A' }}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3 5.5L8 1" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="font-display italic text-sm text-clap-light group-hover:text-clap-gold transition-colors">{label}</span>
    </label>
  );
}

/* ─── Range slider ───────────────────────────────────────────── */
function RangeSlider({ min, max, value, onChange }) {
  return (
    <div className="w-full">
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: '#C9A96E' }}
      />
      <div className="flex justify-between text-xs mt-1">
        <span className="text-clap-gray">{min}</span>
        <span className="text-clap-gold font-semibold">{value}</span>
        <span className="text-clap-gray">{max}</span>
      </div>
    </div>
  );
}

function ShowMore({ expanded, onToggle }) {
  return (
    <button onClick={onToggle} className="text-clap-gold text-xs mt-2 hover:underline tracking-wide">
      {expanded ? 'Show less' : 'Show more'}
    </button>
  );
}

/* ─── Search input (réutilisable) ────────────────────────────── */
function SearchInput({ value, onChange, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
          <circle cx="9.5" cy="9.5" r="7.5" stroke="#C9A96E" strokeWidth="2"/>
          <path d="M15 15L20.5 20.5" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        className="w-full bg-clap-card border border-clap-muted/50 rounded-full py-2 pl-8 pr-7 text-xs text-clap-light placeholder-clap-gray outline-none transition-all focus:border-clap-gold focus:ring-1 focus:ring-clap-gold/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-clap-gray hover:text-white text-sm leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}

/* ─── Filter content (partagé desktop + mobile) ──────────────── */
function FilterContent({ isSearching, filters, onToggleGenre, onTogglePlatform, onToggleLanguage, onSetRating, onSetYear }) {
  const [showGenres,    setShowGenres]    = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const visibleGenres    = showGenres    ? GENRES    : GENRES.slice(0, 4);
  const visiblePlatforms = showPlatforms ? PLATFORMS : PLATFORMS.slice(0, 4);
  const visibleLanguages = showLanguages ? LANGUAGES : LANGUAGES.slice(0, 4);

  return (
    <div className={isSearching ? 'opacity-40 pointer-events-none select-none' : ''}>
      <h2 className="font-display italic text-clap-light text-xl leading-tight mb-6">
        Refine Your<br />Experience
      </h2>

      {/* Genres */}
      <section className="mb-6">
        <h3 className="font-display italic text-white text-base mb-3">Genres</h3>
        <div className="flex flex-col gap-2.5">
          {visibleGenres.map((g) => (
            <Checkbox key={g} label={g} checked={filters.genres.includes(g)} onChange={() => onToggleGenre(g)} />
          ))}
        </div>
        <ShowMore expanded={showGenres} onToggle={() => setShowGenres((v) => !v)} />
      </section>

      {/* Rating */}
      <section className="mb-6">
        <h3 className="font-display italic text-white text-base mb-3">Rating</h3>
        <RangeSlider min={0} max={10} value={filters.maxRating} onChange={onSetRating} />
      </section>

      {/* Release Year */}
      <section className="mb-6">
        <h3 className="font-display italic text-white text-base mb-3">Release Year</h3>
        <RangeSlider min={1900} max={CURRENT_YEAR} value={filters.maxYear} onChange={onSetYear} />
      </section>

      {/* Platform */}
      <section className="mb-6">
        <h3 className="font-display italic text-white text-base mb-3">Plateform</h3>
        <div className="flex flex-wrap gap-2">
          {visiblePlatforms.map((p) => {
            const active = filters.platforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => onTogglePlatform(p.id)}
                className="px-2 py-1 rounded text-xs font-bold transition-all"
                style={{
                  backgroundColor: active ? p.bg : `${p.bg}77`,
                  color: '#fff', fontFamily: p.font,
                  outline: active ? `2px solid ${p.bg}` : '2px solid transparent',
                  outlineOffset: '1px',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <ShowMore expanded={showPlatforms} onToggle={() => setShowPlatforms((v) => !v)} />
      </section>

      {/* Language */}
      <section className="mb-6">
        <h3 className="font-display italic text-white text-base mb-3">Language</h3>
        <div className="flex flex-col gap-2.5">
          {visibleLanguages.map((l) => (
            <Checkbox key={l.code} label={l.label} checked={filters.languages.includes(l.code)} onChange={() => onToggleLanguage(l.code)} />
          ))}
        </div>
        <ShowMore expanded={showLanguages} onToggle={() => setShowLanguages((v) => !v)} />
      </section>
    </div>
  );
}

/* ─── Desktop sidebar ────────────────────────────────────────── */
function Sidebar(props) {
  const { query, onQueryChange, ...rest } = props;
  return (
    <aside className="hidden md:block w-44 lg:w-48 flex-shrink-0">
      <SearchInput value={query} onChange={onQueryChange} className="mb-6" />
      <FilterContent {...rest} />
    </aside>
  );
}

/* ─── Mobile top bar + drawer ────────────────────────────────── */
function MobileBar({ query, onQueryChange, activeCount, onOpenDrawer }) {
  return (
    <div className="flex md:hidden items-center gap-2 mb-4">
      <SearchInput value={query} onChange={onQueryChange} className="flex-1" />
      <button
        onClick={onOpenDrawer}
        className="relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-clap-muted/50 bg-clap-card text-clap-light text-xs transition-colors hover:border-clap-gold"
      >
        {/* Filter icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6"  x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-clap-gold text-clap-bg text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}

function MobileDrawer({ open, onClose, isSearching, filters, onToggleGenre, onTogglePlatform, onToggleLanguage, onSetRating, onSetYear, activeCount, onReset }) {
  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
            style={{ backgroundColor: '#12122A', maxHeight: '85vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-clap-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-clap-muted/30">
              <span className="font-display italic text-white text-lg">Filters</span>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button onClick={onReset} className="text-xs text-clap-gold hover:underline">
                    Reset ({activeCount})
                  </button>
                )}
                <button onClick={onClose} className="text-clap-gray hover:text-white text-xl leading-none">×</button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(85vh - 90px)' }}>
              <FilterContent
                isSearching={isSearching}
                filters={filters}
                onToggleGenre={onToggleGenre}
                onTogglePlatform={onTogglePlatform}
                onToggleLanguage={onToggleLanguage}
                onSetRating={onSetRating}
                onSetYear={onSetYear}
              />
            </div>

            {/* Apply button */}
            <div className="px-5 pb-6 pt-2 border-t border-clap-muted/30">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-clap-gold text-clap-bg font-bold text-sm tracking-wide hover:brightness-110 transition-all"
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Pagination ─────────────────────────────────────────────── */
function Pagination({ page, totalPages, onPageChange }) {
  const clamped = Math.min(totalPages, 237);
  const pages = [];
  if (clamped <= 7) {
    for (let i = 1; i <= clamped; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '...', clamped - 2, clamped - 1, clamped);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10 flex-wrap font-display italic">
      <PageBtn onClick={() => onPageChange(1)}        disabled={page === 1}>«</PageBtn>
      <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</PageBtn>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`d${i}`} className="px-1 text-clap-gray text-sm">...</span>
          : <PageBtn key={p} onClick={() => onPageChange(p)} active={p === page}>{p}</PageBtn>
      )}
      <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === clamped}>›</PageBtn>
      <PageBtn onClick={() => onPageChange(clamped)}  disabled={page === clamped}>»</PageBtn>
    </div>
  );
}

function PageBtn({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className="w-8 h-8 flex items-center justify-center text-sm rounded transition-colors"
      style={{
        color:      active ? '#C9A96E' : disabled ? '#3A3A5A' : 'rgba(255,255,255,0.65)',
        fontWeight: active ? 700 : 400,
        cursor:     disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Random Pick ────────────────────────────────────────────── */
function RandomPick() {
  const navigate = useNavigate();
  const [pickType, setPickType] = useState('movie');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleFind = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get(`/movies/discover/random?mediaType=${pickType}`);
      navigate(`/${pickType === 'tv' ? 'tv' : 'movies'}/${data.id}`);
    } catch {
      setError('Aucun résultat, réessaye !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden flex items-center justify-center mt-16" style={{ minHeight: 420 }}>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/RandomPickBackground.png')" }} />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="font-display italic text-4xl md:text-5xl leading-tight"
          style={{ color: '#E8DCBF' }}
        >
          Find Your New<br />Favorite
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="flex rounded-full border border-white/25 overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
        >
          {[{ key: 'movie', label: 'Movie' }, { key: 'tv', label: 'Tv Show' }].map(({ key, label }, i) => (
            <button key={key} onClick={() => setPickType(key)}
              className="px-10 py-2.5 text-sm font-semibold transition-all"
              style={{
                backgroundColor: pickType === key ? 'rgba(255,255,255,0.15)' : 'transparent',
                color:            pickType === key ? '#fff' : 'rgba(255,255,255,0.45)',
                borderRight:      i === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {error && <p className="text-red-400 text-sm -mb-4">{error}</p>}

        <motion.button
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: loading ? 1 : 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={handleFind} disabled={loading}
          className="px-24 py-4 rounded-full text-white text-xl font-bold tracking-[0.25em] transition-all disabled:opacity-60"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? '...' : 'FIND'}
        </motion.button>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
const INITIAL_FILTERS = { genres: [], maxRating: 10, maxYear: CURRENT_YEAR, platforms: [], languages: [] };

export default function Catalogue() {
  const [page,    setPage]    = useState(1);
  const [query,   setQuery]   = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debounceRef = useRef(null);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /* Debounce search 350ms */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const isSearching = debouncedQuery.length >= 2;

  /* Nombre de filtres actifs (pour le badge mobile) */
  const activeFilterCount =
    filters.genres.length +
    filters.platforms.length +
    filters.languages.length +
    (filters.maxRating < 10 ? 1 : 0) +
    (filters.maxYear < CURRENT_YEAR ? 1 : 0);

  /* Helpers */
  const toggle = (key, value) => {
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));
    setPage(1);
  };
  const setSlider = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const resetFilters = () => { setFilters(INITIAL_FILTERS); setPage(1); };
  const handleQueryChange = (v) => { setQuery(v); setPage(1); };

  const filterProps = {
    isSearching,
    filters,
    onToggleGenre:    (g) => toggle('genres', g),
    onTogglePlatform: (p) => toggle('platforms', p),
    onToggleLanguage: (l) => toggle('languages', l),
    onSetRating:      (v) => setSlider('maxRating', v),
    onSetYear:        (v) => setSlider('maxYear', v),
  };

  /* Build discover params */
  const buildDiscoverParams = () => {
    const p = new URLSearchParams({ mediaType: 'movie', page });
    if (filters.genres.length)    p.set('genres',    filters.genres.map((g) => TMDB_GENRE_MAP[g]).join(','));
    if (filters.maxRating < 10)   p.set('maxRating', filters.maxRating);
    if (filters.maxYear < CURRENT_YEAR) p.set('maxYear', filters.maxYear);
    if (filters.languages.length) p.set('language',  filters.languages[0]);
    if (filters.platforms.length) {
      const ids = filters.platforms.map((id) => PLATFORMS.find((p) => p.id === id)?.tmdbId).filter(Boolean).join(',');
      p.set('providers', ids);
    }
    return p.toString();
  };

  /* Queries */
  const { data: discoverData, isLoading: discoverLoading, isFetching: discoverFetching } = useQuery({
    queryKey:  ['catalogue', page, filters],
    queryFn:   () => api.get(`/movies/discover?${buildDiscoverParams()}`).then((r) => r.data),
    staleTime: 3 * 60 * 1000,
    placeholderData: (prev) => prev,
    enabled: !isSearching,
  });

  const { data: searchData, isLoading: searchLoading, isFetching: searchFetching } = useQuery({
    queryKey:  ['catalogue-search', debouncedQuery],
    queryFn:   () => api.get(`/movies/search?query=${encodeURIComponent(debouncedQuery)}&page=1`).then((r) => r.data),
    staleTime: 60 * 1000,
    enabled: isSearching,
  });

  const movies     = isSearching ? (searchData?.results  ?? []) : (discoverData?.results     ?? []);
  const totalPages = isSearching ? 1                             : (discoverData?.total_pages ?? 1);
  const isLoading  = isSearching ? searchLoading  : discoverLoading;
  const isFetching = isSearching ? searchFetching : discoverFetching;

  const handlePageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="pt-16 min-h-screen bg-clap-bg">
      <div className="flex gap-6 px-4 md:px-6 py-8">

        {/* ── Desktop sidebar ── */}
        <Sidebar query={query} onQueryChange={handleQueryChange} {...filterProps} />

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Barre mobile : search + bouton filtres */}
          <MobileBar
            query={query}
            onQueryChange={handleQueryChange}
            activeCount={activeFilterCount}
            onOpenDrawer={() => setDrawerOpen(true)}
          />

          {isSearching && (
            <p className="text-clap-gray text-sm mb-4 italic">
              Results for <span className="text-clap-gold">"{debouncedQuery}"</span>
            </p>
          )}

          <div
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6 transition-opacity duration-200"
            style={{ opacity: isFetching && !isLoading ? 0.5 : 1 }}
          >
            {isLoading
              ? Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl bg-clap-card animate-pulse" />
                ))
              : movies.length > 0
                ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                : <div className="col-span-full py-20 text-center text-clap-gray">No results found.</div>
            }
          </div>

          {!isLoading && !isSearching && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeCount={activeFilterCount}
        onReset={resetFilters}
        {...filterProps}
      />

      <RandomPick />
    </div>
  );
}
