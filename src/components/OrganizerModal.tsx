import React, { useState } from 'react';
import { Lock, X, Check, AlertTriangle, Plus, RefreshCw, Save, Trophy, Users, CreditCard, Award, Scale, Bell, CheckCircle2, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { Match, Team, MatchStatus, TournamentStatus } from '../types';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOrganizer: boolean;
  onAuthenticate: (pin: string) => boolean;
  onExitOrganizer: () => void;
  matches: Match[];
  knockouts?: Match[];
  teams: Team[];
  feePerTeam?: number;
  tournamentStatus?: TournamentStatus;
  onToggleTournamentStatus?: () => void;
  onUpdateMatchResult: (matchId: string, scoreA: number, scoreB: number, notes?: string) => void;
  onUpdateTeamFee: (teamId: string, newTotalPaid: number, paymentDetails: string) => void;
  onResetData: () => void;
  onAddMatch?: (match: Match) => void;
  onUpdateMatch?: (updatedMatch: Match) => void;
  onAddTeam?: (team: Team) => void;
  onAdjustPoints?: (teamId: string, adjustment: number, note: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  isOrganizer,
  onAuthenticate,
  onExitOrganizer,
  matches,
  knockouts = [],
  teams,
  feePerTeam = 1600,
  tournamentStatus = 'active',
  onToggleTournamentStatus,
  onUpdateMatchResult,
  onUpdateTeamFee,
  onResetData,
  onAddMatch,
  onUpdateMatch,
  onAddTeam,
  onAdjustPoints,
  onNavigateTab
}) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'quickstats' | 'scores' | 'fees' | 'fixtures' | 'points'>('quickstats');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Result update state
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [matchNotes, setMatchNotes] = useState('');

  // Fee update state
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [addFeeAmount, setAddFeeAmount] = useState<number>(0);
  const [paymentDetails, setPaymentDetails] = useState('');

  // Fixture Management State
  const [fixtureSubTab, setFixtureSubTab] = useState<'assign' | 'create'>('assign');
  // Initialize to Match 11 if available (open day slot) or first match
  const defaultEditMatch = matches.find(m => m.id === 'M-11') || matches.find(m => !m.teamAId || !m.teamBId) || matches[0];
  const [editMatchId, setEditMatchId] = useState<string>(defaultEditMatch?.id || '');
  const [editTeamA, setEditTeamA] = useState<string>(defaultEditMatch?.teamAId || '');
  const [editTeamB, setEditTeamB] = useState<string>(defaultEditMatch?.teamBId || '');
  const [editMatchDate, setEditMatchDate] = useState<string>(defaultEditMatch?.date || '');
  const [editMatchTime, setEditMatchTime] = useState<string>(defaultEditMatch?.time || '');
  const [editIsNight, setEditIsNight] = useState<boolean>(Boolean(defaultEditMatch?.isNightSlot));
  const [editMatchNotes, setEditMatchNotes] = useState<string>(defaultEditMatch?.notes || '');

  // Quick Fixture State
  const [newMatchLabel, setNewMatchLabel] = useState('Match 15');
  const [newTeamA, setNewTeamA] = useState(teams[0]?.id || '');
  const [newTeamB, setNewTeamB] = useState(teams[1]?.id || '');
  const [newMatchDate, setNewMatchDate] = useState('Day 8 (Wed, 09 Sept 2026)');
  const [newMatchTime, setNewMatchTime] = useState('5:30 PM (After ASR Prayers)');
  const [newIsNight, setNewIsNight] = useState(false);

  // Quick Points Adjustment State
  const [adjTeamId, setAdjTeamId] = useState(teams[0]?.id || '');
  const [adjAmount, setAdjAmount] = useState<number>(0);
  const [adjNote, setAdjNote] = useState('');

  // Quick Stats Calculations
  const allMatches = [...matches, ...knockouts];
  const totalMatchesCount = allMatches.length;
  const completedMatchesCount = allMatches.filter(m => m.status === 'completed').length;
  const upcomingMatchesCount = allMatches.filter(m => m.status === 'upcoming' || m.status === 'pending').length;
  const liveMatchesCount = allMatches.filter(m => m.status === 'live').length;
  const matchCompletionPct = totalMatchesCount > 0 ? Math.round((completedMatchesCount / totalMatchesCount) * 100) : 0;

  const targetFee = feePerTeam;
  const clearedTeams = teams.filter(t => (t.feesPaid || 0) >= targetFee);
  const pendingTeams = teams.filter(t => (t.feesPaid || 0) < targetFee);
  const pendingPaymentsCount = pendingTeams.length;
  const totalCollectedFees = teams.reduce((acc, t) => acc + (t.feesPaid || 0), 0);
  const totalTargetFees = teams.length * targetFee;
  const totalPendingFees = Math.max(0, totalTargetFees - totalCollectedFees);

  const handleToggleStatus = () => {
    if (onToggleTournamentStatus) {
      onToggleTournamentStatus();
      const nextStatusName = tournamentStatus === 'active' ? 'Finished' : 'Active';
      setStatusFeedback(`Tournament status changed to ${nextStatusName.toUpperCase()}`);
      setTimeout(() => setStatusFeedback(null), 3500);
    }
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAuthenticate(pin);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPin('');
    }
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId) return;
    onUpdateMatchResult(selectedMatchId, Number(scoreA), Number(scoreB), matchNotes);
    alert('Match result successfully saved and points table updated!');
  };

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || addFeeAmount <= 0) return;
    const team = teams.find(t => t.id === selectedTeamId);
    if (!team) return;

    const newTotal = (team.feesPaid || 0) + Number(addFeeAmount);
    onUpdateTeamFee(
      selectedTeamId,
      newTotal,
      paymentDetails || `₹${addFeeAmount} paid on ${new Date().toLocaleDateString('en-GB')}`
    );
    setAddFeeAmount(0);
    setPaymentDetails('');
    alert(`Fee updated for ${team.name}! New Total: ₹${newTotal}`);
  };

  const handleCreateFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddMatch) return;
    const newMatch: Match = {
      id: `M-${Date.now()}`,
      stage: 'league',
      roundLabel: newMatchLabel,
      leagueRound: 2,
      teamAId: newTeamA || null,
      teamBId: newTeamB || null,
      scoreA: null,
      scoreB: null,
      status: 'upcoming',
      date: newMatchDate,
      time: newMatchTime,
      isNightSlot: newIsNight
    };
    onAddMatch(newMatch);
    alert('New fixture created successfully!');
  };

  const handleSelectFixtureToEdit = (id: string) => {
    setEditMatchId(id);
    const m = matches.find(match => match.id === id);
    if (m) {
      setEditTeamA(m.teamAId || '');
      setEditTeamB(m.teamBId || '');
      setEditMatchDate(m.date || '');
      setEditMatchTime(m.time || '');
      setEditIsNight(Boolean(m.isNightSlot));
      setEditMatchNotes(m.notes || '');
    }
  };

  const handleUpdateExistingFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateMatch || !editMatchId) return;
    const existing = matches.find(m => m.id === editMatchId);
    if (!existing) return;

    const updatedMatch: Match = {
      ...existing,
      teamAId: editTeamA || null,
      teamBId: editTeamB || null,
      date: editMatchDate,
      time: editMatchTime,
      isNightSlot: editIsNight,
      notes: editMatchNotes
    };

    onUpdateMatch(updatedMatch);
    alert(`Fixture ${existing.roundLabel || existing.id} successfully updated! Teams and schedule are updated live.`);
  };

  const handleSavePointsAdj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAdjustPoints || !adjTeamId) return;
    onAdjustPoints(adjTeamId, Number(adjAmount), adjNote);
    alert('Points adjustment applied to the standings table!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
          <Lock className="w-4 h-4" />
          <span>Organizer Control Center</span>
        </div>
        <h3 className="text-xl font-extrabold text-white uppercase font-display">
          Tournament Administration
        </h3>

        {!isOrganizer ? (
          /* Authentication Screen */
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <p className="text-xs text-slate-300">
              Enter the authorized Organizer Security PIN to manage matches, standings adjustments, squad players, daily bulletins, and fee clearance.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1.5">
                Organizer Security PIN
              </label>
              <input
                type="password"
                maxLength={12}
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter Security PIN..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-lg tracking-widest text-center focus:outline-none focus:border-amber-500"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> Incorrect Security PIN. Access denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-sm transition-all shadow-md cursor-pointer"
            >
              Authenticate as Organizer
            </button>
          </form>
        ) : (
          /* Organizer Dashboard Controls */
          <div className="mt-6 space-y-5">
            {/* Status bar with quick exit */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Organizer Mode Active across all pages
              </span>
              <button
                onClick={onExitOrganizer}
                className="px-3 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-semibold cursor-pointer"
              >
                Exit Organizer Mode
              </button>
            </div>

            {/* Quick Stats Summary View */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950/90 via-slate-900 to-slate-950 border border-slate-800 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
                    Quick Stats &amp; Tournament Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                      tournamentStatus === 'finished'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        tournamentStatus === 'finished' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                      }`}
                    />
                    {tournamentStatus === 'finished' ? 'Finished' : 'Active'}
                  </span>
                </div>
              </div>

              {statusFeedback && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold">{statusFeedback}</span>
                </div>
              )}

              {/* 3-Metric Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. Total Matches Completed */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Matches Completed
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                      {matchCompletionPct}%
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-white font-display">
                      {completedMatchesCount} <span className="text-sm font-medium text-slate-500">/ {totalMatchesCount}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${matchCompletionPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{upcomingMatchesCount} Upcoming</span>
                      {liveMatchesCount > 0 && (
                        <span className="text-rose-400 font-bold">{liveMatchesCount} Live</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('scores')}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer pt-1 border-t border-slate-900"
                  >
                    Record Scores <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 2. Pending Payments Count */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Pending Payments
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        pendingPaymentsCount > 0
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {clearedTeams.length}/{teams.length} Cleared
                    </span>
                  </div>

                  <div>
                    <div className="text-2xl font-black text-white font-display">
                      {pendingPaymentsCount} <span className="text-sm font-medium text-slate-500">Teams</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {pendingPaymentsCount > 0 ? (
                        <span className="text-amber-400/90">₹{totalPendingFees.toLocaleString()} balance due</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">All squad fees cleared</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      ₹{totalCollectedFees.toLocaleString()} collected of ₹{totalTargetFees.toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveAdminTab('fees')}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer pt-1 border-t border-slate-900"
                  >
                    Clear Fees <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3. Tournament Status & Quick Toggle Link */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between gap-2.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-indigo-400" /> Tournament State
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        tournamentStatus === 'finished'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {tournamentStatus === 'finished' ? 'Finished' : 'Active'}
                    </span>
                  </div>

                  <div>
                    <div className="text-lg font-black text-white font-display flex items-center gap-1.5">
                      {tournamentStatus === 'finished' ? (
                        <span className="text-amber-400">Finished</span>
                      ) : (
                        <span className="text-emerald-400">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tournamentStatus === 'finished'
                        ? 'Tournament concluded. Champions finalized.'
                        : 'Active matches underway under floodlights.'}
                    </p>
                  </div>

                  {/* Quick link to toggle tournament status */}
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider font-display transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                      tournamentStatus === 'finished'
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    }`}
                    title={`Toggle tournament status to ${tournamentStatus === 'finished' ? 'Active' : 'Finished'}`}
                  >
                    {tournamentStatus === 'finished' ? (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        <span>Toggle: Set Active</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-3 h-3" />
                        <span>Toggle: Mark Finished</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Navigation Pills for In-Page Editing */}
            {onNavigateTab && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  Jump Directly to Live In-Page Editor:
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    onClick={() => { onNavigateTab('matches'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trophy className="w-3.5 h-3.5" /> Fixtures &amp; Scores
                  </button>
                  <button
                    onClick={() => { onNavigateTab('standings'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" /> Points Table
                  </button>
                  <button
                    onClick={() => { onNavigateTab('teams'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" /> Squads &amp; Player 8
                  </button>
                  <button
                    onClick={() => { onNavigateTab('updates'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" /> Daily Bulletins
                  </button>
                  <button
                    onClick={() => { onNavigateTab('fees'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Fee Clearance
                  </button>
                  <button
                    onClick={() => { onNavigateTab('committee'); onClose(); }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" /> Disciplinary Rulings
                  </button>
                </div>
              </div>
            )}

            {/* Admin Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
              {[
                { id: 'quickstats', label: 'Quick Stats' },
                { id: 'scores', label: 'Match Scores' },
                { id: 'fixtures', label: 'Add Fixture' },
                { id: 'points', label: 'Points Adjustment' },
                { id: 'fees', label: 'Fee Clearance' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveAdminTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase font-display tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    activeAdminTab === t.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB: Quick Stats */}
            {activeAdminTab === 'quickstats' && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Tournament Operations &amp; Quick Stats
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Official Ledger: Krusan Edge 2026
                  </span>
                </div>

                {/* Match Stage Progression breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Fixture Stages Breakdown</span>
                    <span className="text-amber-400 font-mono text-[11px]">
                      {completedMatchesCount} of {totalMatchesCount} matches completed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Exhibition</div>
                      <div className="text-base font-bold text-white font-display mt-0.5">
                        {allMatches.filter(m => m.id === 'M-0' && m.status === 'completed').length} / 1
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Inaugural Match</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-medium">League Round 1</div>
                      <div className="text-base font-bold text-white font-display mt-0.5">
                        {allMatches.filter(m => ['M-1', 'M-2', 'M-3', 'M-4'].includes(m.id) && m.status === 'completed').length} / 4
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Group Stage 1</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-medium">League Round 2</div>
                      <div className="text-base font-bold text-white font-display mt-0.5">
                        {allMatches.filter(m => ['M-5', 'M-6', 'M-7', 'M-8', 'M-9', 'M-10', 'M-11'].includes(m.id) && m.status === 'completed').length} / 7
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Group Stage 2</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Knockouts</div>
                      <div className="text-base font-bold text-white font-display mt-0.5">
                        {allMatches.filter(m => ['SF-1', 'SF-2', 'FIN-1'].includes(m.id) && m.status === 'completed').length} / 3
                      </div>
                      <div className="text-[10px] text-amber-400 mt-0.5">Semis &amp; Final</div>
                    </div>
                  </div>
                </div>

                {/* Squad Payment Quick Audit */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Squad Entry Fee Clearance ({pendingPaymentsCount} Pending)</span>
                    <button
                      type="button"
                      onClick={() => setActiveAdminTab('fees')}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      Open Fee Ledger <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {teams.map(team => {
                      const isCleared = (team.feesPaid || 0) >= targetFee;
                      const balance = Math.max(0, targetFee - (team.feesPaid || 0));
                      return (
                        <div
                          key={team.id}
                          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-200 truncate">{team.name}</div>
                            <div className="text-[11px] text-slate-400">
                              Paid: <span className="font-mono text-slate-200">₹{team.feesPaid || 0}</span> / ₹{targetFee}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {isCleared ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Cleared
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTeamId(team.id);
                                  setAddFeeAmount(balance);
                                  setActiveAdminTab('fees');
                                }}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-colors cursor-pointer"
                                title="Click to clear remaining balance"
                              >
                                Due: ₹{balance}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tournament Lifecycle Status Toggle Manager */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200 font-display">
                        Tournament Lifecycle Status
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        tournamentStatus === 'finished'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {tournamentStatus === 'finished' ? 'Status: Finished' : 'Status: Active'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tournamentStatus === 'finished'
                      ? 'The tournament is currently marked as FINISHED. All matches are concluded, points tables are certified, and winners are awarded.'
                      : 'The tournament is currently ACTIVE. Match fixtures are live, teams are battling for points, and schedule updates are published.'}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleToggleStatus}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-display transition-all inline-flex items-center gap-2 cursor-pointer shadow-md ${
                        tournamentStatus === 'finished'
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      }`}
                    >
                      {tournamentStatus === 'finished' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Toggle to Active Status</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Toggle to Finished Status</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-slate-500 italic">
                      Instantly updates status across Header, navigation, and summaries
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Scores */}
            {activeAdminTab === 'scores' && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
                  Record / Update Match Result
                </h4>
                <form onSubmit={handleSaveResult} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Select Match:</label>
                    <select
                      value={selectedMatchId}
                      onChange={e => {
                        const id = e.target.value;
                        setSelectedMatchId(id);
                        const m = matches.find(match => match.id === id);
                        if (m) {
                          setScoreA(m.scoreA ?? 0);
                          setScoreB(m.scoreB ?? 0);
                          setMatchNotes(m.notes ?? '');
                        }
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      {matches.map(m => {
                        const tA = teams.find(t => t.id === m.teamAId)?.name || 'TBD';
                        const tB = teams.find(t => t.id === m.teamBId)?.name || 'TBD';
                        return (
                          <option key={m.id} value={m.id}>
                            {m.roundLabel}: {tA} vs {tB} ({m.date}) - {m.status.toUpperCase()}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Team A Sets Won:</label>
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={scoreA}
                        onChange={e => setScoreA(Number(e.target.value))}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-center font-bold text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Team B Sets Won:</label>
                      <input
                        type="number"
                        min={0}
                        max={3}
                        value={scoreB}
                        onChange={e => setScoreB(Number(e.target.value))}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-center font-bold text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Match Note / Highlights:</label>
                    <input
                      type="text"
                      value={matchNotes}
                      onChange={e => setMatchNotes(e.target.value)}
                      placeholder="e.g. 3-setter thriller under floodlights"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow"
                  >
                    Save Result &amp; Recalculate Points
                  </button>
                </form>
              </div>
            )}

            {/* TAB: Fixtures */}
            {activeAdminTab === 'fixtures' && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
                    Fixtures &amp; Match Scheduling
                  </h4>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setFixtureSubTab('assign')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        fixtureSubTab === 'assign'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Assign / Edit Fixture
                    </button>
                    <button
                      type="button"
                      onClick={() => setFixtureSubTab('create')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        fixtureSubTab === 'create'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      + Create New
                    </button>
                  </div>
                </div>

                {fixtureSubTab === 'assign' ? (
                  <form onSubmit={handleUpdateExistingFixture} className="space-y-3 text-xs">
                    {/* Quick shortcuts for Open Slots */}
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 font-display">
                        Quick Select Open Match Slots (2nd League Stage):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {matches
                          .filter(m => !m.teamAId || !m.teamBId || m.id === 'M-11' || m.id === 'M-13')
                          .map(m => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleSelectFixtureToEdit(m.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-display cursor-pointer transition-colors border ${
                                editMatchId === m.id
                                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                                  : 'bg-slate-900 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                              }`}
                            >
                              {m.roundLabel || `Match ${m.matchNumber}`} (Open Slot)
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Select Match to Assign/Update:</label>
                      <select
                        value={editMatchId}
                        onChange={e => handleSelectFixtureToEdit(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                      >
                        {matches.map(m => {
                          const tA = teams.find(t => t.id === m.teamAId)?.name || 'Slot Open (TBD)';
                          const tB = teams.find(t => t.id === m.teamBId)?.name || 'Slot Open (TBD)';
                          return (
                            <option key={m.id} value={m.id}>
                              {m.roundLabel}: {tA} vs {tB} — {m.date}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Team A (or leave TBD):</label>
                        <select
                          value={editTeamA}
                          onChange={e => setEditTeamA(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        >
                          <option value="">-- Slot Open (TBD) --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Team B (or leave TBD):</label>
                        <select
                          value={editTeamB}
                          onChange={e => setEditTeamB(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        >
                          <option value="">-- Slot Open (TBD) --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Date:</label>
                        <input
                          type="text"
                          value={editMatchDate}
                          onChange={e => setEditMatchDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Time Slot:</label>
                        <input
                          type="text"
                          value={editMatchTime}
                          onChange={e => setEditMatchTime(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Match Notes:</label>
                      <input
                        type="text"
                        value={editMatchNotes}
                        onChange={e => setEditMatchNotes(e.target.value)}
                        placeholder="e.g. Day match after ASR prayers"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                      />
                    </div>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsNight}
                        onChange={e => setEditIsNight(e.target.checked)}
                      />
                      <span className="text-amber-300 font-bold">Under Floodlights (Night Match)</span>
                    </label>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow"
                    >
                      Save Assigned Teams &amp; Update Fixture
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCreateFixture} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Round / Match Label:</label>
                      <input
                        type="text"
                        value={newMatchLabel}
                        onChange={e => setNewMatchLabel(e.target.value)}
                        placeholder="Match 15"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Team A:</label>
                        <select
                          value={newTeamA}
                          onChange={e => setNewTeamA(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        >
                          <option value="">-- Slot Open (TBD) --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Team B:</label>
                        <select
                          value={newTeamB}
                          onChange={e => setNewTeamB(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        >
                          <option value="">-- Slot Open (TBD) --</option>
                          {teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Date:</label>
                        <input
                          type="text"
                          value={newMatchDate}
                          onChange={e => setNewMatchDate(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Time:</label>
                        <input
                          type="text"
                          value={newMatchTime}
                          onChange={e => setNewMatchTime(e.target.value)}
                          className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsNight}
                        onChange={e => setNewIsNight(e.target.checked)}
                      />
                      <span className="text-amber-300 font-bold">Under Floodlights (Night Match)</span>
                    </label>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow"
                    >
                      Add Fixture to Schedule
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB: Points Adjustment */}
            {activeAdminTab === 'points' && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display">
                  Official Standings Adjustment (Bonus / Penalty)
                </h4>
                <form onSubmit={handleSavePointsAdj} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Select Squad:</label>
                    <select
                      value={adjTeamId}
                      onChange={e => setAdjTeamId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name} (Capt: {t.captain})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Adjustment Points (+ / -):</label>
                    <input
                      type="number"
                      value={adjAmount}
                      onChange={e => setAdjAmount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-lg font-bold text-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Official Reason / Note:</label>
                    <input
                      type="text"
                      value={adjNote}
                      onChange={e => setAdjNote(e.target.value)}
                      placeholder="e.g. Fair play bonus or disciplinary deduction"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow"
                  >
                    Apply Adjustment
                  </button>
                </form>
              </div>
            )}

            {/* TAB: Fees */}
            {activeAdminTab === 'fees' && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-display">
                  Record Team Fee Payment
                </h4>
                <form onSubmit={handleSaveFee} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Select Team:</label>
                    <select
                      value={selectedTeamId}
                      onChange={e => setSelectedTeamId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} (Currently Paid: ₹{t.feesPaid || 0}/₹1600)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Add Amount Paid (₹):</label>
                      <input
                        type="number"
                        min={50}
                        step={50}
                        value={addFeeAmount || ''}
                        onChange={e => setAddFeeAmount(Number(e.target.value))}
                        placeholder="e.g. 600"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-base font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Payment Mode / Note:</label>
                      <input
                        type="text"
                        value={paymentDetails}
                        onChange={e => setPaymentDetails(e.target.value)}
                        placeholder="e.g. ₹600 (UPI) on 04/09"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow"
                  >
                    Record Payment &amp; Update Ledger
                  </button>
                </form>
              </div>
            )}

            {/* Reset to Official Seed Data */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all tournament scores, teams, and fees back to the official PDF data?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Baseline Data</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
