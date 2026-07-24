import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Search, Film, Bookmark, PlusCircle, Shield, Menu, X, DownloadCloud, Sparkles, Tv } from 'lucide-react';

export const Navbar: React.FC<{ activeTab: 'home' | 'watchlist'; setActiveTab: (tab: 'home' | 'watchlist') => void }> = ({
  activeTab,
  setActiveTab
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    setIsAdminOpen,
    setIsRequestOpen,
    setIsApiImportOpen,
    watchlist
  } = useMovie();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-amber-500/20">
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
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-black font-black text-xl rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 fill-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-widest font-brand block leading-none">
                  CINE<span className="text-amber-500">WORLD</span>
                </span>
                <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded uppercase font-mono tracking-wider">
                  LK
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono block mt-1 font-bold flex items-center gap-1">
                <span>සිංහල Cartoons & Movie Cinema</span>
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-500/70" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Ben 10, Cartoons, Avatar, Movies..."
              className="w-full bg-zinc-900/90 border border-zinc-800 text-white text-xs pl-10 pr-4 py-3 rounded-xl focus:border-amber-500 outline-none transition-colors font-mono"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Nav Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsApiImportOpen(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-105"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Search & Import API</span>
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'home' ? 'watchlist' : 'home')}
              className={`px-3.5 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border rounded-xl transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setIsRequestOpen(true)}
              className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Request</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Admin Panel & API Auto Sync"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar border-t border-white/5 text-xs font-bold uppercase tracking-wider">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveTab('home');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat && activeTab === 'home'
                  ? 'bg-amber-500 text-black border-amber-500 font-black shadow-md shadow-amber-500/20'
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
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setIsApiImportOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 py-3 bg-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Search & Import Movies/Cartoons</span>
            </button>

            <button
              onClick={() => {
                setActiveTab(activeTab === 'home' ? 'watchlist' : 'home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider border border-zinc-800 rounded-lg flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => {
                setIsRequestOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-zinc-900 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 rounded-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Request</span>
            </button>

            <button
              onClick={() => {
                setIsAdminOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2 bg-zinc-900 text-zinc-300 font-bold text-xs uppercase tracking-wider border border-zinc-800 rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Admin Panel & Auto-Sync Engine</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
