import React from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Film, SearchX } from 'lucide-react';

export const MovieGrid: React.FC = () => {
  const { movies, selectedCategory, searchTerm } = useMovie();

  const filtered = movies.filter((movie) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      movie.category === selectedCategory ||
      (selectedCategory === 'Sinhala Dubbed' && (movie.category === 'Sinhala Dubbed' || movie.genres.includes('Sinhala Cartoon')));

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
      </div>

      {/* Grid Content */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#080808] border border-white/10 p-8 space-y-4">
          <SearchX className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase font-editorial italic">
              No Movies or Cartoons Found
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto uppercase tracking-wider">
              No results matching "{searchTerm}". Try another keyword or search using Admin API Auto-Sync!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
