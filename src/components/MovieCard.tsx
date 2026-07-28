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
    return null;
  }

  const handleCopyMovieLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const movieUrl = `${window.location.origin}${window.location.pathname}?movie=${encodeURIComponent(movie.id)}`;
    navigator.clipboard.writeText(movieUrl);
    showToast(`Link for "${movie.title}" copied!`, 'success');
  };

  return (
    <div className="group relative bg-zinc-950/80 border border-zinc-800/80 hover:border-amber-500/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
      
      {/* Top Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 cursor-pointer" onClick={() => setActiveMovie(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => setHasImageError(true)}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 bg-amber-500 text-zinc-950 font-black text-[10px] uppercase tracking-wider rounded-md shadow-md">
            {movie.quality || '1080p HD'}
          </span>
          {movie.category === 'Sinhala Dubbed' && (
            <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-md shadow-md">
              Sinhala Dubbed
            </span>
          )}
          {movie.category === 'Sinhala Subbed' && (
            <span className="px-2 py-0.5 bg-sky-600 text-white font-bold text-[9px] uppercase tracking-wider rounded-md shadow-md">
              Sinhala Sub
            </span>
          )}
        </div>

        {/* Bookmark & Share Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-black/60 text-white hover:bg-amber-500 hover:text-black border border-white/10'
            }`}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isBookmarked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopyMovieLink}
            className="p-2 bg-black/60 hover:bg-amber-500 text-white hover:text-black backdrop-blur-md border border-white/10 rounded-xl transition-all cursor-pointer"
            title="Copy Direct Movie Link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Quick Play/Download Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMovie(movie);
            }}
            className="p-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-full transition-all transform hover:scale-110 shadow-lg shadow-amber-500/40 cursor-pointer"
            title="Watch Online HD"
          >
            <Play className="w-5 h-5 fill-black" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setWhatsappModalMovie(movie);
            }}
            className="p-3.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold rounded-full transition-all transform hover:scale-110 border border-amber-500/40 cursor-pointer shadow-lg"
            title="Direct Fast Download"
          >
            <Download className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 space-y-2 bg-zinc-950 border-t border-zinc-800/80 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            <span className="font-semibold text-zinc-300">{movie.releaseYear || '2025'}</span>
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

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px] text-zinc-400 uppercase font-mono">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            {movie.viewsCount || 350} Views
          </span>

          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Direct CDN
          </span>
        </div>
      </div>
    </div>
  );
};
