import React from 'react';
import { Movie, DownloadOption } from '../types';
import { useMovie } from '../context/MovieContext';
import { Download, Server, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { getDirectDownloadUrl } from '../utils/streamUtils';

interface DownloadSectionProps {
  movie: Movie;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ movie }) => {
  const { incrementMovieDownloads } = useMovie();

  const handleDownload = (url: string) => {
    incrementMovieDownloads(movie.id);
    const directUrl = getDirectDownloadUrl(url);
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const options: DownloadOption[] = movie.downloadOptions || [
    {
      id: 'default-1',
      quality: '1080p Full HD Direct',
      resolution: '1920x1080',
      size: '350 MB',
      format: 'MP4 Direct',
      downloadUrl: movie.streamUrl,
      server2Url: movie.streamUrl,
      server1Name: 'Server 1 High-Speed R2',
      server2Name: 'Server 2 Direct CDN'
    }
  ];

  return (
    <div className="space-y-4 bg-[#080808] border border-white/10 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight font-brand flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-500" />
            <span>High Speed Direct Download Links</span>
          </h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
            100% Free • No Waiting Time • Direct High Speed Cloud CDN
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Verified Fast Servers</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="p-4 bg-black border border-white/10 hover:border-amber-500/50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white uppercase font-brand">
                {opt.quality}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">
                {opt.size || '300 MB'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-white/60">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                {opt.resolution}
              </span>
              <span>•</span>
              <span>{opt.format}</span>
            </div>

            {/* Server Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleDownload(opt.downloadUrl)}
                className="px-3 py-2 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Server 1 (R2)</span>
              </button>

              <button
                onClick={() => handleDownload(opt.server2Url || opt.downloadUrl)}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Server className="w-3.5 h-3.5 text-amber-500" />
                <span>Server 2 (CDN)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
