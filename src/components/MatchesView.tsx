import React, { useState } from 'react';
import { Calendar, Moon, Sun, CheckCircle2, Clock, Sparkles, AlertTriangle, Edit2, Plus, Trash2, X, Save } from 'lucide-react';
import { Match, Team, MatchStatus } from '../types';
import { getMatchDateRelation } from '../utils/tournament';

interface MatchesViewProps {
  matches: Match[];
  knockouts: Match[];
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
  isOrganizer?: boolean;
  onAddMatch?: (match: Match) => void;
  onUpdateMatch?: (match: Match) => void;
  onDeleteMatch?: (matchId: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  knockouts,
  teams,
  onSelectTeam,
  isOrganizer,
  onAddMatch,
  onUpdateMatch,
  onDeleteMatch
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isNewMatchModalOpen, setIsNewMatchModalOpen] = useState(false);

  // New match state
  const [newStage, setNewStage] = useState<'league' | 'pqf' | 'qf' | 'sf' | 'final' | 'inauguration'>('league');
  const [newRoundLabel, setNewRoundLabel] = useState('Match 11');
  const [newLeagueRound, setNewLeagueRound] = useState<1 | 2 | 3>(2);
  const [newTeamAId, setNewTeamAId] = useState<string>(teams[0]?.id || '');
  const [newTeamBId, setNewTeamBId] = useState<string>(teams[1]?.id || '');
  const [newDate, setNewDate] = useState('Day 6 (Mon, 07 Sept 2026)');
  const [newTime, setNewTime] = useState('5:30 PM (After ASR Prayers)');
  const [newIsNightSlot, setNewIsNightSlot] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  const getTeam = (id: string | null) => {
    if (!id) return null;
    return teams.find(t => t.id === id) || null;
  };

  const allMatches = [...matches, ...knockouts];

  const todayMatchesCount = allMatches.filter(m => getMatchDateRelation(m.date) === 'today').length;
  const tomorrowMatchesCount = allMatches.filter(m => getMatchDateRelation(m.date) === 'tomorrow').length;

