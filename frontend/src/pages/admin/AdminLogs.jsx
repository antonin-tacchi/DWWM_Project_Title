import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const ACTION_CONFIG = {
  DELETE_USER:    { label: 'Suppression utilisateur', color: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/10',    icon: '🗑' },
  CHANGE_ROLE:    { label: 'Changement de rôle',      color: 'text-clap-gold',  border: 'border-clap-gold/20',  bg: 'bg-clap-gold/10',  icon: '🔑' },
  DELETE_COMMENT: { label: 'Suppression commentaire', color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10', icon: '💬' },
  DELETE_RATING:  { label: 'Suppression note',        color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10', icon: '⭐' },
};

const FILTERS = ['ALL', 'DELETE_USER', 'CHANGE_ROLE', 'DELETE_COMMENT', 'DELETE_RATING'];

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminLogs() {
  const { t }   = useTranslation();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data: rawLogs, isLoading } = useQuery({
    queryKey: ['admin-logs'],
    queryFn:  () => api.get('/admin/logs').then(r => r.data),
    refetchInterval: 30_000,
  });
  const logs = Array.isArray(rawLogs) ? rawLogs : [];

  const filtered = logs.filter(l => {
    const matchFilter = filter === 'ALL' || l.action === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (l.details  ?? '').toLowerCase().includes(q) ||
      String(l.adminId ?? '').includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-clap-light">{t('admin.logs.title')}</h1>
          <p className="text-white/40 text-sm mt-1">{logs.length} {t('admin.logs.total')}</p>
        </div>
        <input
          type="text"
          placeholder={t('admin.logs.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-clap-gold/40 transition-colors w-56"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => {
          const cfg = ACTION_CONFIG[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? f === 'ALL'
                    ? 'bg-white/10 border-white/20 text-white'
                    : `${cfg.bg} ${cfg.border} ${cfg.color}`
                  : 'bg-white/0 border-white/10 text-white/40 hover:text-white/70'
              }`}
            >
              {f === 'ALL' ? t('admin.logs.filterAll') : `${cfg?.icon ?? ''} ${cfg?.label ?? f}`}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-white/30 text-sm">{t('admin.logs.noResults')}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, i) => {
            const cfg = ACTION_CONFIG[log.action] ?? { label: log.action, color: 'text-white/60', border: 'border-white/10', bg: 'bg-white/5', icon: '•' };
            return (
              <motion.div
                key={log.id ?? i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border bg-white/[0.015] ${cfg.border} hover:bg-white/[0.03] transition-colors`}
              >
                {/* Icon */}
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base ${cfg.bg}`}>
                  {cfg.icon}
                </span>

                {/* Action */}
                <div className="flex-shrink-0 w-36">
                  <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                </div>

                {/* Details */}
                <p className="flex-1 text-white/50 text-xs truncate">{log.details}</p>

                {/* Admin ID */}
                <span className="flex-shrink-0 text-white/25 text-xs font-mono">
                  admin #{log.adminId}
                </span>

                {/* Date */}
                <span className="flex-shrink-0 text-white/30 text-xs whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
