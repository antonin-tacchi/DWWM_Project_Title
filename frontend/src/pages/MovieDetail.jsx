import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import i18nInstance from '../i18n';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import useSeo from '../hooks/useSeo';
import StarRating from '../components/ui/StarRating';

/* ─── Helpers ────────────────────────────────────────────────── */
const img = (path, size = 'original') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  const locale = i18nInstance.language === 'en' ? 'en-US' : 'fr-FR';
  return new Date(dateStr).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const fmtRuntime = (min) => {
  if (!min) return null;
  const h = Math.floor(min / 60), m = min % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
};

/* ─── Trailer modal ──────────────────────────────────────────── */
function TrailerModal({ videoKey, onClose }) {
  const { t } = useTranslation();
  /* close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="trailer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
      >
        {/* Modal box — stop propagation so clicking inside doesn't close */}
        <motion.div
          key="trailer-box"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: '1px solid rgba(201,169,110,0.25)' }}
        >
          {/* 16/9 wrapper */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
              title={t('movieDetail.trailerTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 border border-clap-muted/40 flex items-center justify-center text-clap-gold hover:bg-clap-gold hover:text-black transition-all z-10"
            aria-label={t('movieDetail.closeTrailer')}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Score circle ───────────────────────────────────────────── */
function ScoreCircle({ value }) {
  const { t } = useTranslation();
  const pct = Math.round((value ?? 0) * 10);
  const r   = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color  = pct >= 70 ? '#4CAF50' : pct >= 50 ? '#FFC107' : '#F44336';

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="rgba(0,0,0,0.55)" stroke="#333" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-white text-xs font-bold">{pct}%</span>
        <span className="text-white text-[8px]">{t('movieDetail.userScore')}</span>
      </div>
    </div>
  );
}

/* ─── Section title ──────────────────────────────────────────── */
function SectionTitle({ children }) {
  return (
    <h2 className="font-display italic text-white text-2xl md:text-3xl mb-4 pb-2 border-b border-clap-muted/40">
      {children}
    </h2>
  );
}

/* ─── Stars ──────────────────────────────────────────────────── */
function Stars({ value = 0 }) {
  const filled = Math.round(value);
  return (
    <div className="flex gap-px text-xs" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? '#C9A96E' : '#3A3A5A' }}>★</span>
      ))}
    </div>
  );
}

