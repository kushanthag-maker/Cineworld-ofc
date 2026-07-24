import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, MovieRequest, Notice } from '../types';
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
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isRequestOpen: boolean;
  setIsRequestOpen: (open: boolean) => void;
  activeTrailerUrl: string | null;
  setActiveTrailerUrl: (url: string | null) => void;
  whatsappModalMovie: Movie | null;
  setWhatsappModalMovie: (movie: Movie | null) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  incrementMovieViews: (id: string) => void;
  incrementMovieDownloads: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  deleteNotice: (id: string) => void;
  resetToDefaultData: () => void;
  exportJsonCatalog: () => string;
  importJsonCatalog: (jsonString: string) => boolean;
  refreshMovies: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
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

  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isRequestOpen, setIsRequestOpen] = useState<boolean>(false);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [whatsappModalMovie, setWhatsappModalMovie] = useState<Movie | null>(null);

  // Fetch movies from Express API backend
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
        if (Array.isArray(data)) setRequests(data);
      }
    } catch (err) {
      console.warn('Requests fetch error:', err);
    }
  };

  useEffect(() => {
    refreshMovies();
    fetchNotices();
    fetchRequests();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cineworld_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [watchlist]);

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const addMovie = async (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
    try {
      await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
      });
      refreshMovies();
    } catch (err) {
      console.error('Error adding movie:', err);
    }
  };

  const updateMovie = async (id: string, updatedMovie: Partial<Movie>) => {
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedMovie } : m)));
    try {
      await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie)
      });
      refreshMovies();
    } catch (err) {
      console.error('Error updating movie:', err);
    }
  };

  const deleteMovie = async (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      refreshMovies();
    } catch (err) {
      console.error('Error deleting movie:', err);
    }
  };

  const incrementMovieViews = (id: string) => {
    const target = movies.find((m) => m.id === id);
    if (target) {
      updateMovie(id, { viewsCount: (target.viewsCount || 0) + 1 });
    }
  };

  const incrementMovieDownloads = (id: string) => {
    const target = movies.find((m) => m.id === id);
    if (target) {
      updateMovie(id, { downloadsCount: (target.downloadsCount || 0) + 1 });
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
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReq)
      });
    } catch (err) {
      console.error('Error adding request:', err);
    }
  };

  const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...notice,
      id: 'n-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setNotices((prev) => [newNotice, ...prev]);
    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice)
      });
    } catch (err) {
      console.error('Error adding notice:', err);
    }
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const resetToDefaultData = () => {
    setMovies(initialMovies);
  };

  const exportJsonCatalog = () => {
    return JSON.stringify(movies, null, 2);
  };

  const importJsonCatalog = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setMovies(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
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
        isAdminOpen,
        setIsAdminOpen,
        isRequestOpen,
        setIsRequestOpen,
        activeTrailerUrl,
        setActiveTrailerUrl,
        whatsappModalMovie,
        setWhatsappModalMovie,
        addMovie,
        updateMovie,
        deleteMovie,
        incrementMovieViews,
        incrementMovieDownloads,
        addNotice,
        deleteNotice,
        resetToDefaultData,
        exportJsonCatalog,
        importJsonCatalog,
        refreshMovies
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovie must be used within a MovieProvider');
  return context;
};
