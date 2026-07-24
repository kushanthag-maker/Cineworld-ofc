import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, Review, MovieRequest, Quality, SiteNotice } from '../types';
import { INITIAL_MOVIES, INITIAL_REVIEWS } from '../data/initialMovies';

interface MovieContextType {
  movies: Movie[];
  watchlist: string[];
  reviews: Record<string, Review[]>;
  movieRequests: MovieRequest[];
  notices: SiteNotice[];
  hasFollowedWhatsapp: boolean;
  isAdminLoggedIn: boolean;
  searchQuery: string;
  selectedGenre: string;
  selectedType: string;
  selectedQuality: string;
  activeMovie: Movie | null;
  activeTrailerUrl: string | null;
  isRequestModalOpen: boolean;
  isAdminModalOpen: boolean;

  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedGenre: (g: string) => void;
  setSelectedType: (t: string) => void;
  setSelectedQuality: (q: string) => void;
  setActiveMovie: (m: Movie | null) => void;
  setActiveTrailerUrl: (url: string | null) => void;
  setIsRequestModalOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setHasFollowedWhatsapp: (followed: boolean) => void;

  toggleWatchlist: (movieId: string) => void;
  addMovie: (movie: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'createdAt'>) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  incrementMovieViews: (id: string) => void;
  incrementMovieDownloads: (id: string) => void;

  addReview: (movieId: string, userName: string, rating: number, comment: string) => void;
  submitMovieRequest: (movieName: string, language: string, notes?: string, email?: string) => void;
  updateRequestStatus: (id: string, status: 'Pending' | 'Added' | 'Rejected') => void;

