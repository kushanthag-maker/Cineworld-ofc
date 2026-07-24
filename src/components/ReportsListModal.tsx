import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Flag, X, CheckCircle, Trash2, Play, Search, AlertCircle, ShieldAlert } from 'lucide-react';

export const ReportsListModal: React.FC = () => {
  const {
    isReportsListOpen,
    setIsReportsListOpen,
    reports,
    deleteReport,
    resolveReport,
    movies,
    setActiveMovie
  } = useMovie();

  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isReportsListOpen) return null;

  const filteredReports = reports.filter((rep) => {
    const matchesTab = activeTab === 'All' || rep.status === activeTab;
    const matchesSearch =
      rep.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.description && rep.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = reports.filter((r) => r.status === 'Pending').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-amber-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl relative">
              <Flag className="w-6 h-6 text-amber-500" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">User Reported Issues</h2>
                <span className="bg-amber-500/10 text-amber-400 font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                  {reports.length} Total
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                View & resolve broken links or streaming issues reported by visitors
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportsListOpen(false)}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/20">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['All', 'Pending', 'Resolved'] as const).map((tab) => {
              const count = tab === 'All' ? reports.length : reports.filter((r) => r.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${activeTab === tab ? 'bg-black/20 text-black font-black' : 'bg-zinc-800 text-zinc-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs pl-8 pr-3 py-2 rounded-xl outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Reports List Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-zinc-300 uppercase tracking-wider">No Reports Found</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                {searchTerm
                  ? 'No user reports match your current search criteria.'
                  : 'Great news! There are no pending broken link reports submitted by users.'}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const targetMovie = movies.find((m) => m.id === report.movieId);
              const isResolved = report.status === 'Resolved';

              return (
                <div
                  key={report.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isResolved
                      ? 'bg-zinc-900/30 border-zinc-800/80 opacity-75'
                      : 'bg-zinc-900/80 border-amber-500/20 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm hover:text-amber-400 transition-colors">
                          {report.movieTitle}
                        </span>
                        
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                            report.issueType === 'Stream Not Working'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {report.issueType}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                            isResolved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500 text-black font-black'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      {report.description && (
                        <p className="text-xs text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono">
                          "{report.description}"
                        </p>
                      )}

                      <p className="text-[10px] text-zinc-500 font-mono">
                        Reported on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {targetMovie && (
                        <button
                          onClick={() => {
                            setActiveMovie(targetMovie);
                            setIsReportsListOpen(false);
                          }}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="View Movie Player"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>View Movie</span>
                        </button>
                      )}

                      {!isResolved && (
                        <button
                          onClick={() => resolveReport(report.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Mark as Resolved"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Resolve</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteReport(report.id)}
                        className="p-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-300 rounded-xl transition-colors cursor-pointer"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Reports update live when users submit link issues.</span>
          </div>

          <button
            onClick={() => setIsReportsListOpen(false)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
