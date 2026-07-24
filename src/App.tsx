import React, { useState, useEffect } from 'react';
import { MovieProvider, useMovie } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { MovieDetailsView } from './components/MovieDetailsView';
import { WatchlistView } from './components/WatchlistView';
import { MovieRequestModal } from './components/MovieRequestModal';
import { TrailerModal } from './components/TrailerModal';
import { WhatsappGateModal } from './components/WhatsappGateModal';
import { ReportModal } from './components/ReportModal';
import { ReportsListModal } from './components/ReportsListModal';
import { ToastContainer } from './components/ToastContainer';
import { NoticeBanner } from './components/NoticeBanner';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeMovie } = useMovie();
  const [activeTab, setActiveTab] = useState<'home' | 'watchlist'>('home');

  useEffect(() => {
    // Basic site security layer: disable right-click inspect context menu if desired or protect frame
    const handleContextMenu = (e: MouseEvent) => {
      // Prevent unauthorized code tampering on live public deployment
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

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

      {/* Global Modals & Toasts */}
      <MovieRequestModal />
      <ReportModal />
      <ReportsListModal />
      <TrailerModal />
      <WhatsappGateModal />
      <ToastContainer />
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

