import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Send, Sparkles, PlusCircle, CheckCircle } from 'lucide-react';

export const MovieRequestModal: React.FC = () => {
  const { isRequestModalOpen, setIsRequestModalOpen, submitMovieRequest } = useMovie();

  const [movieName, setMovieName] = useState('');
  const [language, setLanguage] = useState('Sinhala Subtitles');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName.trim()) return;
    submitMovieRequest(movieName, language, notes, email);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMovieName('');
      setNotes('');
      setEmail('');
      setIsRequestModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/10 rounded-none w-full max-w-lg p-6 shadow-2xl relative space-y-6">
        
        <button
          onClick={() => setIsRequestModalOpen(false)}
          className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-amber-500/50 bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase font-editorial italic">Request Film Addition</h2>
            <p className="text-xs text-white/50 uppercase tracking-widest">Submit request to the Cineworld archive team</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-white uppercase font-editorial italic">Request Dispatched</h3>
            <p className="text-xs text-white/60 uppercase tracking-wider">
              Your movie request has been transmitted to the admin panel.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Movie / Series Name *</label>
              <input
                type="text"
                placeholder="e.g. Deadpool & Wolverine (2024)"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                required
                className="w-full bg-black text-white text-sm px-4 py-2.5 border border-white/20 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Preferred Language / Audio</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-black text-white text-sm px-4 py-2.5 border border-white/20 focus:outline-none"
              >
                <option value="Sinhala Subtitles">Sinhala Subtitles (සිංහල උපසිරැසි)</option>
                <option value="Sinhala Dubbed">Sinhala Dubbed (සිංහල හඬකැවූ)</option>
                <option value="English Audio">English Audio</option>
                <option value="Tamil Audio">Tamil Audio</option>
                <option value="Hindi Audio">Hindi Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Your Email (optional)</label>
              <input
                type="email"
                placeholder="Receive notification when uploaded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black text-white text-sm px-4 py-2.5 border border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Additional Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Please upload 1080p full HD if possible..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-black text-white text-xs p-3 border border-white/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Request to Admin</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