  addNotice: (title: string, message: string, type?: 'info' | 'update' | 'alert') => void;
  deleteNotice: (id: string) => void;

  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  resetToDefaultData: () => void;
  importJsonCatalog: (jsonString: string) => boolean;
  exportJsonCatalog: () => string;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const MOVIES_STORAGE_KEY = 'cineworld_movies_v1';
const WATCHLIST_STORAGE_KEY = 'cineworld_watchlist_v1';
const REVIEWS_STORAGE_KEY = 'cineworld_reviews_v1';
const REQUESTS_STORAGE_KEY = 'cineworld_requests_v1';
const NOTICES_STORAGE_KEY = 'cineworld_notices_v1';
const ADMIN_SESSION_KEY = 'cineworld_admin_auth_v1';
const WHATSAPP_FOLLOWED_KEY = 'cineworld_whatsapp_followed_v1';

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Movies
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(MOVIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load movies from storage:', e);
    }
    return INITIAL_MOVIES;
  });

  // Notices
  const [notices, setNotices] = useState<SiteNotice[]>(() => {
    try {
      const saved = localStorage.getItem(NOTICES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // WhatsApp Follow State
  const [hasFollowedWhatsapp, setHasFollowedWhatsappState] = useState<boolean>(() => {
    return localStorage.getItem(WHATSAPP_FOLLOWED_KEY) === 'true';
  });

  const setHasFollowedWhatsapp = (followed: boolean) => {
    setHasFollowedWhatsappState(followed);
    if (followed) {
      localStorage.setItem(WHATSAPP_FOLLOWED_KEY, 'true');
    } else {
      localStorage.removeItem(WHATSAPP_FOLLOWED_KEY);
    }
  };

  // Watchlist
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Reviews
  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  // Requests
  const [movieRequests, setMovieRequests] = useState<MovieRequest[]>(() => {
    try {
      const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');

  // Modals & Selected View
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Load initial data from MongoDB API on mount
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const [moviesRes, requestsRes, reviewsRes, noticesRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/requests'),
          fetch('/api/reviews'),
          fetch('/api/notices')
        ]);

        if (moviesRes.ok) {
          const moviesData = await moviesRes.json();
          if (Array.isArray(moviesData)) {
            setMovies(moviesData);
          }
        }

        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          if (Array.isArray(requestsData)) {
            setMovieRequests(requestsData);
          }
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          if (reviewsData && typeof reviewsData === 'object') {
            setReviews(reviewsData);
          }
        }

        if (noticesRes.ok) {
          const noticesData = await noticesRes.json();
          if (Array.isArray(noticesData)) {
            setNotices(noticesData);
          }
        }
      } catch (err) {
        console.warn('API fetch warning, fallback to local storage:', err);
      }
    };

    fetchApiData();
  }, []);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies));
    } catch (e) {
      console.error('Failed to save movies:', e);
    }
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
    } catch (e) {
      console.error('Failed to save notices:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews:', e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(movieRequests));
    } catch (e) {
      console.error('Failed to save requests:', e);
    }
  }, [movieRequests]);

  // Actions
  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const addMovie = async (movieData: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'createdAt'>) => {
    const newId = 'm-' + Date.now();
    const newMovie: Movie = {
      ...movieData,
      id: newId,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    };
    setMovies((prev) => [newMovie, ...prev]);

    try {
      await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
    } catch (err) {
      console.error('Failed to save movie to API:', err);
    }
  };

  const updateMovie = async (id: string, updatedMovie: Partial<Movie>) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m))
    );
    if (activeMovie && activeMovie.id === id) {
      setActiveMovie((prev) => (prev ? { ...prev, ...updatedMovie } : null));
    }

    try {
      await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });
    } catch (err) {
      console.error('Failed to update movie on API:', err);
    }
  };

  const deleteMovie = async (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    setWatchlist((prev) => prev.filter((wId) => wId !== id));
    if (activeMovie && activeMovie.id === id) {
      setActiveMovie(null);
    }

    try {
      await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete movie on API:', err);
    }
  };

  const incrementMovieViews = async (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, viewsCount: m.viewsCount + 1 } : m))
    );

    try {
      await fetch(`/api/movies/${id}/view`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to increment views on API:', err);
    }
  };

  const incrementMovieDownloads = async (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m))
    );

    try {
      await fetch(`/api/movies/${id}/download`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to increment downloads on API:', err);
    }
  };

  const addReview = async (movieId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      movieId,
      userName: userName || 'Anonymous Fan',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => ({
      ...prev,
      [movieId]: [newReview, ...(prev[movieId] || [])]
    }));

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
    } catch (err) {
      console.error('Failed to add review on API:', err);
    }
  };

  const submitMovieRequest = async (movieName: string, language: string, notes?: string, email?: string) => {
    const newReq: MovieRequest = {
      id: 'req-' + Date.now(),
      movieName,
      language,
      userEmail: email,
      notes,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setMovieRequests((prev) => [newReq, ...prev]);

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
    } catch (err) {
      console.error('Failed to submit request on API:', err);
    }
  };

  const updateRequestStatus = async (id: string, status: 'Pending' | 'Added' | 'Rejected') => {
    setMovieRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to update request status on API:', err);
    }
  };

  const addNotice = async (title: string, message: string, type: 'info' | 'update' | 'alert' = 'info') => {
    const newNotice: SiteNotice = {
      id: 'notice-' + Date.now(),
      title: title || 'Site Announcement',
      message,
      type,
      createdAt: new Date().toISOString(),
      active: true
    };
    setNotices((prev) => [newNotice, ...prev]);

    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice)
      });
    } catch (err) {
      console.error('Failed to add notice on API:', err);
    }
  };

  const deleteNotice = async (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));

    try {
      await fetch(`/api/notices/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete notice on API:', err);
    }
  };

  // Admin login check with password "7060"
  const adminLogin = (password: string) => {
    if (password.trim() === '7060') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const resetToDefaultData = () => {
    setMovies(INITIAL_MOVIES);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem(MOVIES_STORAGE_KEY);
    localStorage.removeItem(REVIEWS_STORAGE_KEY);
  };

  const importJsonCatalog = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setMovies(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON catalog import', e);
    }
    return false;
  };

  const exportJsonCatalog = () => {
    return JSON.stringify(movies, null, 2);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        watchlist,
        reviews,
        movieRequests,
        notices,
        hasFollowedWhatsapp,
        isAdminLoggedIn,
        searchQuery,
        selectedGenre,
        selectedType,
        selectedQuality,
        activeMovie,
        activeTrailerUrl,
        isRequestModalOpen,
        isAdminModalOpen,

        setSearchQuery,
        setSelectedGenre,
        setSelectedType,
        setSelectedQuality,
        setActiveMovie,
        setActiveTrailerUrl,
        setIsRequestModalOpen,
        setIsAdminModalOpen,
        setHasFollowedWhatsapp,

        toggleWatchlist,
        addMovie,
 updateMovie,
        deleteMovie,
        incrementMovieViews,
        incrementMovieDownloads,

        addReview,
        submitMovieRequest,
        updateRequestStatus,

        addNotice,
        deleteNotice,

        adminLogin,
        adminLogout,
        resetToDefaultData,
        importJsonCatalog,
        exportJsonCatalog
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
