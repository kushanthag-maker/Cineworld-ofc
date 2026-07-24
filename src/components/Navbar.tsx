import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Search, Film, Bookmark, PlusCircle, Shield, Menu, X, Sparkles } from 'lucide-react';

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
    <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
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
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center text-black font-black text-xl rounded-none shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:bg-white transition-colors">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-widest font-brand block leading-none">
                CINE<span className="text-amber-500">WORLD</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono block mt-1">
                Movies & Sinhala Cartoons
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Ben 10, Cartoons, Avatar, Movies..."
              className="w-full bg-zinc-900/90 border border-white/10 text-white text-xs pl-10 pr-4 py-3 rounded-none focus:border-amber-500 outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Nav Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setActiveTab(activeTab === 'home' ? 'watchlist' : 'home')}
              className={`px-4 py-2 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer ${
                activeTab === 'watchlist'
                  ? 'bg-amber-500 text-black border-amber-500'
                  : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setIsRequestOpen(true)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Request Content</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-amber-500/40 transition-all cursor-pointer"
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
              className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat && activeTab === 'home'
                  ? 'bg-amber-500 text-black border-amber-500 font-black'
                  : 'bg-zinc-900/50 hover:bg-zinc-800 text-white/70 border-white/5'
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
            <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search movies, Ben 10, cartoons..."
              className="w-full bg-zinc-900 border border-white/10 text-white text-xs pl-9 pr-4 py-2.5 rounded-none outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setActiveTab(activeTab === 'home' ? 'watchlist' : 'home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => {
                setIsRequestOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>Request</span>
            </button>

            <button
              onClick={() => {
                setIsAdminOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2 bg-amber-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel & Auto-Sync Engine</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
