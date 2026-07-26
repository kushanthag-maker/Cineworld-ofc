import React, { useState, useEffect } from 'react';
import { useMovie } from '../context/MovieContext';
import { MessageSquare, Send, Star, ThumbsUp, UserCheck, Sparkles } from 'lucide-react';

interface CommentSectionProps {
  movieId: string;
  movieTitle: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ movieId, movieTitle }) => {
  const { comments, fetchComments, addComment, likeComment } = useMovie();

  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    fetchComments(movieId);
  }, [movieId]);

  // Filter comments for this movie or general comments
  const movieComments = comments.filter((c) => c.movieId === movieId || !c.movieId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const success = await addComment(
      movieId,
      userName.trim() || 'CINEWORLD Fan',
      commentText.trim(),
      rating
    );

    setIsSubmitting(false);
    if (success) {
      setCommentText('');
      setSubmittedMessage(true);
      setTimeout(() => setSubmittedMessage(false), 3000);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-[#08080a] border border-white/10 rounded-xl p-5 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-brand uppercase text-white tracking-wider flex items-center gap-2">
              <span>User Reviews & Comments</span>
              <span className="text-xs bg-amber-500 text-black px-2 py-0.5 font-mono font-bold rounded-full">
                {movieComments.length}
              </span>
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Share your thoughts, episode requests & reviews for {movieTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-1">
              Your Name / Alias
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Ruwan Silva"
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-3 py-2 text-xs rounded-lg outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-1">
              Your Star Rating
            </label>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-amber-400 ml-1">
                {rating}.0
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-zinc-400 mb-1">
            Write your comment / feedback (Sinhala or English)
          </label>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Meka Sinhala dubbed audio maru! Next episode eka ikmanatama danna admin..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 text-xs rounded-lg outline-none focus:border-amber-500 font-mono resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase">
            • Respectful community comments only
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>

        {submittedMessage && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded text-center">
            Comment posted successfully! Thank you for your feedback.
          </div>
        )}
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {movieComments.length > 0 ? (
          movieComments.map((c) => (
            <div
              key={c.id}
              className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-2 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      c.avatarBg || 'bg-amber-600'
                    } text-white font-black text-xs flex items-center justify-center uppercase shadow-md`}
                  >
                    {c.userName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{c.userName}</span>
                      <span className="text-[10px] text-amber-500/80 font-mono flex items-center gap-0.5">
                        <UserCheck className="w-3 h-3" /> Verified Fan
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">{formatDate(c.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-mono font-bold text-amber-400">{c.rating || 5}.0</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-mono leading-relaxed pl-10">
                {c.comment}
              </p>

              <div className="flex items-center justify-end pt-1">
                <button
                  onClick={() => likeComment(c.id)}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({c.likes || 0})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-zinc-950 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-xs font-mono text-zinc-500 uppercase">
              No comments yet for this cartoon. Be the first to post a review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
