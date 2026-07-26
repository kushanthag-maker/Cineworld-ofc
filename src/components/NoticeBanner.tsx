import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Bell, Sparkles } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const { notices } = useMovie();
  const activeNotice = notices.find((n) => n.isActive);

  if (!activeNotice) return null;

  return (
    <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 font-mono">
      <Sparkles className="w-4 h-4 text-black shrink-0 animate-spin" />
      <span className="font-black">{activeNotice.title}:</span>
      <span className="font-semibold">{activeNotice.content}</span>
    </div>
  );
};
