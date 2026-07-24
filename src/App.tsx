import React, { useState } from 'react';
import { MovieProvider, useMovie } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailsView } from './components/MovieDetailsView';
import { WatchlistView } from './components/WatchlistView';
import { AdminModal } from './components/AdminModal';
import { MovieRequestModal } from './components/MovieRequestModal';
import { TrailerModal } from './components/TrailerModal';
import { Footer } from './components/Footer';
import { Movie } from './types';

const MainAppContent: React.FC = () => {
  const { activeMovie, setActiveMovie, movies } = useMovie();
  const [activeTab, setActiveTab] = useState<'home' | 'watchlist' | 'sinhala-sub' | 'sinhala-dub' | 'tv-series'>('home');

  const handleWatchMovie = (movie: Movie) => {
    setActiveMovie(movie);
  };

  const handleDownloadClick = (movie: Movie) => {
    setActiveMovie(movie);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'home') {
            setActiveMovie(null);
          }
        }}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* If Movie Selected -> Show Details View */}
        {activeMovie ? (
          <MovieDetailsView
            movie={activeMovie}
            onClose={() => setActiveMovie(null)}
            onSelectMovie={(m) => setActiveMovie(m)}
          />
        ) : activeTab === 'watchlist' ? (
          <WatchlistView
            onWatchMovie={handleWatchMovie}
            onDownloadClick={handleDownloadClick}
            onBackToHome={() => setActiveTab('home')}
          />
        ) : (
          <>
            {/* Top Hero Banner Carousel */}
            <HeroBanner
              onWatchMovie={handleWatchMovie}
              onDownloadClick={handleDownloadClick}
            />

            {/* Movie Catalog Grid */}
            <MovieGrid
              onWatchMovie={handleWatchMovie}
              onDownloadClick={handleDownloadClick}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <AdminModal />
      <MovieRequestModal />
      <TrailerModal />
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <MainAppContent />
    </MovieProvider>
  );
}
