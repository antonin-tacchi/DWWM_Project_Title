import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GOLD = '#C9A96E';
const CREAM = '#E8DCBF';

const PLANNED = [
  { emoji: '👥', key: 'friendLists' },
  { emoji: '📋', key: 'sharedPlaylists' },
  { emoji: '💬', key: 'discussions' },
  { emoji: '🏆', key: 'leaderboards' },
];

export default function Community() {
  const { t } = useTranslation();

  return (
    <div className="pt-20 min-h-screen bg-clap-bg flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl mb-8"
        >
          🎬
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
          style={{ border: `1px solid ${GOLD}30`, background: 'rgba(201,169,110,0.07)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
          <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: GOLD }}>
            {t('community.badge')}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display italic text-4xl md:text-5xl mb-4"
          style={{ color: CREAM }}
        >
          {t('community.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm leading-relaxed mb-10"
          style={{ color: 'rgba(232,220,191,0.5)' }}
        >
          {t('community.subtitle')}
        </motion.p>

        {/* Planned features */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3 mb-10"
        >
          {PLANNED.map(({ emoji, key }) => (
            <div
              key={key}
              className="rounded-2xl px-4 py-4 flex items-center gap-3 text-left"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm" style={{ color: 'rgba(232,220,191,0.6)' }}>
                {t(`community.${key}`)}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Link
            to="/"
            className="text-xs tracking-widest uppercase transition-colors"
            style={{ color: `${GOLD}70` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}70`)}
          >
            ← {t('community.backHome')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
