import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// ── API helpers ────────────────────────────────────────────────────────────

const getUsers = () =>
  axios.get('/admin/users', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(r => r.data);

const sendToUser = (payload) =>
  axios.post('/admin/notifications/send', payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(r => r.data);

const broadcastAll = (payload) =>
  axios.post('/admin/notifications/broadcast', payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }).then(r => r.data);

// ── Constants ──────────────────────────────────────────────────────────────

const TYPES = [
  { value: 'info',    label: 'Info',    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'success', label: 'Success', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'error',   label: 'Error',   color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { value: 'badge',   label: 'Badge',   color: 'bg-clap-gold/20 text-clap-gold border-clap-gold/30' },
  { value: 'update',  label: 'Update',  color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function TypeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TYPES.map(t => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            value === t.value
              ? t.color + ' ring-1 ring-offset-1 ring-offset-black/50 ring-current'
              : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FeedbackBanner({ result, error, onDismiss }) {
  if (!result && !error) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`flex items-start justify-between gap-4 rounded-xl px-4 py-3 text-sm border ${
          error
            ? 'bg-red-500/10 border-red-500/20 text-red-300'
            : 'bg-green-500/10 border-green-500/20 text-green-300'
        }`}
      >
        <span>{error ? `❌ ${error}` : `✅ ${result}`}</span>
        <button onClick={onDismiss} className="shrink-0 opacity-50 hover:opacity-100">✕</button>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AdminNotifications() {
  const { t } = useTranslation();

  // Forms state
  const [mode, setMode]           = useState('broadcast'); // 'broadcast' | 'single'
  const [selectedUser, setSelectedUser] = useState('');
  const [userSearch, setUserSearch]     = useState('');
  const [type, setType]           = useState('info');
  const [message, setMessage]     = useState('');
  const [feedback, setFeedback]   = useState({ result: null, error: null });

  // Load users for the single-user selector
  const { data: rawUsers = [] } = useQuery({
    queryKey: ['admin-users-notif'],
    queryFn: getUsers,
  });
  const users = Array.isArray(rawUsers) ? rawUsers : [];

  const filteredUsers = userSearch.trim()
    ? users.filter(u =>
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
      )
    : users;

  // Mutations
  const sendMutation = useMutation({
    mutationFn: sendToUser,
    onSuccess: () => {
      setFeedback({ result: t('admin.notifications.successSend'), error: null });
      setMessage('');
    },
    onError: () => setFeedback({ result: null, error: t('admin.notifications.errorSend') }),
  });

  const broadcastMutation = useMutation({
    mutationFn: broadcastAll,
    onSuccess: (data) => {
      setFeedback({
        result: t('admin.notifications.successBroadcast', { sent: data.sent, total: data.total }),
        error: null,
      });
      setMessage('');
    },
    onError: () => setFeedback({ result: null, error: t('admin.notifications.errorBroadcast') }),
  });

  const isPending = sendMutation.isPending || broadcastMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedback({ result: null, error: null });

    if (!message.trim()) return;

    if (mode === 'broadcast') {
      broadcastMutation.mutate({ type, message });
    } else {
      if (!selectedUser) return;
      sendMutation.mutate({ userId: Number(selectedUser), type, message });
    }
  };

  const currentType = TYPES.find(t => t.value === type);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl italic text-clap-light mb-1">
          {t('admin.notifications.title')}
        </h1>
        <p className="text-white/40 text-sm">{t('admin.notifications.subtitle')}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
        {[
          { key: 'broadcast', label: t('admin.notifications.modeBroadcast'), icon: '📢' },
          { key: 'single',    label: t('admin.notifications.modeSingle'),    icon: '👤' },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setFeedback({ result: null, error: null }); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              mode === m.key
                ? 'bg-clap-gold/15 text-clap-gold border border-clap-gold/25'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Form card */}
      <motion.form
        onSubmit={handleSubmit}
        layout
        className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-5"
      >
        {/* Feedback */}
        <FeedbackBanner
          result={feedback.result}
          error={feedback.error}
          onDismiss={() => setFeedback({ result: null, error: null })}
        />

        {/* User selector (single mode) */}
        <AnimatePresence>
          {mode === 'single' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden space-y-2"
            >
              <label className="text-white/60 text-xs uppercase tracking-widest">
                {t('admin.notifications.recipient')}
              </label>
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder={t('admin.notifications.searchUser')}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-clap-gold/40"
              />
              <div className="max-h-44 overflow-y-auto rounded-xl border border-white/8 divide-y divide-white/5">
                {filteredUsers.length === 0 && (
                  <p className="text-white/30 text-xs text-center py-4">{t('common.loading')}</p>
                )}
                {filteredUsers.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => { setSelectedUser(String(u.id)); setUserSearch(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      selectedUser === String(u.id)
                        ? 'bg-clap-gold/10 text-clap-gold'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                      {u.username?.[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className="font-medium">{u.username}</span>
                    <span className="text-white/30 text-xs ml-auto">{u.email}</span>
                    {selectedUser === String(u.id) && <span className="text-clap-gold text-xs">✓</span>}
                  </button>
                ))}
              </div>
              {selectedUser && (
                <p className="text-clap-gold/70 text-xs">
                  {t('admin.notifications.selectedUser')} :{' '}
                  <strong className="text-clap-gold">
                    {users.find(u => String(u.id) === selectedUser)?.username ?? selectedUser}
                  </strong>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-widest">
            {t('admin.notifications.type')}
          </label>
          <TypeSelector value={type} onChange={setType} />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-white/60 text-xs uppercase tracking-widest">
            {t('admin.notifications.message')}
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder={t('admin.notifications.messagePlaceholder')}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-clap-gold/40 resize-none"
          />
          <div className="flex justify-between items-center">
            {/* Preview badge */}
            {message && (
              <span className={`text-xs px-2 py-0.5 rounded-md border ${currentType?.color}`}>
                {currentType?.label} · aperçu
              </span>
            )}
            <span className="text-white/20 text-xs ml-auto">{message.length}/500</span>
          </div>
        </div>

        {/* Preview card */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-black/40 border border-white/8 px-4 py-3 space-y-1"
          >
            <p className="text-white/30 text-xs uppercase tracking-widest">{t('admin.notifications.preview')}</p>
            <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md border ${currentType?.color}`}>
              {currentType?.label}
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{message}</p>
          </motion.div>
        )}

        {/* Send button */}
        <button
          type="submit"
          disabled={isPending || !message.trim() || (mode === 'single' && !selectedUser)}
          className="w-full py-3 rounded-xl bg-clap-gold/15 border border-clap-gold/30 text-clap-gold font-medium text-sm hover:bg-clap-gold/25 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="animate-spin text-base">◌</span>
              {t('admin.notifications.sending')}
            </>
          ) : mode === 'broadcast' ? (
            <>📢 {t('admin.notifications.sendBroadcast', { count: users.length })}</>
          ) : (
            <>✉️ {t('admin.notifications.sendSingle')}</>
          )}
        </button>
      </motion.form>

      {/* Info block */}
      <div className="rounded-xl bg-white/3 border border-white/8 px-5 py-4 text-white/40 text-xs space-y-1.5">
        <p className="text-white/60 font-medium text-sm">{t('admin.notifications.infoTitle')}</p>
        <p>• {t('admin.notifications.info1')}</p>
        <p>• {t('admin.notifications.info2')}</p>
        <p>• {t('admin.notifications.info3')}</p>
      </div>
    </div>
  );
}
