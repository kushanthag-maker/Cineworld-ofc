import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { 
  ShieldCheck, 
  Lock, 
  Film, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Search, 
  X, 
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Crown,
  Copy,
  Check,
  Key,
  Edit3,
  Edit
} from 'lucide-react';
import { Movie, DownloadOption } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const { 
    requests, 
    resolveRequest, 
    deleteRequest, 
    reports, 
    resolveReport, 
    deleteReport, 
    movies, 
    deleteMovie, 
    addMovie,
    updateMovie,
    promoCodes,
    generatePromoCode,
    deletePromoCode,
    fetchPromoCodes,
    vipRequests,
    fetchVipRequests,
    approveVipRequest,
    deleteVipRequest,
    grantPremiumDirect,
    showToast 
  } = useMovie();

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cineworld_admin_authed') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'requests' | 'reports' | 'movies' | 'add_movie' | 'promo_codes' | 'vip_requests'>('requests');
  const [movieSearch, setMovieSearch] = useState('');

  // Promo Code generator state
  const [genDays, setGenDays] = useState<number>(30);
  const [genCustomCode, setGenCustomCode] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Form state for adding new movie
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sinhala Dubbed');
  const [newYear, setNewYear] = useState(2025);
  const [newPoster, setNewPoster] = useState('');
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Form state for editing existing movie
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editOriginalTitle, setEditOriginalTitle] = useState('');
  const [editCategory, setEditCategory] = useState<any>('Sinhala Dubbed');
  const [editYear, setEditYear] = useState(2025);
  const [editDuration, setEditDuration] = useState('1h 30m');
  const [editRating, setEditRating] = useState(8.5);
  const [editQuality, setEditQuality] = useState('1080p Full HD');
  const [editLanguage, setEditLanguage] = useState('Sinhala Subbed (සිංහල)');
  const [editDirector, setEditDirector] = useState('');
  const [editGenres, setEditGenres] = useState('');
  const [editCast, setEditCast] = useState('');
  const [editPoster, setEditPoster] = useState('');
  const [editBackdrop, setEditBackdrop] = useState('');
  const [editStreamUrl, setEditStreamUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDownloads, setEditDownloads] = useState<DownloadOption[]>([]);

  const handleOpenEditModal = (m: Movie) => {
    setEditingMovie(m);
    setEditTitle(m.title || '');
    setEditOriginalTitle(m.originalTitle || m.title || '');
    setEditCategory(m.category || 'Sinhala Dubbed');
    setEditYear(m.releaseYear || 2025);
    setEditDuration(m.duration || '1h 30m');
    setEditRating(m.rating || 8.5);
    setEditQuality(m.quality || '1080p Full HD');
    setEditLanguage(m.language || 'Sinhala Subbed (සිංහල)');
    setEditDirector(m.director || '');
    setEditGenres((m.genres || []).join(', '));
    setEditCast((m.cast || []).join(', '));
    setEditPoster(m.posterUrl || '');
    setEditBackdrop(m.backdropUrl || '');
    setEditStreamUrl(m.streamUrl || '');
    setEditDescription(m.description || '');
    setEditDownloads(m.downloadOptions ? JSON.parse(JSON.stringify(m.downloadOptions)) : []);
  };

  const handleSaveMovieEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;
    if (!editTitle.trim() || !editStreamUrl.trim()) {
      showToast('Title and Direct Stream URL are required!', 'error');
      return;
    }

    const updated: Movie = {
      ...editingMovie,
      title: editTitle.trim(),
      originalTitle: editOriginalTitle.trim(),
      category: editCategory,
      releaseYear: Number(editYear) || 2025,
      duration: editDuration.trim() || '1h 30m',
      rating: Number(editRating) || 8.5,
      quality: editQuality.trim() || '1080p Full HD',
      language: editLanguage.trim() || 'Sinhala Subbed (සිංහල)',
      director: editDirector.trim() || 'CINEWORLD Admin',
      genres: editGenres.split(',').map((g) => g.trim()).filter(Boolean),
      cast: editCast.split(',').map((c) => c.trim()).filter(Boolean),
      posterUrl: editPoster.trim(),
      backdropUrl: editBackdrop.trim() || editPoster.trim(),
      streamUrl: editStreamUrl.trim(),
      description: editDescription.trim(),
      downloadOptions: editDownloads.filter((d) => d.downloadUrl && d.downloadUrl.trim().length > 0)
    };

    await updateMovie(updated);
    setEditingMovie(null);
  };

  const handleAddDownloadOption = () => {
    setEditDownloads((prev) => [
      ...prev,
      {
        id: 'dl-' + Date.now(),
        quality: '1080p Full HD Direct',
        resolution: '1920x1080',
        size: '1.4 GB',
        format: 'MP4 Direct',
        downloadUrl: editStreamUrl || '',
        server1Name: 'Fast CDN Server 1',
        server2Name: 'High Speed Mirror 2'
      }
    ]);
  };

  const handleUpdateDownloadOption = (index: number, field: keyof DownloadOption, value: string) => {
    setEditDownloads((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveDownloadOption = (index: number) => {
    setEditDownloads((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '7060') {
      setIsAuthenticated(true);
      sessionStorage.setItem('cineworld_admin_authed', 'true');
      showToast('Admin access granted! Welcome back.', 'success');
    } else {
      showToast('Incorrect password! Try again.', 'error');
    }
  };

  const handleCreateMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStreamUrl.trim()) {
      showToast('Title and Direct Video URL are required!', 'error');
      return;
    }

    const createdMovie: Movie = {
      id: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
      title: newTitle.trim(),
      originalTitle: newTitle.trim(),
      releaseYear: Number(newYear) || 2025,
      duration: 'Full Movie / Cartoon',
      rating: 8.5,
      genres: ['Animation', newCategory, 'Action'],
      director: 'CINEWORLD LK Admin',
      cast: ['Sinhala Dubbed Stars'],
      description: newDescription.trim() || `Watch ${newTitle.trim()} online in HD quality on CINEWORLD LK.`,
      posterUrl: newPoster.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&q=80',
      backdropUrl: newPoster.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
      streamUrl: newStreamUrl.trim(),
      category: newCategory as any,
      language: 'Sinhala Dubbed (සිංහල)',
      hasSinhalaSub: true,
      quality: 'HD',
      viewsCount: 1,
      downloadsCount: 0
    };

    await addMovie(createdMovie);
    setNewTitle('');
    setNewPoster('');
    setNewStreamUrl('');
    setNewDescription('');
    setActiveTab('movies');
  };

  // Password Lock Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-500">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider font-brand">
              CINEWORLD Admin
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Protected Administrator Control Gate
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1.5">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password (e.g. 7060)"
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3.5 rounded-xl text-center font-mono text-lg tracking-widest outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
            >
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredMovies = movies.filter(m => 
    m.title.toLowerCase().includes(movieSearch.toLowerCase()) || 
    m.category.toLowerCase().includes(movieSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Top Header */}
      <header className="bg-zinc-950 border-b border-amber-500/20 px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Site</span>
          </button>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h1 className="text-lg font-black tracking-wide font-brand">
              CINEWORLD <span className="text-amber-500">ADMIN CONTROL</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem('cineworld_admin_authed');
            setIsAuthenticated(false);
          }}
          className="text-xs text-red-400 hover:text-red-300 font-mono uppercase bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          Lock / Logout
        </button>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>User Requests ({requests.length})</span>
            {requests.filter(r => r.status === 'Pending').length > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black">
                {requests.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Broken Link Reports ({reports.length})</span>
            {reports.filter(r => r.status === 'Pending').length > 0 && (
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black">
                {reports.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'movies'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Manage Collection ({movies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_movie')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all ${
              activeTab === 'add_movie'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-500/30'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Movie</span>
          </button>

        </div>

        {/* TAB 1: USER MOVIE REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  User Requested Movies & Cartoons
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Requests submitted by site visitors via website & WhatsApp
                </p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="p-12 text-center bg-zinc-950 rounded-2xl border border-white/5 space-y-2">
                <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-zinc-400">No movie requests received yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    className="bg-zinc-950 border border-white/10 hover:border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">{req.movieTitle}</span>
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                          {req.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          req.status === 'Fulfilled' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/40'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono">
                        <span>Requested By: <strong className="text-zinc-200">{req.requestedBy || 'User'}</strong></span>
                        {req.whatsappNumber && (
                          <span>WhatsApp: <strong className="text-emerald-400">{req.whatsappNumber}</strong></span>
                        )}
                        <span>Date: {new Date(req.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      {req.whatsappNumber && (
                        <a
                          href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {req.status !== 'Fulfilled' && (
                        <button
                          onClick={() => resolveRequest(req.id)}
                          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Added</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteRequest(req.id)}
                        className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg border border-white/10 transition-colors cursor-pointer"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BROKEN LINK REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Broken Link & Video Issue Reports
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Submitted by users when video player or download link fails
                </p>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center bg-zinc-950 rounded-2xl border border-white/5 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-zinc-400">No broken link reports right now! All streams clean.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map((rep) => (
                  <div 
                    key={rep.id} 
                    className="bg-zinc-950 border border-white/10 hover:border-red-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">{rep.movieTitle}</span>
                        <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                          {rep.issueType}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          rep.status === 'Resolved' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      {rep.description && (
                        <p className="text-xs text-zinc-300 italic bg-black/50 p-2.5 rounded-lg border border-white/5">
                          "{rep.description}"
                        </p>
                      )}

                      <div className="text-[11px] text-zinc-500 font-mono">
                        Reported on: {new Date(rep.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rep.status !== 'Resolved' && (
                        <button
                          onClick={() => resolveReport(rep.id)}
                          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Fixed</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteReport(rep.id)}
                        className="p-2 bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg border border-white/10 transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE COLLECTION */}
        {activeTab === 'movies' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Movie & Cartoon Collection ({movies.length})
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  View and manage movies published on CINEWORLD
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white pl-9 pr-3 py-2 rounded-xl text-xs outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => (
                <div key={movie.id} className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group">
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      {movie.category}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-xs text-white line-clamp-1">{movie.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        Year: {movie.releaseYear} • Views: {(movie.viewsCount || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                      <a
                        href={movie.streamUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-mono"
                        title="Open Direct Stream URL"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(movie)}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-mono uppercase bg-amber-950/40 hover:bg-amber-900/60 px-2.5 py-1 rounded border border-amber-500/30 cursor-pointer flex items-center gap-1 font-bold transition-colors"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => deleteMovie(movie.id)}
                          className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase bg-red-950/30 hover:bg-red-900/50 px-2 py-1 rounded border border-red-500/20 cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADD NEW MOVIE */}
        {activeTab === 'add_movie' && (
          <div className="max-w-2xl mx-auto bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wide">
                  Publish New Movie / Cartoon
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Add direct stream MP4 links to your CINEWORLD collection
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateMovieSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-300 mb-1 uppercase font-bold">
                  Movie / Cartoon Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Tom and Jerry: Cowboy Up! (2025) Sinhala Dubbed"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1 uppercase font-bold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                  >
                    <option value="Sinhala Dubbed">Sinhala Dubbed Cartoon</option>
                    <option value="Sinhala Subbed">Sinhala Subtitled Movie</option>
                    <option value="Sinhala Movie">Sinhala Movie</option>
                    <option value="Hollywood">Hollywood</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Tamil / South">Tamil / South</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 uppercase font-bold">Release Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 uppercase font-bold">Poster Image URL</label>
                <input
                  type="url"
                  value={newPoster}
                  onChange={(e) => setNewPoster(e.target.value)}
                  placeholder="https://... (Poster URL)"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 uppercase font-bold">
                  Direct Stream / MP4 Video URL <span className="text-amber-500">*</span>
                </label>
                <input
                  type="url"
                  value={newStreamUrl}
                  onChange={(e) => setNewStreamUrl(e.target.value)}
                  required
                  placeholder="https://... (Direct .mp4 or stream video link)"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 uppercase font-bold">Description / Plot</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Short movie description..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Publish Movie to Site</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: PROMO CODES & VIP MANAGEMENT */}
        {activeTab === 'promo_codes' && (
          <div className="space-y-8">
            
            {/* Promo Code Generator Box */}
            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center text-amber-400">
                  <Crown className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-wider font-brand">
                    Generate VIP Promo Codes
                  </h2>
                  <p className="text-xs text-amber-400 font-mono">
                    Generate single-use promo codes to grant time-limited VIP access to users
                  </p>
                </div>
              </div>

              {/* Presets & Custom Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800">
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-amber-400 font-mono">
                    Select VIP Duration (දින ගණන)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 7, 30, 60, 90, 365].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setGenDays(d)}
                        className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer border ${
                          genDays === d
                            ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md shadow-amber-500/20'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-500/50'
                        }`}
                      >
                        {d === 365 ? '1 Year (365d)' : `${d} ${d === 1 ? 'Day' : 'Days'}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-amber-400 font-mono">
                    Custom Promo Code Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={genCustomCode}
                    onChange={(e) => setGenCustomCode(e.target.value.toUpperCase())}
                    placeholder="Leave empty for auto code (e.g. CINE-30D-XXXX)"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-xs font-mono uppercase tracking-wider focus:border-amber-500 outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 font-mono">
                    💡 1 Promo Code = 1 User for 1 Device. Code becomes invalid immediately after redemption.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={async () => {
                    const success = await generatePromoCode(genDays, genCustomCode);
                    if (success) {
                      setGenCustomCode('');
                    }
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Key className="w-4 h-4 stroke-[2.5]" />
                  <span>Generate Single-Use Promo Code ({genDays} Days)</span>
                </button>

                <button
                  onClick={() => grantPremiumDirect(30)}
                  className="px-5 py-3.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-emerald-400" />
                  <span>Grant VIP to Current Device Directly</span>
                </button>
              </div>
            </div>

            {/* Generated Codes Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-brand flex items-center gap-2">
                  <span>Generated Promo Codes Log</span>
                  <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                    {promoCodes.length}
                  </span>
                </h3>

                <button
                  onClick={() => fetchPromoCodes()}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-mono font-bold rounded-lg border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh List</span>
                </button>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-900 text-amber-400 uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Promo Code</th>
                        <th className="p-4">VIP Duration</th>
                        <th className="p-4">Usage Limit</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Redeemed By</th>
                        <th className="p-4">Created Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {promoCodes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-zinc-500 italic">
                            No promo codes generated yet. Use the generator above to create codes.
                          </td>
                        </tr>
                      ) : (
                        promoCodes.map((p) => {
                          const isCopied = copiedCodeId === p.id;
                          return (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 font-bold text-amber-300 text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{p.code}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(p.code);
                                      setCopiedCodeId(p.id);
                                      showToast(`Promo Code ${p.code} copied!`, 'success');
                                      setTimeout(() => setCopiedCodeId(null), 2000);
                                    }}
                                    className="p-1 bg-zinc-900 hover:bg-amber-500/20 text-amber-400 rounded transition-colors cursor-pointer"
                                    title="Copy Code"
                                  >
                                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 font-bold text-white">
                                {p.days} Days
                              </td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] rounded uppercase">
                                  1 User Max
                                </span>
                              </td>
                              <td className="p-4">
                                {p.isUsed ? (
                                  <span className="px-2.5 py-1 bg-red-950/60 border border-red-500/40 text-red-400 font-bold rounded-md text-[10px] uppercase">
                                    Used / Redeemed
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold rounded-md text-[10px] uppercase animate-pulse">
                                    Active / Available
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-xs text-zinc-400">
                                {p.usedBy ? (
                                  <div>
                                    <span className="text-amber-300 font-bold">{p.usedBy}</span>
                                    {p.usedAt && (
                                      <span className="block text-[10px] text-zinc-500">
                                        {new Date(p.usedAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-zinc-600">-</span>
                                )}
                              </td>
                              <td className="p-4 text-[11px] text-zinc-400">
                                {new Date(p.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => deletePromoCode(p.id)}
                                  className="p-2 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                                  title="Delete Promo Code"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: DATA CARD VIP REQUESTS MANAGEMENT */}
        {activeTab === 'vip_requests' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-wider font-brand flex items-center gap-2.5">
                  <Crown className="w-6 h-6 text-amber-400 stroke-[2.5]" />
                  <span>Data Card VIP Requests ({vipRequests.length})</span>
                </h2>
                <p className="text-xs text-amber-400/90 font-mono mt-1">
                  Users who submitted Data Card PINs for VIP package activation
                </p>
              </div>

              <button
                onClick={() => fetchVipRequests()}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-mono font-bold rounded-xl border border-amber-500/30 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh VIP Requests</span>
              </button>
            </div>

            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-amber-400 uppercase tracking-wider border-b border-amber-500/30">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">WhatsApp No</th>
                      <th className="p-4">Data Card PIN / Serial</th>
                      <th className="p-4">Package</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Promo Code</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-zinc-300">
                    {vipRequests.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500 italic">
                          No Data Card VIP requests submitted yet.
                        </td>
                      </tr>
                    ) : (
                      vipRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-amber-500/5 transition-colors">
                          <td className="p-4 font-bold text-white text-sm">
                            {req.userName}
                          </td>
                          <td className="p-4 text-amber-300">
                            {req.whatsappNumber ? (
                              <a
                                href={`https://wa.me/${req.whatsappNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 hover:underline text-emerald-400 font-bold"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{req.whatsappNumber}</span>
                              </a>
                            ) : (
                              <span className="text-zinc-500">-</span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-amber-400 font-mono tracking-wider text-sm bg-zinc-900/60 rounded">
                            {req.dataCardNumber}
                          </td>
                          <td className="p-4 font-black text-white">
                            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[11px]">
                              {req.packageDays} Days VIP
                            </span>
                          </td>
                          <td className="p-4">
                            {req.status === 'Approved' ? (
                              <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-bold rounded-md text-[10px] uppercase">
                                Approved ✓
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-400 font-bold rounded-md text-[10px] uppercase animate-pulse">
                                Pending Approval
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold text-emerald-400 font-mono">
                            {req.promoCodeGenerated ? (
                              <div className="flex items-center gap-1.5">
                                <span>{req.promoCodeGenerated}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(req.promoCodeGenerated || '');
                                    showToast(`Copied code: ${req.promoCodeGenerated}`, 'success');
                                  }}
                                  className="p-1 text-zinc-400 hover:text-white"
                                  title="Copy Promo Code"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-zinc-600">-</span>
                            )}
                          </td>
                          <td className="p-4 text-[11px] text-zinc-400">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {req.status === 'Pending' && (
                                <button
                                  onClick={() => approveVipRequest(req.id)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black rounded-lg text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Approve VIP</span>
                                </button>
                              )}

                              <button
                                onClick={() => deleteVipRequest(req.id)}
                                className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg border border-red-500/30 transition-colors cursor-pointer"
                                title="Delete Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* EDIT MOVIE MODAL */}
      {editingMovie && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl w-full max-w-4xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Edit3 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-wide font-brand flex items-center gap-2">
                    <span>Edit Movie Details</span>
                    <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold">
                      {editingMovie.id}
                    </span>
                  </h2>
                  <p className="text-xs text-amber-400/90 font-mono">
                    චිත්‍රපටයේ ඕනෑම තොරතුරක් (Title, Poster, Video Stream, Downloads) මෙතැනින් සංස්කරණය කරන්න
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingMovie(null)}
                className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveMovieEdit} className="space-y-6 text-xs font-mono max-h-[75vh] overflow-y-auto pr-2">
              
              {/* SECTION 1: TITLES & CATEGORY */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  <span>1. Title & Classification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">
                      Display Title <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Original Title</label>
                    <input
                      type="text"
                      value={editOriginalTitle}
                      onChange={(e) => setEditOriginalTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    >
                      <option value="Sinhala Dubbed">Sinhala Dubbed</option>
                      <option value="Sinhala Subbed">Sinhala Subbed</option>
                      <option value="Sinhala Movie">Sinhala Movie</option>
                      <option value="Hollywood">Hollywood</option>
                      <option value="Bollywood">Bollywood</option>
                      <option value="Tamil / South">Tamil / South</option>
                      <option value="Animation">Animation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Release Year</label>
                    <input
                      type="number"
                      value={editYear}
                      onChange={(e) => setEditYear(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Duration</label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      placeholder="e.g. 1h 45m"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Quality Badge</label>
                    <input
                      type="text"
                      value={editQuality}
                      onChange={(e) => setEditQuality(e.target.value)}
                      placeholder="e.g. 1080p Full HD / 4K Ultra HD"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Language Text</label>
                    <input
                      type="text"
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value)}
                      placeholder="e.g. Sinhala Subbed (සිංහල උපසිරැසි)"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: STREAMING & POSTER IMAGES */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Streaming Link & Poster Images</span>
                </h3>

                <div>
                  <label className="block text-zinc-300 mb-1 uppercase font-bold">
                    Direct Stream Video URL <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editStreamUrl}
                    onChange={(e) => setEditStreamUrl(e.target.value)}
                    required
                    placeholder="https://... (Direct .mp4 link or stream video player link)"
                    className="w-full bg-zinc-950 border border-amber-500/40 text-amber-300 p-3 rounded-xl outline-none focus:border-amber-400 font-sans text-sm font-bold"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">
                    💡 Users will watch this video directly in the CINEWORLD built-in video player.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Poster Image URL</label>
                    <input
                      type="text"
                      value={editPoster}
                      onChange={(e) => setEditPoster(e.target.value)}
                      placeholder="https://... (Poster URL)"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Backdrop Banner Image URL</label>
                    <input
                      type="text"
                      value={editBackdrop}
                      onChange={(e) => setEditBackdrop(e.target.value)}
                      placeholder="https://... (Wide Banner URL)"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: DESCRIPTION, GENRES & CAST */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>3. Cast, Genres & Description</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Director</label>
                    <input
                      type="text"
                      value={editDirector}
                      onChange={(e) => setEditDirector(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Genres (Comma separated)</label>
                    <input
                      type="text"
                      value={editGenres}
                      onChange={(e) => setEditGenres(e.target.value)}
                      placeholder="Animation, Horror, Action"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 mb-1 uppercase font-bold">Cast (Comma separated)</label>
                    <input
                      type="text"
                      value={editCast}
                      onChange={(e) => setEditCast(e.target.value)}
                      placeholder="Actor 1, Actor 2"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 uppercase font-bold">Plot / Storyline Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
                  />
                </div>
              </div>

              {/* SECTION 4: DOWNLOAD LINKS & SERVERS */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>4. Direct Download Options ({editDownloads.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddDownloadOption}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[11px] rounded-lg uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Download Option</span>
                  </button>
                </div>

                {editDownloads.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No custom download servers added. (Stream link will be used as default download link).</p>
                ) : (
                  <div className="space-y-3">
                    {editDownloads.map((dl, idx) => (
                      <div key={dl.id || idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-3 relative">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="font-bold text-amber-400 text-xs">Server Option #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDownloadOption(idx)}
                            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-zinc-400 uppercase font-bold">Quality Name</label>
                            <input
                              type="text"
                              value={dl.quality}
                              onChange={(e) => handleUpdateDownloadOption(idx, 'quality', e.target.value)}
                              placeholder="1080p Full HD Direct"
                              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-400 uppercase font-bold">Resolution</label>
                            <input
                              type="text"
                              value={dl.resolution}
                              onChange={(e) => handleUpdateDownloadOption(idx, 'resolution', e.target.value)}
                              placeholder="1920x1080"
                              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-400 uppercase font-bold">File Size</label>
                            <input
                              type="text"
                              value={dl.size}
                              onChange={(e) => handleUpdateDownloadOption(idx, 'size', e.target.value)}
                              placeholder="1.4 GB"
                              className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 rounded-lg text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-bold">Download URL (Server 1)</label>
                          <input
                            type="text"
                            value={dl.downloadUrl}
                            onChange={(e) => handleUpdateDownloadOption(idx, 'downloadUrl', e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-zinc-900 border border-zinc-800 text-amber-400 p-2 rounded-lg text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-bold">Backup Mirror URL (Server 2 Optional)</label>
                          <input
                            type="text"
                            value={dl.server2Url || ''}
                            onChange={(e) => handleUpdateDownloadOption(idx, 'server2Url', e.target.value)}
                            placeholder="https://... (Optional Backup Link)"
                            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingMovie(null)}
                  className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-colors"
                >
                  කැන්සල් (Cancel)
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black uppercase tracking-wider text-xs rounded-xl cursor-pointer transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>වෙනස්කම් සුරකින්න (Save Changes)</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
