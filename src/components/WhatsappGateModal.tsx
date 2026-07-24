import React from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Download, Server, HardDrive, Zap, ShieldCheck } from 'lucide-react';
import { getDirectDownloadUrl } from '../utils/streamUtils';

export const WhatsappGateModal: React.FC = () => {
  const { whatsappModalMovie, setWhatsappModalMovie, incrementMovieDownloads } = useMovie();

  if (!whatsappModalMovie) return null;

  const handleDownloadClick = (url: string) => {
    incrementMovieDownloads(whatsappModalMovie.id);
    const directUrl = getDirectDownloadUrl(url);
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const options = whatsappModalMovie.downloadOptions || [
    {
      id: 'dl-1',
      quality: '1080p Full HD Direct',
      resolution: '1920x1080',
      size: '350 MB',
      format: 'MP4 Direct',
      downloadUrl: whatsappModalMovie.streamUrl,
      server2Url: whatsappModalMovie.streamUrl,
      server1Name: 'Server 1 High-Speed R2',
      server2Name: 'Server 2 Direct CDN'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg p-6 space-y-6 text-white shadow-2xl relative">
        <button
          onClick={() => setWhatsappModalMovie(null)}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase">
            <Zap className="w-4 h-4 fill-amber-500" />
            <span>High Speed Direct Server Downloads</span>
          </div>
          <h3 className="text-xl font-black font-brand text-white uppercase">
            {whatsappModalMovie.title}
          </h3>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <div key={opt.id} className="p-4 bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">{opt.quality}</span>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
                  {opt.size}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownloadClick(opt.downloadUrl)}
                  className="px-3 py-2.5 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Server 1 (R2)</span>
                </button>

                <button
                  onClick={() => handleDownloadClick(opt.server2Url || opt.downloadUrl)}
                  className="px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Server className="w-3.5 h-3.5 text-amber-500" />
                  <span>Server 2 (CDN)</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-zinc-900 text-center text-[10px] text-white/50 font-mono uppercase tracking-widest border border-white/5">
          Fast Direct Download • Unlimited Bandwidth Cloud Servers
        </div>
      </div>
    </div>
  );
};
