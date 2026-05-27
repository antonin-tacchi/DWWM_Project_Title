import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

export default function MovieCard({ movie, type = 'movie' }) {
  const title     = movie.title || movie.name || 'Unknown';
  const poster    = movie.posterPath || movie.poster_path;
  const rating    = movie.voteAverage || movie.vote_average;
  const path      = `/${type === 'tv' ? 'serie' : 'film'}/${movie.id || movie.tmdbId}`;

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex-shrink-0 w-36 md:w-44 cursor-pointer"
    >
      <Link to={path}>
        <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-clap-card">
          {poster ? (
            <img
              src={`${TMDB_IMG}${poster}`}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-clap-card text-clap-gray text-xs text-center p-2">
              No Image
            </div>
          )}

          {/* Rating badge */}
          {rating && (
            <div className="absolute top-2 right-2 bg-clap-bg/80 backdrop-blur-sm text-clap-gold text-xs font-bold px-2 py-1 rounded-full">
              ★ {Number(rating).toFixed(1)}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-clap-bg/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <p className="text-clap-gold text-xs font-semibold">View details</p>
          </div>
        </div>

        <p className="mt-2 text-sm text-clap-light font-medium truncate">{title}</p>
        <p className="text-xs text-clap-gray">
          {(movie.releaseDate || movie.release_date || movie.firstAirDate || movie.first_air_date || '').slice(0, 4)}
        </p>
      </Link>
    </motion.div>
  );
}