import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-clap-dark border-t border-clap-muted/30 mt-20">
      {/* Cinema tagline */}
      <div className="text-center py-10 border-b border-clap-muted/30">
        <p className="font-display text-2xl md:text-3xl text-clap-gold italic">
          Cinema is a dream we share together.
        </p>
        <div className="flex justify-center mt-2 gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-clap-gold text-xs">★</span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl text-clap-gold font-bold">Clap!</Link>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-clap-gray">
          <Link to="/catalogue" className="hover:text-clap-gold transition-colors">Movies</Link>
          <Link to="/catalogue" className="hover:text-clap-gold transition-colors">TV Shows</Link>
          <Link to="/catalogue" className="hover:text-clap-gold transition-colors">Catalog</Link>
          <Link to="/"          className="hover:text-clap-gold transition-colors">Community</Link>
          <Link to="/"          className="hover:text-clap-gold transition-colors">About</Link>
        </nav>

        <div className="flex flex-col gap-1 text-xs text-clap-gray text-center md:text-right">
          <Link to="/" className="hover:text-clap-gold transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-clap-gold transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-clap-gold transition-colors">Contact</Link>
        </div>
      </div>

      <div className="text-center pb-4 text-clap-gray text-xs">
        © {new Date().getFullYear()} Clap! — All rights reserved.
      </div>
    </footer>
  );
}