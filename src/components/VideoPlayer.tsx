import React, { useState } from 'react';
import { AlertCircle, ExternalLink, RefreshCw, Monitor, Film, Server, Play, ListVideo } from 'lucide-react';
import { Movie, Episode } from '../types';
import { formatStreamUrl } from '../utils/streamUtils';

interface VideoPlayerProps {
  movie: Movie;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie }) => {
  const [hasError, setHasError] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(
    movie.episodes && movie.episodes.length > 0 ? movie.episodes[0] : null
  );

  // Extract all available stream servers from movie data & download options
  const streamSources = React.useMemo(() => {
    const list: { name: string; url: string }[] = [];
    
    if (selectedEpisode) {
      list.push({ name: 'Primary Episode Stream', url: selectedEpisode.stream_url });
    } else {
      if (movie.streamUrl) {
        let primaryName = 'DLServer-01 (Primary)';
        if (movie.streamUrl.includes('pixeldrain.com')) primaryName = 'Pixeldrain Stream';
        list.push({ name: primaryName, url: movie.streamUrl });
      }

      if (movie.downloadOptions) {
        movie.downloadOptions.forEach((opt) => {
          if (opt.server2Url && !list.some((s) => s.url === opt.server2Url)) {
            list.push({ name: opt.server2Name || 'DLServer Mirror', url: opt.server2Url });
          }
          if (opt.downloadUrl && !list.some((s) => s.url === opt.downloadUrl)) {
            list.push({ name: opt.server1Name || 'Alternate Mirror', url: opt.downloadUrl });
          }
        });
      }
    }

    return list;
  }, [movie, selectedEpisode]);

  const [activeSourceIndex, setActiveSourceIndex] = useState(0);

  const activeStreamUrl = selectedEpisode
    ? selectedEpisode.stream_url
    : streamSources[activeSourceIndex]?.url || movie.streamUrl;

  const streamInfo = formatStreamUrl(activeStreamUrl);

  const handleRetry = () => {
    setHasError(false);
  };

  const handleSelectSource = (index: number) => {
    setHasError(false);
    setActiveSourceIndex(index);
  };

  const isIframe = streamInfo.isIframe;

  return (
    <div className="w-full bg-[#050505] border border-white/10 shadow-2xl space-y-0">
      
      {/* Streaming Server Selector Bar */}
      <div className="bg-black px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 uppercase text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 animate-pulse rounded-full" />
          <span className="font-bold text-white uppercase font-brand text-[11px] sm:text-xs">
            CINEWORLD STREAMING SERVER
          </span>
          {selectedEpisode && (
            <span className="px-2 py-0.5 border border-amber-500/50 text-amber-400 text-[10px] font-bold">
              Episode {selectedEpisode.episode}
            </span>
          )}
        </div>

        {/* Server Selection Buttons */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {streamSources.map((source, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSource(idx)}
              className={`text-[10px] font-bold px-2.5 py-1 border transition-all cursor-pointer flex items-center gap-1 ${
                activeSourceIndex === idx
                  ? 'bg-amber-500 text-black border-amber-500 font-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
              }`}
              title={`Switch to ${source.name}`}
            >
              <Server className="w-3 h-3" />
              <span>{source.name}</span>
            </button>
          ))}

          <a
            href={activeStreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-amber-400 hover:text-white flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">External Mirror</span>
          </a>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {hasError ? (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-base sm:text-xl font-bold text-white uppercase font-editorial italic">
                Playback Error / CORS Stream Block
              </h4>
              <p className="text-[11px] sm:text-xs text-white/60 max-w-md uppercase tracking-wider">
                Direct stream playback restricted by browser policy. Switch to Server 2 or open external mirror link below.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>

              {streamSources.length > 1 && (
                <button
                  onClick={() => handleSelectSource((activeSourceIndex + 1) % streamSources.length)}
                  className="px-4 py-2 bg-amber-500 hover:bg-white text-black font-black uppercase text-[11px] tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Switch Stream Server</span>
                </button>
              )}

              <a
                href={activeStreamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5 transition-colors"
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
            key={activeStreamUrl}
            src={streamInfo.directUrl || streamInfo.embedUrl}
            controls
            autoPlay
            playsInline
            poster={movie.backdropUrl || movie.posterUrl}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Episode Selector for Cartoon / TV Series */}
      {movie.episodes && movie.episodes.length > 0 && (
        <div className="p-4 bg-zinc-950 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
            <ListVideo className="w-4 h-4" />
            <span>Select Episode ({movie.episodes.length} Episodes Available)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {movie.episodes.map((ep, idx) => {
              const isSelected = selectedEpisode?.episode === ep.episode;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setHasError(false);
                    setSelectedEpisode(ep);
                  }}
                  className={`px-3 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-500 font-black'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white border-white/10'
                  }`}
                >
                  <Play className={`w-3 h-3 ${isSelected ? 'fill-black' : 'fill-white'}`} />
                  <span>Ep {ep.episode}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Footer info */}
      <div className="p-3 sm:p-4 bg-black flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wider text-white/60 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-500" />
          <span className="text-white font-bold">{movie.title}</span>
          {selectedEpisode && <span className="text-amber-400">({selectedEpisode.title})</span>}
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-amber-500">
          <span>Sinhala Audio / Subtitles</span>
        </div>
      </div>
    </div>
  );
};
