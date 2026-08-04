import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import api from './services/api';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import ErrorBoundary from './components/layout/ErrorBoundary';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/layout/ScrollToTop';
import NotificationContainer from './components/ui/NotificationToast';
import useSeo from './hooks/useSeo';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import ActorProfile from './pages/ActorProfile';
import CrewProfile from './pages/CrewProfile';
import UserProfile from './pages/UserProfile';
import History from './pages/History';
import News from './pages/News';
import Discovery from './pages/Discovery';
import LegalNotice from './pages/legal/LegalNotice';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Contact from './pages/legal/Contact';
import About from './pages/About';
import Community from './pages/Community';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminComments from './pages/admin/AdminComments';
import AdminRatings from './pages/admin/AdminRatings';
import AdminLogs from './pages/admin/AdminLogs';
import AdminSearch from './pages/admin/AdminSearch';
import AdminNotifications from './pages/admin/AdminNotifications';

const AUTH_ROUTES  = ['/login', '/register'];

const PRIVATE_ROUTES = ['/admin', '/profile', '/history', ...AUTH_ROUTES];

const routeSeo = [
  {
    match: (pathname) => pathname === '/',
    title: 'Clap! - Accueil',
    description: 'Découvrez les tendances cinéma et séries, consultez les nouveautés et retrouvez vos prochains coups de cœur sur Clap!',
  },
  {
    match: (pathname) => pathname === '/catalogue',
    title: 'Catalogue films et séries - Clap!',
    description: 'Explorez le catalogue Clap! avec des filtres par genre, plateforme, langue, note et année.',
  },
  {
    match: (pathname) => pathname === '/news',
    title: 'Actualités cinéma et séries - Clap!',
    description: 'Suivez les sorties à venir, les tendances et les nouveautés films et séries sur Clap!',
  },
  {
    match: (pathname) => pathname === '/discover',
    title: 'Découverte personnalisée - Clap!',
    description: 'Choisissez une humeur et laissez Clap! proposer un film ou une série adaptée à votre envie du moment.',
  },
  {
    match: (pathname) => pathname === '/about',
    title: 'À propos du projet - Clap!',
    description: 'Découvrez la plateforme Clap!, son objectif, ses fonctionnalités et son architecture microservices.',
  },
  {
    match: (pathname) => pathname === '/community',
    title: 'Communauté - Clap!',
    description: 'Retrouvez les fonctionnalités communautaires prévues pour connecter les cinéphiles autour de Clap!',
  },
  {
    match: (pathname) => pathname.startsWith('/actors/'),
    title: 'Profil acteur - Clap!',
    description: 'Consultez la filmographie, les informations et les contenus associés à un acteur sur Clap!',
  },
  {
    match: (pathname) => pathname.startsWith('/crew/'),
    title: 'Profil équipe artistique - Clap!',
    description: 'Consultez les informations et les œuvres associées à un membre de l’équipe artistique sur Clap!',
  },
  {
    match: (pathname) => pathname === '/legal',
    title: 'Mentions légales - Clap!',
    description: 'Consultez les mentions légales de la plateforme Clap!',
  },
  {
    match: (pathname) => pathname === '/terms',
    title: 'Conditions d’utilisation - Clap!',
    description: 'Consultez les conditions d’utilisation de la plateforme Clap!',
  },
  {
    match: (pathname) => pathname === '/privacy',
    title: 'Confidentialité - Clap!',
    description: 'Consultez la politique de confidentialité et de protection des données personnelles de Clap!',
  },
  {
    match: (pathname) => pathname === '/contact',
    title: 'Contact - Clap!',
    description: 'Contactez l’équipe Clap! pour une question, une remarque ou une demande liée à la plateforme.',
  },
];

const getSeoForPath = (pathname) => {
  if (pathname.startsWith('/film/') || pathname.startsWith('/serie/')) {
    return { enabled: false };
  }

  if (PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return {
      title: 'Espace privé - Clap!',
      description: 'Espace réservé aux utilisateurs de Clap!',
      robots: 'noindex, nofollow',
    };
  }

  return routeSeo.find(({ match }) => match(pathname)) ?? {
    title: 'Page introuvable - Clap!',
    description: 'La page demandée est introuvable sur Clap!',
    robots: 'noindex, follow',
  };
};

export default function App() {
  const { pathname } = useLocation();
  const isAuth       = AUTH_ROUTES.includes(pathname);
  const isAdmin      = pathname.startsWith('/admin');
  const { logout, isAuthenticated, updateUser } = useAuthStore();

  useSeo(getSeoForPath(pathname));

  /* Check JWT expiry + refresh user data (including id, xp, level) on app load */
  useEffect(() => {
    let token = null;
    try {
      const raw = localStorage.getItem('clap-auth');
      if (raw) token = JSON.parse(raw)?.state?.token ?? null;
    } catch { /* ignore */ }
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout();
        return;
      }
    } catch {
      logout();
      return;
    }
    /* Sync store with fresh /auth/me so user.id, xp, level are always up-to-date */
    api.get('/auth/me').then(r => updateUser(r.data)).catch(() => {});
  }, [logout, updateUser]);

  return (
    <ErrorBoundary resetKey={pathname}>
    <div className="min-h-screen flex flex-col bg-clap-bg">
      <ScrollToTop />
      <NotificationContainer />

      {/* Admin panel has its own sidebar layout — no global Navbar/Footer */}
      {!isAdmin && <Navbar />}

      <main id="main-content" className="flex-1">
        <Routes>
          {/* ── Admin (nested, own layout) ────────────────────────── */}
          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index            element={<AdminDashboard />} />
            <Route path="users"    element={<AdminUsers />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="ratings"  element={<AdminRatings />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="logs"          element={<AdminLogs />} />
            <Route path="search"        element={<AdminSearch />} />
          </Route>

          {/* ── Public / protected routes ─────────────────────────── */}
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/film/:id"  element={<MovieDetail />} />
          <Route path="/serie/:id" element={<TvDetail />} />
          <Route path="/actors/:id" element={<ActorProfile />} />
          <Route path="/crew/:id"  element={<CrewProfile />} />
          <Route path="/news"      element={<News />} />
          <Route path="/discover"  element={<Discovery />} />
          <Route path="/profile"   element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/history"   element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/legal"     element={<LegalNotice />} />
          <Route path="/terms"     element={<Terms />} />
          <Route path="/privacy"   element={<Privacy />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/about"     element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </main>

      {!isAuth && !isAdmin && <Footer />}
    </div>
    </ErrorBoundary>
  );
}
