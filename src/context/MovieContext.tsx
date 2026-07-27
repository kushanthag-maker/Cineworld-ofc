import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, MovieRequest, Notice, MovieComment, LinkReport, ToastMessage, PromoCode, UserPremiumInfo, VipRequest } from '../types';
import { initialMovies } from '../data/initialMovies';

interface MovieContextType {
  movies: Movie[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeMovie: Movie | null;
  setActiveMovie: (movie: Movie | null) => void;
  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
  requests: MovieRequest[];
  addMovieRequest: (request: Omit<MovieRequest, 'id' | 'status' | 'createdAt'>) => void;
  notices: Notice[];
  comments: MovieComment[];
  reports: LinkReport[];
  submitReport: (movieId: string, movieTitle: string, issueType: LinkReport['issueType'], description: string) => Promise<boolean>;
  deleteReport: (id: string) => void;
  resolveReport: (id: string) => void;
  isReportsListOpen: boolean;
  setIsReportsListOpen: (open: boolean) => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  isRequestOpen: boolean;
  setIsRequestOpen: (open: boolean) => void;
  isReportOpen: boolean;
  setIsReportOpen: (open: boolean) => void;
  reportMovieTarget: Movie | null;
  setReportMovieTarget: (movie: Movie | null) => void;
  activeTrailerUrl: string | null;
  setActiveTrailerUrl: (url: string | null) => void;
  whatsappModalMovie: Movie | null;
  setWhatsappModalMovie: (movie: Movie | null) => void;
  userPremium: UserPremiumInfo;
  promoCodes: PromoCode[];
  vipRequests: VipRequest[];
  isPromoModalOpen: boolean;
  setIsPromoModalOpen: (open: boolean) => void;
  redeemPromoCode: (code: string, userName?: string) => Promise<{ success: boolean; message: string; days?: number }>;
  generatePromoCode: (days: number, customCode?: string) => Promise<boolean>;
  deletePromoCode: (id: string) => Promise<void>;
  fetchPromoCodes: () => Promise<void>;
  fetchVipRequests: () => Promise<void>;
  submitVipRequest: (userName: string, whatsappNumber: string, dataCardNumber: string, packageDays: number) => Promise<{ success: boolean; message: string }>;
  approveVipRequest: (id: string) => Promise<{ success: boolean; promoCode?: string; message: string }>;
  deleteVipRequest: (id: string) => Promise<void>;
  grantPremiumDirect: (days: number) => void;
  incrementMovieViews: (id: string) => void;
  incrementMovieDownloads: (id: string) => void;
  fetchComments: (movieId?: string) => Promise<void>;
  addComment: (movieId: string, userName: string, comment: string, rating: number) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<void>;
  deleteRequest: (id: string) => void;
  resolveRequest: (id: string) => void;
  deleteMovie: (id: string) => Promise<void>;
  addMovie: (movie: Movie) => Promise<void>;
  updateMovie: (movie: Movie) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization
  const [movies, setMovies] = useState<Movie[]>(() => {
    const removedIds = ['the-croods-a-new-age-2020', 'avatar-tla-s1'];
    try {
      const saved = localStorage.getItem('cineworld_movies');
      if (saved) {
        const parsed: Movie[] = JSON.parse(saved);
        const mergedMap = new Map<string, Movie>();
        parsed.forEach((m) => {
          if (!removedIds.includes(m.id)) mergedMap.set(m.id, m);
        });
        initialMovies.forEach((initM) => {
          if (!removedIds.includes(initM.id)) mergedMap.set(initM.id, initM);
        });
        return Array.from(mergedMap.values());
      }
      return initialMovies.filter((m) => !removedIds.includes(m.id));
    } catch {
      return initialMovies.filter((m) => !removedIds.includes(m.id));
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cineworld_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [requests, setRequests] = useState<MovieRequest[]>(() => {
    try {
      const saved = localStorage.getItem('cineworld_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notices, setNotices] = useState<Notice[]>([]);
  
  const [comments, setComments] = useState<MovieComment[]>(() => {
    try {
      const saved = localStorage.getItem('cineworld_comments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reports, setReports] = useState<LinkReport[]>(() => {
    try {
      const saved = localStorage.getItem('cineworld_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isReportsListOpen, setIsReportsListOpen] = useState<boolean>(false);
  const [isRequestOpen, setIsRequestOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportMovieTarget, setReportMovieTarget] = useState<Movie | null>(null);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [whatsappModalMovie, setWhatsappModalMovie] = useState<Movie | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [vipRequests, setVipRequests] = useState<VipRequest[]>([]);

  const [userPremium, setUserPremium] = useState<UserPremiumInfo>(() => {
    try {
      const saved = localStorage.getItem('cineworld_user_premium');
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        if (parsed.expiresAt && parsed.expiresAt > now) {
          const daysRemaining = Math.max(1, Math.ceil((parsed.expiresAt - now) / (1000 * 60 * 60 * 24)));
          return { ...parsed, isPremium: true, daysRemaining };
        }
      }
    } catch {}
    return { isPremium: false, expiresAt: null, daysRemaining: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_user_premium', JSON.stringify(userPremium));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [userPremium]);

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch('/api/promo-codes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPromoCodes(data);
      }
    } catch (err) {
      console.warn('Promo codes fetch error:', err);
    }
  };

  const redeemPromoCode = async (code: string, userName?: string): Promise<{ success: boolean; message: string; days?: number }> => {
    try {
      const res = await fetch('/api/promo-codes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userName })
      });
      const data = await res.json();

      if (data.success) {
        const days = data.days || 30;
        const now = Date.now();
        // If user is already premium, stack duration
        const currentExpiresAt = userPremium.isPremium && userPremium.expiresAt && userPremium.expiresAt > now 
          ? userPremium.expiresAt 
          : now;
        const newExpiresAt = currentExpiresAt + (days * 24 * 60 * 60 * 1000);
        const daysRemaining = Math.max(1, Math.ceil((newExpiresAt - now) / (1000 * 60 * 60 * 24)));

        const newPremiumState: UserPremiumInfo = {
          isPremium: true,
          expiresAt: newExpiresAt,
          daysRemaining,
          codeUsed: code.toUpperCase()
        };

        setUserPremium(newPremiumState);
        showToast(`🎉 VIP Membership Activated for ${days} Days!`, 'success');
        fetchPromoCodes();
        return { success: true, message: data.message, days };
      } else {
        return { success: false, message: data.error || 'Invalid or used Promo Code' };
      }
    } catch (err: any) {
      return { success: false, message: 'Server connection error. Please try again later.' };
    }
  };

  const generatePromoCode = async (days: number, customCode?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/promo-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, customCode })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Promo Code (${data.promoCode.code}) generated for ${days} Days!`, 'success');
        fetchPromoCodes();
        return true;
      } else {
        showToast(data.error || 'Failed to generate promo code', 'error');
        return false;
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
      return false;
    }
  };

  const deletePromoCode = async (id: string) => {
    setPromoCodes(prev => prev.filter(p => p.id !== id));
    showToast('Promo Code deleted', 'info');
    try {
      await fetch(`/api/promo-codes/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete promo code error:', err);
    }
  };

  const grantPremiumDirect = (days: number) => {
    const now = Date.now();
    const currentExpiresAt = userPremium.isPremium && userPremium.expiresAt && userPremium.expiresAt > now 
      ? userPremium.expiresAt 
      : now;
    const newExpiresAt = currentExpiresAt + (days * 24 * 60 * 60 * 1000);
    const daysRemaining = Math.max(1, Math.ceil((newExpiresAt - now) / (1000 * 60 * 60 * 24)));

    setUserPremium({
      isPremium: true,
      expiresAt: newExpiresAt,
      daysRemaining,
      codeUsed: 'ADMIN_DIRECT_GRANT'
    });
    showToast(`👑 Granted ${days} Days VIP Premium Access!`, 'success');
  };

  const fetchVipRequests = async () => {
    try {
      const res = await fetch('/api/vip-requests');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setVipRequests(data);
      }
    } catch (err) {
      console.warn('VIP requests fetch error:', err);
    }
  };

  const submitVipRequest = async (userName: string, whatsappNumber: string, dataCardNumber: string, packageDays: number) => {
    try {
      const res = await fetch('/api/vip-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, whatsappNumber, dataCardNumber, packageDays })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Data Card VIP request submitted!', 'success');
        fetchVipRequests();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Failed to submit VIP request' };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  };

  const approveVipRequest = async (id: string) => {
    try {
      const res = await fetch('/api/vip-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`VIP Request Approved! Promo Code: ${data.promoCode}`, 'success');
        fetchVipRequests();
        fetchPromoCodes();
        return { success: true, promoCode: data.promoCode, message: data.message };
      } else {
        showToast(data.error || 'Failed to approve VIP request', 'error');
        return { success: false, message: data.error };
      }
    } catch (err) {
      showToast('Error approving request', 'error');
      return { success: false, message: 'Server connection error' };
    }
  };

  const deleteVipRequest = async (id: string) => {
    setVipRequests(prev => prev.filter(r => r.id !== id));
    showToast('VIP Request removed', 'info');
    try {
      await fetch(`/api/vip-requests/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete VIP request error:', err);
    }
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Report removed', 'info');
  };

  const resolveReport = (id: string) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' as const } : r)));
    showToast('Report marked as Resolved', 'success');
  };

  const deleteRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('Movie request deleted', 'info');
  };

  const resolveRequest = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Fulfilled' as const } : r)));
    showToast('Movie request marked as Fulfilled!', 'success');
  };

  const deleteMovie = async (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    showToast('Movie deleted from collection', 'info');
    try {
      await fetch(`/api/movies/${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete movie server note:', e);
    }
  };

  const addMovie = async (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
    showToast(`Movie "${newMovie.title}" added successfully!`, 'success');
    try {
      await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
    } catch (e) {
      console.warn('Add movie server note:', e);
    }
  };

  const updateMovie = async (updatedMovie: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
    if (activeMovie?.id === updatedMovie.id) {
      setActiveMovie(updatedMovie);
    }
    showToast(`Movie "${updatedMovie.title}" updated successfully!`, 'success');
    try {
      await fetch(`/api/movies/${encodeURIComponent(updatedMovie.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });
    } catch (e) {
      console.warn('Update movie server note:', e);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cineworld_movies', JSON.stringify(movies));
    } catch (e) { console.error('LocalStorage error:', e); }
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_watchlist', JSON.stringify(watchlist));
    } catch (e) { console.error('LocalStorage error:', e); }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_requests', JSON.stringify(requests));
    } catch (e) { console.error('LocalStorage error:', e); }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_comments', JSON.stringify(comments));
    } catch (e) { console.error('LocalStorage error:', e); }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_reports', JSON.stringify(reports));
    } catch (e) { console.error('LocalStorage error:', e); }
  }, [reports]);

  // Server API Sync
  const refreshMovies = async () => {
    try {
      const res = await fetch('/api/movies');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMovies(data);
        }
      }
    } catch (err) {
      console.warn('Backend fetch error:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setNotices(data);
      }
    } catch (err) {
      console.warn('Notices fetch error:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setRequests((prev) => (data.length > 0 ? data : prev));
      }
    } catch (err) {
      console.warn('Requests fetch error:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setReports((prev) => (data.length > 0 ? data : prev));
      }
    } catch (err) {
      console.warn('Reports fetch error:', err);
    }
  };

  const submitReport = async (movieId: string, movieTitle: string, issueType: LinkReport['issueType'], description: string): Promise<boolean> => {
    const newReport: LinkReport = {
      id: 'rep-' + Date.now(),
      movieId,
      movieTitle,
      issueType,
      description,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setReports((prev) => [newReport, ...prev]);
    showToast('Broken link report submitted! Thank you.', 'success');

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, movieTitle, issueType, description })
      });
    } catch (err) {
      console.warn('Server sync report warning:', err);
    }
    return true;
  };

  const fetchComments = async (movieId?: string) => {
    try {
      const url = movieId ? `/api/comments?movieId=${encodeURIComponent(movieId)}` : '/api/comments';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setComments(data);
      }
    } catch (err) {
      console.warn('Comments fetch error:', err);
    }
  };

  const addComment = async (movieId: string, userName: string, comment: string, rating: number): Promise<boolean> => {
    const newComment: MovieComment = {
      id: 'comm-' + Date.now(),
      movieId,
      userName: userName.trim() || 'Anonymous Fan',
      comment: comment.trim(),
      rating: rating || 5,
      likes: 0,
      avatarBg: 'bg-amber-500',
      createdAt: new Date().toISOString()
    };

    setComments((prev) => [newComment, ...prev]);
    showToast('Comment posted successfully!', 'success');

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, userName, comment, rating })
      });
    } catch (err) {
      console.warn('Server comment save warning:', err);
    }
    return true;
  };

  const likeComment = async (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
    try {
      await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
    } catch (err) {
      console.warn('Like comment error:', err);
    }
  };

  useEffect(() => {
    refreshMovies();
    fetchNotices();
    fetchRequests();
    fetchComments();
    fetchReports();
    fetchPromoCodes();
    fetchVipRequests();
  }, []);

  // Movie Deep Link handling: automatically open movie if ?movie=<id> or ?m=<id> is present in URL
  useEffect(() => {
    if (movies.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const movieId = params.get('movie') || params.get('m');
      if (movieId) {
        const found = movies.find(
          (m) => m.id === movieId || encodeURIComponent(m.id) === movieId || m.id.toLowerCase() === movieId.toLowerCase()
        );
        if (found && (!activeMovie || activeMovie.id !== found.id)) {
          setActiveMovie(found);
        }
      }
    }
  }, [movies]);

  // Sync activeMovie state to URL query string & increment views
  useEffect(() => {
    if (activeMovie) {
      incrementMovieViews(activeMovie.id);
      const newUrl = `${window.location.pathname}?movie=${encodeURIComponent(activeMovie.id)}`;
      window.history.replaceState({ movieId: activeMovie.id }, '', newUrl);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (params.has('movie') || params.has('m')) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [activeMovie?.id]);

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast('Removed from Watchlist', 'info');
        return prev.filter((id) => id !== movieId);
      } else {
        showToast('Added to Watchlist!', 'success');
        return [...prev, movieId];
      }
    });
  };

  const incrementMovieViews = async (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, viewsCount: (m.viewsCount || 0) + 1 } : m))
    );
    try {
      await fetch(`/api/movies/${encodeURIComponent(id)}/view`, { method: 'POST' });
    } catch (e) {
      console.warn('View increment sync note:', e);
    }
  };

  const incrementMovieDownloads = async (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m))
    );
    try {
      await fetch(`/api/movies/${encodeURIComponent(id)}/download`, { method: 'POST' });
    } catch (e) {
      console.warn('Download increment sync note:', e);
    }
  };

  const addMovieRequest = async (req: Omit<MovieRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: MovieRequest = {
      ...req,
      id: 'req-' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast('Movie request received! We will add it soon.', 'success');

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
    } catch (err) {
      console.warn('Request server sync error:', err);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        selectedCategory,
        setSelectedCategory,
        searchTerm,
        setSearchTerm,
        activeMovie,
        setActiveMovie,
        watchlist,
        toggleWatchlist,
        requests,
        addMovieRequest,
        notices,
        comments,
        reports,
        submitReport,
        deleteReport,
        resolveReport,
        isReportsListOpen,
        setIsReportsListOpen,
        toast,
        showToast,
        isRequestOpen,
        setIsRequestOpen,
        isReportOpen,
        setIsReportOpen,
        reportMovieTarget,
        setReportMovieTarget,
        activeTrailerUrl,
        setActiveTrailerUrl,
        whatsappModalMovie,
        setWhatsappModalMovie,
        userPremium,
        promoCodes,
        vipRequests,
        isPromoModalOpen,
        setIsPromoModalOpen,
        redeemPromoCode,
        generatePromoCode,
        deletePromoCode,
        fetchPromoCodes,
        fetchVipRequests,
        submitVipRequest,
        approveVipRequest,
        deleteVipRequest,
        grantPremiumDirect,
        incrementMovieViews,
        incrementMovieDownloads,
        fetchComments,
        addComment,
        likeComment,
        deleteRequest,
        resolveRequest,
        deleteMovie,
        addMovie,
        updateMovie
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};
