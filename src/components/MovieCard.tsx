import React, { useState } from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { Play, Download, Star, Bookmark, Check, Eye, Share2 } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { setActiveMovie, setWhatsappModalMovie, watchlist, toggleWatchlist, showToast } = useMovie();
  const [hasImageError, setHasImageError] = useState(false);
  const isBookmarked = watchlist.includes(movie.id);

  if (hasImageError) {
    // Hide movie completely if poster fails to load as requested by user
    return null;
  }

  const handleCopyMovieLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const movieUrl = `${window.location.origin}${window.location.pathname}?movie=${encodeURIComponent(movie.id)}`;
    navigator.clipboard.writeText(movieUrl);
    showToast(`Link for "${movie.title}" copied to clipboard!`, 'success');
  };

  return (
    <div className="group relative bg-[#080808] border border-white/10 hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      
      {/* Top Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black cursor-pointer" onClick={() => setActiveMovie(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => setHasImageError(true)}
        />

        {/* Quality & Category Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
            {movie.quality || '1080p HD'}
          </span>
          {movie.category === 'Sinhala Dubbed' && (
            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
              Sinhala Dubbed
            </span>
          )}
        </div>

        {/* Bookmark & Share Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`p-2 backdrop-blur-md transition-colors ${
              isBookmarked ? 'bg-amber-500 text-black' : 'bg-black/60 text-white hover:bg-amber-500 hover:text-black'
            }`}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isBookmarked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopyMovieLink}
            className="p-2 bg-black/60 hover:bg-amber-500 text-white hover:text-black backdrop-blur-md transition-colors"
            title="Copy Direct Movie Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMovie(movie);
            }}
            className="p-3 bg-amber-500 hover:bg-white text-black font-bold rounded-full transition-all transform hover:scale-110"
            title="Watch Online"
          >
            <Play className="w-5 h-5 fill-black" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setWhatsappModalMovie(movie);
            }}
            className="p-3 bg-zinc-800 hover:bg-amber-500 text-white hover:text-black font-bold rounded-full transition-all transform hover:scale-110 border border-white/20"
            title="Direct Download"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 space-y-2 bg-[#050505] border-t border-white/5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/50 uppercase tracking-wider">
            <span>{movie.releaseYear || '2024'}</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              {movie.rating || '8.5'}
            </span>
          </div>

          <h3
            onClick={() => setActiveMovie(movie)}
            className="text-sm font-bold text-white uppercase tracking-tight line-clamp-1 hover:text-amber-400 cursor-pointer transition-colors"
            title={movie.title}
          >
            {movie.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-white/40 uppercase font-mono">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-500" />
            {movie.viewsCount || 350} Views
          </span>

          <span className="text-emerald-400 font-bold">
            Direct Server
          </span>
        </div>
      </div>
    </div>
  );
};
