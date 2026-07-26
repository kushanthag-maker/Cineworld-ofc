import React, { useState, useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { Users, Download, Film, TrendingUp, Radio, MessageCircle, Sparkles } from 'lucide-react';

export const SiteStatsBar: React.FC = () => {
  const { movies, setIsRequestOpen } = useMovie();

  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [todayVisitors, setTodayVisitors] = useState<number>(1);
  const [todayDownloads, setTodayDownloads] = useState<number>(0);

  // Persistent browser session ID for real online & visitor analytics
  const [sessionId] = useState<string>(() => {
    let id = localStorage.getItem('cineworld_session_id');
    if (!id) {
      id = 'sess-' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('cineworld_session_id', id);
    }
    return id;
  });

  useEffect(() => {
    const sendHeartbeatAndFetchStats = async () => {
      try {
        const hbRes = await fetch('/api/stats/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        if (hbRes.ok) {
          const data = await hbRes.json();
          if (data) {
            setOnlineCount(data.onlineCount || 1);
            setTodayVisitors(data.todayVisitors || 1);
            setTodayDownloads(data.todayDownloads || 0);
          }
        }
      } catch (err) {
        try {
          const res = await fetch('/api/stats');
          if (res.ok) {
            const data = await res.json();
            setOnlineCount(data.onlineCount || 1);
            setTodayVisitors(data.todayVisitors || 1);
            setTodayDownloads(data.todayDownloads || 0);
          }
        } catch (e) {
          console.warn('Stats fetch notice:', e);
        }
      }
    };

    sendHeartbeatAndFetchStats();
    const interval = setInterval(sendHeartbeatAndFetchStats, 15000); // Heartbeat every 15s
    return () => clearInterval(interval);
  }, [sessionId]);

  // Find real top viewed movie
  const topMovie = [...movies].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))[0] || movies[0];

  return (
    <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-amber-500/20 py-4 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Main Real Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Real Daily Visitors Card */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
                  {todayVisitors.toLocaleString()}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-zinc-400 font-mono uppercase font-semibold">
                Daily Visitors (Real)
              </p>
            </div>
          </div>

          {/* Real Daily Downloads Card */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
                {todayDownloads.toLocaleString()}
              </span>
              <p className="text-[11px] text-zinc-400 font-mono uppercase font-semibold">
                Downloads Today (Real)
              </p>
            </div>
          </div>

          {/* Total Movies & Cartoons */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
                {movies.length} HD Movies
              </span>
              <p className="text-[11px] text-zinc-400 font-mono uppercase font-semibold">
                Sinhala Cartoons & Dubs
              </p>
            </div>
          </div>

          {/* Real Live Active Streamers */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center gap-3 hover:border-amber-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
                  {onlineCount.toLocaleString()} Active
                </span>
                <span className="text-[9px] bg-red-600 text-white font-black px-1 rounded uppercase">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono uppercase font-semibold">
                Online Users Now
              </p>
            </div>
          </div>

        </div>

        {/* Featured Real #1 Trending & WhatsApp Request Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          
          {/* Top Watched Movie Badge */}
          {topMovie && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-lg px-3 py-2 text-zinc-300">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-amber-400 uppercase text-[11px]">#1 Most Watched:</span>
              <span className="font-bold text-white truncate max-w-xs">{topMovie.title}</span>
              <span className="hidden sm:inline-block text-[10px] bg-amber-500 text-black font-black px-1.5 py-0.5 rounded font-mono">
                {(topMovie.viewsCount || 0).toLocaleString()} Real Views
              </span>
            </div>
          )}

          {/* Direct WhatsApp Movie Request Banner */}
          <button
            onClick={() => setIsRequestOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 px-4 py-2 rounded-lg font-bold transition-all cursor-pointer shadow-lg group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
            <span>Request Movie on WhatsApp (+94 76 990 4294)</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>

        </div>

      </div>
    </div>
  );
};
