import React, { useState, useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { Play, Download, Star, Subtitles, Info, ChevronLeft, ChevronRight, Sparkles, Film } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  onWatchMovie: (movie: Movie) => void;
  onDownloadClick: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onWatchMovie, onDownloadClick }) => {
  const { movies, setActiveTrailerUrl, toggleWatchlist, watchlist } = useMovie();

  const featuredMovies = movies.filter((m) => m.featured || m.trending);
  const displayList = featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [displayList.length]);

  if (displayList.length === 0) return null;

  const currentMovie = displayList[currentIndex];
  const isBookmarked = watchlist.includes(currentMovie.id);

  return (
    <div className="relative w-full h-[520px] md:h-[580px] lg:h-[620px] overflow-hidden bg-[#050505] border border-white/10 my-6 shadow-2xl group">
      
      {/* Background Image with Editorial Gradients */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110 transition-all duration-1000 ease-out opacity-60"
        />
        {/* Dark Editorial Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
      </div>

      {/* Slide Navigation Buttons */}
      {displayList.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + displayList.length) % displayList.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white hover:border-amber-500 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 z-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % displayList.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/80 border border-white/10 text-white hover:border-amber-500 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 z-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-7xl h-full mx-auto px-6 md:px-12 flex flex-col justify-end pb-12">
        <div className="max-w-2xl space-y-4">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 border border-amber-500/50 text-amber-500 text-[10px] uppercase font-bold tracking-widest bg-amber-500/10">
              Featured Release
            </span>

            {currentMovie.hasSinhalaSub && (
              <span className="px-2 py-0.5 border border-amber-400/40 text-amber-300 text-[10px] uppercase font-bold tracking-widest">
                සිංහල Subtitles
              </span>
            )}

            {currentMovie.isSinhalaDubbed && (
              <span className="px-2 py-0.5 border border-orange-500/40 text-orange-400 text-[10px] uppercase font-bold tracking-widest">
                සිංහල Dubbed
              </span>
            )}

            <span className="px-2 py-0.5 border border-white/20 text-white/80 text-[10px] uppercase font-bold tracking-widest">
              {currentMovie.quality}
            </span>
          </div>

          {/* Title & Native Title */}
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter italic text-white font-editorial">
              {currentMovie.title}
            </h1>
            {currentMovie.originalTitle && (
              <p className="text-amber-500/90 text-xs md:text-sm uppercase tracking-widest font-semibold">
                {currentMovie.originalTitle}
              </p>
            )}
          </div>

          {/* Quick Meta Info */}
          <div className="flex items-center gap-3 text-xs text-white/70 uppercase tracking-widest font-medium">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{currentMovie.rating.toFixed(1)} / 10</span>
            </div>
            <span>•</span>
            <span>{currentMovie.releaseYear}</span>
            <span>•</span>
            <span>{currentMovie.duration}</span>
            <span>•</span>
            <div className="flex flex-wrap gap-1 text-white/50">
              {currentMovie.genres.slice(0, 3).join(' / ')}
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-white/70 text-xs md:text-sm line-clamp-3 leading-relaxed max-w-xl italic font-serif">
            "{currentMovie.synopsis}"
          </p>

          {/* CTA Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onWatchMovie(currentMovie)}
              className="px-8 py-3.5 bg-white text-black font-black uppercase text-xs tracking-wider flex items-center gap-3 hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Online</span>
            </button>

            <button
              onClick={() => onDownloadClick(currentMovie)}
              className="px-8 py-3.5 border border-white/30 text-white hover:border-amber-500 hover:text-amber-500 font-black uppercase text-xs tracking-wider flex items-center gap-2 transition-all cursor-pointer bg-black/40"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>Direct Download</span>
            </button>

            {currentMovie.trailerUrl && (
              <button
                onClick={() => setActiveTrailerUrl(currentMovie.trailerUrl)}
                className="px-5 py-3.5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 font-bold uppercase text-xs tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-white/50" />
                <span>Trailer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {displayList.length > 1 && (
        <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
          {displayList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 transition-all ${
                currentIndex === idx ? 'w-8 bg-amber-500' : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
