import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import useAuthStore from '../store/authStore';

/* ─── TMDB image helper ──────────────────────────────────────── */
const tmdbImg = (path, size = 'w1280') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

/* ─── Icons ──────────────────────────────────────────────────── */
function EyeIcon({ show }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function PlusIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}

/* ─── Avatar circle (initials or image) ─────────────────────── */
function Avatar({ username, avatarUrl, size = 'xl', avatarPos }) {
  const initials = (username ?? '?').slice(0, 2).toUpperCase();
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-3xl md:w-32 md:h-32 md:text-4xl',
  };
  const objPos = avatarPos ? `${avatarPos.x}% ${avatarPos.y}%` : '50% 20%';
  return (
    <div
      className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #8B6E42 100%)', border: '3px solid rgba(201,169,110,0.5)' }}
    >
      {avatarUrl
        ? <img src={avatarUrl} alt={username} className="w-full h-full object-cover"
            style={{ objectPosition: objPos }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        : initials}
    </div>
  );
}

/* ─── Level badge + XP bar ────────────────────────────────────── */
function LevelBadge({ level, xp }) {
  const { t } = useTranslation();
  const currentLevel = level ?? 1;
  const currentXp    = xp ?? 0;
  const xpInLevel    = currentXp % 100;          // XP dans le niveau actuel
  const xpNeeded     = 100;                       // XP pour passer au niveau suivant
  const progress     = (xpInLevel / xpNeeded) * 100;

  return (
    <div className="flex flex-col gap-1">
      <span className="px-3 py-0.5 rounded-full text-xs font-bold self-start"
        style={{ background: 'rgba(201,169,110,0.2)', border: '1px solid #C9A96E', color: '#C9A96E' }}>
        {t('userProfile.level', { level: currentLevel })}
      </span>
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #C9A96E, #e8c97a)' }}
          />
        </div>
        <span className="text-white/30 text-xs">{xpInLevel}/{xpNeeded} XP</span>
      </div>
    </div>
  );
}

/* ─── Form input ──────────────────────────────────────────────── */
function FormInput({ label, type = 'text', value, onChange, placeholder, rightEl }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-clap-gold transition-colors"
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  );
}

