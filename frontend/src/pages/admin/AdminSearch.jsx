import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function useAllData() {
  const { data: rawUsers }    = useQuery({ queryKey: ['admin-users'],    queryFn: () => api.get('/admin/users').then(r => r.data)    });
  const { data: rawComments } = useQuery({ queryKey: ['admin-comments'], queryFn: () => api.get('/admin/comments').then(r => r.data) });
  const { data: rawRatings }  = useQuery({ queryKey: ['admin-ratings'],  queryFn: () => api.get('/admin/ratings').then(r => r.data)  });
  return {
    users:    Array.isArray(rawUsers)    ? rawUsers    : [],
    comments: Array.isArray(rawComments) ? rawComments : [],
    ratings:  Array.isArray(rawRatings)  ? rawRatings  : [],
  };
}

function ResultSection({ title, icon, items, renderItem, color }) {
  if (items.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className={`flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold ${color}`}>
        <span>{icon}</span>
        <span>{title}</span>
        <span className="ml-1 opacity-50">({items.length})</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id ?? i} className="bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3 text-sm hover:bg-white/[0.04] transition-colors">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AdminSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { users, comments, ratings } = useAllData();

  const q = query.toLowerCase().trim();

  const results = useMemo(() => {
    if (!q || q.length < 2) return { users: [], comments: [], ratings: [] };
    return {
      users: users.filter(u =>
        (u.username ?? '').toLowerCase().includes(q) ||
        (u.email    ?? '').toLowerCase().includes(q)
      ),
      comments: comments.filter(c =>
        (c.content ?? '').toLowerCase().includes(q) ||
        String(c.userId ?? '').includes(q)
      ),
      ratings: ratings.filter(r =>
        String(r.score   ?? '').includes(q) ||
        String(r.userId  ?? '').includes(q) ||
        String(r.tmdbId  ?? '').includes(q)
      ),
    };
  }, [q, users, comments, ratings]);

  const total = results.users.length + results.comments.length + results.ratings.length;
  const hasResults = q.length >= 2;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-clap-light">{t('admin.search.title')}</h1>
        <p className="text-white/40 text-sm mt-1">{t('admin.search.subtitle')}</p>
      </div>

      {/* Search input */}
      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          autoFocus
          placeholder={t('admin.search.placeholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 outline-none focus:border-clap-gold/40 transition-colors text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-lg leading-none">
            ×
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!hasResults ? (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 text-white/20 text-sm">
            {t('admin.search.hint')}
          </motion.div>
        ) : total === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 text-white/30 text-sm">
            {t('admin.search.noResults', { query })}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-white/30 text-xs mb-6">
              {t('admin.search.found', { count: total, query })}
            </p>

            {/* Users */}
            <ResultSection
              title={t('admin.search.sectionUsers')}
              icon="👤"
              color="text-clap-gold"
              items={results.users}
              renderItem={u => (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 flex-shrink-0">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white/80 font-medium">{u.username}</span>
                    <span className="text-white/30 ml-2 text-xs">{u.email}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    u.role === 'admin'
                      ? 'bg-clap-gold/10 text-clap-gold border-clap-gold/20'
                      : 'bg-white/5 text-white/30 border-white/10'
                  }`}>{u.role ?? 'user'}</span>
                </div>
              )}
            />

            {/* Comments */}
            <ResultSection
              title={t('admin.search.sectionComments')}
              icon="💬"
              color="text-sky-400"
              items={results.comments}
              renderItem={c => (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/30 text-xs font-mono">user #{c.userId}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${c.mediaType === 'tv' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                      {c.mediaType === 'tv' ? 'Série' : 'Film'} #{c.tmdbId}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs line-clamp-2 italic">« {c.content} »</p>
                </div>
              )}
            />

            {/* Ratings */}
            <ResultSection
              title={t('admin.search.sectionRatings')}
              icon="⭐"
              color="text-yellow-400"
              items={results.ratings}
              renderItem={r => (
                <div className="flex items-center gap-3">
                  <span className="text-white/30 text-xs font-mono">user #{r.userId}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${r.mediaType === 'tv' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {r.mediaType === 'tv' ? 'Série' : 'Film'} #{r.tmdbId}
                  </span>
                  <span className="ml-auto text-clap-gold font-semibold">{r.score}/10</span>
                </div>
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