  const filteredMatches = allMatches.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'today') return getMatchDateRelation(m.date) === 'today';
    if (filter === 'tomorrow') return getMatchDateRelation(m.date) === 'tomorrow';
    if (filter === 'round1') return m.leagueRound === 1;
    if (filter === 'round2') return m.leagueRound === 2;
    if (filter === 'round3') return m.leagueRound === 3;
    if (filter === 'knockouts') return ['pqf', 'qf', 'sf', 'final'].includes(m.stage);
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  const handleOpenEdit = (match: Match) => {
    setEditingMatch({ ...match });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch || !onUpdateMatch) return;
    onUpdateMatch(editingMatch);
    setEditingMatch(null);
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddMatch) return;

    const newMatch: Match = {
      id: `M-${Date.now()}`,
      stage: newStage,
      roundLabel: newRoundLabel,
      leagueRound: newStage === 'league' ? newLeagueRound : undefined,
      teamAId: newTeamAId || null,
      teamBId: newTeamBId || null,
      scoreA: null,
      scoreB: null,
      status: 'upcoming',
      date: newDate,
      time: newTime,
      isNightSlot: newIsNightSlot,
      notes: newNotes
    };

    onAddMatch(newMatch);
    setIsNewMatchModalOpen(false);
    setNewNotes('');
  };

  const filterPills = [
    { id: 'all', label: 'All Fixtures' },
    ...(todayMatchesCount > 0
      ? [{ id: 'today', label: `🔥 Today (${todayMatchesCount})`, type: 'today' }]
      : []),
    ...(tomorrowMatchesCount > 0
      ? [{ id: 'tomorrow', label: `📅 Tomorrow (${tomorrowMatchesCount})`, type: 'tomorrow' }]
      : []),
    { id: 'round1', label: 'Round 1' },
    { id: 'round2', label: 'Round 2' },
    { id: 'round3', label: 'Round 3 (Suggested)' },
    { id: 'knockouts', label: 'Knockouts (PQF/QF/SF/Final)' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Tournament Fixtures &amp; Results</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            2 Matches Daily: Daylight at 5:30 PM (After ASR) · Floodlights at 7:20 PM (After Maghrib).
          </p>
        </div>

        {/* Action button if Organizer */}
        {isOrganizer && onAddMatch && (
          <button
            onClick={() => setIsNewMatchModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fixture</span>
          </button>
        )}
      </div>

      {/* Dynamic Notification Banner based on System Date */}
      {todayMatchesCount > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-300">
            <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>
              <strong className="text-white font-bold">{todayMatchesCount} match{todayMatchesCount > 1 ? 'es are' : ' is'} scheduled for TODAY</strong> based on current system date.
            </span>
          </div>
          {filter !== 'today' && (
            <button
              onClick={() => setFilter('today')}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold uppercase tracking-wider text-[11px] font-display hover:bg-emerald-400 cursor-pointer transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
            >
              View Today's Fixtures
            </button>
          )}
        </div>
      ) : tomorrowMatchesCount > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-xs">
          <div className="flex items-center gap-2.5 text-sky-300">
            <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>
              <strong className="text-white font-bold">{tomorrowMatchesCount} match{tomorrowMatchesCount > 1 ? 'es' : ''}</strong> scheduled for <strong>TOMORROW</strong> based on current system date.
            </span>
          </div>
          {filter !== 'tomorrow' && (
            <button
              onClick={() => setFilter('tomorrow')}
              className="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 font-bold uppercase tracking-wider text-[11px] font-display hover:bg-sky-400 cursor-pointer transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
            >
              View Tomorrow's Fixtures
            </button>
          )}
        </div>
      ) : null}

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {filterPills.map(f => {
          const isActive = filter === f.id;
          const isTodayPill = f.id === 'today';
          const isTomorrowPill = f.id === 'tomorrow';

          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider font-display transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? isTodayPill
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                    : isTomorrowPill
                    ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/20'
                    : 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : isTodayPill
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25'
                  : isTomorrowPill
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 hover:bg-sky-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Match Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map(match => {
          const teamA = getTeam(match.teamAId);
          const teamB = getTeam(match.teamBId);
          const isCompleted = match.status === 'completed';
          const isUpcoming = match.status === 'upcoming';
          const isInaugural = match.stage === 'inauguration';
          const isWalkover = match.isWalkover;
          const isSuggested = match.isSuggested;

          const dateRelation = getMatchDateRelation(match.date);
          const isTodayMatch = dateRelation === 'today';
          const isTomorrowMatch = dateRelation === 'tomorrow';

          const teamAWon = isWalkover
            ? match.walkoverWinnerId === match.teamAId
            : isCompleted && match.scoreA !== null && match.scoreB !== null && match.scoreA > match.scoreB;

          const teamBWon = isWalkover
            ? match.walkoverWinnerId === match.teamBId
            : isCompleted && match.scoreA !== null && match.scoreB !== null && match.scoreB > match.scoreA;

          return (
            <div
              key={match.id}
              className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between gap-4 ${
                isTodayMatch
                  ? 'bg-gradient-to-br from-emerald-950/25 via-slate-900 to-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : isTomorrowMatch
                  ? 'bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-900 border-sky-500/50 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/25'
                  : isInaugural
                  ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/40'
                  : isWalkover
                  ? 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border-amber-500/50'
                  : match.isNightSlot
                  ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Header: Round, Time, Lighting & Organizer Edit button */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                    {match.roundLabel || `Match ${match.matchNumber || ''}`}
                  </span>

                  {isTodayMatch && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-sm inline-flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                      Happening Today
                    </span>
                  )}

                  {isTomorrowMatch && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      Tomorrow
                    </span>
                  )}

                  {isInaugural && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Exhibition
                    </span>
                  )}
                  {isSuggested && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-amber-300 border border-amber-500/30">
                      Suggested Fixture
                    </span>
                  )}
                  {!match.teamAId && !match.teamBId && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Slot Open
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {isOrganizer && (!match.teamAId || !match.teamBId) && (
                    <button
                      onClick={() => handleOpenEdit(match)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] uppercase font-display tracking-wider cursor-pointer shadow-sm transition-colors"
                      title="Assign teams to this open slot"
                    >
                      <Edit2 className="w-3 h-3" /> Assign Teams
                    </button>
                  )}
                  {match.isNightSlot ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                      <Moon className="w-3 h-3 text-amber-400" />
                      <span>Under Lights</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span>Daylight</span>
                    </span>
                  )}

                  {isWalkover ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase text-[10px] font-display">
                      <AlertTriangle className="w-3 h-3" /> Walkover
                    </span>
                  ) : isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold uppercase text-[11px] font-display">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Final
                    </span>
                  ) : isUpcoming ? (
                    <span className="inline-flex items-center gap-1 text-amber-400 font-bold uppercase text-[11px] font-display">
                      <Clock className="w-3.5 h-3.5" /> Today
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px] uppercase font-display">Scheduled</span>
                  )}

                  {isOrganizer && (
                    <button
                      onClick={() => handleOpenEdit(match)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                      title="Edit Match Details or Score"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Match Scoreboard */}
              <div className="grid grid-cols-5 items-center gap-2 py-2">
                {/* Team A */}
                <div
                  className={`col-span-2 text-left cursor-pointer hover:opacity-80 transition-opacity ${
                    teamAWon ? 'text-emerald-300 font-extrabold' : 'text-slate-200 font-semibold'
                  }`}
                  onClick={() => match.teamAId && onSelectTeam(match.teamAId)}
                >
                  <div className="font-display text-base sm:text-lg truncate leading-tight">
                    {teamA ? teamA.name : 'Slot Open (TBD)'}
                  </div>
                  {teamA ? (
                    <div className="text-[11px] text-slate-400 truncate">
                      Capt: {teamA.captain}
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-400/80 italic truncate">
                      Pending assignment
                    </div>
                  )}
                  {isWalkover && match.walkoverWinnerId === match.teamAId && (
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Awarded 3 Pts
                    </div>
                  )}
                </div>

                {/* Score / VS Center */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  {isWalkover ? (
                    <div className="flex flex-col items-center">
                      <div className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold font-display uppercase tracking-wider border border-amber-500/40">
                        Walkover
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1">3–0 Pts</span>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                      <span className={`text-xl sm:text-2xl font-black font-display ${teamAWon ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {match.scoreA}
                      </span>
                      <span className="text-slate-600 font-display text-xs">·</span>
                      <span className={`text-xl sm:text-2xl font-black font-display ${teamBWon ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {match.scoreB}
                      </span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 text-xs font-bold font-display uppercase tracking-widest border border-slate-800">
                      VS
                    </div>
                  )}
                </div>

                {/* Team B */}
                <div
                  className={`col-span-2 text-right cursor-pointer hover:opacity-80 transition-opacity ${
                    teamBWon ? 'text-emerald-300 font-extrabold' : 'text-slate-200 font-semibold'
                  }`}
                  onClick={() => match.teamBId && onSelectTeam(match.teamBId)}
                >
                  <div className="font-display text-base sm:text-lg truncate leading-tight">
                    {teamB ? teamB.name : 'Slot Open (TBD)'}
                  </div>
                  {teamB ? (
                    <div className="text-[11px] text-slate-400 truncate">
                      Capt: {teamB.captain}
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-400/80 italic truncate">
                      Pending assignment
                    </div>
                  )}
                  {isWalkover && match.walkoverWinnerId === match.teamBId && (
                    <div className="mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Awarded 3 Pts
                    </div>
                  )}
                </div>
              </div>

              {/* Match Footer: Date, Time & Notes */}
              <div className="border-t border-slate-800/80 pt-2.5 text-xs text-slate-400 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2 text-slate-300 font-medium flex-wrap">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className={isTodayMatch ? 'text-emerald-300 font-bold' : isTomorrowMatch ? 'text-sky-300 font-bold' : ''}>
                      {match.date}
                    </span>
                    {isTodayMatch && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Today
                      </span>
                    )}
                    {isTomorrowMatch && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        Tomorrow
                      </span>
                    )}
                    <span className="text-slate-600">·</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{match.time}</span>
                  </div>

                  {match.notes && (
                    <div className="text-[11px] text-slate-400 italic truncate max-w-xs">
                      {match.notes}
                    </div>
                  )}
                </div>

                {/* If Walkover note */}
                {isWalkover && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                    <strong>Disciplinary Verdict:</strong> Match awarded with 3 match points (no sets won/lost) under official Committee resolution.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Edit Modal */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingMatch(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Edit2 className="w-4 h-4" />
              <span>Organizer Fixture Management</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Edit Match Details &amp; Score
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Round label & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Round Label:</label>
                  <input
                    type="text"
                    value={editingMatch.roundLabel || ''}
                    onChange={e => setEditingMatch({ ...editingMatch, roundLabel: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Match Status:</label>
                  <select
                    value={editingMatch.status}
                    onChange={e => setEditingMatch({ ...editingMatch, status: e.target.value as MatchStatus })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live Now</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Teams Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Team A:</label>
                  <select
                    value={editingMatch.teamAId || ''}
                    onChange={e => setEditingMatch({ ...editingMatch, teamAId: e.target.value || null })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="">-- Select Team A --</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Team B:</label>
                  <select
                    value={editingMatch.teamBId || ''}
                    onChange={e => setEditingMatch({ ...editingMatch, teamBId: e.target.value || null })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="">-- Select Team B --</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time, Night Slot */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1 font-bold">Date:</label>
                  <input
                    type="text"
                    value={editingMatch.date}
                    onChange={e => setEditingMatch({ ...editingMatch, date: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1 font-bold">Time:</label>
                  <input
                    type="text"
                    value={editingMatch.time}
                    onChange={e => setEditingMatch({ ...editingMatch, time: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="col-span-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingMatch.isNightSlot || false}
                      onChange={e => setEditingMatch({ ...editingMatch, isNightSlot: e.target.checked })}
                    />
                    <span className="text-[11px] text-amber-300 font-bold">Night Slot</span>
                  </label>
                </div>
              </div>

              {/* Walkover Toggle & Winner */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMatch.isWalkover || false}
                    onChange={e => {
                      const isWo = e.target.checked;
                      setEditingMatch({
                        ...editingMatch,
                        isWalkover: isWo,
                        status: isWo ? 'completed' : editingMatch.status,
                        walkoverWinnerId: isWo ? (editingMatch.teamAId || undefined) : undefined
                      });
                    }}
                  />
                  <span className="font-bold text-amber-300">Award as Walkover (3 match points, 0 sets won/lost)</span>
                </label>

                {editingMatch.isWalkover && (
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Awarded Winner Team:</label>
                    <select
                      value={editingMatch.walkoverWinnerId || ''}
                      onChange={e => setEditingMatch({ ...editingMatch, walkoverWinnerId: e.target.value })}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                    >
                      <option value={editingMatch.teamAId || ''}>
                        {teams.find(t => t.id === editingMatch.teamAId)?.name || 'Team A'}
                      </option>
                      <option value={editingMatch.teamBId || ''}>
                        {teams.find(t => t.id === editingMatch.teamBId)?.name || 'Team B'}
                      </option>
                    </select>
                  </div>
                )}
              </div>

              {/* Standard Set Scores (if not walkover) */}
              {!editingMatch.isWalkover && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Team A Sets Won:</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={editingMatch.scoreA ?? ''}
                      onChange={e => setEditingMatch({ ...editingMatch, scoreA: e.target.value ? Number(e.target.value) : null })}
                      placeholder="0"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-bold text-lg text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Team B Sets Won:</label>
                    <input
                      type="number"
                      min={0}
                      max={3}
                      value={editingMatch.scoreB ?? ''}
                      onChange={e => setEditingMatch({ ...editingMatch, scoreB: e.target.value ? Number(e.target.value) : null })}
                      placeholder="0"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-bold text-lg text-emerald-400"
                    />
                  </div>
                </div>
              )}

              {/* Match Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Notes / Highlights:</label>
                <input
                  type="text"
                  value={editingMatch.notes || ''}
                  onChange={e => setEditingMatch({ ...editingMatch, notes: e.target.value })}
                  placeholder="e.g. 3-setter thriller under floodlights"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                {onDeleteMatch && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this fixture?')) {
                        onDeleteMatch(editingMatch.id);
                        setEditingMatch(null);
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    Delete Fixture
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingMatch(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display transition-colors cursor-pointer shadow-md inline-flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Fixture</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Match Modal */}
      {isNewMatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsNewMatchModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Plus className="w-4 h-4" />
              <span>Add Tournament Match</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Create New Fixture
            </h3>

            <form onSubmit={handleCreateMatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Stage:</label>
                  <select
                    value={newStage}
                    onChange={e => setNewStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="league">League Match</option>
                    <option value="pqf">Pre-Quarterfinal (PQF)</option>
                    <option value="qf">Quarterfinal (QF)</option>
                    <option value="sf">Semifinal (SF)</option>
                    <option value="final">Grand Final</option>
                    <option value="inauguration">Exhibition / Inauguration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Round Label:</label>
                  <input
                    type="text"
                    value={newRoundLabel}
                    onChange={e => setNewRoundLabel(e.target.value)}
                    placeholder="e.g. Match 11"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Team A:</label>
                  <select
                    value={newTeamAId}
                    onChange={e => setNewTeamAId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Team B:</label>
                  <select
                    value={newTeamBId}
                    onChange={e => setNewTeamBId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1 font-bold">Date:</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="e.g. Day 6 (07 Sept)"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1 font-bold">Time:</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    placeholder="5:30 PM (After ASR)"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div className="col-span-1 flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsNightSlot}
                      onChange={e => setNewIsNightSlot(e.target.checked)}
                    />
                    <span className="text-[11px] text-amber-300 font-bold">Night Slot</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Notes (optional):</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Crucial qualification battle"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewMatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md"
                >
                  Create Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
