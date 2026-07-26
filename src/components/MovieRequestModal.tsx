import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Send, PlusCircle, MessageCircle, Sparkles } from 'lucide-react';

export const MovieRequestModal: React.FC = () => {
  const { isRequestOpen, setIsRequestOpen, addMovieRequest } = useMovie();

  const [movieTitle, setMovieTitle] = useState('');
  const [category, setCategory] = useState('Sinhala Dubbed');
  const [requestedBy, setRequestedBy] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isRequestOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    addMovieRequest({
      movieTitle: movieTitle.trim(),
      category,
      requestedBy: requestedBy.trim() || 'CINEWORLD Fan',
      whatsappNumber: whatsappNumber.trim() || 'N/A'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMovieTitle('');
      setIsRequestOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 space-y-5 text-white shadow-2xl relative">
        <button
          onClick={() => setIsRequestOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg bg-zinc-900 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500 font-brand">
            <PlusCircle className="w-5 h-5" />
            <h2 className="text-lg font-black uppercase tracking-wider">Request Movie or Cartoon</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Submit your request directly to the CINEWORLD Admin Dashboard
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-mono text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <p className="font-black text-sm uppercase">Request Received!</p>
            <p className="text-zinc-300">
              Your movie request has been logged into the Admin Panel. Our team will review and upload it soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-mono uppercase text-[11px] mb-1">
                Movie / Cartoon Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                required
                placeholder="e.g. Ben 10 Omniverse, Inside Out 2..."
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-mono uppercase text-[11px] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
              >
                <option value="Sinhala Dubbed">Sinhala Dubbed Cartoon (සිංහල හඩකැවූ)</option>
                <option value="Sinhala Subbed">Sinhala Subtitled Movie (සිංහල උපසිරැසි)</option>
                <option value="Sinhala Movie">Sinhala Movie (සිංහල චිත්‍රපට)</option>
                <option value="Hollywood">Hollywood Movie</option>
                <option value="Bollywood">Bollywood Movie</option>
                <option value="Tamil / South">Tamil / South Movie</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-mono uppercase text-[11px] mb-1">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Your Name (e.g. Kasun)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-mono uppercase text-[11px] mb-1">
                Your Phone / WhatsApp Number (Optional)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="07X XXX XXXX"
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request to Admin</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

