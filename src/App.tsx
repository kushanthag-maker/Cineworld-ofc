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
import { AdminPanel } from './components/AdminPanel';
import { PromoCodeModal } from './components/PromoCodeModal';

const AppContent: React.FC = () => {
  const { activeMovie, isPromoModalOpen, setIsPromoModalOpen } = useMovie();
  const [activeTab, setActiveTab] = useState<'home' | 'watchlist'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Check URL parameters for secret admin mode (?admin=true, ?admin=7060, /admin, #admin)
  useEffect(() => {
    const checkAdminRoute = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isParamAdmin = searchParams.has('admin') || searchParams.get('p') === '7060';
      const isHashAdmin = window.location.hash.includes('admin') || window.location.hash.includes('7060');
      const isPathAdmin = window.location.pathname === '/admin';
      if (isParamAdmin || isHashAdmin || isPathAdmin) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  useEffect(() => {
    // Basic site security layer
    const handleContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <AdminPanel onClose={() => {
          setIsAdminOpen(false);
          if (window.location.search.includes('admin')) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        }} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-amber-500 selection:text-black font-sans">
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