/* ─── Cast card ──────────────────────────────────────────────── */
function CastCard({ member }) {
  return (
    <Link to={`/actors/${member.id}`} className="flex-shrink-0 flex flex-col items-center gap-2 w-20">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-clap-card border-2 border-clap-muted/40 flex-shrink-0">
        {member.profile_path
          ? <img src={img(member.profile_path, 'w185')} alt={member.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-clap-gray text-lg">👤</div>
        }
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-semibold leading-tight">{member.name}</p>
        <p className="text-clap-gray text-[10px] leading-tight">{member.character}</p>
      </div>
    </Link>
  );
}

/* ─── Scroll row with arrow buttons ─────────────────────────── */
function ScrollRow({ children, gap = 'gap-6', label }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label={t('movieDetail.scrollRowLeft', { section: label })}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/70 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-3 text-xl leading-none border border-clap-muted/30"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <div
        ref={ref}
        className={`flex ${gap} overflow-x-auto pb-2 scroll-smooth`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={t('movieDetail.scrollRowRight', { section: label })}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/70 text-clap-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-3 text-xl leading-none border border-clap-muted/30"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}

/* ─── Related movie card ─────────────────────────────────────── */
function RelatedCard({ movie }) {
  const title = movie.title || movie.name;
  const type  = movie.media_type || 'movie';
  return (
    <Link to={`/${type === 'tv' ? 'serie' : 'film'}/${movie.id}`}>
      <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }} className="flex-shrink-0 w-32 md:w-40">
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-clap-card">
          {movie.poster_path
            ? <img src={img(movie.poster_path, 'w342')} alt={title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-clap-gray text-xs p-2 text-center">{title}</div>
          }
        </div>
        <div className="mt-2 px-0.5">
          <p className="text-white text-xs font-semibold truncate mb-1">{title}</p>
          <Stars value={movie.vote_average} />
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Comment card ───────────────────────────────────────────── */
function CommentCard({ comment, currentUserId, onDelete }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const text        = comment.content ?? '';
  const long        = text.length > 200;
  const shown       = expanded || !long ? text : text.slice(0, 200) + '…';
  const isOwner     = currentUserId && Number(currentUserId) === Number(comment.userId);
  const displayName = comment.username || `User${comment.userId}`;

  const handleDelete = async () => {
    if (!window.confirm(t('movieDetail.deleteCommentConfirm'))) return;
    setDeleting(true);
    try { await onDelete(comment.id); } finally { setDeleting(false); }
  };

  return (
    <div className="flex gap-3 py-5 border-b border-clap-muted/20 group">
      <div className="w-10 h-10 rounded-full bg-clap-muted overflow-hidden flex items-center justify-center flex-shrink-0 border border-clap-muted/40">
        {comment.avatarUrl
          ? <img src={comment.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          : <span className="text-clap-gold text-sm font-bold">{displayName[0]?.toUpperCase()}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-clap-gold text-sm font-semibold font-display italic">
            {displayName}
          </p>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-clap-gray hover:text-red-400 text-xs flex items-center gap-1 disabled:opacity-30"
              title={t('movieDetail.deleteCommentTitle')}
              aria-label={t('movieDetail.deleteCommentBy', { user: displayName })}
            >
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 3h10M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.8 7.2A.8.8 0 003.6 11h4.8a.8.8 0 00.8-.8L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {deleting ? '…' : t('movieDetail.deleteComment')}
            </button>
          )}
        </div>
        <p className="text-clap-light text-sm leading-relaxed">{shown}</p>
        {long && (
          <button onClick={() => setExpanded((v) => !v)} className="text-clap-gold text-xs mt-1 italic hover:underline">
            {expanded ? t('movieDetail.commentShowLess') : t('movieDetail.commentShowMore')}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Playlist dropdown ──────────────────────────────────────── */
function PlaylistDropdown({ tmdbId, mediaType, isFavorited, currentFavorite, onToggleFav, favPending }) {
  const { t } = useTranslation();
  const [open, setOpen]           = useState(false);
  const [dropPos, setDropPos]     = useState({ top: 0, left: 0 });
  const [feedback, setFeedback]   = useState({}); // { listId: 'added'|'removed'|'exists' }
  const { isAuthenticated }       = useAuthStore();
  const queryClient               = useQueryClient();
  const btnRef                    = useRef(null);
  const dropRef                   = useRef(null);

  /* compute fixed position from button rect */
  const handleToggle = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 8, left: rect.left });
    }
    setOpen((v) => !v);
  };

  /* close on outside click (check button + portal panel) */
  useEffect(() => {
    const h = (e) => {
      if (
        btnRef.current  && !btnRef.current.contains(e.target) &&
        dropRef.current && !dropRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* fetch lists + items for this media when dropdown opens */
  const { data: listsWithItems, isLoading: listsLoading } = useQuery({
    queryKey: ['lists-items-for', tmdbId, mediaType],
    queryFn:  async () => {
      const lists = await api.get('/lists').then((r) => r.data);
      if (!lists.length) return [];
      const itemsArr = await Promise.all(
        lists.map((l) => api.get(`/lists/${l.id}/items`).then((r) => ({
          listId: l.id,
          items:  r.data,
        })))
      );
      return lists.map((l) => ({
        ...l,
        items:     itemsArr.find((x) => x.listId === l.id)?.items ?? [],
      }));
    },
    enabled:   isAuthenticated && open,
    staleTime: 30_000,
  });

  const isInList    = (l) => l.items.some((i) => Number(i.tmdbId) === Number(tmdbId) && i.mediaType === mediaType);
  const getItem     = (l) => l.items.find((i)  => Number(i.tmdbId) === Number(tmdbId) && i.mediaType === mediaType);

  const addToList = useMutation({
    mutationFn: ({ listId }) => api.post(`/lists/${listId}/items`, { tmdbId: Number(tmdbId), mediaType }),
    onSuccess:  (_, { listId }) => {
      setFeedback((f) => ({ ...f, [listId]: 'added' }));
      queryClient.invalidateQueries({ queryKey: ['lists-items-for', tmdbId, mediaType] });
    },
    onError: (err, { listId }) => {
      if (err?.response?.status === 409) setFeedback((f) => ({ ...f, [listId]: 'exists' }));
    },
  });

  const removeFromList = useMutation({
    mutationFn: ({ listId, itemId }) => api.delete(`/lists/${listId}/items/${itemId}`),
    onSuccess:  (_, { listId }) => {
      setFeedback((f) => ({ ...f, [listId]: 'removed' }));
      queryClient.invalidateQueries({ queryKey: ['lists-items-for', tmdbId, mediaType] });
    },
  });

  const handleList = (list) => {
    if (isInList(list)) {
      removeFromList.mutate({ listId: list.id, itemId: getItem(list).id });
    } else {
      addToList.mutate({ listId: list.id });
    }
  };

  /* Trigger button style */
  const btnStyle = {
    backgroundColor: open ? 'rgba(201,169,110,0.2)' : 'rgba(30,30,60,0.85)',
    border:          `1px solid ${open ? 'rgba(201,169,110,0.8)' : 'rgba(201,169,110,0.6)'}`,
    backdropFilter:  'blur(8px)',
  };

  /* Portal dropdown panel */
  const dropdownPanel = (
    <AnimatePresence>
      {open && isAuthenticated && (
        <motion.div
          id="playlist-dropdown"
          ref={dropRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            top:      dropPos.top,
            left:     dropPos.left,
            width:    256,
            zIndex:   1000,
            backgroundColor: '#13132a',
            border:   '1px solid rgba(201,169,110,0.2)',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
            {/* ── Favoris ── */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-clap-gray text-[10px] uppercase tracking-widest mb-2">{t('movieDetail.playlistSectionFavorites')}</p>
              <button
                type="button"
                onClick={() => { onToggleFav(); }}
                disabled={favPending}
                aria-pressed={isFavorited}
                aria-label={isFavorited ? t('movieDetail.removeFromFavorites') : t('movieDetail.addToFavorites')}
                className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-clap-muted/30 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 18 18"
                    fill={isFavorited ? '#e05555' : 'none'}
                    stroke={isFavorited ? '#e05555' : '#C9A96E'}
                    strokeWidth="1.5">
                    <path d="M9 15.5S1.5 11 1.5 5.5A4 4 0 019 3a4 4 0 017.5 2.5C16.5 11 9 15.5 9 15.5z"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-clap-light text-sm">{t('movieDetail.myFavorites')}</span>
                </div>
                {isFavorited && (
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="6" stroke="#4ade80"/>
                    <path d="M3.5 6.5l2 2 4-4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* ── Playlists ── */}
            <div className="px-4 py-2">
              <p className="text-clap-gray text-[10px] uppercase tracking-widest mb-2">{t('movieDetail.myPlaylists')}</p>
              {listsLoading ? (
                <div className="flex flex-col gap-2 py-2">
                  {[1, 2].map((i) => <div key={i} className="h-8 bg-clap-muted/30 animate-pulse rounded-xl" />)}
                </div>
              ) : !listsWithItems?.length ? (
                <p className="text-clap-gray text-xs italic py-2 text-center">{t('movieDetail.noPlaylistCreated')}</p>
              ) : (
                <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                  {listsWithItems.map((list) => {
                    const inList = isInList(list);
                    const fb     = feedback[list.id];
                    return (
                      <button
                        key={list.id}
                        type="button"
                        onClick={() => handleList(list)}
                        disabled={addToList.isPending || removeFromList.isPending}
                        aria-label={
                          inList
                            ? t('movieDetail.removeFromList', { name: list.name })
                            : t('movieDetail.addToList', { name: list.name })
                        }
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-clap-muted/30 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                            <path d="M3 2.5A1.5 1.5 0 014.5 1h7A1.5 1.5 0 0113 2.5v12l-5-3-5 3v-12z"
                              strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-clap-light text-sm text-left truncate max-w-[140px]">{list.name}</span>
                        </div>
                        <span className="text-[11px] flex-shrink-0">
                          {fb === 'exists'  && <span className="text-yellow-400">{t('movieDetail.alreadyAdded')}</span>}
                          {fb === 'added'   && <span className="text-green-400">{t('movieDetail.added')}</span>}
                          {fb === 'removed' && <span className="text-clap-gray">{t('movieDetail.removed')}</span>}
                          {!fb && inList    && <svg aria-hidden="true" width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <circle cx="6.5" cy="6.5" r="6" stroke="#4ade80"/>
                            <path d="M3.5 6.5l2 2 4-4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>}
                          {!fb && !inList   && <span className="text-clap-gray text-lg leading-none">+</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-clap-muted/20 px-4 py-2.5">
              <p className="text-clap-gray text-[10px] text-center italic">
                {t('movieDetail.createPlaylistsHint')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );

  return (
    <div className="relative">
      {/* Trigger */}
      <motion.button
        ref={btnRef}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
        onClick={isAuthenticated ? handleToggle : undefined}
        title={isAuthenticated ? t('movieDetail.addToPlaylistTitle') : t('movieDetail.loginToSave')}
        aria-label={isAuthenticated ? t('movieDetail.openPlaylistMenu') : t('movieDetail.loginToSaveContent')}
        aria-expanded={isAuthenticated ? open : undefined}
        aria-controls="playlist-dropdown"
        aria-disabled={!isAuthenticated}
        tabIndex={isAuthenticated ? undefined : -1}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-clap-gold transition-all"
        style={btnStyle}
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 2.5A1.5 1.5 0 014.5 1h7A1.5 1.5 0 0113 2.5v12l-5-3-5 3v-12z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {t('movieDetail.save')}
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <path d="M2 3.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      {/* Non connecté → lien login par-dessus */}
      {!isAuthenticated && (
        <Link to="/login" className="absolute inset-0" aria-label={t('movieDetail.loginToSaveContent')} />
      )}

      {/* Dropdown rendu dans le body via portal (bypass overflow-hidden du hero) */}
      {createPortal(dropdownPanel, document.body)}
    </div>
  );
}

/* ─── Media Detail Page ──────────────────────────────────────── */
export default function MovieDetail({ mediaType = 'movie' }) {
  const { t } = useTranslation();
  const { id }         = useParams();
  const tmdbId         = Number(id);
  const { isAuthenticated, user } = useAuthStore();
  const queryClient    = useQueryClient();
  const [comment, setComment]             = useState('');
  const [commentError, setCommentError]   = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [trailerOpen, setTrailerOpen]     = useState(false);
  const [favError, setFavError]           = useState('');

  /* ── Queries ── */
  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['detail', mediaType, tmdbId],
    queryFn:  () => api.get(`/movies/${tmdbId}?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: credits } = useQuery({
    queryKey: ['credits', mediaType, tmdbId],
    queryFn:  () => api.get(`/movies/${tmdbId}/credits?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: trailerData } = useQuery({
    queryKey: ['trailer', mediaType, tmdbId],
    queryFn:  () => api.get(`/movies/${tmdbId}/trailer?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: providersData } = useQuery({
    queryKey: ['providers', mediaType, tmdbId],
    queryFn:  () => api.get(`/movies/${tmdbId}/providers?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: similar } = useQuery({
    queryKey: ['similar', mediaType, tmdbId],
    queryFn:  () => api.get(`/movies/${tmdbId}/similar?mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', mediaType, tmdbId],
    queryFn:  () => api.get(`/comments?tmdbId=${tmdbId}&mediaType=${mediaType}`).then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });

  /* ── Log this view to the user's history ── */
  useEffect(() => {
    if (!isAuthenticated || !tmdbId) return;
    api.post('/movies/history', { tmdbId, mediaType })
      .then(() => queryClient.invalidateQueries({ queryKey: ['history'] }))
      .catch(() => {});
  }, [isAuthenticated, tmdbId, mediaType, queryClient]);

  /* ── Favorites ── */
  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn:  () => api.get('/favorites').then((r) => r.data),
    enabled:  isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const currentFavorite = (favoritesData ?? []).find(
    (f) => Number(f.tmdbId) === tmdbId && f.mediaType === mediaType
  );
  const isFavorited = Boolean(currentFavorite);

  const addFavorite = useMutation({
    mutationFn: () => api.post('/favorites', { tmdbId, mediaType }),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError:    () => setFavError(t('movieDetail.errorAddFavorite')),
  });

  const removeFavorite = useMutation({
    mutationFn: () => api.delete(`/favorites/${currentFavorite?.id}`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
    onError:    () => setFavError(t('movieDetail.errorRemoveFavorite')),
  });

  const handleFavorite = () => {
    if (!isAuthenticated) return; // bouton n'est pas affiché si non connecté
    if (isFavorited) removeFavorite.mutate();
    else             addFavorite.mutate();
  };

  /* ── Post comment ── */
  const postComment = useMutation({
    mutationFn: (content) => api.post('/comments', { tmdbId, mediaType, content }),
    onSuccess: (response) => {
      const newComment = response.data;
      setComment('');
      setCommentError('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
      // Optimistic update: prepend immediately without waiting for refetch
      queryClient.setQueryData(['comments', mediaType, tmdbId], (old) =>
        old ? [newComment, ...old] : [newComment]
      );
      // Background sync with server
      queryClient.invalidateQueries({ queryKey: ['comments', mediaType, tmdbId] });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message
               ?? err?.response?.data
               ?? 'Erreur lors de l\'envoi. Vérifiez que vous êtes bien connecté.';
      setCommentError(String(msg));
    },
  });

  /* ── Delete comment ── */
  const deleteComment = useMutation({
    mutationFn: (commentId) => api.delete(`/comments/${commentId}`),
    onSuccess: (_data, commentId) => {
      // Optimistic remove from cache
      queryClient.setQueryData(['comments', mediaType, tmdbId], (old) =>
        old ? old.filter((c) => c.id !== commentId) : []
      );
      queryClient.invalidateQueries({ queryKey: ['comments', mediaType, tmdbId] });
    },
  });

  const handleSend = () => {
    if (!comment.trim()) return;
    setCommentError('');
    postComment.mutate(comment.trim());
  };

  /* ── Derived data ── */
  const title      = detail?.title || detail?.name || '';
  const backdrop   = img(detail?.backdrop_path);
  const releaseDate = fmt(detail?.release_date || detail?.first_air_date);
  const genres     = (detail?.genres ?? []).map((g) => g.name).join(', ') || '—';
  const runtime    = fmtRuntime(detail?.runtime);
  const cast       = (credits?.cast ?? []).slice(0, 10);
  /* Directors: for movies use job='Director'; for TV fall back to created_by from the detail */
  const directorsFromCrew = (credits?.crew ?? []).filter(
    (c) => c.job === 'Director' || c.department === 'Directing'
  );
  const creators   = detail?.created_by ?? [];
  const directors  = directorsFromCrew.length > 0 ? directorsFromCrew : creators;
  const directorLabel = mediaType === 'tv' && directorsFromCrew.length === 0
    ? t('movieDetail.labelCreator')
    : t('movieDetail.labelDirector');
  const trailer    = (trailerData?.results ?? []).find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const providers  = providersData?.results?.FR?.flatrate ?? [];
  const relatedMovies = similar?.results ?? [];
  const comments   = commentsData ?? [];
  const fallbackMediaTitle = mediaType === 'tv' ? 'Série - Clap!' : 'Film - Clap!';
  const fallbackDescription = mediaType === 'tv'
    ? 'Consultez les informations, notes et commentaires de cette série sur Clap!'
    : 'Consultez les informations, notes et commentaires de ce film sur Clap!';
  const detailDescription = detail?.overview
    ? (detail.overview.length > 155 ? `${detail.overview.slice(0, 152).trim()}...` : detail.overview)
    : fallbackDescription;

  useSeo({
    title: title ? `${title} - Clap!` : fallbackMediaTitle,
    description: detailDescription,
    image: backdrop || '/og-image.png',
    type: 'video.other',
  });

  if (detailLoading) {
    return (
      <div className="pt-16 min-h-screen bg-clap-bg">
        <div className="h-[420px] bg-clap-card animate-pulse" />
        <div className="px-4 md:px-8 py-8 flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-clap-card animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Trailer modal */}
    {trailerOpen && trailer && (
      <TrailerModal videoKey={trailer.key} onClose={() => setTrailerOpen(false)} />
    )}

    <div className="pt-16 min-h-screen bg-clap-bg">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 420 }}>
        {backdrop && (
          <img src={backdrop} alt={title} className="absolute inset-0 w-full h-full object-cover object-top" />
        )}
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-clap-bg via-clap-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-clap-bg/80 via-transparent to-transparent" />

        {/* Score (top right) */}
        <div className="absolute top-4 right-4">
          <ScoreCircle value={detail?.vote_average} />
        </div>

        {/* Content (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <h1 className="font-display italic text-white text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            {title}
          </h1>

          {/* Metadata rows */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs md:text-sm text-clap-gray mb-2">
            <span><span className="text-white/60">{t('movieDetail.labelCategory')}</span>{genres}</span>
            <span><span className="text-white/60">{t('movieDetail.labelReleaseDate')}</span>{releaseDate}</span>
            {providers.length > 0 && (
              <span className="flex items-center gap-2">
                <span className="text-white/60">{t('movieDetail.labelStreamingPlatform')}</span>
                {providers.slice(0, 2).map((p) => (
                  <span key={p.provider_name} className="bg-clap-card border border-clap-muted/40 px-2 py-0.5 rounded text-white text-xs">
                    {p.provider_name}
                  </span>
                ))}
                {providers.length === 0 && <span className="bg-clap-card border border-clap-muted/40 px-2 py-0.5 rounded text-white text-xs">{t('movieDetail.onlyInTheater')}</span>}
              </span>
            )}
            {providers.length === 0 && (
              <span><span className="text-white/60">{t('movieDetail.labelStreamingPlatform')}</span>
                <span className="bg-clap-card border border-clap-muted/40 px-2 py-0.5 rounded text-white text-xs">{t('movieDetail.onlyInTheater')}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs md:text-sm text-clap-gray mb-4">
            <span>
              <span className="text-white/60">{directorLabel}</span>
              {directors.length === 0 ? '—' : directors.map((d, i) => (
                <span key={d.id}>
                  <Link
                    to={`/crew/${d.id}`}
                    className="hover:text-clap-gold transition-colors underline-offset-2 hover:underline"
                  >
                    {d.name}
                  </Link>
                  {i < directors.length - 1 && ', '}
                </span>
              ))}
            </span>
            {runtime && <span><span className="text-white/60">{t('movieDetail.labelDuration')}</span>{runtime}</span>}
            {detail?.number_of_seasons && (
              <span><span className="text-white/60">{t('movieDetail.labelSeasons')}</span>{detail.number_of_seasons}</span>
            )}
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Watch trailer */}
            {trailer && (
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setTrailerOpen(true)}
                className="px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all"
                style={{ backgroundColor: 'rgba(30,30,60,0.85)', border: '1px solid rgba(201,169,110,0.6)', color: '#C9A96E', backdropFilter: 'blur(8px)' }}
              >
                {t('movieDetail.watchTrailers')}
              </motion.button>
            )}

            {/* Save / Playlist */}
            <PlaylistDropdown
              tmdbId={tmdbId}
              mediaType={mediaType}
              isFavorited={isFavorited}
              currentFavorite={currentFavorite}
              onToggleFav={handleFavorite}
              favPending={addFavorite.isPending || removeFavorite.isPending}
            />
            {favError && <span className="text-red-400 text-xs">{favError}</span>}
          </div>
        </div>
      </div>

      {/* ══ SECTIONS ══════════════════════════════════════════════ */}
      <div className="px-4 md:px-8 py-8 flex flex-col gap-12">

        {/* ── Overview ── */}
        {detail?.overview && (
          <section>
            <SectionTitle>{t('movieDetail.sectionOverview')}</SectionTitle>
            <p className="text-clap-light leading-relaxed text-sm md:text-base">{detail.overview}</p>
          </section>
        )}

        {/* ── Top Billed Cast ── */}
        {cast.length > 0 && (
          <section>
            <SectionTitle>{t('movieDetail.sectionCast')}</SectionTitle>
            <ScrollRow gap="gap-6" label={t('movieDetail.sectionCast')}>
              {cast.map((member) => (
                <CastCard key={member.id} member={member} />
              ))}
            </ScrollRow>
          </section>
        )}

        {/* ── Rating ── */}
        <section>
          <SectionTitle>{t('movieDetail.sectionRating')}</SectionTitle>
          <StarRating tmdbId={tmdbId} mediaType={mediaType} />
        </section>

        {/* ── Commentary ── */}
        <section>
          <SectionTitle>{t('movieDetail.sectionCommentary')}</SectionTitle>

          {/* Textarea */}
          <div className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isAuthenticated ? t('movieDetail.commentPlaceholderAuth') : t('movieDetail.commentPlaceholderGuest')}
              disabled={!isAuthenticated}
              rows={4}
              className="w-full bg-clap-card/60 border border-clap-muted/40 rounded-2xl px-4 py-3 text-clap-light text-sm resize-none outline-none transition-all focus:border-clap-gold/50 focus:ring-1 focus:ring-clap-gold/20 placeholder-clap-gray disabled:opacity-50"
            />
            {commentError && <p className="text-red-400 text-xs mt-1">{commentError}</p>}
          </div>

          {isAuthenticated ? (
            <div className="flex flex-col items-center gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleSend}
                disabled={postComment.isPending || !comment.trim()}
                className="px-12 py-2.5 rounded-full font-display italic text-white font-semibold text-base tracking-wide transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(30,30,60,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {postComment.isPending ? t('movieDetail.sendingComment') : t('movieDetail.sendComment')}
              </motion.button>
              <AnimatePresence>
                {commentSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-400 text-sm flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6.5" stroke="#4ade80" />
                      <path d="M4 7l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('movieDetail.commentPublished')}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex justify-center mb-8">
              <Link to="/login" className="text-clap-gold text-sm hover:underline italic">
                {t('movieDetail.loginToComment')}
              </Link>
            </div>
          )}

          {/* Comments list */}
          {commentsLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 bg-clap-card animate-pulse rounded-xl" />
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div>
              {comments.map((c) => (
                <CommentCard
                  key={c.id}
                  comment={c}
                  currentUserId={user?.id}
                  onDelete={(commentId) => deleteComment.mutateAsync(commentId)}
                />
              ))}
            </div>
          ) : (
            <p className="text-clap-gray text-sm italic">{t('movieDetail.noComments')}</p>
          )}
        </section>

        {/* ── Related content ── */}
        {relatedMovies.length > 0 && (
          <section>
            <SectionTitle>{t('movieDetail.sectionRelated')}</SectionTitle>
            <ScrollRow gap="gap-4" label={t('movieDetail.sectionRelated')}>
              {relatedMovies.slice(0, 12).map((movie) => (
                <RelatedCard key={movie.id} movie={{ ...movie, media_type: mediaType }} />
              ))}
            </ScrollRow>
          </section>
        )}
      </div>
    </div>
    </>
  );
}
