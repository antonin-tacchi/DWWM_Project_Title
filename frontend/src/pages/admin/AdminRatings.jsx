import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function Stars({ score }) {
  const filled = Math.round((score / 10) * 5);
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 10 10" fill="none">
          <path
            d="M5 1l1.1 2.2L8.5 3.6 6.75 5.3l.4 2.2L5 6.4l-2.15 1.1.4-2.2L1.5 3.6l2.4-.4z"
            fill={i < filled ? '#C9A96E' : 'rgba(255,255,255,0.1)'}
          />
        </svg>
      ))}
      <span className="text-white/40 text-xs ml-1">{score}/10</span>
    </div>
  );
}

function MediaBadge({ type }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
      type === 'tv'
        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    }`}>
      {type === 'tv' ? 'Série' : 'Film'}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function AdminRatings() {
  const { t }  = useTranslation();
  const qc     = useQueryClient();
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState(null);

  const { data: rawRatings, isLoading } = useQuery({
    queryKey: ['admin-ratings'],
    queryFn:  () => api.get('/admin/ratings').then(r => r.data),
  });
  const ratings = Array.isArray(rawRatings) ? rawRatings : [];

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/ratings/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-ratings'] }); qc.invalidateQueries({ queryKey: ['admin-stats'] }); setConfirm(null); },
  });

  const filtered = ratings.filter(r => {
    const q = search.toLowerCase();
    return (
      String(r.userId  ?? '').includes(q) ||
      String(r.tmdbId  ?? '').includes(q) ||
      String(r.score   ?? '').includes(q)
    );
  });

  /* Score distribution */
  const avgScore = ratings.length
    ? (ratings.reduce((s, r) => s + (r.score ?? 0), 0) / ratings.length).toFixed(1)
    : '—';

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-clap-light">{t('admin.ratings.title')}</h1>
          <p className="text-white/40 text-sm mt-1">
            {ratings.length} {t('admin.ratings.total')}
            {ratings.length > 0 && (
              <span className="ml-3 text-clap-gold/70">∅ {avgScore}/10</span>
            )}
          </p>
        </div>
        <input
          type="text"
          placeholder={t('admin.ratings.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-clap-gold/40 transition-colors w-56"
        />
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-white/40 uppercase tracking-widest text-xs">
              <th className="text-left px-4 py-3">{t('admin.ratings.cols.user')}</th>
              <th className="text-left px-4 py-3">{t('admin.ratings.cols.media')}</th>
              <th className="text-left px-4 py-3">{t('admin.ratings.cols.score')}</th>
              <th className="text-left px-4 py-3">{t('admin.ratings.cols.date')}</th>
              <th className="text-right px-4 py-3">{t('admin.ratings.cols.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-white/5 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : filtered.map(r => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white/60 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                        #{r.userId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MediaBadge type={r.mediaType} />
                        <span className="text-white/40 text-xs font-mono">#{r.tmdbId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Stars score={r.score ?? 0} />
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setConfirm(r)}
                        className="text-xs px-2 py-1 rounded border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
                      >
                        {t('admin.ratings.delete')}
                      </button>
                    </td>
                  </motion.tr>
                ))
            }
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">{t('admin.ratings.noResults')}</div>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-clap-card border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            >
              <h3 className="text-white font-semibold mb-2">{t('admin.ratings.confirmDelete')}</h3>
              <p className="text-white/50 text-sm mb-1">
                {t('admin.ratings.byUser')} #{confirm.userId}
              </p>
              <div className="mb-5"><Stars score={confirm.score ?? 0} /></div>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(null)} className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors">
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirm.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors disabled:opacity-50"
                >
                  {t('common.confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
