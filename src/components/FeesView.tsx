import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Copy, Check, QrCode, ShieldCheck, Search, Filter, ArrowUpRight, Edit2, Plus, Settings, X, Save } from 'lucide-react';
import { Team, PaymentConfig } from '../types';

interface FeesViewProps {
  teams: Team[];
  paymentConfig: PaymentConfig;
  isOrganizer?: boolean;
  onUpdateTeamFee?: (teamId: string, amount: number, details: string) => void;
  onUpdatePaymentConfig?: (config: PaymentConfig) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  teams,
  paymentConfig,
  isOrganizer,
  onUpdateTeamFee,
  onUpdatePaymentConfig
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'cleared'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingTeamFee, setEditingTeamFee] = useState<Team | null>(null);
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [feeDetails, setFeeDetails] = useState<string>('');

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configUpiId, setConfigUpiId] = useState(paymentConfig.upiId);
  const [configPayee, setConfigPayee] = useState(paymentConfig.payeeName);
  const [configFeePerTeam, setConfigFeePerTeam] = useState(paymentConfig.feePerTeam || 1600);

  const totalFeePerTeam = paymentConfig.feePerTeam || 1600;
  const totalTarget = teams.length * totalFeePerTeam;
  const totalCollected = teams.reduce((acc, t) => acc + (t.feesPaid || 0), 0);
  const totalPending = totalTarget - totalCollected;
  const percentCollected = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(paymentConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const upiUri = `upi://pay?pa=${paymentConfig.upiId}&pn=${encodeURIComponent(paymentConfig.payeeName)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}&margin=10`;

  const filteredTeams = teams.filter(team => {
    const paid = team.feesPaid || 0;
    const isCleared = paid >= totalFeePerTeam;

    if (filterMode === 'cleared' && !isCleared) return false;
    if (filterMode === 'pending' && isCleared) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return team.name.toLowerCase().includes(q) || team.captain.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenEditFee = (team: Team) => {
    setEditingTeamFee(team);
    setFeeAmount(team.feesPaid || 0);
    setFeeDetails(team.paymentDetails || 'Pending');
  };

  const handleSaveTeamFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeamFee || !onUpdateTeamFee) return;
    onUpdateTeamFee(editingTeamFee.id, Number(feeAmount), feeDetails);
    setEditingTeamFee(null);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdatePaymentConfig) return;
    onUpdatePaymentConfig({
      upiId: configUpiId,
      payeeName: configPayee,
      feePerTeam: Number(configFeePerTeam)
    });
    setIsConfigModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Official Financial Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide font-display text-white">
            Team Fee Clearance &amp; Payment Tracker
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Standard registration fee: ₹{totalFeePerTeam.toLocaleString()} per team. Transparent ledger showing paid and pending clearance balances for all {teams.length} participating squads.
          </p>
        </div>

        {isOrganizer && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Payment Settings</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Target */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
            Target Collection ({teams.length} Teams)
          </div>
          <div className="text-3xl font-extrabold text-white font-display mt-1">
            ₹{totalTarget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            ₹{totalFeePerTeam.toLocaleString()} per registered squad
          </div>
        </div>

        {/* Total Collected */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
            Total Collected ({percentCollected}%)
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-display mt-1">
            ₹{totalCollected.toLocaleString()}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, percentCollected)}%` }}
            />
          </div>
        </div>

        {/* Total Pending */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 relative overflow-hidden">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
            Remaining Clearance Balance
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-display mt-1">
            ₹{totalPending.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            {teams.filter(t => (t.feesPaid || 0) < totalFeePerTeam).length} squads pending clearance
          </div>
        </div>
      </div>

      {/* Official UPI Gateway & QR Scanner Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-display uppercase tracking-wider">
              Official Payment Account
            </span>
            <span className="text-xs text-slate-400 font-mono">PhonePe / Google Pay / Paytm</span>
          </div>

          <h3 className="text-xl font-bold text-white font-display uppercase">
            Tournament Treasury QR &amp; UPI
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Captains can pay registration fees via any UPI application or in cash to the tournament organizers.
            Always confirm transaction screenshot to receive immediate clearance on this portal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 font-display">
                  Official UPI VPA:
                </div>
                <div className="font-mono text-sm font-bold text-amber-300">
                  {paymentConfig.upiId}
                </div>
              </div>

              <button
                onClick={handleCopyUpi}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-500 font-display">
                Payee Account Holder:
              </div>
              <div className="text-sm font-bold text-slate-200">
                {paymentConfig.payeeName}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="p-4 rounded-2xl bg-white flex flex-col items-center gap-2 shadow-2xl border-4 border-amber-400">
          <img
            src={qrUrl}
            alt="Tournament UPI QR Code"
            className="w-36 h-36 rounded-lg"
          />
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-900">
            Scan to Pay via UPI
          </span>
        </div>
      </div>

      {/* Team Clearance Table / Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold uppercase tracking-wide font-display text-white">
              Squad Clearance Records
            </h3>
            <span className="text-xs text-slate-500 font-mono">({filteredTeams.length} Shown)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({teams.length})
              </button>
              <button
                onClick={() => setFilterMode('cleared')}
                className={`px-3 py-1 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  filterMode === 'cleared'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cleared
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  filterMode === 'pending'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pending
              </button>
            </div>

            {/* Search */}
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search squad..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map(team => {
            const paid = team.feesPaid || 0;
            const isCleared = paid >= totalFeePerTeam;
            const remaining = Math.max(0, totalFeePerTeam - paid);

            return (
              <div
                key={team.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isCleared
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : paid > 0
                    ? 'bg-slate-900/90 border-amber-500/40'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base font-display uppercase tracking-wide">
                        {team.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Captain: <strong className="text-slate-200">{team.captain}</strong>
                      </p>
                    </div>

                    {isCleared ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-display uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold font-display uppercase">
                        <AlertCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>

                  {/* Payment numbers */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-display block">
                        Amount Paid:
                      </span>
                      <span className={`font-mono text-base font-extrabold ${paid > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        ₹{paid.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 font-display block">
                        Balance Due:
                      </span>
                      <span className={`font-mono text-base font-extrabold ${remaining > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                        ₹{remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details / Receipt Note */}
                  <div className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Transaction Details: </span>
                    <span>{team.paymentDetails || 'Pending payment verification'}</span>
                  </div>
                </div>

                {/* Organizer Edit Button */}
                {isOrganizer && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                    <button
                      onClick={() => handleOpenEditFee(team)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Update Fee Record</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Fee Modal */}
      {editingTeamFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingTeamFee(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Organizer Fee Management</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-2">
              {editingTeamFee.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Captain: {editingTeamFee.captain} · Total required: ₹{totalFeePerTeam.toLocaleString()}
            </p>

            <form onSubmit={handleSaveTeamFee} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Total Amount Paid (₹):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={feeAmount}
                    onChange={e => setFeeAmount(Number(e.target.value))}
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFeeAmount(totalFeePerTeam)}
                    className="px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold uppercase text-[11px] font-display border border-emerald-500/30 whitespace-nowrap"
                  >
                    Full Clearance (₹{totalFeePerTeam})
                  </button>
                </div>
              </div>

              {/* Quick addition pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[10px]">Quick:</span>
                {[100, 400, 500, 600, 650, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFeeAmount(val)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Payment Details / Receipt Log:
                </label>
                <input
                  type="text"
                  value={feeDetails}
                  onChange={e => setFeeDetails(e.target.value)}
                  placeholder="e.g. ₹600 (UPI) on 04/09/2026"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTeamFee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Settings className="w-4 h-4" />
              <span>Organizer Financial Settings</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Configure Tournament UPI Gateway
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Official UPI ID:
                </label>
                <input
                  type="text"
                  value={configUpiId}
                  onChange={e => setConfigUpiId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Payee Account Name:
                </label>
                <input
                  type="text"
                  value={configPayee}
                  onChange={e => setConfigPayee(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Fee Required Per Team (₹):
                </label>
                <input
                  type="number"
                  value={configFeePerTeam}
                  onChange={e => setConfigFeePerTeam(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
