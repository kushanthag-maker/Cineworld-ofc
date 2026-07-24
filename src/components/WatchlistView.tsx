import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Bookmark, Film } from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const { movies, watchlist } = useMovie();

  const savedMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-brand flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500" />
          <span>My Saved Watchlist ({savedMovies.length})</span>
        </h2>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#080808] border border-white/10 p-8 space-y-3">
          <Film className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase font-editorial">Your Watchlist is Empty</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto uppercase tracking-wider font-mono">
            Click the bookmark icon on any movie or cartoon poster to save it for quick access!
          </p>
        </div>
      )}
    </div>
  );
};
