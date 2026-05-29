import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/admin',                  icon: '▣', key: 'dashboard',      end: true },
  { to: '/admin/users',            icon: '◉', key: 'users' },
  { to: '/admin/comments',         icon: '◈', key: 'comments' },
  { to: '/admin/ratings',          icon: '◆', key: 'ratings' },
  { to: '/admin/notifications',    icon: '🔔', key: 'notifications' },
  { to: '/admin/logs',             icon: '≡', key: 'logs' },
  { to: '/admin/search',           icon: '⊕', key: 'search' },
];

export default function AdminLayout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex bg-clap-bg">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-black/60 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <span className="font-display text-clap-gold text-xl italic tracking-wide">Clap!</span>
          <p className="text-white/30 text-xs mt-0.5 uppercase tracking-widest">{t('admin.sidebar.title')}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, icon, key, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-clap-gold/10 text-clap-gold border border-clap-gold/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {t(`admin.sidebar.${key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5">
          <NavLink
            to="/"
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            ← {t('admin.sidebar.backToSite')}
          </NavLink>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <motion.main
          key="admin-main"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-8 overflow-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
