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
  Sparkles
} from 'lucide-react';
import { Movie } from '../types';

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
    showToast 
  } = useMovie();

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cineworld_admin_authed') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'requests' | 'reports' | 'movies' | 'add_movie'>('requests');
  const [movieSearch, setMovieSearch] = useState('');

  // Form state for adding new movie
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sinhala Dubbed');
  const [newYear, setNewYear] = useState(2025);
  const [newPoster, setNewPoster] = useState('');
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

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

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={movie.streamUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-mono"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Link</span>
                      </a>

                      <button
                        onClick={() => deleteMovie(movie.id)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase bg-red-950/30 hover:bg-red-900/50 px-2 py-1 rounded border border-red-500/20 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
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

      </div>
    </div>
  );
};
