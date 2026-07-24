import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Movie } from '../types';
import { Filter, SlidersHorizontal, Sparkles, Film, ArrowUpDown, X } from 'lucide-react';

interface MovieGridProps {
  onWatchMovie: (movie: Movie) => void;
  onDownloadClick: (movie: Movie) => void;
}

const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Adventure',
  'Horror',
  'Comedy',
  'Drama',
  'Romance',
  'Animation',
  'Biography',
  'Crime',
  'Fantasy',
  'History'
];

export const MovieGrid: React.FC<MovieGridProps> = ({ onWatchMovie, onDownloadClick }) => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedType,
    setSelectedType,
    selectedQuality,
    setSelectedQuality
  } = useMovie();

  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular' | 'year'>('newest');

  // Filter Logic
  const filteredMovies = movies.filter((movie) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchOriginal = movie.originalTitle?.toLowerCase().includes(q);
      const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
      const matchGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
      if (!matchTitle && !matchOriginal && !matchCast && !matchGenre) return false;
    }

    // Genre
    if (selectedGenre !== 'All') {
      if (!movie.genres.includes(selectedGenre)) return false;
    }

    // Type
    if (selectedType !== 'All') {
      if (movie.type !== selectedType) return false;
    }

    // Quality
    if (selectedQuality !== 'All') {
      if (movie.quality !== selectedQuality) return false;
    }

    return true;
  });

  // Sorting
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
    if (sortBy === 'year') return b.releaseYear - a.releaseYear;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <section className="space-y-6 my-8">
      
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3 font-editorial italic">
            <span>Movie Collection</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 border border-amber-500/40 px-2 py-0.5 bg-amber-500/10 not-italic font-sans">
              {sortedMovies.length} ARCHIVED
            </span>
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
            Stream & Direct Download with Sinhala Subtitles
          </p>
        </div>

        {/* Sorting Dropdown & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quality Filter */}
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="bg-black text-white/80 border border-white/10 text-xs uppercase font-bold tracking-wider px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All">All Quality</option>
            <option value="4K Ultra HD">4K Ultra HD</option>
            <option value="1080p Full HD">1080p Full HD</option>
            <option value="720p HD">720p HD</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-black border border-white/10 px-3 py-2 text-xs uppercase font-bold tracking-wider text-white/80">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer uppercase font-bold"
            >
              <option value="newest" className="bg-black text-white">Latest Added</option>
              <option value="popular" className="bg-black text-white">Most Popular</option>
              <option value="rating" className="bg-black text-white">Top Rated</option>
              <option value="year" className="bg-black text-white">Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Pills Slider / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === genre
                ? 'bg-amber-500 text-black border border-amber-500 font-black'
                : 'bg-black text-white/70 hover:text-white border border-white/10 hover:border-white/30'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Active Filter Clear Bar */}
      {(searchQuery || selectedGenre !== 'All' || selectedType !== 'All' || selectedQuality !== 'All') && (
        <div className="flex items-center gap-2 text-xs text-white/70 bg-white/5 p-2.5 border border-white/10 uppercase tracking-wider">
          <span className="text-amber-500 font-bold">Active Filters:</span>
          {searchQuery && (
            <span className="px-2 py-0.5 bg-black border border-white/20 text-white font-mono flex items-center gap-1">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </span>
          )}
          {selectedGenre !== 'All' && (
            <span className="px-2 py-0.5 bg-black border border-white/20 text-white font-mono flex items-center gap-1">
              Genre: {selectedGenre}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGenre('All')} />
            </span>
          )}
          {selectedType !== 'All' && (
            <span className="px-2 py-0.5 bg-black border border-white/20 text-white font-mono flex items-center gap-1">
              Type: {selectedType}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType('All')} />
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setSelectedType('All');
              setSelectedQuality('All');
            }}
            className="ml-auto text-xs text-amber-500 hover:underline uppercase font-bold"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Movie Grid Cards */}
      {sortedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatchMovie={onWatchMovie}
              onDownloadClick={onDownloadClick}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white/5 border border-white/10">
          <Film className="w-12 h-12 text-white/30 mx-auto" />
          <h3 className="text-xl font-bold uppercase text-white font-editorial italic">No Movies Found</h3>
          <p className="text-xs text-white/50 uppercase tracking-wider max-w-md mx-auto">
            We couldn't find any movies matching your current search or filter criteria. Try searching for another title or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setSelectedType('All');
              setSelectedQuality('All');
            }}
            className="px-6 py-3 bg-amber-500 text-black font-black uppercase text-xs tracking-wider hover:bg-white transition-colors"
          >
            Show All Movies
          </button>
        </div>
      )}
    </section>
  );
};
