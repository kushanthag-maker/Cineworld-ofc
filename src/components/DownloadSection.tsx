import React, { useState } from 'react';
import { Movie, DownloadOption } from '../types';
import { useMovie } from '../context/MovieContext';
import { Download, ShieldCheck, HardDrive, CheckCircle2, ArrowDownCircle, ExternalLink, Sparkles } from 'lucide-react';

interface DownloadSectionProps {
  movie: Movie;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ movie }) => {
  const { incrementMovieDownloads } = useMovie();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadClick = (option: DownloadOption) => {
    setDownloadingId(option.id);
    incrementMovieDownloads(movie.id);

    setTimeout(() => {
      // Trigger download or open URL in new tab
      const a = document.createElement('a');
      a.href = option.downloadUrl;
      a.target = '_blank';
      a.download = `${movie.title.replace(/\s+/g, '_')}_${option.quality}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadingId(null);
    }, 1000);
  };

  return (
    <div className="space-y-4 bg-black p-6 border border-white/10">
      
      {/* Download Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-editorial italic">
            <Download className="w-5 h-5 text-amber-500" />
            <span>Direct Archival Downloads</span>
          </h3>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
            High-speed direct MP4 media links & Sinhala subtitle attachments
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 w-fit">
          <ShieldCheck className="w-4 h-4" />
          <span>Direct High Speed</span>
        </div>
      </div>

      {/* Download List Cards / Table */}
      {movie.downloadOptions && movie.downloadOptions.length > 0 ? (
        <div className="space-y-3">
          {movie.downloadOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-4 bg-[#050505] border border-white/10 hover:border-amber-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 border border-amber-500/50 text-amber-400 font-mono text-xs font-bold uppercase">
                    {opt.quality}
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{opt.resolution}</span>
                  <span className="text-xs text-white/50 font-mono uppercase">({opt.format})</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60 uppercase tracking-wider font-mono">
                  <span className="flex items-center gap-1 text-white font-bold">
                    <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                    Size: {opt.size}
                  </span>
                  {opt.directServerName && (
                    <span className="text-white/40">Server: {opt.directServerName}</span>
                  )}
                </div>
              </div>

              {/* Download CTA */}
              <button
                onClick={() => handleDownloadClick(opt)}
                disabled={downloadingId === opt.id}
                className="px-6 py-2.5 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {downloadingId === opt.id ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Preparing Download...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownCircle className="w-4 h-4" />
                    <span>Download {opt.quality}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-white/40 text-xs font-mono uppercase tracking-widest">
          No direct download links added yet for this movie.
        </div>
      )}

      {/* Sinhala Subtitle File Notice */}
      <div className="p-3 bg-white/5 border border-white/10 text-xs text-white/60 uppercase tracking-wider flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          Note: All downloads include embedded or attached Sinhala subtitles (.srt) file format where available.
        </span>
      </div>
    </div>
  );
};
