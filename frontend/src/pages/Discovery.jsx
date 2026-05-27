import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const GOLD = '#C9A96E';
const tmdbImg = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── Mood options ───────────────────────────────────────────── */
const MOODS = [
  { id: 'action',    emoji: '💥', genreIds: [28, 12],     labelKey: 'moodAction' },
  { id: 'comedy',    emoji: '😂', genreIds: [35],          labelKey: 'moodComedy' },
  { id: 'drama',     emoji: '🎭', genreIds: [18],          labelKey: 'moodDrama' },
  { id: 'horror',    emoji: '😱', genreIds: [27, 53],      labelKey: 'moodHorror' },
  { id: 'romance',   emoji: '❤️', genreIds: [10749],       labelKey: 'moodRomance' },
  { id: 'scifi',     emoji: '🚀', genreIds: [878, 14],     labelKey: 'moodSciFi' },
  { id: 'animation', emoji: '✨', genreIds: [16],          labelKey: 'moodAnimation' },
  { id: 'docs',      emoji: '📹', genreIds: [99],          labelKey: 'moodDocs' },
];

const MEDIA_TYPES = [
  { value: 'movie', labelKey: 'typeMovie' },
  { value: 'tv',    labelKey: 'typeTv' },
];

/* ─── Result card ────────────────────────────────────────────── */
function ResultCard({ item, mediaType }) {
  const title = item.title || item.name || '—';
  const type  = mediaType === 'tv' ? 'serie' : 'film';
  const pct   = Math.round((item.vote_average ?? 0) * 10);
  const color = pct >= 70 ? '#4ade80' : pct >= 50 ? '#facc15' : '#f87171';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{ border: `1px solid ${GOLD}25`, background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Poster */}
      {item.poster_path && (
        <div className="relative w-full" style={{ paddingBottom: '150%' }}>
          <img
            src={tmdbImg(item.poster_path, 'w342')}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>
      )}

      {/* Info */}
      <div className={`${item.poster_path ? 'absolute bottom-0 left-0 right-0' : ''} p-5`}>
        <p className="font-display italic text-white text-lg leading-tight mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
          <span className="text-white/40 text-xs">
            {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || '—'}
          </span>
        </div>
        <Link
          to={`/${type}/${item.id}`}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
          style={{ background: 'rgba(201,169,110,0.15)', border: `1px solid ${GOLD}50`, color: GOLD }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,110,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,169,110,0.15)'; }}
        >
          Voir →
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function Discovery() {
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood]   = useState(null);
  const [mediaType,    setMediaType]       = useState('movie');
  const [results,      setResults]         = useState([]);
  const [searching,    setSearching]       = useState(false);
  const [hasSearched,  setHasSearched]     = useState(false);

  const handleDiscover = async () => {
    if (!selectedMood) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const mood = MOODS.find((m) => m.id === selectedMood);
      const genreParam = mood.genreIds.join(',');
      const { data } = await api.get('/movies/discover', {
        params: {
          mediaType,
          withGenres: genreParam,
          page: Math.ceil(Math.random() * 5),
          sortBy: 'popularity.desc',
        },
      });
      const all     = data.results ?? [];
      /* Pick 3 random results */
      const shuffled = [...all].sort(() => Math.random() - 0.5);
      setResults(shuffled.slice(0, 3));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-clap-bg pb-20 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: `${GOLD}80` }}
          >
            {t('discovery.label')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display italic text-4xl md:text-5xl text-white mb-4"
          >
            {t('discovery.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm"
            style={{ color: 'rgba(232,220,191,0.5)' }}
          >
            {t('discovery.subtitle')}
          </motion.p>
        </div>

        {/* ── Media type toggle ── */}
        <div className="flex justify-center gap-3 mb-8">
          {MEDIA_TYPES.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => setMediaType(value)}
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all"
              style={mediaType === value
                ? { background: 'rgba(201,169,110,0.2)', border: `1px solid ${GOLD}`, color: GOLD }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              {t(`discovery.${labelKey}`)}
            </button>
          ))}
        </div>

        {/* ── Mood grid ── */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood.id === selectedMood ? null : mood.id)}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all"
              style={selectedMood === mood.id
                ? { background: 'rgba(201,169,110,0.15)', border: `1px solid ${GOLD}60` }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span
                className="text-xs font-medium text-center leading-tight"
                style={{ color: selectedMood === mood.id ? GOLD : 'rgba(255,255,255,0.55)' }}
              >
                {t(`discovery.${mood.labelKey}`)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Discover button ── */}
        <div className="flex justify-center mb-12">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDiscover}
            disabled={!selectedMood || searching}
            className="relative px-10 py-3.5 rounded-full font-display italic text-lg font-semibold transition-all disabled:opacity-40"
            style={{
              background: selectedMood
                ? 'linear-gradient(135deg, rgba(201,169,110,0.25) 0%, rgba(139,110,66,0.25) 100%)'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${selectedMood ? GOLD : 'rgba(255,255,255,0.15)'}`,
              color: selectedMood ? GOLD : 'rgba(255,255,255,0.3)',
            }}
          >
            {searching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                {t('discovery.searching')}
              </span>
            ) : (
              t('discovery.discoverBtn')
            )}
          </motion.button>
        </div>

        {/* ── Results ── */}
        <AnimatePresence mode="wait">
          {hasSearched && !searching && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {results.length === 0 ? (
                <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {t('discovery.noResults')}
                </p>
              ) : (
                <>
                  <p className="text-center text-xs mb-6 uppercase tracking-widest" style={{ color: `${GOLD}70` }}>
                    {t('discovery.resultsLabel')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {results.map((item) => (
                      <ResultCard key={item.id} item={item} mediaType={mediaType} />
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleDiscover}
                      className="text-sm transition-colors"
                      style={{ color: `${GOLD}70` }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}70`)}
                    >
                      ↺ {t('discovery.tryAgain')}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <Link
              to="/catalogue"
              className="text-xs transition-colors"
              style={{ color: 'rgba(232,220,191,0.3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,220,191,0.3)')}
            >
              {t('discovery.catalogueLink')}
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
