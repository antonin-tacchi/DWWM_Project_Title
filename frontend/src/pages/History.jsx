import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

/* ─── Helpers ────────────────────────────────────────────────── */
const tmdbImg = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── Stars ──────────────────────────────────────────────────── */
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

/* ─── One history entry — fetches its own movie/tv detail ─────── */
function HistoryCard({ entry }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const { data: detail, isLoading } = useQuery({
    queryKey: ['detail', entry.mediaType, entry.tmdbId],
    queryFn:  () => api.get(`/movies/${entry.tmdbId}?mediaType=${entry.mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const title  = detail?.title || detail?.name;
  const poster = tmdbImg(detail?.poster_path);
  const href   = `/${entry.mediaType === 'tv' ? 'serie' : 'film'}/${entry.tmdbId}`;
  const watchedAt = entry.consultedAt
    ? new Date(entry.consultedAt).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  if (isLoading) {
    return (
      <div>
        <div className="rounded-xl overflow-hidden aspect-[2/3] bg-clap-card animate-pulse" />
        <div className="mt-2 h-3 w-3/4 rounded bg-clap-card animate-pulse" />
      </div>
    );
  }

  return (
    <Link to={href}>
      <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-clap-card">
          {poster
            ? <img src={poster} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-clap-gray text-xs px-2 text-center">{title ?? '—'}</div>
          }
        </div>
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-semibold truncate mb-1">{title}</p>
          <div className="flex items-center justify-between gap-2">
            <Stars value={detail?.vote_average} />
            {watchedAt && (
              <span className="text-clap-gray text-[10px] flex-shrink-0">{watchedAt}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── History page ───────────────────────────────────────────── */
export default function History() {
  const { t } = useTranslation();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['history'],
    queryFn:  () => api.get('/movies/history').then((r) => r.data),
    staleTime: 60 * 1000,
  });

  return (
    <div className="pt-16 min-h-screen bg-clap-bg px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display italic text-white text-3xl md:text-4xl mb-2">
          {t('history.title')}
        </h1>
        <p className="text-clap-gray text-sm mb-8">{t('history.subtitle')}</p>

        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="rounded-xl overflow-hidden aspect-[2/3] bg-clap-card animate-pulse" />
                <div className="mt-2 h-3 w-3/4 rounded bg-clap-card animate-pulse" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-5xl">🎬</span>
            <p className="text-clap-gray text-sm max-w-sm">{t('history.empty')}</p>
            <Link to="/catalogue" className="text-clap-gold text-sm hover:underline italic">
              {t('history.browseCatalogue')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-6">
            {history.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
