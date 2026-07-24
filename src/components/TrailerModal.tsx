import React from 'react';
import { useMovie } from '../context/MovieContext';
import { X } from 'lucide-react';
import { formatStreamUrl } from '../utils/streamUtils';

export const TrailerModal: React.FC = () => {
  const { activeTrailerUrl, setActiveTrailerUrl } = useMovie();

  if (!activeTrailerUrl) return null;

  const streamInfo = formatStreamUrl(activeTrailerUrl);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-4xl aspect-video relative shadow-2xl overflow-hidden">
        <button
          onClick={() => setActiveTrailerUrl(null)}
          className="absolute top-3 right-3 z-10 p-2 bg-black/80 text-white hover:bg-amber-500 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <iframe
          src={streamInfo.embedUrl}
          title="Official Trailer"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};
