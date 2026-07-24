import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, MovieRequest, Notice, MovieComment, LinkReport, ToastMessage } from '../types';
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
  incrementMovieViews: (id: string) => void;
  incrementMovieDownloads: (id: string) => void;
  fetchComments: (movieId?: string) => Promise<void>;
  addComment: (movieId: string, userName: string, comment: string, rating: number) => Promise<boolean>;
  likeComment: (commentId: string) => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage state initialization
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('cineworld_movies');
      return saved ? JSON.parse(saved) : initialMovies;
    } catch {
      return initialMovies;
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
  const [isRequestOpen, setIsRequestOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportMovieTarget, setReportMovieTarget] = useState<Movie | null>(null);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [whatsappModalMovie, setWhatsappModalMovie] = useState<Movie | null>(null);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
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
  }, []);

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

  const incrementMovieViews = (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, viewsCount: (m.viewsCount || 0) + 1 } : m))
    );
  };

  const incrementMovieDownloads = (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m))
    );
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
        incrementMovieViews,
        incrementMovieDownloads,
        fetchComments,
        addComment,
        likeComment
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
