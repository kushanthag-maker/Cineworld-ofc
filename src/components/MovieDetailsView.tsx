import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { useMovie } from '../context/MovieContext';
import { VideoPlayer } from './VideoPlayer';
import { DownloadSection } from './DownloadSection';
import { MovieCard } from './MovieCard';
import {
  X,
  Play,
  Download,
  Star,
  Bookmark,
  Share2,
  Subtitles,
  Film,
  User,
  Clock,
  Eye,
  MessageSquare,
  Send,
  ThumbsUp,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface MovieDetailsViewProps {
  movie: Movie;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
  movie,
  onClose,
  onSelectMovie
}) => {
  const {
    movies,
    watchlist,
    toggleWatchlist,
    setActiveTrailerUrl,
    incrementMovieViews,
    reviews,
    addReview
  } = useMovie();

  const [activeTab, setActiveTab] = useState<'watch' | 'download' | 'overview' | 'reviews'>('watch');
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [copiedShare, setCopiedShare] = useState(false);

  const isBookmarked = watchlist.includes(movie.id);

  useEffect(() => {
    incrementMovieViews(movie.id);
  }, [movie.id]);

  // Related Movies
  const relatedMovies = movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 5);

  const movieReviews = reviews[movie.id] || [];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    addReview(movie.id, reviewName, reviewRating, reviewComment);
    setReviewComment('');
    setReviewName('');
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onClose}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Movie Header Banner */}
      <div className="relative overflow-hidden bg-[#050505] border border-white/10 shadow-2xl">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-80 md:h-96">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-50 contrast-110 opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-6 md:p-10 pt-32 md:pt-48 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
          
          {/* Poster Card */}
          <div className="w-44 md:w-56 aspect-[2/3] overflow-hidden border border-white/20 shadow-2xl shrink-0 bg-black">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-widest">
                {movie.quality}
              </span>

              {movie.hasSinhalaSub && (
                <span className="px-2.5 py-0.5 border border-amber-500/50 text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <Subtitles className="w-3.5 h-3.5" />
                  සිංහල Subtitles
                </span>
              )}

              {movie.isSinhalaDubbed && (
                <span className="px-2.5 py-0.5 border border-orange-500/50 text-orange-400 text-xs font-bold uppercase tracking-widest">
                  සිංහල Dubbed
                </span>
              )}

              <span className="px-2.5 py-0.5 border border-white/10 bg-black text-white/70 text-xs font-bold uppercase tracking-widest">
                {movie.type}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic font-editorial leading-tight">
                {movie.title}
              </h1>
              {movie.originalTitle && (
                <p className="text-amber-500 font-bold uppercase tracking-widest text-xs md:text-sm mt-1">
                  {movie.originalTitle}
                </p>
              )}
            </div>

            {/* Quick Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/70">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-white/50" />
                <span>{movie.duration}</span>
              </div>
              <span>•</span>
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <div className="flex items-center gap-1 text-white/50">
                <Eye className="w-3.5 h-3.5" />
                <span>{movie.viewsCount} Views</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span key={g} className="px-2.5 py-1 border border-white/10 bg-white/5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                  {g}
                </span>
              ))}
            </div>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('watch')}
                className={`px-6 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'watch'
                    ? 'bg-amber-500 text-black border border-amber-500'
                    : 'bg-black hover:bg-white/10 text-white border border-white/20'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Stream</span>
              </button>

              <button
                onClick={() => setActiveTab('download')}
                className={`px-6 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'download'
                    ? 'bg-amber-500 text-black border border-amber-500'
                    : 'bg-black hover:bg-white/10 text-white border border-white/20'
                }`}
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>Direct Downloads</span>
              </button>

              {movie.trailerUrl && (
                <button
                  onClick={() => setActiveTrailerUrl(movie.trailerUrl)}
                  className="px-4 py-3 bg-black hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all"
                >
                  <Film className="w-4 h-4 text-white/50" />
                  <span>Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`p-3 border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-black hover:bg-white/10 text-white border-white/20'
                }`}
                title={isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black' : ''}`} />
              </button>

              <button
                onClick={handleShareClick}
                className="p-3 bg-black hover:bg-white/10 text-white border border-white/20 relative"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                {copiedShare && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-black shadow">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto uppercase text-xs font-bold tracking-widest">
        <button
          onClick={() => setActiveTab('watch')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'watch'
              ? 'border-amber-500 text-amber-500 bg-white/5 font-black'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Online Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('download')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'download'
              ? 'border-amber-500 text-amber-500 bg-white/5 font-black'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Download Links</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-500 bg-white/5 font-black'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Storyline & Cast</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-amber-500 text-amber-500 bg-white/5 font-black'
              : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews ({movieReviews.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'watch' && (
          <VideoPlayer movie={movie} />
        )}

        {activeTab === 'download' && (
          <DownloadSection movie={movie} />
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Storyline */}
            <div className="md:col-span-2 space-y-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-xl font-bold text-white font-serif">Storyline / Synopsis</h3>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {movie.synopsis}
              </p>

              <div className="pt-4 border-t border-zinc-800 space-y-2 text-sm">
                <div>
                  <span className="text-zinc-500 font-medium">Director: </span>
                  <span className="text-white font-semibold">{movie.director || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">Starring Cast: </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {movie.cast.map((actor) => (
                      <span key={actor} className="px-3 py-1 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 text-xs font-medium">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Specs Side Panel */}
            <div className="space-y-4 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white font-serif">Movie Information</h3>
              <div className="space-y-3 text-xs font-mono text-zinc-300">
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Audio/Language</span>
                  <span className="text-white">English / Sinhala</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Subtitles</span>
                  <span className="text-amber-400 font-bold">
                    {movie.hasSinhalaSub ? 'Sinhala (.srt)' : 'English'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Video Quality</span>
                  <span className="text-white">{movie.quality}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Release Year</span>
                  <span className="text-white">{movie.releaseYear}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800">
                  <span className="text-zinc-500">Rating</span>
                  <span className="text-amber-400">{movie.rating} / 10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-lg font-bold text-white font-serif">Leave a Review or Comment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Kasun Silva"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-zinc-950 text-white text-sm rounded-xl px-4 py-2 border border-zinc-800 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5/5 Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ 4/5 Good Quality</option>
                    <option value={3}>⭐⭐⭐ 3/5 Average</option>
                    <option value={2}>⭐⭐ 2/5 Needs Improvement</option>
                    <option value={1}>⭐ 1/5 Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Comment</label>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts about this movie, subtitles, or streaming speed..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-zinc-950 text-white text-sm rounded-xl p-4 border border-zinc-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Review</span>
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {movieReviews.length > 0 ? (
                movieReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.userName}</span>
                      <span className="text-zinc-500 font-mono">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p className="text-xs text-zinc-300 pt-1">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No reviews yet. Be the first to leave a comment!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Movies Section */}
      {relatedMovies.length > 0 && (
        <div className="pt-8 border-t border-zinc-800 space-y-4">
          <h3 className="text-xl font-black text-white font-serif">You Might Also Like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {relatedMovies.map((rMovie) => (
              <MovieCard
                key={rMovie.id}
                movie={rMovie}
                onWatchMovie={onSelectMovie}
                onDownloadClick={onSelectMovie}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
