import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Search, Film, Bookmark, PlusCircle, Menu, X, Sparkles, Flag, Crown } from 'lucide-react';

export const Navbar: React.FC<{ activeTab: 'home' | 'watchlist'; setActiveTab: (tab: 'home' | 'watchlist') => void }> = ({
  activeTab,
  setActiveTab
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    setIsRequestOpen,
    setIsReportsListOpen,
    setIsPromoModalOpen,
    userPremium,
    reports,
    watchlist
  } = useMovie();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pendingReportsCount = reports.filter((r) => r.status === 'Pending').length;

  const categories = [
    'All',
    'Sinhala Dubbed',
    'Sinhala Subbed',
    'Hollywood',
    'Bollywood',
    'Tamil / South',
    'Animation'
  ];

  return (
    <nav className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div
            onClick={() => {
              setActiveTab('home');
              setSelectedCategory('All');
              setSearchTerm('');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-xl rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-transform border border-amber-300/50">
                <Film className="w-7 h-7 text-zinc-950 stroke-[2.5]" />
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-widest font-brand block leading-none drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                  CINE<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">WORLD</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shadow-sm">
                  LK
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono block mt-1 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>සිංහල Cartoons & Movie Cinema</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-500/80" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Ben 10, Cartoons, Avatar, Movies..."
              className="w-full bg-zinc-900/90 border border-zinc-800 text-white text-xs pl-10 pr-12 py-3 rounded-2xl focus:border-amber-500 focus:bg-zinc-900 outline-none transition-all font-mono shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Nav Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsReportsListOpen(true)}
              className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/30 rounded-xl transition-all cursor-pointer relative"
              title="View User Link & Stream Reports"
            >
              <Flag className="w-4 h-4 text-amber-500" />
              <span>Reports</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${pendingReportsCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                {reports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'home' ? 'watchlist' : 'home')}
              className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border rounded-xl transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setIsRequestOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Request Movie</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-500" /> : <Menu className="w-6 h-6 text-amber-500" />}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-t border-white/10 text-xs font-bold uppercase tracking-wider">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveTab('home');
              }}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat && activeTab === 'home'
                  ? 'bg-amber-500 text-black border-amber-500 font-black shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              {cat === 'Sinhala Dubbed' ? 'Sinhala Dubbed Cartoons' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/10 px-4 py-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies, Ben 10, cartoons..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setIsReportsListOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2.5 bg-zinc-900 text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-500/30 rounded-xl flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4 text-amber-500" />
              <span>User Link Reports ({reports.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab(activeTab === 'home' ? 'watchlist' : 'home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider border border-zinc-800 rounded-xl flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => {
                setIsRequestOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 bg-amber-500 text-black font-black text-xs uppercase tracking-wider border border-amber-500 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Request Movie</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

