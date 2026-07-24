import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Movie, Notice } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle,
  FileJson,
  UserCheck,
  KeyRound,
  RefreshCw,
  Search,
  Bot,
  Zap,
  Shield,
  Film
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    requests,
    notices,
    addNotice,
    deleteNotice,
    resetToDefaultData,
    exportJsonCatalog,
    importJsonCatalog,
    refreshMovies
  } = useMovie();

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'add' | 'manage' | 'requests' | 'notices' | 'export' | 'sync'>('sync');

  // API Auto Sync State
  const [apiQuery, setApiQuery] = useState('ben 10');
  const [apiSearchResults, setApiSearchResults] = useState<any[]>([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [importingUrls, setImportingUrls] = useState<Set<string>>(new Set());
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [category, setCategory] = useState<'Sinhala Dubbed' | 'Sinhala Subbed' | 'Hollywood' | 'Bollywood' | 'Tamil / South' | 'Animation'>('Sinhala Dubbed');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [rating, setRating] = useState('8.5');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [duration, setDuration] = useState('2h 15m');
  const [quality, setQuality] = useState('1080p HD');
  const [genres, setGenres] = useState('Animation, Sinhala Cartoon, Action');
  const [director, setDirector] = useState('Sinhala Cartoons LK');
  const [cast, setCast] = useState('Sinhala Dubbing Team');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeType, setNoticeType] = useState<'info' | 'warning' | 'success' | 'alert'>('success');

  // JSON Import
  const [jsonInput, setJsonInput] = useState('');

  if (!isAdminOpen) return null;

  const safeFetchJson = async (url: string, options?: RequestInit) => {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      if (text.trim().startsWith('<')) {
        throw new Error('Server returned HTML fallback. Please try again in 2 seconds.');
      }
      throw new Error('Invalid JSON response from server.');
    }
  };

  // ==================== SIMPLE CLIENT-SIDE LOGIN (7060) ====================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '7060') {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Invalid Password. Please try 7060');
    }
  };

  const handleSearchApi = async () => {
    if (!apiQuery.trim()) return;
    setIsSearchingApi(true);
    setSyncStatus(null);
    try {
      const data = await safeFetchJson(`/api/cartoons/search?text=${encodeURIComponent(apiQuery)}`);
      if (data.success && Array.isArray(data.results)) {
        setApiSearchResults(data.results);
      } else {
        setApiSearchResults([]);
        setSyncStatus(data.message || 'No results found from Sinhala Cartoons API.');
      }
    } catch (err: any) {
      setSyncStatus('API Error: ' + err.message);
    } finally {
      setIsSearchingApi(false);
    }
  };

  const handleImportSingleItem = async (item: any) => {
    setImportingUrls((prev) => new Set(prev).add(item.url));
    try {
      const data = await safeFetchJson('/api/cartoons/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item })
      });
      if (data.success && data.movie) {
        await refreshMovies();
        setSyncStatus(`Successfully imported "${data.movie.title}" into CINEWORLD database!`);
      } else {
        setSyncStatus('Failed to import: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (err: any) {
      setSyncStatus('Import error: ' + err.message);
    } finally {
      setImportingUrls((prev) => {
        const next = new Set(prev);
        next.delete(item.url);
        return next;
      });
    }
  };

  const handleRunFullAutoSync = async () => {
    setIsAutoSyncing(true);
    setSyncStatus('Running full automatic search & sync across cartoon keywords...');
    try {
      const data = await safeFetchJson('/api/cartoons/auto-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: ['ben 10', 'tom and jerry', 'scooby', 'avatar', 'cartoon', 'sinhala'] })
      });
      if (data.success) {
        await refreshMovies();
        setSyncStatus(`Auto Sync Complete! Imported ${data.importedCount} new items. Total catalog: ${data.totalCached} movies/cartoons.`);
      } else {
        setSyncStatus('Sync error: ' + (data.error || data.message || 'Failed'));
      }
    } catch (err: any) {
      setSyncStatus('Sync execution failed: ' + err.message);
    } finally {
      setIsAutoSyncing(false);
    }
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const movieObj: Movie = {
      id: editingId || 'm-' + Date.now(),
      title,
      originalTitle,
      category,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
      backdropUrl: backdropUrl || posterUrl,
      streamUrl: streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      rating: parseFloat(rating) || 8.5,
      releaseYear: parseInt(releaseYear) || 2024,
      duration: duration || '2h 00m',
      quality: quality || '1080p HD',
      genres: genres.split(',').map((g) => g.trim()),
      director: director || 'Director',
      cast: cast.split(',').map((c) => c.trim()),
      description: description || 'No description provided.',
      language: category === 'Sinhala Dubbed' ? 'Sinhala Dubbed (සිංහල)' : 'English',
      hasSinhalaSub: category === 'Sinhala Subbed',
      viewsCount: 100,
      downloadsCount: 50,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      updateMovie(editingId, movieObj);
    } else {
      addMovie(movieObj);
    }

    resetForm();
    setActiveAdminTab('manage');
  };

  const resetForm = () => {
    setTitle('');
    setOriginalTitle('');
    setCategory('Sinhala Dubbed');
    setPosterUrl('');
    setBackdropUrl('');
    setStreamUrl('');
    setRating('8.5');
    setReleaseYear('2024');
    setDuration('2h 15m');
    setQuality('1080p HD');
    setGenres('Animation, Sinhala Cartoon, Action');
    setDirector('Sinhala Cartoons LK');
    setCast('Sinhala Dubbing Team');
    setDescription('');
    setEditingId(null);
  };

  const handleEditClick = (m: Movie) => {
    setEditingId(m.id);
    setTitle(m.title);
    setOriginalTitle(m.originalTitle || '');
    setCategory(m.category as any);
    setPosterUrl(m.posterUrl);
    setBackdropUrl(m.backdropUrl || '');
    setStreamUrl(m.streamUrl);
    setRating(String(m.rating));
    setReleaseYear(String(m.releaseYear));
    setDuration(m.duration);
    setQuality(m.quality);
    setGenres(m.genres.join(', '));
    setDirector(m.director);
    setCast(m.cast.join(', '));
    setDescription(m.description);
    setActiveAdminTab('add');
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    addNotice({
      title: noticeTitle,
      content: noticeContent,
      type: noticeType,
      isActive: true
    });
    setNoticeTitle('');
    setNoticeContent('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c0c0c] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-0 text-white">
        
        {/* Header */}
        <div className="bg-black p-4 sm:p-6 border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-brand uppercase tracking-wider">
                CINEWORLD Admin Control & Auto-Sync Engine
              </h2>
              <p className="text-[10px] font-mono text-amber-500 uppercase">
                Direct Sinhala Cartoons API Integration & Content Management
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Barrier */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-brand uppercase">Enter Admin Password</h3>
            <p className="text-xs text-white/50">Enter passcode to unlock movie management & Sinhala Cartoon API Auto-Sync.</p>
            
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-zinc-900 border border-white/10 text-white text-xs p-3 text-center outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-white text-black font-black uppercase text-xs tracking-wider cursor-pointer"
            >
              Unlock Control Panel
            </button>
          </form>
        ) : (
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveAdminTab('sync')}
                className={`px-4 py-2 flex items-center gap-2 border cursor-pointer ${
                  activeAdminTab === 'sync' ? 'bg-amber-500 text-black border-amber-500 font-black' : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>API Auto Sync & Search</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('manage')}
                className={`px-4 py-2 flex items-center gap-2 border cursor-pointer ${
                  activeAdminTab === 'manage' ? 'bg-amber-500 text-black border-amber-500 font-black' : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Catalog ({movies.length})</span>
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setActiveAdminTab('add');
                }}
                className={`px-4 py-2 flex items-center gap-2 border cursor-pointer ${
                  activeAdminTab === 'add' ? 'bg-amber-500 text-black border-amber-500 font-black' : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Movie</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('requests')}
                className={`px-4 py-2 flex items-center gap-2 border cursor-pointer ${
                  activeAdminTab === 'requests' ? 'bg-amber-500 text-black border-amber-500 font-black' : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>User Requests ({requests.length})</span>
              </button>
            </div>

            {/* TAB: API AUTO SYNC & SEARCH */}
            {activeAdminTab === 'sync' && (
              <div className="space-y-6 bg-zinc-950 p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white font-brand flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span>Sinhala Cartoons & Movies API Auto-Sync Engine</span>
                    </h3>
                    <p className="text-xs text-white/50 font-mono mt-0.5">
                      Connected to Zanta Mini API • Fetches streams, episodes & direct download links automatically.
                    </p>
                  </div>

                  <button
                    onClick={handleRunFullAutoSync}
                    disabled={isAutoSyncing}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isAutoSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Syncing Catalog...</span>
                      </>
                    ) : (
                      <>
                        <Bot className="w-4 h-4" />
                        <span>Run Full Catalog Auto-Sync</span>
                      </>
                    )}
                  </button>
                </div>

                {syncStatus && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{syncStatus}</span>
                  </div>
                )}

                {/* API Search Form */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase font-mono">
                    Live Search External Sinhala Cartoons API
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                      <input
                        type="text"
                        value={apiQuery}
                        onChange={(e) => setApiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchApi())}
                        placeholder="Search e.g. Ben 10, Tom and Jerry, Scooby, Avatar, Dora..."
                        className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs pl-9 pr-4 py-2.5 outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSearchApi}
                      disabled={isSearchingApi}
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      {isSearchingApi ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                      ) : (
                        <Search className="w-4 h-4 text-amber-500" />
                      )}
                      <span>Search API</span>
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {apiSearchResults.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>Found {apiSearchResults.length} items from API</span>
                      <span>Click 'Import' to publish into CINEWORLD</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                      {apiSearchResults.map((resItem, idx) => {
                        const isImporting = importingUrls.has(resItem.url);
                        const isAlreadyInCatalog = movies.some((m) => m.originalTitle === resItem.title || m.title === resItem.title);

                        return (
                          <div
                            key={idx}
                            className="p-3 bg-zinc-900 border border-zinc-800 flex items-center gap-3 hover:border-amber-500/50 transition-all"
                          >
                            <img
                              src={resItem.thumbnail}
                              alt={resItem.title}
                              className="w-14 h-18 object-cover shrink-0 border border-zinc-800 bg-black"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />

                            <div className="flex-1 min-w-0 space-y-1">
                              <h5 className="text-xs font-bold text-white truncate" title={resItem.title}>
                                {resItem.title}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                                <span className="text-amber-400">★ {resItem.rating || '8.2'}</span>
                                <span>•</span>
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  {resItem.quality || 'HD'}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleImportSingleItem(resItem)}
                              disabled={isImporting || isAlreadyInCatalog}
                              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-60 ${
                                isAlreadyInCatalog
                                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                  : 'bg-amber-500 hover:bg-white text-black'
                              }`}
                            >
                              {isImporting ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Importing...</span>
                                </>
                              ) : isAlreadyInCatalog ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  <span>In Catalog</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Import</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-zinc-800 space-y-2">
                    <Bot className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-500 font-mono">
                      Click "Run Full Catalog Auto-Sync" or search keywords above to import Sinhala Dubbed Cartoons directly!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MANAGE MOVIES */}
            {activeAdminTab === 'manage' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                  {movies.map((m) => (
                    <div key={m.id} className="p-3 bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={m.posterUrl} alt={m.title} className="w-12 h-16 object-cover bg-black" />
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                          <span className="text-[10px] font-mono text-amber-500 block">{m.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditClick(m)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteMovie(m.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ADD / EDIT MOVIE FORM */}
            {activeAdminTab === 'add' && (
              <form onSubmit={handleSaveMovie} className="space-y-4 bg-zinc-950 p-6 border border-white/10">
                <h3 className="text-sm font-bold text-amber-500 font-mono uppercase">
                  {editingId ? 'Edit Movie Details' : 'Add New Movie / Cartoon'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-white/70 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g. Ben 10: Alien Force"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    >
                      <option value="Sinhala Dubbed">Sinhala Dubbed</option>
                      <option value="Sinhala Subbed">Sinhala Subbed</option>
                      <option value="Hollywood">Hollywood</option>
                      <option value="Bollywood">Bollywood</option>
                      <option value="Tamil / South">Tamil / South</option>
                      <option value="Animation">Animation</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/70 mb-1">Stream / MP4 / Video URL</label>
                    <input
                      type="text"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      placeholder="Direct MP4 link or YouTube embed link"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Poster Image URL</label>
                    <input
                      type="text"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Backdrop Image URL</label>
                    <input
                      type="text"
                      value={backdropUrl}
                      onChange={(e) => setBackdropUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white/70 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Plot summary..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-white text-black font-black uppercase text-xs tracking-wider cursor-pointer"
                  >
                    {editingId ? 'Update Movie' : 'Publish Movie'}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase text-xs cursor-pointer"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            )}

            {/* TAB: REQUESTS */}
            {activeAdminTab === 'requests' && (
              <div className="space-y-3">
                {requests.length > 0 ? (
                  requests.map((r) => (
                    <div key={r.id} className="p-3 bg-zinc-900 border border-zinc-800 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-amber-400">
                        <span>{r.movieTitle}</span>
                        <span className="text-white/50">{r.category}</span>
                      </div>
                      <p className="text-[10px] text-white/60 font-mono">
                        Requested by {r.requestedBy} • {r.whatsappNumber || 'No WhatsApp'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/50 font-mono text-center py-6">No user requests yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
