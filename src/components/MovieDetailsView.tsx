import React, { useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { VideoPlayer } from './VideoPlayer';
import { DownloadSection } from './DownloadSection';
import { CommentSection } from './CommentSection';
import { ArrowLeft, Star, Clock, Eye, Download, Bookmark, Check, Share2, Film, Heart } from 'lucide-react';

export const MovieDetailsView: React.FC = () => {
  const { activeMovie, setActiveMovie, watchlist, toggleWatchlist, incrementMovieViews, setWhatsappModalMovie } = useMovie();

  useEffect(() => {
    if (activeMovie) {
      incrementMovieViews(activeMovie.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeMovie?.id]);

  if (!activeMovie) return null;

  const isBookmarked = watchlist.includes(activeMovie.id);

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      
      {/* Back Header Bar */}
      <div className="bg-zinc-950 border-b border-white/10 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => setActiveMovie(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/10 transition-colors cursor-pointer rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Back to All Movies & Cartoons</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(activeMovie.id)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border rounded-lg transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-500 text-black border-amber-500 font-black' : 'bg-zinc-900 text-white border-white/10'
              }`}
            >
              {isBookmarked ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isBookmarked ? 'Saved' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => setWhatsappModalMovie(activeMovie)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Options</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Main Title Header */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest">
            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded">
              {activeMovie.category || 'Sinhala Dubbed'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-bold text-white">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {activeMovie.rating} IMDb
            </span>
            <span>•</span>
            <span>{activeMovie.duration}</span>
            <span>•</span>
            <span>{activeMovie.releaseYear}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-brand uppercase tracking-tight">
            {activeMovie.title}
          </h1>

          {activeMovie.originalTitle && (
            <p className="text-xs text-amber-400/80 font-mono italic">
              Original: {activeMovie.originalTitle}
            </p>
          )}
        </div>

        {/* Video Player Box */}
        <VideoPlayer movie={activeMovie} />

        {/* Downloads Section */}
        <DownloadSection movie={activeMovie} />

        {/* Movie Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6 bg-[#080808] border border-white/10 p-6 rounded-xl">
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest font-mono">
                Synopsis & Details
              </h3>
              <p className="text-sm text-white/80 leading-relaxed font-sans">
                {activeMovie.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs uppercase font-mono">
              <div>
                <span className="text-white/40 block">Language</span>
                <span className="text-white font-bold">{activeMovie.language}</span>
              </div>

              <div>
                <span className="text-white/40 block">Quality</span>
                <span className="text-amber-400 font-bold">{activeMovie.quality}</span>
              </div>

              <div>
                <span className="text-white/40 block">Director / Studio</span>
                <span className="text-white font-bold">{activeMovie.director}</span>
              </div>

              <div>
                <span className="text-white/40 block">Total Downloads</span>
                <span className="text-emerald-400 font-bold">{activeMovie.downloadsCount || 420}</span>
              </div>
            </div>
          </div>

          {/* Genres & Sidebar */}
          <div className="space-y-6 bg-[#080808] border border-white/10 p-6 rounded-xl">
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">
                Categories & Genres
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeMovie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-wider rounded"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {activeMovie.cast && activeMovie.cast.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">
                  Voice Cast & Stars
                </h4>
                <ul className="text-xs text-white/70 space-y-1 font-mono">
                  {activeMovie.cast.map((actor, i) => (
                    <li key={i}>• {actor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection movieId={activeMovie.id} movieTitle={activeMovie.title} />
      </div>
    </div>
  );
};
