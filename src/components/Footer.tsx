import React from 'react';
import { Film, Lock, ShieldCheck, Github, ExternalLink, Heart, Subtitles, Flame } from 'lucide-react';
import { useMovie } from '../context/MovieContext';
import logoImg from '../assets/images/cineworld_logo_1784874799347.jpg';

export const Footer: React.FC = () => {
  const { setIsAdminModalOpen, movies } = useMovie();

  return (
    <footer className="mt-20 bg-[#050505] border-t border-white/10 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/50 shadow-md">
                <img src={logoImg} alt="Cineworld Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-2xl font-black text-white font-brand tracking-tighter uppercase">
                CINE<span className="text-amber-500">WORLD</span>
              </span>
            </div>

            <p className="text-xs text-white/60 italic font-serif leading-relaxed max-w-md">
              Cineworld is an archival digital streaming and direct download library featuring curated films, Sinhala subtitles, and high-bitrate media.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-white/50">
              <span className="flex items-center gap-1 text-amber-500">
                <Subtitles className="w-3.5 h-3.5" />
                සිංහල උපසිරැසි
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-3.5 h-3.5" />
                සිංහල හඬකැවූ
              </span>
            </div>
          </div>

          {/* Catalog Stats */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Catalog Overview</h4>
            <ul className="space-y-2 text-xs text-white/60 uppercase tracking-wider">
              <li>Archived Titles: <span className="text-white font-bold">{movies.length} Movies</span></li>
              <li>Formats: <span className="text-white font-bold">4K UHD, 1080p, 720p</span></li>
              <li>Links: <span className="text-amber-500 font-bold">Direct Stream & MP4</span></li>
            </ul>
          </div>

          {/* Admin & Hosting Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">System Controls</h4>
            <p className="text-xs text-white/50 uppercase tracking-wider">
              Restricted Portal Access
            </p>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-widest text-white/40">
          <p>© {new Date().getFullYear()} CINEWORLD ENTERTAINMENT. Vercel & GitHub Stream Active.</p>
          <div className="flex items-center gap-2">
            <span>Direct Link Stream Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
