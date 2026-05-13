import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogue from './pages/Catalogue';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import ActorProfile from './pages/ActorProfile';
import UserProfile from './pages/UserProfile';
import Discovery from './pages/Discovery';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-clap-bg">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/catalogue"     element={<Catalogue />} />
          <Route path="/movies/:id"    element={<MovieDetail />} />
          <Route path="/tv/:id"        element={<TvDetail />} />
          <Route path="/actors/:id"    element={<ActorProfile />} />
          <Route path="/discover"      element={<Discovery />} />
          <Route path="/profile"       element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
