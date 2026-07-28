import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Megaphone, X, Sparkles, Volume2 } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const { notices } = useMovie();
  const [isDismissed, setIsDismissed] = useState(false);

  const activeNotices = notices.filter((n) => n.isActive !== false);

  // If dismissed or no active notice exists -> return null (do not display anything)
  if (isDismissed || activeNotices.length === 0) return null;

  const displayNotice = activeNotices[0];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between gap-3 font-mono shadow-lg border-b border-amber-600/30">
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <span className="bg-black text-amber-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 shadow">
          <Megaphone className="w-3 h-3 text-amber-400 animate-bounce" />
          <span>LATEST NOTICE</span>
        </span>
        <div className="truncate flex items-center gap-2">
          <span className="font-black text-black underline decoration-black/30 underline-offset-2 shrink-0">
            {displayNotice.title}:
          </span>
          <span className="font-semibold text-zinc-900 truncate">
            {displayNotice.content}
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="p-1 hover:bg-black/10 rounded-lg text-black transition-colors shrink-0 cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
