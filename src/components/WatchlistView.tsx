import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';
import { Bookmark, ArrowLeft } from 'lucide-react';

interface WatchlistViewProps {
  onWatchMovie: (movie: Movie) => void;
  onDownloadClick: (movie: Movie) => void;
  onBackToHome: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  onWatchMovie,
  onDownloadClick,
  onBackToHome
}) => {
  const { movies, watchlist } = useMovie();

  const savedMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="space-y-6 my-8 animate-fadeIn">
      
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-editorial italic">
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>Saved Watchlist</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 border border-amber-500/40 px-2 py-0.5 bg-amber-500/10 not-italic font-sans">
              {savedMovies.length} SAVED
            </span>
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
            Personal curated bookmark archive
          </p>
        </div>

        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-500" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {savedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatchMovie={onWatchMovie}
              onDownloadClick={onDownloadClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white/5 border border-white/10">
          <Bookmark className="w-12 h-12 text-white/30 mx-auto" />
          <h3 className="text-xl font-bold uppercase text-white font-editorial italic">Watchlist Empty</h3>
          <p className="text-xs text-white/50 uppercase tracking-wider max-w-sm mx-auto">
            Click the bookmark icon on any movie card to add it to your personal saved library!
          </p>
          <button
            onClick={onBackToHome}
            className="px-6 py-3 bg-amber-500 text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-colors"
          >
            Explore Movies
          </button>
        </div>
      )}
    </div>
  );
};
