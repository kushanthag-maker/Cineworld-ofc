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

  const processRequest = (sendToWhatsApp: boolean) => {
    if (!movieTitle.trim()) return;

    addMovieRequest({
      movieTitle: movieTitle.trim(),
      category,
      requestedBy: requestedBy.trim() || 'CINEWORLD Fan',
      whatsappNumber: whatsappNumber.trim() || '0769904294'
    });

    if (sendToWhatsApp) {
      const waMessage = `👋 Hi CINEWORLD LK Admin!\n\nI would like to request a Movie / Cartoon:\n🎬 Title: ${movieTitle.trim()}\n🏷️ Category: ${category}\n👤 Requested By: ${requestedBy.trim() || 'CINEWORLD Fan'}\n📱 Contact: ${whatsappNumber.trim() || 'N/A'}\n\nPlease add this movie/cartoon to CINEWORLD LK! Thank you!`;
      const targetNumber = '94769904294';
      const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(waMessage)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMovieTitle('');
      setIsRequestOpen(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processRequest(true); // Default send via WhatsApp
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
          <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sends directly to CINEWORLD Admin WhatsApp: <strong className="text-emerald-400">0769904294</strong></span>
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-mono text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <p className="font-black text-sm uppercase">Request Sent Successfully!</p>
            <p className="text-zinc-300">
              Your movie request has been logged and sent to WhatsApp Admin (<strong>0769904294</strong>).
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
                placeholder="e.g. Ben 10 Omniverse, Kung Fu Panda 4..."
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
                Your WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="07X XXX XXXX"
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-amber-500 font-sans"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>Send Request via WhatsApp (0769904294)</span>
              </button>

              <button
                type="button"
                onClick={() => processRequest(false)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-white/10 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-500" />
                <span>Submit to Website Only</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

