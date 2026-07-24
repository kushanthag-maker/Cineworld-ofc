import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import {
  Film,
  Search,
  Bookmark,
  PlusCircle,
  Lock,
  UserCheck,
  Menu,
  X,
  Sparkles,
  Clapperboard,
  Tv,
  Subtitles,
  Flame
} from 'lucide-react';

import logoImg from '../assets/images/cineworld_logo_1784874799347.jpg';

interface NavbarProps {
  onNavigateTab: (tab: 'home' | 'watchlist' | 'sinhala-sub' | 'sinhala-dub' | 'tv-series') => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateTab, activeTab }) => {
  const {
    searchQuery,
    setSearchQuery,
    watchlist,
    isAdminLoggedIn,
    setIsAdminModalOpen,
    setIsRequestModalOpen,
    setSelectedGenre,
    setSelectedType,
    adminLogout
  } = useMovie();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('home');
  };

  const handleTabClick = (tab: 'home' | 'watchlist' | 'sinhala-sub' | 'sinhala-dub' | 'tv-series') => {
    if (tab === 'sinhala-sub') {
      setSelectedType('All');
      setSelectedGenre('All');
      onNavigateTab('sinhala-sub');
    } else if (tab === 'sinhala-dub') {
      setSelectedType('All');
      setSelectedGenre('All');
      onNavigateTab('sinhala-dub');
    } else if (tab === 'tv-series') {
      setSelectedType('TV Series');
      onNavigateTab('tv-series');
    } else {
      setSelectedType('All');
      setSelectedGenre('All');
      onNavigateTab(tab);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-500/50 shadow-md group-hover:border-amber-400 transition-colors">
              <img src={logoImg} alt="Cineworld Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white uppercase font-brand">
                CINE<span className="text-amber-500">WORLD</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 -mt-1">
                Stream & Direct Download
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-medium uppercase tracking-widest">
            <button
              onClick={() => handleTabClick('home')}
              className={`px-3 py-1.5 transition-all ${
                activeTab === 'home'
                  ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Clapperboard className="w-4 h-4 inline mr-1.5 opacity-70" />
              <span>All Movies</span>
            </button>

            <button
              onClick={() => handleTabClick('sinhala-sub')}
              className={`px-3 py-1.5 transition-all ${
                activeTab === 'sinhala-sub'
                  ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Subtitles className="w-4 h-4 text-amber-500 inline mr-1.5" />
              <span>සිංහල Subtitles</span>
            </button>

            <button
              onClick={() => handleTabClick('sinhala-dub')}
              className={`px-3 py-1.5 transition-all ${
                activeTab === 'sinhala-dub'
                  ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400 inline mr-1.5" />
              <span>සිංහල Dubbed</span>
            </button>

            <button
              onClick={() => handleTabClick('tv-series')}
              className={`px-3 py-1.5 transition-all ${
                activeTab === 'tv-series'
                  ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4 text-emerald-400 inline mr-1.5" />
              <span>TV Series</span>
            </button>

            <button
              onClick={() => handleTabClick('watchlist')}
              className={`px-3 py-1.5 transition-all relative ${
                activeTab === 'watchlist'
                  ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 inline mr-1.5" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="ml-1 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>

          {/* Search Input & Action Controls */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-56 lg:w-64">
              <input
                type="text"
                placeholder="Search Library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-white/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Request Movie Modal Button */}
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors"
              title="Request a movie from Admin"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Request</span>
            </button>

            {/* Admin Panel Button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Admin Active</span>
                </button>
                <button
                  onClick={adminLogout}
                  className="text-xs text-white/40 hover:text-amber-500 uppercase font-mono"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/30 text-white text-[11px] font-bold uppercase tracking-wider transition-all"
              >
                <span>Admin Access</span>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 bg-white/5 text-white lg:hidden border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="block md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search Library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 text-white placeholder-white/40 text-xs rounded-full pl-9 pr-4 py-2 border border-white/10 focus:outline-none focus:border-amber-500/50"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#080808] border-b border-white/10 px-4 py-4 space-y-3 uppercase text-xs tracking-wider">
          <button
            onClick={() => handleTabClick('home')}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between ${
              activeTab === 'home' ? 'bg-white/10 text-amber-500 font-bold' : 'text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clapperboard className="w-4 h-4" />
              <span>All Movies</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('sinhala-sub')}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between ${
              activeTab === 'sinhala-sub' ? 'bg-white/10 text-amber-500 font-bold' : 'text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Subtitles className="w-4 h-4 text-amber-500" />
              <span>සිංහල Subtitles Movies</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('sinhala-dub')}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between ${
              activeTab === 'sinhala-dub' ? 'bg-white/10 text-amber-500 font-bold' : 'text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>සිංහල Dubbed Movies</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('tv-series')}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between ${
              activeTab === 'tv-series' ? 'bg-white/10 text-amber-500 font-bold' : 'text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>TV Series</span>
            </div>
          </button>

          <button
            onClick={() => handleTabClick('watchlist')}
            className={`w-full text-left px-4 py-2.5 flex items-center justify-between ${
              activeTab === 'watchlist' ? 'bg-white/10 text-amber-500 font-bold' : 'text-white/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>My Watchlist ({watchlist.length})</span>
            </div>
          </button>

          <button
            onClick={() => {
              setIsRequestModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-amber-500 bg-white/5 border border-white/10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request a Movie</span>
          </button>
        </div>
      )}
    </header>
  );
};
