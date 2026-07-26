import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Film, Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsRequestOpen } = useMovie();

  return (
    <footer className="bg-zinc-950 border-t border-amber-500/20 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 flex items-center justify-center font-black rounded-2xl shadow-lg shadow-amber-500/20 border border-amber-300/40">
              <Film className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-brand tracking-widest block">
                  CINE<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">WORLD</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded uppercase font-mono">
                  LK
                </span>
              </div>
              <p className="text-[10px] uppercase font-mono text-amber-400/80 tracking-widest mt-0.5">
                සිංහල Cartoons & Movie Cinema Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <button onClick={() => setIsRequestOpen(true)} className="hover:text-amber-400 transition-colors cursor-pointer bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
              Request Movies / Cartoons
            </button>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full HD Direct Downloads</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-mono gap-4 uppercase">
          <p>© {new Date().getFullYear()} CINEWORLD LK. All Rights Reserved.</p>
          
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Secure Client Persistence</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>100% Free Cinema</span>
            </span>
          </div>

          <p className="flex items-center gap-1 text-zinc-400">
            <span>Powered by</span>
            <span className="text-amber-500 font-bold">CineWorld LK Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