/* ─── Gold button ─────────────────────────────────────────────── */
function GoldButton({ children, onClick, disabled, type = 'button', full = false, small = false }) {
  const { t } = useTranslation();
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? 'w-full' : ''} ${small ? 'py-2 px-4 text-xs' : 'py-3 px-6 text-sm'} rounded-xl font-semibold transition-all disabled:opacity-50`}
      style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #8B6E42 100%)', color: '#fff' }}
    >
      {disabled ? t('userProfile.saving') : children}
    </motion.button>
  );
}

/* ─── Modal shell ─────────────────────────────────────────────── */
function ModalShell({ title, onClose, children, wide = false, headerRight }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} rounded-2xl overflow-hidden`}
        style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h2 className="font-display italic text-white text-xl font-bold">{title}</h2>
          <div className="flex items-center gap-3">
            {headerRight}
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <CloseIcon />
            </button>
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  EDIT PROFILE MODAL                                             */
/* ─────────────────────────────────────────────────────────────── */
function EditProfileModal({ user, onClose }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateUser, logout } = useAuthStore();

  const [username,    setUsername]    = useState(user?.username  ?? '');
  const [email,       setEmail]       = useState(user?.email     ?? '');
  const [bio,         setBio]         = useState(user?.bio       ?? '');
  const [currentPw,  setCurrentPw]   = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showCur,     setShowCur]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConf,    setShowConf]    = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [deleteStep,  setDeleteStep]  = useState(0); // 0=hidden, 1=first confirm, 2=final confirm

  /* Avatar preview (read-only — modifiable via "Photo de profil" dans le dropdown) */
  const previewInitials = (username || '?').slice(0, 2).toUpperCase();

  const profileMut = useMutation({
    mutationFn: () => api.put('/auth/me', {
      username,
      email,
      bio,
      avatarUrl:          user?.avatarUrl            ?? null,
      bannerTmdbId:       user?.bannerTmdbId         ?? null,
      bannerMediaType:    user?.bannerMediaType       ?? null,
      bannerBackdropPath: user?.bannerBackdropPath    ?? null,
    }),
    onSuccess: (res) => {
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setSuccess(t('userProfile.successProfileUpdated'));
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => setError(err.response?.data?.message ?? t('userProfile.errorUpdateProfile')),
  });

  const passwordMut = useMutation({
    mutationFn: () => api.put('/auth/me/password', {
      currentPassword: currentPw,
      newPassword: newPw,
      confirmNewPassword: confirmPw,
    }),
    onSuccess: () => {
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setSuccess(t('userProfile.successPasswordChanged'));
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => setError(err.response?.data?.message ?? t('userProfile.errorWrongPassword')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const saves = [profileMut.mutateAsync()];
    if (currentPw || newPw || confirmPw) {
      if (newPw !== confirmPw) { setError(t('userProfile.errorPasswordMismatch')); return; }
      saves.push(passwordMut.mutateAsync());
    }
    Promise.all(saves).catch(() => {});
  };

  const deleteMut = useMutation({
    mutationFn: () => api.delete('/auth/me'),
    onSuccess: () => {
      queryClient.clear();
      logout();
    },
  });

  const isPending = profileMut.isPending || passwordMut.isPending;

  return (
    <ModalShell title={t('userProfile.editProfileTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">

        {/* ── Identity fields ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput label={t('userProfile.username')}
            value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder={t('userProfile.usernamePlaceholder')} />
          <FormInput label={t('userProfile.email')} type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t('userProfile.emailPlaceholder')} />
        </div>

        <FormInput label={t('userProfile.bio')}
          value={bio} onChange={(e) => setBio(e.target.value)}
          placeholder={t('userProfile.bioPlaceholder')} />

        {/* ── Password divider ── */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/30 text-xs uppercase tracking-wider">{t('userProfile.changePassword')}</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── Password fields ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormInput label={t('userProfile.currentPassword')}
            type={showCur ? 'text' : 'password'}
            value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
            rightEl={
              <button type="button" onClick={() => setShowCur(!showCur)} className="text-white/40 hover:text-white transition-colors">
                <EyeIcon show={showCur} />
              </button>
            } />
          <FormInput label={t('userProfile.newPassword')}
            type={showNew ? 'text' : 'password'}
            value={newPw} onChange={(e) => setNewPw(e.target.value)}
            placeholder="••••••••"
            rightEl={
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-white/40 hover:text-white transition-colors">
                <EyeIcon show={showNew} />
              </button>
            } />
          <FormInput label={t('userProfile.confirmNewPassword')}
            type={showConf ? 'text' : 'password'}
            value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="••••••••"
            rightEl={
              <button type="button" onClick={() => setShowConf(!showConf)} className="text-white/40 hover:text-white transition-colors">
                <EyeIcon show={showConf} />
              </button>
            } />
        </div>

        {/* ── Feedback ── */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">{error}</motion.p>
          )}
          {success && (
            <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-green-400 bg-green-400/10 rounded-xl px-4 py-2">✓ {success}</motion.p>
          )}
        </AnimatePresence>

        <div className="pt-1">
          <GoldButton type="submit" disabled={isPending} full>{t('userProfile.editProfileBtn')}</GoldButton>
        </div>

        {/* ── Danger zone ── */}
        <div className="border-t border-red-500/15 pt-5 mt-2 flex flex-col gap-3">
          <p className="text-red-400/60 text-xs uppercase tracking-wider font-semibold">{t('userProfile.dangerZone')}</p>

          {deleteStep === 0 && (
            <button
              type="button"
              onClick={() => setDeleteStep(1)}
              className="self-start text-sm text-red-400/50 hover:text-red-400 border border-red-500/20 hover:border-red-400/40 rounded-lg px-4 py-2 transition-colors"
            >
              {t('userProfile.deleteAccount')}
            </button>
          )}

          {deleteStep === 1 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-4 flex flex-col gap-3"
              >
                <p className="text-red-300 text-sm font-medium">{t('userProfile.deleteAccountTitle')}</p>
                <p className="text-white/50 text-xs leading-relaxed">{t('userProfile.deleteAccountWarning')}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(0)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="flex-1 py-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 text-sm font-medium transition-colors"
                  >
                    {t('userProfile.deleteAccountConfirmBtn')}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {deleteStep === 2 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/12 border border-red-500/40 rounded-xl px-4 py-4 flex flex-col gap-3"
              >
                <p className="text-red-300 text-sm font-semibold">{t('userProfile.deleteAccountFinal')}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(0)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMut.mutate()}
                    disabled={deleteMut.isPending}
                    className="flex-1 py-2 rounded-lg bg-red-500/30 text-red-300 hover:bg-red-500/50 border border-red-400/50 text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {deleteMut.isPending ? '…' : t('userProfile.deleteAccountFinalBtn')}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </form>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  EDIT BACKGROUND MODAL — multi-image carousel per media         */
/* ─────────────────────────────────────────────────────────────── */

/* One backdrop thumbnail inside the per-media carousel */
function BackdropThumb({ filePath, isSelected, onSelect }) {
  if (!filePath) return null;
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      className="relative flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: 200,
        aspectRatio: '16/9',
        border: isSelected ? '2px solid #C9A96E' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 14px rgba(201,169,110,0.45)' : 'none',
      }}
    >
      <img
        src={tmdbImg(filePath, 'w500')}
        alt=""
        className="w-full h-full object-cover"
      />
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#C9A96E' }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </motion.button>
  );
}

/* Row for one media: title + horizontal carousel of its backdrops */
function MediaBackdropRow({ tmdbId, mediaType, selectedPath, onSelect }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  /* Fetch movie/show details for the title */
  const { data: detail } = useQuery({
    queryKey: ['movie-detail', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  /* Fetch all available backdrop images */
  const { data: imagesData } = useQuery({
    queryKey: ['movie-images', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}/images?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const title     = detail?.title || detail?.name || '…';
  const backdrops = imagesData?.backdrops ?? [];

  /* Also include the main backdrop_path from details if not already present.
     Jackson serialises @JsonProperty("file_path") as "file_path" in the response,
     so we use the snake_case key throughout. */
  const allPaths = [
    ...(detail?.backdrop_path ? [{ file_path: detail.backdrop_path }] : []),
    ...backdrops.filter((b) => b.file_path && b.file_path !== detail?.backdrop_path),
  ].slice(0, 12);

  if (allPaths.length === 0 && !detail) {
    /* Still loading */
    return (
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 rounded-xl bg-white/5 animate-pulse" style={{ width: 200, aspectRatio: '16/9' }} />
          ))}
        </div>
      </div>
    );
  }

  if (allPaths.length === 0) return null;

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

  return (
    <div className="space-y-2">
      {/* Media title as category label */}
      <div className="flex items-center gap-2">
        {detail?.poster_path && (
          <img src={tmdbImg(detail.poster_path, 'w92')} alt="" className="w-6 h-9 rounded object-cover flex-shrink-0" />
        )}
        <span className="text-white font-semibold text-sm truncate">{title}</span>
        <span className="text-white/30 text-xs flex-shrink-0">
          {t('userProfile.imageCount', { count: allPaths.length })}
        </span>
      </div>

      {/* Horizontal image carousel */}
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 text-lg leading-none"
        >‹</button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allPaths.map((b, i) => (
            <BackdropThumb
              key={i}
              filePath={b.file_path}
              isSelected={selectedPath === b.file_path}
              onSelect={() => onSelect(b.file_path, tmdbId, mediaType)}
            />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 text-lg leading-none"
        >›</button>
      </div>
    </div>
  );
}

function EditBackgroundModal({ user, onClose }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn:  () => api.get('/favorites').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

  /* Initialise from current user so the existing selection is visible on open */
  const [selectedPath,   setSelectedPath]   = useState(user?.bannerBackdropPath ?? null);
  const [selectedTmdbId, setSelectedTmdbId] = useState(user?.bannerTmdbId      ?? null);
  const [selectedType,   setSelectedType]   = useState(user?.bannerMediaType   ?? 'movie');
  const [position,       setPosition]       = useState(() => getBannerPosition(user?.email));

  const handleSelect = (filePath, tmdbId, mediaType) => {
    setSelectedPath(filePath);
    setSelectedTmdbId(tmdbId);
    setSelectedType(mediaType);
  };

  const saveMut = useMutation({
    mutationFn: () => api.put('/auth/me', {
      username:           user?.username,
      email:              user?.email,
      bio:                user?.bio,
      avatarUrl:          user?.avatarUrl ?? null,
      bannerTmdbId:       selectedTmdbId,
      bannerMediaType:    selectedType,
      bannerBackdropPath: selectedPath,
    }),
    onSuccess: (res) => {
      saveBannerPosition(user?.email, position); // persist position in localStorage
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      onClose();
    },
  });

  /* Deduplicate favorites by tmdbId so each media appears once */
  const uniqueMedia = favorites.reduce((acc, fav) => {
    if (!acc.find((f) => f.tmdbId === fav.tmdbId)) acc.push(fav);
    return acc;
  }, []);

  return (
    <ModalShell
      title={t('userProfile.editBackgroundTitle')}
      onClose={onClose}
      wide
      headerRight={
        <GoldButton onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
          {t('userProfile.saveBackground')}
        </GoldButton>
      }
    >
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto flex flex-col gap-6">
        {/* ── Drag positioner — shown only when an image is selected ── */}
        {selectedPath && (
          <ImagePositioner
            imagePath={selectedPath}
            position={position}
            onPositionChange={setPosition}
          />
        )}

        {uniqueMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <span className="text-5xl mb-3">🎬</span>
            <p>{t('userProfile.noFavoritesForBackground')}</p>
          </div>
        ) : (
          uniqueMedia.map((fav) => (
            <MediaBackdropRow
              key={fav.tmdbId}
              tmdbId={fav.tmdbId}
              mediaType={fav.mediaType}
              selectedPath={selectedPath}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </ModalShell>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  CREATE PLAYLIST MODAL                                          */
/* ─────────────────────────────────────────────────────────────── */
function CreatePlaylistModal({ onClose }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name,    setName]    = useState('');
  const [desc,    setDesc]    = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error,   setError]   = useState('');

  const createMut = useMutation({
    mutationFn: () => api.post('/lists', { name, description: desc, isPublic }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      onClose();
    },
    onError: (err) => setError(err.response?.data?.message ?? t('userProfile.errorCreatePlaylist')),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setError(t('userProfile.errorNameRequired')); return; }
    setError('');
    createMut.mutate();
  };

  return (
    <ModalShell title={t('userProfile.newPlaylistTitle')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
        <FormInput
          label={t('userProfile.playlistName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('userProfile.playlistNamePlaceholder')}
        />
        <FormInput
          label={t('userProfile.playlistDescription')}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={t('userProfile.playlistDescriptionPlaceholder')}
        />
        {/* Public toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsPublic(!isPublic)}
            className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            style={{ background: isPublic ? '#C9A96E' : 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              animate={{ x: isPublic ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
            />
          </div>
          <span className="text-sm text-white/70">{t('userProfile.makePublic')}</span>
        </label>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-red-400 bg-red-400/10 rounded-xl px-4 py-2">{error}</motion.p>
          )}
        </AnimatePresence>

        <div className="pt-1 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/30 hover:text-white transition-colors">
            {t('userProfile.cancel')}
          </button>
          <div className="flex-1">
            <GoldButton type="submit" disabled={createMut.isPending} full>
              {t('userProfile.createPlaylist')}
            </GoldButton>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* ─── Banner position helpers ────────────────────────────────── */
const DEFAULT_POS = { x: 50, y: 50 };

function getBannerPosition(userEmail) {
  try {
    const raw = localStorage.getItem(`clap-banner-pos-${userEmail ?? 'guest'}`);
    if (!raw) return { ...DEFAULT_POS };
    const parsed = JSON.parse(raw);
    /* Migrate old string format ("top" / "center" / "bottom") */
    if (typeof parsed === 'string') return { ...DEFAULT_POS };
    return parsed;
  } catch { return { ...DEFAULT_POS }; }
}
function saveBannerPosition(userEmail, pos) {
  try { localStorage.setItem(`clap-banner-pos-${userEmail ?? 'guest'}`, JSON.stringify(pos)); }
  catch {}
}

/* ─── Image drag positioner ──────────────────────────────────── */
function ImagePositioner({ imagePath, position, onPositionChange }) {
  const isDragging      = useRef(false);
  const startPt         = useRef({ x: 0, y: 0 });
  const startPos        = useRef({ ...DEFAULT_POS });
  const onChangeRef     = useRef(onPositionChange);
  onChangeRef.current   = onPositionChange; // always current, avoids stale closure

  /* Sensitivity: px → % shift */
  const SENS = 0.18;

  const applyDelta = (clientX, clientY) => {
    const dx = (startPt.current.x - clientX) * SENS;
    const dy = (startPt.current.y - clientY) * SENS;
    onChangeRef.current({
      x: Math.max(0, Math.min(100, startPos.current.x + dx)),
      y: Math.max(0, Math.min(100, startPos.current.y + dy)),
    });
  };

  /* ── Mouse ── */
  const onMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startPt.current    = { x: e.clientX, y: e.clientY };
    startPos.current   = { ...position };
  };

  useEffect(() => {
    const onMove = (e) => { if (isDragging.current) applyDelta(e.clientX, e.clientY); };
    const onUp   = ()  => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Touch ── */
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    isDragging.current = true;
    startPt.current    = { x: touch.clientX, y: touch.clientY };
    startPos.current   = { ...position };
  };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    applyDelta(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => { isDragging.current = false; };

  if (!imagePath) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs uppercase tracking-wider">Aperçu &amp; positionnement</span>
        {/* Reset button */}
        <button
          onClick={() => onPositionChange({ ...DEFAULT_POS })}
          className="text-white/25 text-xs hover:text-white/60 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Draggable preview */}
      <div
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full rounded-xl overflow-hidden select-none"
        style={{
          paddingBottom: '33%', /* ~3:1 banner ratio */
          cursor: 'grab',
          border: '1px solid rgba(201,169,110,0.2)',
        }}
      >
        <img
          src={tmdbImg(imagePath, 'w1280')}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: `${position.x}% ${position.y}%` }}
          alt="preview"
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.15)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.6">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white/60 text-[10px] tracking-wider uppercase">Glisser pour cadrer</span>
          </div>
        </div>

        {/* Position indicator */}
        <div
          className="absolute bottom-2 right-2 text-[9px] font-mono"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {Math.round(position.x)}% · {Math.round(position.y)}%
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  EDIT AVATAR MODAL                                               */
/* ─────────────────────────────────────────────────────────────── */

function AvatarThumb({ url, isSelected, onSelect, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onSelect}
      title={label}
      className="relative flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        width: 72,
        height: 108,
        border: isSelected ? '2px solid #C9A96E' : '2px solid transparent',
        boxShadow: isSelected ? '0 0 14px rgba(201,169,110,0.45)' : 'none',
      }}
    >
      <img src={url} alt={label ?? ''} className="w-full h-full object-cover" />
      {isSelected && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#C9A96E' }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </motion.button>
  );
}

function MediaAvatarRow({ tmdbId, mediaType, selectedUrl, onSelect }) {
  const scrollRef = useRef(null);

  const { data: detail } = useQuery({
    queryKey: ['movie-detail', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}?mediaType=${mediaType}`).then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: imagesData } = useQuery({
    queryKey: ['movie-images', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}/images?mediaType=${mediaType}`).then(r => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const title = detail?.title || detail?.name || '…';

  /* Posters uniquement — main poster_path en premier, puis extras de /images */
  const allOptions = [];
  if (detail?.poster_path) {
    allOptions.push({ url: tmdbImg(detail.poster_path, 'w342'), label: title });
  }
  (imagesData?.posters ?? [])
    .filter(p => p.file_path && p.file_path !== detail?.poster_path)
    .slice(0, 7)
    .forEach(p => allOptions.push({ url: tmdbImg(p.file_path, 'w342'), label: title }));

  const scroll = dir => scrollRef.current?.scrollBy({ left: dir * 100, behavior: 'smooth' });

  if (!detail && allOptions.length === 0) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
        <div className="flex gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex-shrink-0 rounded-xl bg-white/5 animate-pulse" style={{ width: 72, height: 108 }} />
          ))}
        </div>
      </div>
    );
  }

  if (allOptions.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {detail?.poster_path && (
          <img src={tmdbImg(detail.poster_path, 'w92')} alt="" className="w-5 h-8 rounded object-cover flex-shrink-0" />
        )}
        <span className="text-white font-semibold text-sm truncate">{title}</span>
        <span className="text-white/30 text-xs flex-shrink-0">
          {allOptions.length} image{allOptions.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 text-lg leading-none"
        >‹</button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allOptions.map((opt, i) => (
            <AvatarThumb
              key={i}
              url={opt.url}
              label={opt.label}
              isSelected={selectedUrl === opt.url}
              onSelect={() => onSelect(opt.url)}
            />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 text-lg leading-none"
        >›</button>
      </div>
    </div>
  );
}

/* ─── Avatar position helpers ─────────────────────────────────── */
const DEFAULT_AVATAR_POS = { x: 50, y: 20 };

function getAvatarPosition(userEmail) {
  try {
    const raw = localStorage.getItem(`clap-avatar-pos-${userEmail ?? 'guest'}`);
    if (!raw) return { ...DEFAULT_AVATAR_POS };
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return { ...DEFAULT_AVATAR_POS };
    return parsed;
  } catch { return { ...DEFAULT_AVATAR_POS }; }
}
function saveAvatarPosition(userEmail, pos) {
  try { localStorage.setItem(`clap-avatar-pos-${userEmail ?? 'guest'}`, JSON.stringify(pos)); }
  catch {}
}

/* ─── Avatar image positioner (drag to crop) ─────────────────── */
function AvatarImagePositioner({ imageUrl, position, onPositionChange }) {
  const isDragging    = useRef(false);
  const startPt       = useRef({ x: 0, y: 0 });
  const startPos      = useRef({ ...DEFAULT_AVATAR_POS });
  const onChangeRef   = useRef(onPositionChange);
  onChangeRef.current = onPositionChange;

  const SENS = 0.25;

  const applyDelta = (clientX, clientY) => {
    const dx = (startPt.current.x - clientX) * SENS;
    const dy = (startPt.current.y - clientY) * SENS;
    onChangeRef.current({
      x: Math.max(0, Math.min(100, startPos.current.x + dx)),
      y: Math.max(0, Math.min(100, startPos.current.y + dy)),
    });
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startPt.current    = { x: e.clientX, y: e.clientY };
    startPos.current   = { ...position };
  };

  useEffect(() => {
    const onMove = (e) => { if (isDragging.current) applyDelta(e.clientX, e.clientY); };
    const onUp   = ()  => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    isDragging.current = true;
    startPt.current    = { x: t.clientX, y: t.clientY };
    startPos.current   = { ...position };
  };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const t = e.touches[0];
    applyDelta(t.clientX, t.clientY);
  };
  const onTouchEnd = () => { isDragging.current = false; };

  if (!imageUrl) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs uppercase tracking-wider">Aperçu &amp; cadrage</span>
        <button
          onClick={() => onPositionChange({ ...DEFAULT_AVATAR_POS })}
          className="text-white/25 text-xs hover:text-white/60 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      <div className="flex justify-center">
        <div
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative overflow-hidden select-none"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            cursor: 'grab',
            border: '3px solid rgba(201,169,110,0.5)',
            boxShadow: '0 0 20px rgba(201,169,110,0.2)',
          }}
        >
          <img
            src={imageUrl}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: `${position.x}% ${position.y}%` }}
            alt="aperçu"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.5">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <p className="text-center text-white/25 text-xs">Glisser pour cadrer</p>
    </div>
  );
}

function EditAvatarModal({ user, onClose }) {
  const queryClient  = useQueryClient();
  const { updateUser } = useAuthStore();

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn:  () => api.get('/favorites').then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });

  const [selectedUrl, setSelectedUrl] = useState(user?.avatarUrl ?? null);
  const [position,    setPosition]    = useState(() => getAvatarPosition(user?.email));

  const saveMut = useMutation({
    mutationFn: () => api.put('/auth/me', {
      username:           user?.username,
      email:              user?.email,
      bio:                user?.bio,
      avatarUrl:          selectedUrl,
      bannerTmdbId:       user?.bannerTmdbId       ?? null,
      bannerMediaType:    user?.bannerMediaType     ?? null,
      bannerBackdropPath: user?.bannerBackdropPath  ?? null,
    }),
    onSuccess: res => {
      saveAvatarPosition(user?.email, position);
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      onClose();
    },
  });

  /* Deduplicate favorites by tmdbId */
  const uniqueMedia = favorites.reduce((acc, fav) => {
    if (!acc.find(f => f.tmdbId === fav.tmdbId)) acc.push(fav);
    return acc;
  }, []);

  const previewInitials = (user?.username ?? '?').slice(0, 2).toUpperCase();

  return (
    <ModalShell
      title="Photo de profil"
      onClose={onClose}
      wide
      headerRight={
        <GoldButton onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
          Enregistrer
        </GoldButton>
      }
    >
      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto flex flex-col gap-6">

        {/* ── Avatar preview + positionneur ── */}
        {selectedUrl ? (
          <AvatarImagePositioner
            imageUrl={selectedUrl}
            position={position}
            onPositionChange={setPosition}
          />
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white text-2xl"
              style={{ background: 'linear-gradient(135deg, #C9A96E 0%, #8B6E42 100%)', border: '3px solid rgba(201,169,110,0.5)' }}
            >
              {previewInitials}
            </div>
            <div>
              <p className="text-white text-sm font-medium">Aperçu</p>
              <p className="text-white/40 text-xs mt-0.5">
                Choisissez un poster parmi vos favoris
              </p>
            </div>
          </div>
        )}

        {selectedUrl && (
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedUrl(null)}
              className="text-white/30 text-xs hover:text-red-400 transition-colors"
            >
              Supprimer la photo
            </button>
          </div>
        )}

        <div className="h-px bg-white/8" />

        {/* ── Media rows ── */}
        {uniqueMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <span className="text-5xl mb-3">🎬</span>
            <p>Ajoutez des favoris pour choisir une photo de profil</p>
          </div>
        ) : (
          uniqueMedia.map(fav => (
            <MediaAvatarRow
              key={fav.tmdbId}
              tmdbId={fav.tmdbId}
              mediaType={fav.mediaType}
              selectedUrl={selectedUrl}
              onSelect={setSelectedUrl}
            />
          ))
        )}
      </div>
    </ModalShell>
  );
}

/* ─── Profile Hero ───────────────────────────────────────────── */
function ProfileHero({ user, onEditProfile, onEditBackground, onEditAvatar }) {
  const { t } = useTranslation();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  /* Use the specific chosen backdrop path stored on the user profile */
  const backdropUrl = user?.bannerBackdropPath ? tmdbImg(user.bannerBackdropPath, 'w1280') : null;
  const bannerPos   = getBannerPosition(user?.email);
  const avatarPos   = getAvatarPosition(user?.email);

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {backdropUrl
        ? <img src={backdropUrl} alt="banner" className="w-full h-full object-cover" style={{ objectPosition: `${bannerPos.x}% ${bannerPos.y}%` }} />
        : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #0F3460 50%, #1A1A2E 100%)' }} />
      }

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-clap-bg via-black/40 to-transparent" />

      {/* Top-right vignette — guarantees contrast for the Modify button on ANY image */}
      <div
        className="absolute top-0 right-0 w-64 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(0,0,0,0.65) 0%, transparent 70%)' }}
      />

      {/* Modify dropdown */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10" ref={dropRef}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDropOpen(!dropOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background:     'rgba(0,0,0,0.35)',
            border:         '1px solid rgba(255,255,255,0.25)',
            color:          '#fff',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {t('userProfile.modify')}
          <svg width="10" height="10" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </motion.button>

        <AnimatePresence>
          {dropOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-xl"
              style={{ background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {[
                { label: t('userProfile.dropdownEditProfile'),    icon: '👤', action: onEditProfile },
                { label: t('userProfile.dropdownEditBackground'), icon: '🖼️',  action: onEditBackground },
                { label: 'Photo de profil',                        icon: '📸', action: onEditAvatar },
              ].map(({ label, icon, action }) => (
                <button key={label}
                  onClick={() => { setDropOpen(false); action(); }}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/8 transition-colors flex items-center gap-3 first:border-b first:border-white/8"
                >
                  <span>{icon}</span>{label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + info */}
      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6 flex items-end gap-4">
        <Avatar username={user?.username} avatarUrl={user?.avatarUrl} size="xl" avatarPos={avatarPos} />
        <div className="pb-1">
          <h1 className="font-display italic text-white text-2xl md:text-3xl font-bold leading-tight">
            {user?.username ?? '…'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <LevelBadge level={user?.level} xp={user?.xp} />
            {user?.bio && <span className="text-white/50 text-xs truncate max-w-xs">{user.bio}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stats row ──────────────────────────────────────────────── */
function StatsRow({ favMovies, favTV, listCount }) {
  const { t } = useTranslation();
  const stats = [
    { label: t('userProfile.statsLabelFavMovies'), value: favMovies, icon: '🎬' },
    { label: t('userProfile.statsLabelFavShows'),  value: favTV,     icon: '📺' },
    { label: t('userProfile.statsLabelPlaylists'), value: listCount,  icon: '📋' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, icon }) => (
        <div key={label} className="rounded-2xl p-4 md:p-6 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-3xl md:text-4xl font-bold text-white">{value ?? 0}</div>
          <div className="text-white/40 text-xs mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Genre bar chart ─────────────────────────────────────────── */
const CHART_COLORS = ['#C9A96E','#8B6E42','#E8C98A','#A07840','#D4A96E','#6B5030','#F0D4A0','#9B7850'];

function GenreChart({ genreCounts }) {
  const { t } = useTranslation();
  if (!genreCounts?.length) return null;
  const max = Math.max(...genreCounts.map((g) => g.count), 1);
  return (
    <section>
      <h2 className="font-display italic text-xl md:text-2xl text-white mb-5">{t('userProfile.sectionFavoriteGenres')}</h2>
      <div className="rounded-2xl p-5 md:p-6 flex flex-col gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {genreCounts.slice(0, 8).map(({ name, count }, i) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-white/60 text-xs w-24 text-right flex-shrink-0">{name}</span>
            <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(count / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
            </div>
            <span className="text-white/40 text-xs w-6 text-right flex-shrink-0">{count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Favorite media card ─────────────────────────────────────── */
function FavMediaCard({ tmdbId, mediaType }) {
  const { data } = useQuery({
    queryKey: ['movie-detail', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
  if (!data) return <div className="flex-shrink-0 w-28 md:w-36 aspect-[2/3] rounded-xl bg-clap-card animate-pulse" />;
  const title = data.title || data.name;
  const type  = mediaType === 'tv' ? 'serie' : 'film';
  return (
    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }} className="flex-shrink-0 w-28 md:w-36">
      <Link to={`/${type}/${tmdbId}`}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
          {data.poster_path
            ? <img src={tmdbImg(data.poster_path, 'w342')} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-clap-card flex items-center justify-center text-white/20 text-xs px-2 text-center">{title}</div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <p className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-semibold truncate">{title}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function FavCarousel({ items }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  if (!items?.length) {
    return (
      <div className="flex items-center justify-center h-40 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/20 text-sm">{t('userProfile.noneYet')}</p>
      </div>
    );
  }
  return (
    <div className="relative group">
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 text-lg">‹</button>
      <div ref={ref} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {items.map((fav) => <FavMediaCard key={fav.id} tmdbId={fav.tmdbId} mediaType={fav.mediaType} />)}
      </div>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 text-lg">›</button>
    </div>
  );
}

/* ─── Playlist section ────────────────────────────────────────── */
function PlaylistItemCard({ tmdbId, mediaType }) {
  const { data } = useQuery({
    queryKey: ['movie-detail', tmdbId, mediaType],
    queryFn:  () => api.get(`/movies/${tmdbId}?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });
  if (!data) return <div className="flex-shrink-0 w-24 md:w-32 aspect-[2/3] rounded-xl bg-clap-card animate-pulse" />;
  const title = data.title || data.name;
  const type  = mediaType === 'tv' ? 'serie' : 'film';
  return (
    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }} className="flex-shrink-0 w-24 md:w-32">
      <Link to={`/${type}/${tmdbId}`}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
          {data.poster_path
            ? <img src={tmdbImg(data.poster_path, 'w342')} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-clap-card flex items-center justify-center text-white/20 text-xs px-2 text-center">{title}</div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <p className="absolute bottom-0 left-0 right-0 p-1.5 text-white text-xs truncate">{title}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function PlaylistSection({ lists }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeId,       setActiveId]       = useState(null);
  const [createOpen,     setCreateOpen]     = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (lists?.length && activeId === null) setActiveId(lists[0]?.id);
  }, [lists, activeId]);

  const { data: items = [] } = useQuery({
    queryKey:       ['list-items', activeId],
    queryFn:        () => api.get(`/lists/${activeId}/items`).then((r) => r.data),
    enabled:        Boolean(activeId),
    staleTime:      0,          // always refetch — items may have been added from another page
    refetchOnMount: true,
  });

  const deleteMut = useMutation({
    mutationFn: (listId) => api.delete(`/lists/${listId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      setActiveId(null);
    },
  });

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });

  const activeList = lists?.find((l) => l.id === activeId);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display italic text-xl md:text-2xl text-white">{t('userProfile.sectionMySelections')}</h2>
        <GoldButton small onClick={() => setCreateOpen(true)}>
          <span className="flex items-center gap-1.5"><PlusIcon size={13} /> {t('userProfile.newPlaylistBtn')}</span>
        </GoldButton>
      </div>

      {(!lists || lists.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-44 rounded-2xl gap-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white/20 text-sm">{t('userProfile.noPlaylists')}</p>
          <GoldButton small onClick={() => setCreateOpen(true)}>
            <span className="flex items-center gap-1.5"><PlusIcon size={13} /> {t('userProfile.createFirstPlaylist')}</span>
          </GoldButton>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveId(list.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={activeId === list.id
                  ? { background: 'rgba(201,169,110,0.2)', border: '1px solid #C9A96E', color: '#C9A96E' }
                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }
                }
              >{list.name}</button>
            ))}
          </div>

          {/* Items */}
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Active playlist header */}
            {activeList && (
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <p className="text-white text-sm font-semibold">{activeList.name}</p>
                  {activeList.description && <p className="text-white/40 text-xs mt-0.5">{activeList.description}</p>}
                </div>
                {!activeList.isDefault && (
                  <button
                    onClick={() => { if (window.confirm(t('userProfile.deletePlaylistConfirm', { name: activeList.name }))) deleteMut.mutate(activeList.id); }}
                    className="text-white/25 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                    title={t('userProfile.deletePlaylistTitle')}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            )}

            {items.length === 0 ? (
              <div className="flex items-center justify-center h-36 text-white/20 text-sm">
                {t('userProfile.playlistEmpty')}
              </div>
            ) : (
              <div className="relative group">
                <button onClick={() => scroll(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 text-lg">‹</button>
                <div ref={ref} className="flex gap-3 overflow-x-auto pb-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {items.map((item) => (
                    <PlaylistItemCard key={item.id} tmdbId={item.tmdbId} mediaType={item.mediaType} />
                  ))}
                </div>
                <button onClick={() => scroll(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 text-lg">›</button>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {createOpen && <CreatePlaylistModal onClose={() => setCreateOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

/* ─── Badges ─────────────────────────────────────────────────── */
const BADGES_CATALOG = [
  { id: 'first_fav',     icon: '❤️',  i18nKey: 'firstFav',      req: (d) => d.favTotal >= 1   },
  { id: 'movie_buff',    icon: '🎬',  i18nKey: 'movieBuff',     req: (d) => d.favMovies >= 10 },
  { id: 'series_fan',    icon: '📺',  i18nKey: 'seriesFan',     req: (d) => d.favTV >= 10     },
  { id: 'collector',     icon: '📚',  i18nKey: 'collector',     req: (d) => d.favTotal >= 25  },
  { id: 'curator',       icon: '🗂️', i18nKey: 'curator',        req: (d) => d.listCount >= 1  },
  { id: 'cinephile',     icon: '🏆',  i18nKey: 'cinephile',     req: (d) => d.favTotal >= 50  },
  { id: 'multi_list',    icon: '📋',  i18nKey: 'listMaster',    req: (d) => d.listCount >= 3  },
  { id: 'completionist', icon: '⭐',  i18nKey: 'completionist', req: (d) => d.favTotal >= 100 },
];

/**
 * Badges are PERMANENT once unlocked: earned IDs are persisted in localStorage
 * so removing a favourite doesn't strip a badge that was already won.
 */
function BadgeSection({ favMovies, favTV, listCount, userEmail }) {
  const { t } = useTranslation();
  const data = { favMovies, favTV, favTotal: favMovies + favTV, listCount };

  /* localStorage key is scoped to the user so switching accounts works correctly */
  const storageKey = `clap-badges-${userEmail ?? 'guest'}`;

  const [earnedIds, setEarnedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) ?? '[]')); }
    catch { return new Set(); }
  });

  /* Check for new unlocks whenever stats change — only ADD, never remove */
  useEffect(() => {
    let changed = false;
    const updated = new Set(earnedIds);
    BADGES_CATALOG.forEach((badge) => {
      if (badge.req(data) && !updated.has(badge.id)) {
        updated.add(badge.id);
        changed = true;
      }
    });
    if (changed) {
      setEarnedIds(updated);
      localStorage.setItem(storageKey, JSON.stringify([...updated]));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.favTotal, data.favMovies, data.favTV, data.listCount, storageKey]);

  return (
    <section>
      <h2 className="font-display italic text-xl md:text-2xl text-white mb-5">{t('userProfile.sectionBadges')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGES_CATALOG.map((badge) => {
          const unlocked = earnedIds.has(badge.id) || badge.req(data);
          return (
            <motion.div key={badge.id} whileHover={{ scale: 1.03 }}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center"
              style={{
                background: unlocked ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                border: unlocked ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.06)',
                opacity: unlocked ? 1 : 0.4,
              }}>
              <span className="text-3xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{badge.icon}</span>
              <p className="text-white text-xs font-semibold">{t(`userProfile.badges.${badge.i18nKey}.label`)}</p>
              <p className="text-white/30 text-xs leading-tight">{t(`userProfile.badges.${badge.i18nKey}.desc`)}</p>
              {unlocked && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(201,169,110,0.2)', color: '#C9A96E' }}>{t('userProfile.badgeUnlocked')}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Genre computation (useQueries) ─────────────────────────── */
function useGenreCounts(favorites) {
  const limited = (favorites ?? []).slice(0, 12);
  const results = useQueries({
    queries: limited.map((fav) => ({
      queryKey: ['movie-detail', fav.tmdbId, fav.mediaType],
      queryFn:  () => api.get(`/movies/${fav.tmdbId}?mediaType=${fav.mediaType}`).then((r) => r.data),
      staleTime: 10 * 60 * 1000,
    })),
  });
  const counts = {};
  results.forEach(({ data }) => {
    (data?.genres ?? []).forEach(({ name }) => { counts[name] = (counts[name] ?? 0) + 1; });
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function UserProfile() {
  const { t } = useTranslation();
  const { user: storeUser } = useAuthStore();
  const [editProfileOpen,    setEditProfileOpen]    = useState(false);
  const [editBackgroundOpen, setEditBackgroundOpen] = useState(false);
  const [editAvatarOpen,     setEditAvatarOpen]     = useState(false);

  const { data: me } = useQuery({
    queryKey:       ['me'],
    queryFn:        () => api.get('/auth/me').then((r) => r.data),
    staleTime:      0,
    refetchOnMount: true,
  });

  const user = me ?? storeUser;

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn:  () => api.get('/favorites').then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

  const { data: lists = [] } = useQuery({
    queryKey:       ['lists'],
    queryFn:        () => api.get('/lists').then((r) => r.data),
    staleTime:      0,          // always up-to-date (new playlists may have been created)
    refetchOnMount: true,
  });

  const favMovies  = favorites.filter((f) => f.mediaType === 'movie');
  const favTV      = favorites.filter((f) => f.mediaType === 'tv');
  const genreCounts = useGenreCounts(favorites);

  return (
    <div className="pt-16 min-h-screen bg-clap-bg">
      <ProfileHero
        user={user}
        onEditProfile={() => setEditProfileOpen(true)}
        onEditBackground={() => setEditBackgroundOpen(true)}
        onEditAvatar={() => setEditAvatarOpen(true)}
      />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-10">
        <StatsRow favMovies={favMovies.length} favTV={favTV.length} listCount={lists.length} />
        {genreCounts.length > 0 && <GenreChart genreCounts={genreCounts} />}

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display italic text-xl md:text-2xl text-white">{t('userProfile.sectionFavoriteMovies')}</h2>
            <Link to="/catalogue" className="text-xs text-clap-gold hover:text-white transition-colors">{t('userProfile.exploreLink')}</Link>
          </div>
          <FavCarousel items={favMovies} />
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-display italic text-xl md:text-2xl text-white">{t('userProfile.sectionFavoriteTVShows')}</h2>
            <Link to="/catalogue" className="text-xs text-clap-gold hover:text-white transition-colors">{t('userProfile.exploreLink')}</Link>
          </div>
          <FavCarousel items={favTV} />
        </section>

        <PlaylistSection lists={lists} />
        <BadgeSection favMovies={favMovies.length} favTV={favTV.length} listCount={lists.length} userEmail={user?.email} />
      </div>

      <AnimatePresence>
        {editProfileOpen    && <EditProfileModal    user={user} onClose={() => setEditProfileOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {editBackgroundOpen && <EditBackgroundModal user={user} onClose={() => setEditBackgroundOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {editAvatarOpen && <EditAvatarModal user={user} onClose={() => setEditAvatarOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
