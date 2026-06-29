import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function MediaBadge({ type }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        type === 'tv'
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      }`}
    >
      {type === 'tv' ? 'Série' : 'Film'}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminComments() {
  const { t }  = useTranslation();
  const qc     = useQueryClient();
  const [search,  setSearch]  = useState('');
  const [confirm, setConfirm] = useState(null); // comment object
  const [page,    setPage]    = useState(1);
  const PAGE_SIZE = 10;

  const { data: rawComments, isLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn:  () => api.get('/admin/comments').then(r => r.data),
  });
  const comments = Array.isArray(rawComments) ? rawComments : [];

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/comments/${id}`),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-comments'] }); setConfirm(null); },
  });

  const filtered = comments.filter(c => {
    const q = search.toLowerCase();
    return (
      String(c.userId ?? '').includes(q) ||
      (c.content ?? '').toLowerCase().includes(q) ||
      String(c.tmdbId ?? '').includes(q)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-clap-light">{t('admin.comments.title')}</h1>
          <p className="text-white/40 text-sm mt-1">
            {comments.length} {t('admin.comments.total')}
          </p>
        </div>
        <input
          type="text"
          placeholder={t('admin.comments.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-clap-gold/40 transition-colors w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/8 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-white/40 uppercase tracking-widest text-xs">
              <th className="text-left px-4 py-3">{t('admin.comments.cols.user')}</th>
              <th className="text-left px-4 py-3">{t('admin.comments.cols.content')}</th>
              <th className="text-left px-4 py-3">{t('admin.comments.cols.media')}</th>
              <th className="text-left px-4 py-3">{t('admin.comments.cols.date')}</th>
              <th className="text-right px-4 py-3">{t('admin.comments.cols.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-white/5 rounded animate-pulse w-28" />
                      </td>
                    ))}
                  </tr>
                ))
              : paginated.map(c => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <span className="text-white/60 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                        #{c.userId}
                      </span>
                    </td>

                    {/* Content */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                        {c.content}
                      </p>
                    </td>

                    {/* Media */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MediaBadge type={c.mediaType} />
                        <span className="text-white/40 text-xs font-mono">#{c.tmdbId}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                      {formatDate(c.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setConfirm(c)}
                        className="text-xs px-2 py-1 rounded border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
                      >
                        {t('admin.comments.delete')}
                      </button>
                    </td>
                  </motion.tr>
                ))
            }
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">{t('admin.comments.noResults')}</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors disabled:opacity-30">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${p === page ? 'bg-clap-gold/20 text-clap-gold border border-clap-gold/30' : 'border border-white/10 text-white/40 hover:text-white'}`}
            >{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors disabled:opacity-30">→</button>
        </div>
      )}

      {/* Confirmation modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-clap-card border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            >
              <h3 className="text-white font-semibold mb-2">{t('admin.comments.confirmDelete')}</h3>
              <p className="text-white/50 text-sm mb-3 line-clamp-3 italic">
                « {confirm.content} »
              </p>
              <p className="text-white/30 text-xs mb-5">
                {t('admin.comments.byUser')} #{confirm.userId} · {formatDate(confirm.createdAt)}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
                >
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
