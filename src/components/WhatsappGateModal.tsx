import React, { useState } from 'react';
import { MessageCircle, CheckCircle, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useMovie } from '../context/MovieContext';

export const WhatsappGateModal: React.FC = () => {
  const { hasFollowedWhatsapp, setHasFollowedWhatsapp } = useMovie();
  const [clickedFollow, setClickedFollow] = useState(false);

  if (hasFollowedWhatsapp) return null;

  const channelUrl = 'https://whatsapp.com/channel/0029Vb8dDtT35fLlrLPylH1I';

  const handleFollowClick = () => {
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
    setClickedFollow(true);
  };

  const handleConfirm = () => {
    setHasFollowedWhatsapp(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-amber-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-amber-500/10 relative text-white animate-fadeIn">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 p-1" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Logo & Icon */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <MessageCircle className="w-9 h-9 fill-emerald-500/20" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-1 border-2 border-black">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 border border-amber-500/30 px-3 py-1 bg-amber-500/10 rounded-full inline-block">
                Mandatory Verification • අනිවාර්යයි
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-editorial italic text-white pt-1">
                WhatsApp Channel Access
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 text-center">
            <p className="text-sm font-bold text-white">
              CINEWORLD චිත්‍රපට හා උපසිරැසි ලබා ගැනීමට පෙර අපගේ නිල WhatsApp Channel එක Follow කිරීම අනිවාර්ය වේ!
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              Please follow our official WhatsApp channel to unlock full access to Sinhala Subtitled & Dubbed direct movie downloads.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 text-xs text-white/80">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Instant alerts for new Sinhala Subbed 4K/1080p movie releases</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Direct direct-download MP4 server mirrors & request updates</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleFollowClick}
              className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs md:text-sm tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>1. Follow WhatsApp Channel</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </button>

            <button
              onClick={handleConfirm}
              disabled={!clickedFollow}
              className={`w-full py-3.5 px-5 font-black uppercase text-xs tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${
                clickedFollow
                  ? 'bg-amber-500 hover:bg-white text-black cursor-pointer shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {clickedFollow ? '2. I Have Followed (ඇතුළු වන්න)' : 'Click Button 1 First to Unlock'}
              </span>
            </button>
          </div>

          <p className="text-[10px] text-center text-white/40 uppercase tracking-widest">
            Once followed, you won't be asked again on this device.
          </p>
        </div>
      </div>
    </div>
  );
};
