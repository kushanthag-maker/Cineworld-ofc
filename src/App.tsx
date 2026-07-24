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
import { WhatsappGateModal } from './components/WhatsappGateModal';
import { ApiSearchImportModal } from './components/ApiSearchImportModal';
import { NoticeBanner } from './components/NoticeBanner';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeMovie } = useMovie();
  const [activeTab, setActiveTab] = useState<'home' | 'watchlist'>('home');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      <div>
        <NoticeBanner />
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeMovie ? (
          <MovieDetailsView />
        ) : activeTab === 'watchlist' ? (
          <WatchlistView />
        ) : (
          <main>
            <HeroBanner />
            <MovieGrid />
          </main>
        )}
      </div>

      <Footer />

      {/* Global Modals */}
      <AdminModal />
      <MovieRequestModal />
      <TrailerModal />
      <WhatsappGateModal />
      <ApiSearchImportModal />
    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
  );
}
