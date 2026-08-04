import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

function StarIcon({ filled }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"
      fill={filled ? '#C9A96E' : 'rgba(255,255,255,0.12)'}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

export default function StarRating({ tmdbId, mediaType }) {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState(null);

  /* ── All ratings for this media (average) ── */
  const { data: allRatings = [] } = useQuery({
    queryKey: ['ratings', tmdbId, mediaType],
    queryFn: () => api.get(`/ratings?tmdbId=${tmdbId}&mediaType=${mediaType}`).then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });

  /* ── User's own rating ── */
  const { data: userRating } = useQuery({
    queryKey: ['my-rating', tmdbId, mediaType],
    queryFn: () =>
      api.get(`/ratings?tmdbId=${tmdbId}&mediaType=${mediaType}`)
        .then(r => (r.data ?? []).find(rating => rating.userId === user?.id) ?? null),
    enabled: isAuthenticated && !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const avg = allRatings.length
    ? (allRatings.reduce((s, r) => s + (r.score ?? 0), 0) / allRatings.length).toFixed(1)
    : null;

  const submitMutation = useMutation({
    mutationFn: (score) =>
      userRating?.id
        ? api.put(`/ratings/${userRating.id}`, { score })
        : api.post('/ratings', { tmdbId, mediaType, score }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', tmdbId, mediaType] });
      queryClient.invalidateQueries({ queryKey: ['my-rating', tmdbId, mediaType] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/ratings/${userRating.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', tmdbId, mediaType] });
      queryClient.invalidateQueries({ queryKey: ['my-rating', tmdbId, mediaType] });
    },
  });

  const displayScore = hovered ?? userRating?.score ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 flex-wrap">

        {/* Stars row */}
        <div
          className="flex gap-1"
          onMouseLeave={() => setHovered(null)}
          role="group"
          aria-label={t('movieDetail.ratingLabel')}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const score = i + 1;
            return (
              <motion.button
                key={score}
                type="button"
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => isAuthenticated && setHovered(score)}
                onClick={() => isAuthenticated && submitMutation.mutate(score)}
                aria-label={t('movieDetail.ratingScore', { score })}
                disabled={!isAuthenticated || submitMutation.isPending}
                className="transition-colors disabled:cursor-default"
                style={{ cursor: isAuthenticated ? 'pointer' : 'default' }}
              >
                <StarIcon filled={score <= displayScore} />
              </motion.button>
            );
          })}
        </div>

        {/* Score label */}
        {isAuthenticated && userRating && !hovered && (
          <span className="text-clap-gold text-sm font-semibold">{userRating.score}/10</span>
        )}
        {hovered && (
          <span className="text-white/60 text-sm">{hovered}/10</span>
        )}

        {/* Delete own rating */}
        {isAuthenticated && userRating && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="text-white/25 text-xs hover:text-red-400 transition-colors"
            aria-label={t('movieDetail.ratingDelete')}
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      {/* Average */}
      {avg && (
        <p className="text-white/35 text-xs">
          {t('movieDetail.ratingAvg', { avg, count: allRatings.length })}
        </p>
      )}

      {/* Login prompt */}
      {!isAuthenticated && (
        <p className="text-white/30 text-xs italic">{t('movieDetail.ratingLogin')}</p>
      )}
    </div>
  );
}
