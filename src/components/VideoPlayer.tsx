import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle, ExternalLink, Subtitles } from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onClose?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if streamUrl is YouTube or Vimeo iframe embed or direct MP4
  const isEmbed = movie.streamUrl.includes('youtube.com') ||
                  movie.streamUrl.includes('youtu.be') ||
                  movie.streamUrl.includes('vimeo.com') ||
                  movie.streamUrl.includes('embed');

  return (
    <div className="w-full bg-[#050505] border border-white/10 shadow-2xl space-y-0">
      
      {/* Player Header / Status Bar */}
      <div className="bg-black px-4 py-3 flex items-center justify-between border-b border-white/10 uppercase text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 animate-pulse" />
          <span className="font-bold text-white uppercase font-brand">
            CINEWORLD ARCHIVAL STREAM
          </span>
          {movie.hasSinhalaSub && (
            <span className="px-2 py-0.5 border border-amber-500/50 text-amber-400 text-[10px] font-bold">
              Sinhala Subtitles Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={movie.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-white/70 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 transition-colors"
          >
            <span>Direct Stream Link</span>
            <ExternalLink className="w-3 h-3 text-amber-500" />
          </a>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {isEmbed ? (
          <iframe
            src={movie.streamUrl}
            title={movie.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={movie.streamUrl}
            controls
            autoPlay
            poster={movie.backdropUrl || movie.posterUrl}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500" />
            <h4 className="text-lg font-bold text-white uppercase font-editorial italic">Direct Video Streaming Error</h4>
            <p className="text-xs text-white/60 max-w-md uppercase tracking-wider">
              The direct stream source could not be played inline. You can open the stream link directly or use direct downloads below!
            </p>
            <a
              href={movie.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-amber-500 text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-colors"
            >
              Open External Video Link
            </a>
          </div>
        )}
      </div>

      {/* Video Footer info */}
      <div className="p-4 bg-black flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wider text-white/60 border-t border-white/10">
        <div>
          <span className="text-white font-bold">{movie.title}</span> - {movie.quality} ({movie.duration})
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-amber-500">
          <span>Audio: Dual Audio / Original</span>
          <span>•</span>
          <span>Subtitles: Sinhala SRT</span>
        </div>
      </div>
    </div>
  );
};
