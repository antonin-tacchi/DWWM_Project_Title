import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const CARD_ICONS = {
  users:         '👤',
  comments:      '💬',
  ratings:       '⭐',
  favorites:     '♥',
  notifications: '🔔',
};

const BAR_COLORS = {
  users:         '#C9A96E',
  comments:      '#7dd3fc',
  ratings:       '#fbbf24',
  favorites:     '#f472b6',
  notifications: '#a78bfa',
};

/* ── Stat card ────────────────────────────────────────────────── */
function StatCard({ icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="bg-white/[0.03] border border-white/8 rounded-xl p-6 flex flex-col gap-3 hover:border-clap-gold/20 transition-colors"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-semibold text-clap-light tabular-nums">
          {value?.toLocaleString() ?? '—'}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Horizontal bar chart ─────────────────────────────────────── */
function BarChart({ entries }) {
  const max = Math.max(...entries.map(([, v]) => v ?? 0), 1);
  return (
    <div className="space-y-4">
      {entries.map(([key, value], i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.06 }}
          className="flex items-center gap-3"
        >
          <span className="text-base w-5 flex-shrink-0">{CARD_ICONS[key] ?? '📊'}</span>
          <span className="text-white/40 text-xs w-24 flex-shrink-0 capitalize">{key}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: BAR_COLORS[key] ?? '#C9A96E' }}
              initial={{ width: 0 }}
              animate={{ width: `${((value ?? 0) / max) * 100}%` }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-white/60 text-xs tabular-nums w-10 text-right">
            {(value ?? 0).toLocaleString()}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Recent logs widget ──────────────────────────────────────── */
const ACTION_STYLE = {
  DELETE_USER:    { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: '🗑' },
  CHANGE_ROLE:    { color: 'text-clap-gold',  bg: 'bg-clap-gold/10',  icon: '🔑' },
  DELETE_COMMENT: { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: '💬' },
  DELETE_RATING:  { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: '⭐' },
};

function RecentLogs() {
  const { t } = useTranslation();
  const { data: rawLogs } = useQuery({
    queryKey: ['admin-logs'],
    queryFn:  () => api.get('/admin/logs').then(r => r.data),
  });
  const logs = Array.isArray(rawLogs) ? rawLogs.slice(0, 5) : [];

  if (logs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/[0.02] border border-white/8 rounded-xl p-5"
    >
      <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
        {t('admin.dashboard.recentActivity')}
      </p>
      <div className="space-y-2">
        {logs.map((log, i) => {
          const style = ACTION_STYLE[log.action] ?? { color: 'text-white/60', bg: 'bg-white/5', icon: '•' };
          return (
            <div key={log.id ?? i} className="flex items-center gap-3 text-xs">
              <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-sm ${style.bg}`}>
                {style.icon}
              </span>
              <span className={`font-medium ${style.color} flex-shrink-0`}>{log.action}</span>
              <span className="text-white/30 truncate">{log.details}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => api.get('/admin/stats').then(r => r.data),
  });

  const entries = (stats && typeof stats === 'object' && !Array.isArray(stats))
    ? Object.entries(stats)
    : [];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-clap-light">{t('admin.dashboard.title')}</h1>
        <p className="text-white/40 text-sm mt-1">{t('admin.dashboard.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-6 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {entries.map(([key, val], i) => (
              <StatCard
                key={key}
                icon={CARD_ICONS[key] ?? '📊'}
                label={t(`admin.dashboard.stats.${key}`)}
                value={typeof val === 'number' ? val : undefined}
                index={i}
              />
            ))}
          </div>

          {/* Bar chart */}
          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white/[0.02] border border-white/8 rounded-xl p-6 mb-6"
            >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-5">
                {t('admin.dashboard.distribution')}
              </p>
              <BarChart entries={entries} />
            </motion.div>
          )}

          {/* Recent logs */}
          <RecentLogs />
        </>
      )}

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <p className="text-white/20 text-xs text-center uppercase tracking-widest">
          Clap! — {t('admin.dashboard.poweredBy')}
        </p>
      </div>
    </div>
  );
}
