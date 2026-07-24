import React, { useState } from 'react';
import { Movie, DownloadOption } from '../types';
import { useMovie } from '../context/MovieContext';
import { Download, ShieldCheck, HardDrive, ArrowDownCircle, ExternalLink, Sparkles, Server, Check } from 'lucide-react';
import { getDirectDownloadUrl } from '../utils/streamUtils';

interface DownloadSectionProps {
  movie: Movie;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ movie }) => {
  const { incrementMovieDownloads } = useMovie();
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const triggerDirectDownload = (rawUrl: string, filename: string, key: string) => {
    setDownloadingKey(key);
    incrementMovieDownloads(movie.id);

    const directUrl = getDirectDownloadUrl(rawUrl);

    setTimeout(() => {
      // Direct browser download trigger
      const link = document.createElement('a');
      link.href = directUrl;
      link.setAttribute('download', filename);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadingKey(null);
    }, 600);
  };

  return (
    <div className="space-y-4 bg-black p-4 sm:p-6 border border-white/10">
      
      {/* Download Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-editorial italic">
            <Download className="w-5 h-5 text-amber-500" />
            <span>Direct High-Speed Downloads</span>
          </h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
            Auto Direct Download • Server 1 (Primary) & Server 2 (Backup Mirror)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 w-fit rounded-none">
          <ShieldCheck className="w-4 h-4" />
          <span>No Ad Redirects • 100% Direct</span>
        </div>
      </div>

      {/* Download List Cards */}
      {movie.downloadOptions && movie.downloadOptions.length > 0 ? (
        <div className="space-y-3">
          {movie.downloadOptions.map((opt) => {
            const server1Key = `${opt.id}-s1`;
            const server2Key = `${opt.id}-s2`;
            const hasServer2 = Boolean(opt.server2Url && opt.server2Url.trim() !== '');

            const defaultFilename = `${movie.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${opt.quality.replace(/\s+/g, '')}.mp4`;

            return (
              <div
                key={opt.id}
                className="p-4 bg-[#050505] border border-white/10 hover:border-amber-500/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Info */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 border border-amber-500/50 text-amber-400 font-mono text-xs font-bold uppercase">
                      {opt.quality}
                    </span>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">{opt.resolution}</span>
                    <span className="text-xs text-white/50 font-mono uppercase">({opt.format})</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 uppercase tracking-wider font-mono pt-1">
                    <span className="flex items-center gap-1 text-white font-bold">
                      <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                      Size: {opt.size}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Sinhala Subtitles Included
                    </span>
                  </div>
                </div>

                {/* Dual Server Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  {/* Server 1 Button */}
                  <button
                    onClick={() => triggerDirectDownload(opt.downloadUrl, defaultFilename, server1Key)}
                    disabled={downloadingKey === server1Key}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    title="Download directly from Primary High-Speed Server 1"
                  >
                    {downloadingKey === server1Key ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Downloading S1...</span>
                      </>
                    ) : (
                      <>
                        <Server className="w-3.5 h-3.5" />
                        <span>Server 1 ({opt.server1Name || 'Direct HD'})</span>
                        <ArrowDownCircle className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  {/* Server 2 Button */}
                  {hasServer2 && (
                    <button
                      onClick={() => triggerDirectDownload(opt.server2Url!, defaultFilename, server2Key)}
                      disabled={downloadingKey === server2Key}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-amber-500 hover:text-black border border-white/20 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                      title="Download from Backup Mirror Server 2"
                    >
                      {downloadingKey === server2Key ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          <span>Downloading S2...</span>
                        </>
                      ) : (
                        <>
                          <Server className="w-3.5 h-3.5 text-amber-400" />
                          <span>Server 2 ({opt.server2Name || 'Backup Mirror'})</span>
                          <ArrowDownCircle className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-white/40 text-xs font-mono uppercase tracking-widest">
          No direct download links added yet for this movie.
        </div>
      )}

      {/* Subtitle & Safety Notice */}
      <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/60 uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          Note: Clicking download initiates immediate direct media download. All files come with Sinhala Subtitles attached.
        </span>
      </div>
    </div>
  );
};

