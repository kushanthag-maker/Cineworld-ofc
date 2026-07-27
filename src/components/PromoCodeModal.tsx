import React, { useState } from 'react';
import { useMovie } from '../context/MovieContext';
import { Crown, Sparkles, X, CheckCircle2, AlertCircle, MessageCircle, Key, CreditCard, Send, ShieldCheck, Check } from 'lucide-react';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoCodeModal: React.FC<PromoCodeModalProps> = ({ isOpen, onClose }) => {
  const { userPremium, redeemPromoCode, submitVipRequest, showToast } = useMovie();
  
  const [activeTab, setActiveTab] = useState<'redeem' | 'data_card'>('redeem');

  // Redeem Code State
  const [code, setCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data Card Request State
  const [dcName, setDcName] = useState('');
  const [dcWhatsapp, setDcWhatsapp] = useState('');
  const [dcCardNumber, setDcCardNumber] = useState('');
  const [dcDays, setDcDays] = useState<number>(30);
  const [dcIsSubmitting, setDcIsSubmitting] = useState(false);
  const [dcSubmittedSuccess, setDcSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('කරුණාකර ප්‍රෝමෝ කෝඩ් එක ඇතුළත් කරන්න (Please enter a promo code).');
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await redeemPromoCode(code.trim(), userName.trim());
    setIsLoading(false);

    if (res.success) {
      setCode('');
      onClose();
    } else {
      setError(res.message);
    }
  };

  const handleDataCardRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dcCardNumber.trim()) {
      showToast('කරුණාකර ඩේටා කාඩ් අංකය (PIN / Serial) ඇතුළත් කරන්න.', 'error');
      return;
    }

    setDcIsSubmitting(true);
    const res = await submitVipRequest(dcName.trim(), dcWhatsapp.trim(), dcCardNumber.trim(), dcDays);
    setDcIsSubmitting(false);

    if (res.success) {
      setDcSubmittedSuccess(true);
      setTimeout(() => {
        setDcSubmittedSuccess(false);
        setDcCardNumber('');
        setActiveTab('redeem');
      }, 4000);
    }
  };

  const handleBuyWhatsApp = () => {
    if (!dcCardNumber.trim()) {
      showToast('කරුණාකර ඩේටා කාඩ් අංකය (PIN / Serial) ඇතුළත් කරන්න.', 'error');
      return;
    }

    const msg = `Hello CINEWORLD Admin! 🍿
I would like to purchase VIP Membership using Data Card.

👤 Name: ${dcName.trim() || 'CINEWORLD User'}
📱 WhatsApp: ${dcWhatsapp.trim() || 'Not provided'}
💳 Data Card PIN/Serial: ${dcCardNumber.trim()}
⭐ Package: ${dcDays} Days VIP Access

Please send me my VIP Promo Code! Thank you.`;

    const waUrl = `https://wa.me/94701234567?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Also auto submit online request for admin log
    submitVipRequest(dcName.trim(), dcWhatsapp.trim(), dcCardNumber.trim(), dcDays);
  };

  const daysLeft = userPremium.daysRemaining;
  const expiryDateFormatted = userPremium.expiresAt 
    ? new Date(userPremium.expiresAt).toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl mx-auto flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/30 border border-amber-300">
            <Crown className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest font-brand">
            CINE<span className="text-amber-400">WORLD</span> VIP PREMIUM
          </h2>
          <p className="text-xs text-amber-400/90 font-mono flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock All Exclusive Movies & Direct High-Speed Downloads</span>
          </p>
        </div>

        {/* Current VIP Status Card if active */}
        {userPremium.isPremium ? (
          <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-600/20 border border-amber-500/50 rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>You have active VIP Membership!</span>
            </div>
            <p className="text-xs text-zinc-300">
              Valid until: <strong className="text-amber-300">{expiryDateFormatted}</strong> ({daysLeft} days remaining)
            </p>
            <p className="text-[10px] text-zinc-400 font-mono mt-1">
              Redeem additional promo codes below to extend your membership!
            </p>
          </div>
        ) : null}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('redeem')}
            className={`py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'redeem'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Redeem Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data_card')}
            className={`py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'data_card'
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Buy via Data Card</span>
          </button>
        </div>

        {/* TAB 1: REDEEM PROMO CODE */}
        {activeTab === 'redeem' && (
          <form onSubmit={handleRedeemSubmit} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5 font-mono">
                <Key className="w-4 h-4" />
                <span>Promo Code (ප්‍රෝමෝ කෝඩ් එක)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="e.g. CINE-30D-XXXX or VIP7DAYS"
                className="w-full bg-zinc-900 border border-amber-500/30 text-white p-4 rounded-2xl text-center text-lg font-mono font-bold tracking-widest focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5 font-mono">
                Your Name (ඔබේ නම)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Kasun Fernando"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-xs font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying Code...</span>
              ) : (
                <>
                  <Crown className="w-5 h-5 stroke-[2.5]" />
                  <span>Redeem & Activate VIP Membership</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: BUY VIA DATA CARD / REQUEST ACCESS */}
        {activeTab === 'data_card' && (
          <form onSubmit={handleDataCardRequest} className="space-y-4 animate-fadeIn">
            {dcSubmittedSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-brand">
                  VIP Request Submitted!
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  ඔබේ Data Card VIP ඉල්ලීම සාර්ථකව Admin Panel වෙත යවන ලදී. Admin විසින් ඩේටා කාඩ්පත පරීක්ෂා කර සෘජුවම access ලබාදෙනු ඇත.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    1. Select VIP Duration / Package (පැකේජය තෝරන්න)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { days: 7, label: '7 Days VIP', card: 'Rs. 200' },
                      { days: 30, label: '30 Days VIP', card: 'Rs. 500' },
                      { days: 365, label: '365 Days VIP', card: 'Rs. 2500' }
                    ].map((pkg) => (
                      <button
                        key={pkg.days}
                        type="button"
                        onClick={() => setDcDays(pkg.days)}
                        className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                          dcDays === pkg.days
                            ? 'bg-amber-500 text-black border-amber-300 font-black shadow-md shadow-amber-500/20'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-amber-500/40'
                        }`}
                      >
                        <span className="block text-xs font-black uppercase font-mono">{pkg.label}</span>
                        <span className="block text-[10px] opacity-80 font-mono">Card: {pkg.card}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 font-mono">
                    2. Data Card PIN / Serial No (ඩේටා කාඩ් අංකය) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dcCardNumber}
                    onChange={(e) => setDcCardNumber(e.target.value)}
                    placeholder="Enter Dialog / Mobitel / Hutch Data Card PIN"
                    className="w-full bg-zinc-900 border border-amber-500/40 text-white p-3.5 rounded-xl text-sm font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    💡 Dialog, Mobitel, Hutch, Airtel ඩේටා කාඩ් අංකය ඇතුළත් කරන්න.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 font-mono">
                      Your Name (ඔබේ නම)
                    </label>
                    <input
                      type="text"
                      value={dcName}
                      onChange={(e) => setDcName(e.target.value)}
                      placeholder="e.g. Nimal Perera"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs font-mono focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 font-mono">
                      WhatsApp No (වට්ස්ඇප්)
                    </label>
                    <input
                      type="text"
                      value={dcWhatsapp}
                      onChange={(e) => setDcWhatsapp(e.target.value)}
                      placeholder="e.g. 0771234567"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-2.5 rounded-xl text-xs font-mono focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Two Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={dcIsSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>Submit Request Online</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyWhatsApp}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600 stroke-[2]" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Help & Contact */}
        <div className="pt-2 border-t border-zinc-800 text-center space-y-2">
          <p className="text-xs text-zinc-400">
            VIP පිළිබඳව ඕනෑම ගැටලුවක් සඳහා Admin සම්බන්ධ කරගන්න:
          </p>
          <a
            href="https://wa.me/94701234567?text=Hello%20CINEWORLD%20Admin,%20I%20have%20a%20question%20about%20VIP%20Access"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold font-mono transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Contact Admin on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
