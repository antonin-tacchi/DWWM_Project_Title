import { useRef } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from '../ui/Skeleton';

export default function Carousel({ title, items = [], type = 'movie', isLoading = false }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 md:px-0">
        <h2 className="section-title">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-clap-card border border-clap-muted hover:border-clap-gold text-clap-light hover:text-clap-gold transition-colors flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-clap-card border border-clap-muted hover:border-clap-gold text-clap-light hover:text-clap-gold transition-colors flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading
          ? [...Array(8)].map((_, i) => <MovieCardSkeleton key={i} />)
          : items.map((item) => (
              <motion.div
                key={item.id || item.tmdbId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard movie={item} type={type} />
              </motion.div>
            ))
        }
      </div>
    </section>
  );
}