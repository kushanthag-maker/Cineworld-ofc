import React, { useState } from 'react';
import { Megaphone, X, Info, AlertTriangle, Bell } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export const NoticeBanner: React.FC = () => {
  const { notices } = useMovie();
  const [closedIds, setClosedIds] = useState<string[]>([]);

  const activeNotices = notices.filter((n) => n.active && !closedIds.includes(n.id));

  if (activeNotices.length === 0) return null;

  const handleClose = (id: string) => {
    setClosedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-2 mb-6">
      {activeNotices.map((notice) => {
        const isAlert = notice.type === 'alert';
        const isUpdate = notice.type === 'update';

        return (
          <div
            key={notice.id}
            className={`p-4 border rounded-xl flex items-start justify-between gap-4 animate-fadeIn transition-all ${
              isAlert
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                : isUpdate
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-black/40 border border-white/10 shrink-0 mt-0.5">
                {isAlert ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : isUpdate ? (
                  <Bell className="w-5 h-5 text-amber-400" />
                ) : (
                  <Megaphone className="w-5 h-5 text-emerald-400" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-editorial italic text-white">
                    {notice.title}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-black/40 border border-white/10 rounded">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {notice.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleClose(notice.id)}
              className="p-1 rounded bg-black/40 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
