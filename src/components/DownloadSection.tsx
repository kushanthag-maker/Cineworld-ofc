import React from 'react';
import { Movie, DownloadOption } from '../types';
import { useMovie } from '../context/MovieContext';
import { Download, Server, HardDrive, Zap, FileText } from 'lucide-react';
import { getDirectDownloadUrl } from '../utils/streamUtils';

interface DownloadSectionProps {
  movie: Movie;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ movie }) => {
  const { incrementMovieDownloads } = useMovie();

  const handleDownload = (url: string) => {
    if (!url) return;
    incrementMovieDownloads(movie.id);
    const directUrl = getDirectDownloadUrl(url);
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const options: DownloadOption[] = movie.downloadOptions && movie.downloadOptions.length > 0 ? movie.downloadOptions : [
    {
      id: 'default-1',
      quality: '1080p Full HD Direct',
      resolution: '1920x1080',
      size: '350 MB',
      format: 'MP4 Direct',
      downloadUrl: movie.streamUrl,
      server2Url: movie.streamUrl,
      subtitleUrl: movie.subtitleUrl,
      server1Name: 'Server 1 High-Speed R2',
      server2Name: 'Server 2 Direct CDN'
    }
  ];

  const mainSubUrl = movie.subtitleUrl;

  return (
    <div className="space-y-4 bg-zinc-950 border border-zinc-800 p-5 sm:p-6 rounded-2xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-500" />
            <span>High Speed Direct Download Links</span>
          </h3>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            100% Free • Direct High Speed Cloud CDN • Synced Sinhala Subtitles
          </p>
        </div>

        <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 shrink-0 w-fit">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Verified Fast CDN</span>
        </span>
      </div>

      {/* Main Movie Subtitle Download Banner if available */}
      {mainSubUrl && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                Synced Sinhala Subtitle File (.VTT / .SRT)
              </h4>
              <p className="text-[11px] text-zinc-300 font-mono">
                Download original standalone Sinhala subtitle track to play on VLC or smart TV
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDownload(mainSubUrl)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Sinhala Subtitle</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const subUrl = opt.subtitleUrl || mainSubUrl;
          return (
            <div
              key={opt.id}
              className="p-4.5 bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 rounded-xl transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white uppercase">
                  {opt.quality}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {opt.size || '300 MB'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                  {opt.resolution}
                </span>
                <span>•</span>
                <span>{opt.format}</span>
              </div>

              {/* Server Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleDownload(opt.downloadUrl)}
                  className="px-3 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{opt.server1Name || 'Server 1 (R2)'}</span>
                </button>

                <button
                  onClick={() => handleDownload(opt.server2Url || opt.downloadUrl)}
                  className="px-3 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Server className="w-3.5 h-3.5 text-amber-500" />
                  <span>{opt.server2Name || 'Server 2 (CDN)'}</span>
                </button>
              </div>

              {subUrl && (
                <button
                  onClick={() => handleDownload(subUrl)}
                  className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 font-mono text-[11px] border border-zinc-800 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Download Sinhala Subtitle (.vtt / .srt)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
