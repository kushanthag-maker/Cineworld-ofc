import React from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Film } from 'lucide-react';

export const TrailerModal: React.FC = () => {
  const { activeTrailerUrl, setActiveTrailerUrl } = useMovie();

  if (!activeTrailerUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/10 rounded-none w-full max-w-4xl overflow-hidden shadow-2xl relative">
        
        <div className="bg-black px-6 py-3 flex items-center justify-between border-b border-white/10 uppercase tracking-widest text-xs font-bold">
          <div className="flex items-center gap-2 text-white">
            <Film className="w-4 h-4 text-amber-500" />
            <span className="font-editorial italic">Official Film Trailer</span>
          </div>
          <button
            onClick={() => setActiveTrailerUrl(null)}
            className="p-1.5 bg-white/5 border border-white/10 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          <iframe
            src={activeTrailerUrl}
            title="Movie Trailer"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
