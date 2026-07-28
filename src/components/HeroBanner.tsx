import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Play, Download, Star } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80';
const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80';

export const HeroBanner: React.FC = () => {
  const { movies, setActiveMovie, setWhatsappModalMovie, featuredMovieId } = useMovie();
  const [hasPosterErr, setHasPosterErr] = React.useState(false);
  const [hasBackdropErr, setHasBackdropErr] = React.useState(false);

  const featured = (featuredMovieId && movies.find((m) => m.id === featuredMovieId)) || movies[0];
  if (!featured) return null;

  const posterImg = hasPosterErr || !featured.posterUrl ? FALLBACK_POSTER : featured.posterUrl;
  const backdropImg = hasBackdropErr || !featured.backdropUrl ? FALLBACK_BACKDROP : featured.backdropUrl;

  return (
    <div className="relative w-full min-h-[420px] lg:min-h-[480px] bg-black flex items-center overflow-hidden border-b border-amber-500/20">
      {/* Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdropImg}
          alt={featured.title}
          className="w-full h-full object-cover object-center opacity-25 filter blur-[2px]"
          onError={() => setHasBackdropErr(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center gap-8">
        {/* Featured Poster */}
        <div
          onClick={() => setActiveMovie(featured)}
          className="w-44 sm:w-52 lg:w-60 shrink-0 rounded-xl overflow-hidden border-2 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.35)] relative group cursor-pointer"
        >
          <img
            src={posterImg}
            alt={featured.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setHasPosterErr(true)}
          />
          <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded">
            FEATURED CARTOON
          </div>
        </div>

        {/* Featured Content Details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
            <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-amber-400 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {featured.rating} IMDb
            </span>
            <span className="text-white/40">•</span>
            <span className="text-white">{featured.duration}</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
              100% Direct Download Server
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-brand uppercase tracking-tight leading-none">
            {featured.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-sans line-clamp-3 leading-relaxed">
            {featured.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={() => setActiveMovie(featured)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Online HD</span>
            </button>

            <button
              onClick={() => setWhatsappModalMovie(featured)}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>Direct Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
