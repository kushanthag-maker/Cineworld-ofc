import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Search, DownloadCloud, Sparkles, CheckCircle2, Loader2, Film, Star, ExternalLink } from 'lucide-react';

export const ApiSearchImportModal: React.FC = () => {
  const { isApiImportOpen, setIsApiImportOpen, importCartoonFromApi, setActiveMovie } = useMovie();

  const [query, setQuery] = useState('Ben 10');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [importingUrl, setImportingUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isApiImportOpen) return null;

  const handleSearch = async (textToSearch?: string) => {
    const searchText = textToSearch !== undefined ? textToSearch : query;
    if (!searchText.trim()) return;

    setLoading(true);
    setSuccessMessage(null);
    try {
      const res = await fetch(`/api/cartoons/search?text=${encodeURIComponent(searchText)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('API search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (item: any) => {
    setImportingUrl(item.url);
    setSuccessMessage(null);
    try {
      const importedMovie = await importCartoonFromApi(item);
      if (importedMovie) {
        setSuccessMessage(`"${importedMovie.title}" imported & published successfully!`);
        setTimeout(() => {
          setActiveMovie(importedMovie);
          setIsApiImportOpen(false);
        }, 1200);
      }
    } catch (err) {
      console.error('Import error:', err);
    } finally {
      setImportingUrl(null);
    }
  };

  const popularKeywords = [
    'Ben 10', 'Tom and Jerry', 'Scooby', 'Avatar', 'Naruto', 'Dragon Ball', 'Pokemon', 'Tintin', 'Batman', 'Spiderman'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#09090b] border border-amber-500/30 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative rounded-xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-black flex items-center justify-center font-black rounded-lg shadow-lg shadow-amber-500/20">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-brand uppercase text-white tracking-wider">
                  Movie & Cartoon API Search
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 border border-amber-500/30 rounded">
                  AUTO-SYNC ENGINE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Search Sinhala Cartoons & Movies database to import instantly with direct streaming & downloads.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsApiImportOpen(false)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Chips */}
        <div className="p-5 border-b border-white/10 space-y-4 bg-zinc-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cartoons or movies (e.g. Ben 10, Scooby-Doo, Avatar)..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white pl-11 pr-4 py-3 text-sm rounded-lg outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider flex items-center gap-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search API</span>
            </button>
          </form>

          {/* Quick Keyword Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Search:
            </span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setQuery(kw);
                  handleSearch(kw);
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                  query.toLowerCase() === kw.toLowerCase()
                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-500/50 hover:text-white'
                }`}
              >
                {kw}
              </button>
            ))}
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 max-h-[500px]">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Searching Sinhala Cartoons & Movies Database...
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((item, idx) => {
                const isImportingThis = importingUrl === item.url;
                return (
                  <div
                    key={idx}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex gap-3 hover:border-amber-500/50 transition-all group"
                  >
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=300'}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded bg-zinc-900 shrink-0 border border-white/5"
                    />
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 border border-amber-500/20 rounded">
                            {item.quality || '1080p HD'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {item.rating || '8.5'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h4>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => handleImport(item)}
                          disabled={isImportingThis}
                          className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] tracking-wider rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          {isImportingThis ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Importing...</span>
                            </>
                          ) : (
                            <>
                              <DownloadCloud className="w-3.5 h-3.5" />
                              <span>Import & Publish</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-zinc-950 border border-dashed border-zinc-800 rounded-lg">
              <Film className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Type a keyword above to search & import movies or cartoons directly from API.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-950 border-t border-white/10 text-[10px] text-zinc-500 font-mono text-center flex items-center justify-between px-5">
          <span>API Connected: Zanta SL Cartoons Mirror</span>
          <span>1-Click Auto Import to Mongodb & App Cache</span>
        </div>
      </div>
    </div>
  );
};
