import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import ScrollToTop from './components/layout/ScrollToTop';
import NotificationContainer from './components/ui/NotificationToast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import ActorProfile from './pages/ActorProfile';
import CrewProfile from './pages/CrewProfile';
import UserProfile from './pages/UserProfile';
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

const AUTH_ROUTES  = ['/login', '/register'];

export default function App() {
  const { pathname } = useLocation();
  const isAuth       = AUTH_ROUTES.includes(pathname);
  const isAdmin      = pathname.startsWith('/admin');
  const { logout }   = useAuthStore();

  /* Check JWT expiry on every mount / page load */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        logout();
      }
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <div className="min-h-screen flex flex-col bg-clap-bg">
      <ScrollToTop />
      <NotificationContainer />

      {/* Admin panel has its own sidebar layout — no global Navbar/Footer */}
      {!isAdmin && <Navbar />}

      <main className="flex-1">
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
            <Route path="logs"     element={<AdminLogs />} />
            <Route path="search"   element={<AdminSearch />} />
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
          <Route path="/legal"     element={<LegalNotice />} />
          <Route path="/terms"     element={<Terms />} />
          <Route path="/privacy"   element={<Privacy />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/about"     element={<About />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </main>

      {!isAuth && !isAdmin && <Footer />}
    </div>
  );
}
