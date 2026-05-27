import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
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

const AUTH_ROUTES = ['/login', '/register'];

export default function App() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-clap-bg">
      <ScrollToTop />
      <NotificationContainer />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/catalogue"     element={<Catalogue />} />
          <Route path="/film/:id"       element={<MovieDetail />} />
          <Route path="/serie/:id"     element={<TvDetail />} />
          <Route path="/actors/:id"    element={<ActorProfile />} />
          <Route path="/crew/:id"      element={<CrewProfile />} />
          <Route path="/news"          element={<News />} />
          <Route path="/discover"      element={<Discovery />} />
          <Route path="/profile"       element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/legal"         element={<LegalNotice />} />
          <Route path="/terms"         element={<Terms />} />
          <Route path="/privacy"       element={<Privacy />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/about"         element={<About />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
    </div>
  );
}
