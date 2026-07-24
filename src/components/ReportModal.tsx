import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { AlertTriangle, X, Send, ShieldAlert } from 'lucide-react';
import { LinkReport } from '../types';

export const ReportModal: React.FC = () => {
  const { isReportOpen, setIsReportOpen, reportMovieTarget, submitReport } = useMovie();
  const [issueType, setIssueType] = useState<LinkReport['issueType']>('Stream Not Working');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReportOpen || !reportMovieTarget) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await submitReport(reportMovieTarget.id, reportMovieTarget.title, issueType, description);
    setIsSubmitting(false);
    if (success) {
      setDescription('');
      setIsReportOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={() => setIsReportOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Report Broken Link / Stream</h2>
            <p className="text-xs text-amber-400/80 line-clamp-1 font-mono">{reportMovieTarget.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Select Issue Category
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl p-3 outline-none focus:border-amber-500"
            >
              <option value="Stream Not Working">Streaming / Online Player Error</option>
              <option value="Download Link Broken">Direct Download Link Expired or Broken</option>
              <option value="Wrong Episode / Audio">Wrong Episode, Audio Mismatch or Missing Subtitle</option>
              <option value="Other Issue">Other Technical Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what went wrong (e.g., Episode 3 player hangs at 0:00)..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded-xl p-3 outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="p-3 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center gap-2.5 text-zinc-400 text-[11px]">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Reports are sent instantly to CINEWORLD Admins for fast replacement.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsReportOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
