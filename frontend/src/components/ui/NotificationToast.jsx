import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useNotificationStore from '../../store/notificationStore';

/* ─── Type config ─────────────────────────────────────────────── */
export const NOTIF_TYPES = {
  info:    { color: '#C9A96E', bg: 'rgba(201,169,110,0.13)', label: 'Info' },
  success: { color: '#4ade80', bg: 'rgba(74,222,128,0.11)',  label: 'Succès' },
  error:   { color: '#f87171', bg: 'rgba(248,113,113,0.13)', label: 'Erreur' },
  warning: { color: '#fb923c', bg: 'rgba(251,146,60,0.13)',  label: 'Attention' },
  badge:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.13)', label: 'Badge' },
};

/* ─── Icons per type ──────────────────────────────────────────── */
function TypeIcon({ type, color }) {
  const s = { width: 14, height: 14, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (type === 'success')
    return <svg viewBox="0 0 24 24" style={s}><polyline points="20 6 9 17 4 12" /></svg>;
  if (type === 'error')
    return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
  if (type === 'warning')
    return <svg viewBox="0 0 24 24" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  if (type === 'badge')
    return <svg viewBox="0 0 24 24" style={s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  /* info */
  return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
}

/* ─── Single toast ────────────────────────────────────────────── */
function Toast({ notification }) {
  const { t } = useTranslation();
  const remove = useNotificationStore((s) => s.remove);
  const { id, type, title, message, duration } = notification;
  const cfg = NOTIF_TYPES[type] ?? NOTIF_TYPES.info;

  /* auto-dismiss */
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => remove(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, remove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 72, scale: 0.93 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: 72, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-3 rounded-2xl pl-5 pr-4 py-3.5"
      style={{
        width: 320,
        background: 'rgba(12,12,20,0.97)',
        backdropFilter: 'blur(28px)',
        border: `1px solid ${cfg.color}35`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.65), inset 0 0 0 0.5px ${cfg.color}18`,
      }}
    >
      {/* Barre accent gauche */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
        style={{ background: cfg.color }}
      />

      {/* Icône */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
        aria-hidden="true"
        style={{ background: cfg.bg }}
      >
        <TypeIcon type={type} color={cfg.color} />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight">{title}</p>
        {message && (
          <p className="text-white/55 text-xs leading-snug mt-0.5 line-clamp-2">{message}</p>
        )}
      </div>

      {/* Fermer */}
      <button
        onClick={() => remove(id)}
        className="flex-shrink-0 text-white/25 hover:text-white/70 transition-colors mt-0.5 ml-1"
        aria-label={t('notifications.closeToast')}
      >
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Barre de progression */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl origin-left"
          style={{ background: cfg.color }}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

/* ─── Conteneur global (à monter dans App) ────────────────────── */
export default function NotificationContainer() {
  const notifications = useNotificationStore((s) => s.notifications);

  return (
    <div
      className="fixed right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none"
      style={{ top: 72 }}   /* sous la navbar */
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notification={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
