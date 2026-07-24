import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Movie, DownloadOption, Quality } from '../types';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  RotateCcw,
  Film,
  CheckCircle,
  AlertCircle,
  Eye,
  PlusCircle,
  Sparkles,
  FileJson,
  UserCheck,
  Subtitles,
  KeyRound
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    movies,
    addMovie,
    updateMovie,
    deleteMovie,
    movieRequests,
    updateRequestStatus,
    notices,
    addNotice,
    deleteNotice,
    resetToDefaultData,
    exportJsonCatalog,
    importJsonCatalog
  } = useMovie();

  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activeAdminTab, setActiveAdminTab] = useState<'add' | 'manage' | 'requests' | 'notices' | 'export'>('add');

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeType, setNoticeType] = useState<'info' | 'update' | 'alert'>('update');

  // Add / Edit Movie Form State
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [duration, setDuration] = useState('2h 15m');
  const [rating, setRating] = useState(8.5);
  const [genres, setGenres] = useState<string[]>(['Action', 'Sci-Fi']);
  const [type, setType] = useState<'Movie' | 'TV Series' | 'Teledrama' | 'Short Film'>('Movie');
  const [hasSinhalaSub, setHasSinhalaSub] = useState(true);
  const [isSinhalaDubbed, setIsSinhalaDubbed] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [quality, setQuality] = useState<Quality>('1080p Full HD');
  const [director, setDirector] = useState('');
  const [castInput, setCastInput] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [streamUrl, setStreamUrl] = useState('');

  // Download options array state for form
  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([
    {
      id: 'opt-1',
      quality: '1080p Full HD',
      resolution: '1920x1080',
      size: '2.1 GB',
      format: 'MP4 / x264',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      directServerName: 'Cineworld HighSpeed Mirror 1'
    }
  ]);

  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [searchAdminQuery, setSearchAdminQuery] = useState('');

  if (!isAdminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(passwordInput)) {
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;
    addNotice(noticeTitle, noticeMessage, noticeType);
    setNoticeTitle('');
    setNoticeMessage('');
  };

  const handleAddDownloadOption = () => {
    setDownloadOptions((prev) => [
      ...prev,
      {
        id: 'opt-' + Date.now(),
        quality: '720p HD',
        resolution: '1280x720',
        size: '950 MB',
        format: 'MP4',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        directServerName: 'Server 2'
      }
    ]);
  };

  const handleRemoveDownloadOption = (id: string) => {
    setDownloadOptions((prev) => prev.filter((o) => o.id !== id));
  };

  const handleDownloadOptionChange = (id: string, field: keyof DownloadOption, value: string) => {
    setDownloadOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const resetForm = () => {
    setEditingMovieId(null);
    setTitle('');
    setOriginalTitle('');
    setPosterUrl('');
    setBackdropUrl('');
    setSynopsis('');
    setReleaseYear(new Date().getFullYear());
    setDuration('2h 15m');
    setRating(8.5);
    setGenres(['Action']);
    setType('Movie');
    setHasSinhalaSub(true);
    setIsSinhalaDubbed(false);
    setFeatured(false);
    setQuality('1080p Full HD');
    setDirector('');
    setCastInput('');
    setTrailerUrl('');
    setStreamUrl('');
    setDownloadOptions([
      {
        id: 'opt-1',
        quality: '1080p Full HD',
        resolution: '1920x1080',
        size: '2.1 GB',
        format: 'MP4 / x264',
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      }
    ]);
  };

  const handleStartEdit = (m: Movie) => {
    setEditingMovieId(m.id);
    setTitle(m.title);
    setOriginalTitle(m.originalTitle || '');
    setPosterUrl(m.posterUrl);
    setBackdropUrl(m.backdropUrl);
    setSynopsis(m.synopsis);
    setReleaseYear(m.releaseYear);
    setDuration(m.duration);
    setRating(m.rating);
    setGenres(m.genres);
    setType(m.type);
    setHasSinhalaSub(m.hasSinhalaSub);
    setIsSinhalaDubbed(m.isSinhalaDubbed);
    setFeatured(m.featured);
    setQuality(m.quality);
    setDirector(m.director || '');
    setCastInput(m.cast.join(', '));
    setTrailerUrl(m.trailerUrl);
    setStreamUrl(m.streamUrl);
    setDownloadOptions(m.downloadOptions || []);
    setActiveAdminTab('add');
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !streamUrl.trim()) {
      alert('Please enter Movie Title and Direct Stream URL!');
      return;
    }

    const castArray = castInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const movieData = {
      title,
      originalTitle: originalTitle || undefined,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: backdropUrl || posterUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      synopsis: synopsis || 'No description provided.',
      releaseYear: Number(releaseYear),
      duration: duration || '2h 00m',
      rating: Number(rating),
      genres: genres.length > 0 ? genres : ['Action'],
      type,
      hasSinhalaSub,
      isSinhalaDubbed,
      featured,
      trending: featured,
      quality,
      director,
      cast: castArray.length > 0 ? castArray : ['Cineworld Cast'],
      trailerUrl,
      streamUrl,
      downloadOptions
    };

    if (editingMovieId) {
      updateMovie(editingMovieId, movieData);
      alert('Movie updated successfully!');
    } else {
      addMovie(movieData);
      alert('New Movie added to Cineworld catalog!');
    }

    resetForm();
    setActiveAdminTab('manage');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (importJsonCatalog(importJsonText)) {
      setImportStatus('Successfully imported movie catalog!');
      setImportJsonText('');
    } else {
      setImportStatus('Failed to parse JSON. Please ensure valid movie JSON format.');
    }
  };

  const handleDownloadExportJson = () => {
    const jsonStr = exportJsonCatalog();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cineworld-catalog-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Preset Poster helper
  const applyPresetPoster = () => {
    setPosterUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop');
    setBackdropUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-black px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-black font-black">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-editorial italic uppercase tracking-wider">Cineworld Control Portal</h2>
              <p className="text-[10px] text-amber-500 font-mono uppercase tracking-widest">Restricted Portal Access</p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-2 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAdminLoggedIn ? (
          /* Password Form */
          <div className="p-8 max-w-md mx-auto w-full text-center space-y-6 my-auto">
            <div className="w-16 h-16 border border-amber-500/50 bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase font-editorial italic">Enter Portal Password</h3>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                Authorized access required to manage films and stream metadata.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Admin Passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-black text-white text-center text-lg font-mono tracking-widest py-3 border border-white/20 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                {loginError && (
                  <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mt-2">
                    Invalid Passcode! Please check credentials.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest transition-colors shadow-xl"
              >
                Unlock System Controls
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs text-zinc-400 font-mono">Total Movies</span>
                <p className="text-2xl font-black text-white">{movies.length}</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs text-zinc-400 font-mono">Total Views</span>
                <p className="text-2xl font-black text-amber-400">
                  {movies.reduce((acc, m) => acc + m.viewsCount, 0)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs text-zinc-400 font-mono">Total Downloads</span>
                <p className="text-2xl font-black text-emerald-400">
                  {movies.reduce((acc, m) => acc + (m.downloadsCount || 0), 0)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs text-zinc-400 font-mono">Movie Requests</span>
                <p className="text-2xl font-black text-red-400">
                  {movieRequests.filter((r) => r.status === 'Pending').length} Pending
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveAdminTab('add')}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${
                  activeAdminTab === 'add'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{editingMovieId ? 'Edit Movie' : 'Add New Movie'}</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('manage')}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${
                  activeAdminTab === 'manage'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Manage Movies ({movies.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('requests')}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${
                  activeAdminTab === 'requests'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>User Requests ({movieRequests.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('notices')}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${
                  activeAdminTab === 'notices'
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Site Notices ({notices.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('export')}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 ${
                  activeAdminTab === 'export'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <FileJson className="w-4 h-4" />
                <span>Vercel Backup / JSON</span>
              </button>
            </div>

            {/* TAB 1: Add or Edit Movie */}
            {activeAdminTab === 'add' && (
              <form onSubmit={handleSaveMovie} className="space-y-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white font-serif">
                    {editingMovieId ? 'Edit Movie Information' : 'Add New Movie with Direct Links'}
                  </h3>
                  {editingMovieId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Movie Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Avatar 3: Fire and Ash"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Original Title / Sinhala Name (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. සිංහල උපසිරැසි සමඟ"
                      value={originalTitle}
                      onChange={(e) => setOriginalTitle(e.target.value)}
                      className="w-full bg-zinc-950 text-amber-300 text-sm rounded-xl px-4 py-2 border border-zinc-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Poster Image URL *</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={posterUrl}
                        onChange={(e) => setPosterUrl(e.target.value)}
                        className="flex-1 bg-zinc-950 text-white text-xs rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyPresetPoster}
                        className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 whitespace-nowrap"
                      >
                        Sample Poster
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Backdrop Banner URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={backdropUrl}
                      onChange={(e) => setBackdropUrl(e.target.value)}
                      className="w-full bg-zinc-950 text-white text-xs rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Category / Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800"
                    >
                      <option value="Movie">Movie</option>
                      <option value="TV Series">TV Series</option>
                      <option value="Teledrama">Teledrama</option>
                      <option value="Short Film">Short Film</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Quality Badge</label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as any)}
                      className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800"
                    >
                      <option value="4K Ultra HD">4K Ultra HD</option>
                      <option value="1080p Full HD">1080p Full HD</option>
                      <option value="720p HD">720p HD</option>
                      <option value="480p SD">480p SD</option>
                      <option value="CAM / HD-CAM">CAM / HD-CAM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Release Year</label>
                    <input
                      type="number"
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(Number(e.target.value))}
                      className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Duration / Runtime</label>
                    <input
                      type="text"
                      placeholder="e.g. 2h 15m or 10 Episodes"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800"
                    />
                  </div>
                </div>

                {/* Subtitle & Feature Toggles */}
                <div className="flex flex-wrap items-center gap-6 py-2 border-y border-zinc-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={hasSinhalaSub}
                      onChange={(e) => setHasSinhalaSub(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span>Has Sinhala Subtitles (සිංහල උපසිරැසි)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={isSinhalaDubbed}
                      onChange={(e) => setIsSinhalaDubbed(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span>Sinhala Dubbed (සිංහල හඬකැවූ)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-red-600 rounded"
                    />
                    <span>Show in Featured Hero Banner</span>
                  </label>
                </div>

                {/* Video Streaming Link */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-red-400 uppercase tracking-wider">
                    Direct Video Stream Link (MP4 / WebM / M3U8 or Embed URL) *
                  </label>
                  <input
                    type="url"
                    placeholder="https://commondatastorage.googleapis.com/... or https://www.youtube.com/embed/..."
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    required
                    className="w-full bg-zinc-950 text-emerald-400 font-mono text-xs rounded-xl p-3 border border-zinc-800 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[11px] text-zinc-500">
                    This link enables direct video playback on Cineworld for viewers!
                  </p>
                </div>

                {/* Trailer Link */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">YouTube Trailer Embed URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/..."
                    value={trailerUrl}
                    onChange={(e) => setTrailerUrl(e.target.value)}
                    className="w-full bg-zinc-950 text-white text-xs rounded-xl px-3 py-2 border border-zinc-800"
                  />
                </div>

                {/* Synopsis */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Synopsis / Storyline</label>
                  <textarea
                    rows={3}
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    className="w-full bg-zinc-950 text-white text-xs rounded-xl p-3 border border-zinc-800"
                  />
                </div>

                {/* Cast */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Cast Members (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Cillian Murphy, Emily Blunt, Matt Damon"
                    value={castInput}
                    onChange={(e) => setCastInput(e.target.value)}
                    className="w-full bg-zinc-950 text-white text-xs rounded-xl px-3 py-2 border border-zinc-800"
                  />
                </div>

                {/* Direct Download Options Array */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-red-500" />
                      <span>Direct Download Links Config</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddDownloadOption}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200"
                    >
                      + Add Download Quality Link
                    </button>
                  </div>

                  {downloadOptions.map((opt, idx) => (
                    <div key={opt.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-zinc-400">Option #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDownloadOption(opt.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Quality (1080p)"
                          value={opt.quality}
                          onChange={(e) => handleDownloadOptionChange(opt.id, 'quality', e.target.value as any)}
                          className="bg-zinc-900 text-white text-xs p-2 rounded-lg border border-zinc-800"
                        />
                        <input
                          type="text"
                          placeholder="Size (2.1 GB)"
                          value={opt.size}
                          onChange={(e) => handleDownloadOptionChange(opt.id, 'size', e.target.value)}
                          className="bg-zinc-900 text-white text-xs p-2 rounded-lg border border-zinc-800"
                        />
                        <input
                          type="text"
                          placeholder="Resolution (1920x1080)"
                          value={opt.resolution}
                          onChange={(e) => handleDownloadOptionChange(opt.id, 'resolution', e.target.value)}
                          className="bg-zinc-900 text-white text-xs p-2 rounded-lg border border-zinc-800"
                        />
                        <input
                          type="text"
                          placeholder="Server 1 Name"
                          value={opt.server1Name || 'Server 1 Direct'}
                          onChange={(e) => handleDownloadOptionChange(opt.id, 'server1Name', e.target.value)}
                          className="bg-zinc-900 text-white text-xs p-2 rounded-lg border border-zinc-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-amber-400 font-mono block mb-1">Server 1 (Primary Direct URL)</label>
                          <input
                            type="url"
                            placeholder="Server 1 Direct URL (e.g. https://.../movie.mp4)"
                            value={opt.downloadUrl}
                            onChange={(e) => handleDownloadOptionChange(opt.id, 'downloadUrl', e.target.value)}
                            className="w-full bg-zinc-900 text-amber-300 font-mono text-xs p-2 rounded-lg border border-zinc-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 font-mono block mb-1">Server 2 (Backup Mirror URL - Optional)</label>
                          <input
                            type="url"
                            placeholder="Server 2 Backup Mirror URL"
                            value={opt.server2Url || ''}
                            onChange={(e) => handleDownloadOptionChange(opt.id, 'server2Url', e.target.value)}
                            className="w-full bg-zinc-900 text-zinc-300 font-mono text-xs p-2 rounded-lg border border-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl"
                >
                  {editingMovieId ? 'Save Movie Updates' : 'Publish Movie to Cineworld'}
                </button>
              </form>
            )}

            {/* TAB 2: Manage Catalog */}
            {activeAdminTab === 'manage' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Filter movies..."
                  value={searchAdminQuery}
                  onChange={(e) => setSearchAdminQuery(e.target.value)}
                  className="w-full bg-zinc-900 text-white text-xs rounded-xl p-3 border border-zinc-800"
                />

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {movies
                    .filter((m) => m.title.toLowerCase().includes(searchAdminQuery.toLowerCase()))
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img src={m.posterUrl} alt="" className="w-10 h-14 object-cover rounded bg-black" />
                          <div>
                            <h4 className="text-sm font-bold text-white">{m.title}</h4>
                            <p className="text-xs text-zinc-400 font-mono">
                              {m.releaseYear} • {m.quality} • {m.viewsCount} Views
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEdit(m)}
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
                            title="Edit Movie"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${m.title}"?`)) deleteMovie(m.id);
                            }}
                            className="p-2 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: Movie Requests */}
            {activeAdminTab === 'requests' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white font-serif">Viewer Movie Requests</h3>
                {movieRequests.length > 0 ? (
                  movieRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{req.movieName}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                            req.status === 'Added'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : req.status === 'Rejected'
                              ? 'bg-red-950 text-red-400 border border-red-500/30'
                              : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Language Requested: <span className="text-zinc-200">{req.language}</span>
                      </div>
                      {req.notes && <p className="text-xs text-zinc-300 italic">"{req.notes}"</p>}

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Added')}
                          className="px-3 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 text-xs font-medium"
                        >
                          Mark Added
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, 'Rejected')}
                          className="px-3 py-1 rounded-lg bg-red-950 text-red-400 hover:bg-red-900 text-xs font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No user requests pending.</p>
                )}
              </div>
            )}

            {/* TAB: Broadcast Notices & Announcements */}
            {activeAdminTab === 'notices' && (
              <div className="space-y-6">
                <form onSubmit={handleCreateNotice} className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-4">
                  <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Broadcast New Notice / Update</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs text-zinc-400 font-mono">Notice Title</label>
                      <input
                        type="text"
                        placeholder="e.g., New Sinhala Subbed Movies Added!"
                        value={noticeTitle}
                        onChange={(e) => setNoticeTitle(e.target.value)}
                        className="w-full bg-black text-white text-xs p-3 rounded-xl border border-zinc-800 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400 font-mono">Notice Type</label>
                      <select
                        value={noticeType}
                        onChange={(e) => setNoticeType(e.target.value as any)}
                        className="w-full bg-black text-white text-xs p-3 rounded-xl border border-zinc-800 focus:border-amber-500"
                      >
                        <option value="update">Update Announcement</option>
                        <option value="info">General Info</option>
                        <option value="alert">Alert / Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 font-mono">Message Content</label>
                    <textarea
                      rows={3}
                      placeholder="Enter the update message for visitors..."
                      value={noticeMessage}
                      onChange={(e) => setNoticeMessage(e.target.value)}
                      className="w-full bg-black text-white text-xs p-3 rounded-xl border border-zinc-800 focus:border-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-colors"
                  >
                    Publish Notice to Site Users
                  </button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase font-mono">Active Broadcasts ({notices.length})</h4>
                  {notices.length > 0 ? (
                    notices.map((n) => (
                      <div key={n.id} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{n.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase rounded">
                              {n.type}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300">{n.message}</p>
                          <span className="text-[10px] text-zinc-500 font-mono block pt-1">
                            Published: {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteNotice(n.id)}
                          className="p-2 bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900 rounded-lg text-xs"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 font-mono">No active broadcasts created yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Vercel Export & JSON Catalog Sync */}
            {activeAdminTab === 'export' && (
              <div className="space-y-6 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Vercel Deployment & JSON Export</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Export your complete movie catalog as JSON to commit to your GitHub repository before deploying on Vercel!
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-sm font-bold text-white">1. Export Current Catalog to JSON</h4>
                  <button
                    onClick={handleDownloadExportJson}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download cineworld-catalog-export.json</span>
                  </button>
                </div>

                <form onSubmit={handleImportSubmit} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                  <h4 className="text-sm font-bold text-white">2. Import Catalog JSON</h4>
                  <textarea
                    rows={4}
                    placeholder="Paste JSON array here..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    className="w-full bg-zinc-900 text-zinc-200 text-xs font-mono p-3 rounded-xl border border-zinc-800"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import JSON Data</span>
                  </button>
                  {importStatus && <p className="text-xs text-amber-400">{importStatus}</p>}
                </form>

                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                  <h4 className="text-sm font-bold text-white">3. Reset Catalog</h4>
                  <button
                    onClick={() => {
                      if (confirm('Reset catalog to default movies?')) resetToDefaultData();
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-red-950 text-red-400 border border-zinc-800 text-xs font-bold flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore Default Movie Catalog</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
