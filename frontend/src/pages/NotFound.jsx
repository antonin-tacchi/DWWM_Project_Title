import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-clap-bg px-6 text-center">

      {/* Film strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-1.5 mb-10"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i % 3 === 1 ? 0.08 : 0.18 }}
            transition={{ delay: i * 0.04 }}
            className="w-7 h-12 bg-white/30 rounded-sm"
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-clap-gold/60 text-xs uppercase tracking-[0.4em] mb-3"
      >
        {t('notFound.label')}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-display text-[9rem] leading-none text-clap-light italic tracking-tight mb-2"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-white/40 text-base mb-2"
      >
        {t('notFound.title')}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/25 text-sm max-w-xs mb-10"
      >
        {t('notFound.subtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4"
      >
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-clap-gold/10 border border-clap-gold/30 text-clap-gold hover:bg-clap-gold/20 transition-colors text-sm font-medium"
        >
          {t('notFound.backHome')}
        </Link>
        <Link
          to="/catalogue"
          className="px-6 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white transition-colors text-sm"
        >
          {t('notFound.catalogue')}
        </Link>
      </motion.div>

      {/* Decorative quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-10 text-white/10 text-xs italic"
      >
        « Cette page n'existe pas encore dans notre catalogue. »
      </motion.p>
    </div>
  );
}
