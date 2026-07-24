import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, ExternalLink, RefreshCw, Monitor, Film } from 'lucide-react';
import { Movie } from '../types';
import { formatStreamUrl } from '../utils/streamUtils';

interface VideoPlayerProps {
  movie: Movie;
  onClose?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie }) => {
  const [hasError, setHasError] = useState(false);
  const [forcedMode, setForcedMode] = useState<'auto' | 'iframe' | 'direct'>('auto');

  const streamInfo = formatStreamUrl(movie.streamUrl);

  const isIframe = forcedMode === 'iframe' || (forcedMode === 'auto' && streamInfo.isIframe);

  const handleRetry = () => {
    setHasError(false);
  };

  const handleToggleMode = () => {
    setHasError(false);
    if (isIframe) {
      setForcedMode('direct');
    } else {
      setForcedMode('iframe');
    }
  };

  return (
    <div className="w-full bg-[#050505] border border-white/10 shadow-2xl space-y-0">
      
      {/* Player Header / Status Bar */}
      <div className="bg-black px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 uppercase text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 animate-pulse rounded-full" />
          <span className="font-bold text-white uppercase font-brand">
            CINEWORLD ARCHIVAL STREAMING SERVER
          </span>
          {movie.hasSinhalaSub && (
            <span className="px-2 py-0.5 border border-amber-500/50 text-amber-400 text-[10px] font-bold">
              Sinhala Subtitles Attached
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMode}
            className="text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 transition-colors cursor-pointer"
            title="Switch between Iframe Embed & Direct HTML5 Player"
          >
            <Monitor className="w-3 h-3 text-amber-500" />
            <span>Mode: {isIframe ? 'Iframe Embed' : 'Direct Player'}</span>
          </button>

          <a
            href={movie.streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 transition-colors"
          >
            <span>External Stream Mirror</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {hasError ? (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white uppercase font-editorial italic">
                Playback Error / Direct Stream Blocked
              </h4>
              <p className="text-xs text-white/60 max-w-md uppercase tracking-wider">
                The video stream could not be loaded in standard HTML5 mode. Try switching to Iframe Embed mode or open the mirror stream directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRetry}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>

              <button
                onClick={handleToggleMode}
                className="px-5 py-2.5 bg-amber-500 hover:bg-white text-black font-black uppercase text-xs tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Switch to {isIframe ? 'Direct Video' : 'Iframe Embed'}</span>
              </button>

              <a
                href={movie.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Direct Mirror</span>
              </a>
            </div>
          </div>
        ) : isIframe ? (
          <iframe
            src={streamInfo.embedUrl}
            title={movie.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => setHasError(true)}
          />
        ) : (
          <video
            src={streamInfo.embedUrl}
            controls
            autoPlay
            poster={movie.backdropUrl || movie.posterUrl}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>
        )}
      </div>

      {/* Video Footer info */}
      <div className="p-4 bg-black flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wider text-white/60 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-500" />
          <span className="text-white font-bold">{movie.title}</span>
          <span>({movie.releaseYear})</span>
          <span className="text-amber-500 font-mono text-[10px] bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
            {movie.quality}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-amber-500">
          <span>Audio: Original Dual Audio</span>
          <span>•</span>
          <span>Subtitles: Sinhala Subtitles (.srt)</span>
        </div>
      </div>
    </div>
  );
};
