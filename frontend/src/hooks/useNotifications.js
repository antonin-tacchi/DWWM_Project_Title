import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../store/authStore';

/* ─── Types → labels affichés dans le panel ──────────────────── */
export const NOTIF_LABELS = {
  info:    'Information',
  success: 'Succès',
  error:   'Erreur',
  warning: 'Attention',
  badge:   'Badge débloqué',
  session: 'Session',
  update:  'Mise à jour',
};

export function titleFromType(type) {
  return NOTIF_LABELS[type] ?? type?.charAt(0).toUpperCase() + type?.slice(1) ?? 'Notification';
}

/* ─── Hook principal ──────────────────────────────────────────── */
export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const qc = useQueryClient();

  /* ── Fetch ── */
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn:  () => api.get('/notifications').then((r) => r.data),
    enabled:  isAuthenticated,
    refetchInterval: 30_000,   /* polling toutes les 30 s */
    staleTime: 15_000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ── Marquer une notif comme lue ── */
  const markReadMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  /* ── Supprimer une notif ── */
  const removeMutation = useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onMutate: async (id) => {
      /* optimistic update : retire de la liste immédiatement */
      await qc.cancelQueries({ queryKey: ['notifications'] });
      const prev = qc.getQueryData(['notifications']);
      qc.setQueryData(['notifications'], (old = []) => old.filter((n) => n.id !== id));
      return { prev };
    },
    onError: (_err, _id, ctx) => qc.setQueryData(['notifications'], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  /* ── Marquer toutes les non-lues comme lues ── */
  function markAllRead() {
    const unread = notifications.filter((n) => !n.isRead);
    unread.forEach((n) => markReadMutation.mutate(n.id));
  }

  /* ── Supprimer toutes ── */
  function clearAll() {
    notifications.forEach((n) => removeMutation.mutate(n.id));
  }

  return {
    notifications,
    unreadCount,
    markRead: (id) => markReadMutation.mutate(id),
    remove:   (id) => removeMutation.mutate(id),
    markAllRead,
    clearAll,
  };
}
