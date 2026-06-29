import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

function Badge({ role }) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        role === 'admin'
          ? 'bg-clap-gold/15 text-clap-gold border border-clap-gold/30'
          : 'bg-white/5 text-white/40 border border-white/10'
      }`}
    >
      {role}
    </span>
  );
}

export default function AdminUsers() {
  const { t }         = useTranslation();
  const qc            = useQueryClient();
  const currentUser   = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null); // { type: 'delete'|'role', user, newRole }
  const [page,   setPage]   = useState(1);
  const PAGE_SIZE = 10;

  const { data: rawUsers, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then(r => r.data),
  });
  const users = Array.isArray(rawUsers) ? rawUsers : [];

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setConfirm(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setConfirm(null); },
  });

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-clap-light">{t('admin.users.title')}</h1>
          <p className="text-white/40 text-sm mt-1">
            {users.length} {t('admin.users.total')}
          </p>
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder={t('admin.users.search')}
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
              <th className="text-left px-4 py-3">{t('admin.users.cols.user')}</th>
              <th className="text-left px-4 py-3">{t('admin.users.cols.email')}</th>
              <th className="text-left px-4 py-3">{t('admin.users.cols.role')}</th>
              <th className="text-left px-4 py-3">{t('admin.users.cols.level')}</th>
              <th className="text-right px-4 py-3">{t('admin.users.cols.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-white/5 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              : paginated.map(u => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-white/80 font-medium">{u.username}</span>
                        {u.email === currentUser?.email && (
                          <span className="text-[10px] text-clap-gold/60 border border-clap-gold/20 rounded px-1">{t('admin.users.you')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50">{u.email}</td>
                    <td className="px-4 py-3"><Badge role={u.role ?? 'user'} /></td>
                    <td className="px-4 py-3 text-white/50">{u.level ?? 1}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle role */}
                        {u.email !== currentUser?.email && (
                          <button
                            onClick={() => setConfirm({
                              type: 'role',
                              user: u,
                              newRole: u.role === 'admin' ? 'user' : 'admin',
                            })}
                            className="text-xs px-2 py-1 rounded border border-white/10 text-white/40 hover:text-clap-gold hover:border-clap-gold/30 transition-colors"
                          >
                            {u.role === 'admin' ? t('admin.users.demote') : t('admin.users.promote')}
                          </button>
                        )}
                        {/* Delete */}
                        {u.email !== currentUser?.email && (
                          <button
                            onClick={() => setConfirm({ type: 'delete', user: u })}
                            className="text-xs px-2 py-1 rounded border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 transition-colors"
                          >
                            {t('admin.users.delete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
            }
          </tbody>
        </table>

        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">{t('admin.users.noResults')}</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors disabled:opacity-30"
          >←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                p === page
                  ? 'bg-clap-gold/20 text-clap-gold border border-clap-gold/30'
                  : 'border border-white/10 text-white/40 hover:text-white'
              }`}
            >{p}</button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors disabled:opacity-30"
          >→</button>
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
              <h3 className="text-white font-semibold mb-2">
                {confirm.type === 'delete'
                  ? t('admin.users.confirmDelete')
                  : t('admin.users.confirmRole', { role: confirm.newRole })}
              </h3>
              <p className="text-white/50 text-sm mb-5">
                {confirm.user.username} — {confirm.user.email}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  className="flex-1 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => {
                    if (confirm.type === 'delete') {
                      deleteMutation.mutate(confirm.user.id);
                    } else {
                      roleMutation.mutate({ id: confirm.user.id, role: confirm.newRole });
                    }
                  }}
                  disabled={deleteMutation.isPending || roleMutation.isPending}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                    confirm.type === 'delete'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-clap-gold/10 text-clap-gold hover:bg-clap-gold/20 border border-clap-gold/30'
                  }`}
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
