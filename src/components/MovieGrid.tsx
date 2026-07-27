import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Film, Search, SearchX, X, Sparkles, Filter } from 'lucide-react';

export const MovieGrid: React.FC = () => {
  const { movies, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm } = useMovie();

  const quickSearchTags = [
    'Ben 10',
    'Kung Fu Panda',
    'Scooby',
    'Shrek',
    'Sonic',
    'Rio',
    'Frozen',
    'Gajaman',
    'Angry Birds',
    'Dragon'
  ];

  const filtered = movies.filter((movie) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      movie.category === selectedCategory ||
      (selectedCategory === 'Sinhala Dubbed' && (movie.category === 'Sinhala Dubbed' || movie.genres.includes('Sinhala Cartoon'))) ||
      (selectedCategory === 'Horror Movies' && movie.genres.some((g) => g.toLowerCase().includes('horror')));

    const matchesSearch =
      !searchTerm ||
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      movie.genres.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Prominent Search Bar Section */}
      <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-brand flex items-center gap-2">
                <span>Search Movies & Sinhala Cartoons</span>
                <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold">
                  {movies.length} Titles
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Type movie name, cartoon title (e.g. Ben 10, Kung Fu Panda) or click quick tag below
              </p>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-amber-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Ben 10, Kung Fu Panda, Scooby, Shrek, Cartoons..."
              className="w-full bg-zinc-950 border-2 border-zinc-800 text-white text-sm pl-11 pr-24 py-3 rounded-xl focus:border-amber-500 focus:bg-black outline-none transition-all font-sans shadow-inner placeholder:text-zinc-500"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            ) : (
              <span className="absolute right-3 top-3 text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded font-mono uppercase">
                Live Search
              </span>
            )}
          </div>
        </div>

        {/* Quick Search Tag Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80 text-xs">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Search:
          </span>
          {quickSearchTags.map((tag) => {
            const isActive = searchTerm.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSearchTerm(isActive ? '' : tag)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/30'
                    : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-amber-500/50'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-brand flex items-center gap-2">
            <Film className="w-6 h-6 text-amber-500" />
            <span>
              {selectedCategory === 'All' ? 'Latest Movies & Sinhala Cartoons' : `${selectedCategory}`}
            </span>
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-0.5">
            Auto Direct Download Servers & HD Streaming ({filtered.length} Titles)
          </p>
        </div>

        {searchTerm && (
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold">
            <Filter className="w-4 h-4" />
            <span>Searching: "{searchTerm}" ({filtered.length} found)</span>
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 hover:text-white"
              title="Clear Filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid Content */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#080808] border border-white/10 p-8 space-y-4 rounded-2xl">
          <SearchX className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase font-editorial italic">
              No Movies or Cartoons Found
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto uppercase tracking-wider">
              No results matching "{searchTerm}". Try another keyword or reset category filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 bg-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Show All Movies ({movies.length})
          </button>
        </div>
      )}
    </div>
  );
};
