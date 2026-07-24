import React from 'react';
import { useMovie } from '../context/MovieContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toast } = useMovie();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50',
    info: 'bg-zinc-900/95 border-amber-500/50 text-amber-200 shadow-amber-950/50',
    error: 'bg-rose-900/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <p className="text-xs sm:text-sm font-semibold leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
