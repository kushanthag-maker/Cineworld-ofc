import React from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { Play, Download, Star, Subtitles, Bookmark, Eye, Film } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onWatchMovie: (movie: Movie) => void;
  onDownloadClick: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onWatchMovie, onDownloadClick }) => {
  const { watchlist, toggleWatchlist } = useMovie();
  const isBookmarked = watchlist.includes(movie.id);

  return (
    <div className="group relative bg-[#080808] border border-white/10 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-md hover:shadow-2xl">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#050505] cursor-pointer" onClick={() => onWatchMovie(movie)}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/50 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 z-10 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {/* Quality Tag */}
            <span className="px-2 py-0.5 bg-black/80 text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
              {movie.quality}
            </span>

            {/* Sinhala Sub Badge */}
            {movie.hasSinhalaSub && (
              <span className="px-2 py-0.5 bg-amber-500/90 text-black text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                <Subtitles className="w-3 h-3" />
                <span>සිංහල Sub</span>
              </span>
            )}

            {/* Sinhala Dubbed Badge */}
            {movie.isSinhalaDubbed && (
              <span className="px-2 py-0.5 bg-orange-500/90 text-black text-[9px] font-black uppercase tracking-wider">
                සිංහල Dub
              </span>
            )}
          </div>

          {/* Watchlist Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`p-1.5 transition-all pointer-events-auto border ${
              isBookmarked
                ? 'bg-amber-500 border-amber-500 text-black'
                : 'bg-black/70 border-white/20 text-white/70 hover:text-white hover:border-white/50'
            }`}
            title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-black' : ''}`} />
          </button>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 gap-3 text-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchMovie(movie);
            }}
            className="w-12 h-12 bg-amber-500 text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>
          <span className="text-[10px] font-black text-white tracking-widest uppercase">
            Watch / Details
          </span>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownloadClick(movie);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-amber-500" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Rating Badge Bottom Right */}
        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/90 border border-white/10 px-2 py-0.5 flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase tracking-wider">
          <Star className="w-3 h-3 fill-amber-500" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3
            onClick={() => onWatchMovie(movie)}
            className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-amber-500 transition-colors line-clamp-1 cursor-pointer font-sans"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {movie.originalTitle && (
            <p className="text-[10px] text-amber-500/80 uppercase font-semibold line-clamp-1 mt-0.5">
              {movie.originalTitle}
            </p>
          )}

          <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-wider font-mono mt-1.5">
            <span>{movie.releaseYear}</span>
            <span>{movie.duration}</span>
            <div className="flex items-center gap-1 text-white/40">
              <Eye className="w-3 h-3" />
              <span>{movie.viewsCount > 1000 ? `${(movie.viewsCount / 1000).toFixed(1)}k` : movie.viewsCount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => onWatchMovie(movie)}
            className="flex-1 py-1.5 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Watch</span>
          </button>

          <button
            onClick={() => onDownloadClick(movie)}
            className="p-1.5 bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-amber-500 transition-colors"
            title="Direct Download Links"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
