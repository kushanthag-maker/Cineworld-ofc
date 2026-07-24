import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { X, Send, PlusCircle } from 'lucide-react';

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
      movieTitle,
      category,
      requestedBy: requestedBy || 'Anonymous Fan',
      whatsappNumber
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMovieTitle('');
      setIsRequestOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md p-6 space-y-4 text-white shadow-2xl relative">
        <button
          onClick={() => setIsRequestOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-500 font-brand">
          <PlusCircle className="w-5 h-5" />
          <h2 className="text-lg font-black uppercase tracking-wider">Request Movie or Cartoon</h2>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center space-y-1">
            <p className="font-bold uppercase">Request Received!</p>
            <p className="text-[10px]">Our team will source and publish your cartoon/movie shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 mb-1 uppercase font-mono">Movie / Cartoon Title</label>
              <input
                type="text"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                required
                placeholder="e.g. Ben 10 Omniverse Season 1"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1 uppercase font-mono">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 outline-none focus:border-amber-500"
              >
                <option value="Sinhala Dubbed">Sinhala Dubbed Cartoon</option>
                <option value="Sinhala Subbed">Sinhala Subtitled Movie</option>
                <option value="Hollywood">Hollywood</option>
                <option value="Bollywood">Bollywood</option>
                <option value="Tamil / South">Tamil / South</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-1 uppercase font-mono">Your Name / Alias</label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Name"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-white/70 mb-1 uppercase font-mono">WhatsApp Number (Optional)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+94 7X XXX XXXX"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-white text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
