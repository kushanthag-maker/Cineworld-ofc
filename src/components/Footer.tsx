import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAdminOpen, setIsRequestOpen } = useMovie();

  return (
    <footer className="bg-black border-t border-white/10 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-black flex items-center justify-center font-black">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black font-brand tracking-widest block">
                CINE<span className="text-amber-500">WORLD</span>
              </span>
              <p className="text-[10px] uppercase font-mono text-white/50 tracking-widest">
                Sinhala Cartoons & Movie Cinema Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-white/70">
            <button onClick={() => setIsRequestOpen(true)} className="hover:text-amber-400 transition-colors">
              Request Content
            </button>
            <span>•</span>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-amber-400 transition-colors">
              Admin & API Auto-Sync
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-mono gap-4 uppercase">
          <p>© {new Date().getFullYear()} CINEWORLD LK. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-amber-500 font-bold">Sinhala Cartoons API</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
