import React, { useState } from 'react';
import { Award, Info, ChevronRight, Edit3, X, Save, AlertCircle } from 'lucide-react';
import { TournamentStanding, Team } from '../types';

interface StandingsTableProps {
  standings: TournamentStanding[];
  teams: Team[];
  onSelectTeam: (teamId: string) => void;
  isOrganizer?: boolean;
  onAdjustPoints?: (teamId: string, adjustment: number, note: string) => void;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  teams,
  onSelectTeam,
  isOrganizer,
  onAdjustPoints
}) => {
  const [adjustingTeamId, setAdjustingTeamId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState<string>('');

  const handleOpenAdjust = (teamId: string, currentAdj?: number, currentNote?: string) => {
    setAdjustingTeamId(teamId);
    setAdjustAmount(currentAdj || 0);
    setAdjustNote(currentNote || '');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingTeamId || !onAdjustPoints) return;
    onAdjustPoints(adjustingTeamId, Number(adjustAmount), adjustNote);
    setAdjustingTeamId(null);
  };

  const activeAdjustingTeam = teams.find(t => t.id === adjustingTeamId);

  return (
    <div className="space-y-6">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Official Points Table</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Standings automatically update as match results are recorded. Organizers can apply official bonus or disciplinary adjustments.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Win = 3 Pts · Loss = 0 Pts · Tie-breaker: Points → Set Diff → Sets Won</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold tracking-wider font-display border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 text-center w-12">#</th>
                <th className="py-3.5 px-4 min-w-[180px]">Team</th>
                <th className="py-3.5 px-3 text-center">P</th>
                <th className="py-3.5 px-3 text-center text-emerald-400">W</th>
                <th className="py-3.5 px-3 text-center text-rose-400">L</th>
                <th className="py-3.5 px-3 text-center">Sets W</th>
                <th className="py-3.5 px-3 text-center">Sets L</th>
                <th className="py-3.5 px-3 text-center">Diff</th>
                <th className="py-3.5 px-4 text-center text-amber-400 font-extrabold">PTS</th>
                {isOrganizer && <th className="py-3.5 px-3 text-center">Admin</th>}
                <th className="py-3.5 px-3 text-right">Roster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {standings.map((item, index) => {
                const team = teams.find(t => t.id === item.teamId);
                const isTop4 = index < 4;
                const isTop8 = index < 8;

                return (
                  <tr
                    key={item.teamId}
                    className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectTeam(item.teamId)}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs font-display ${
                          index === 0
                            ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                            : isTop4
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isTop8
                            ? 'bg-slate-800 text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    {/* Team Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors font-display text-base">
                          {item.teamName}
                        </span>
                        {isTop8 && (
                          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            QF Zone
                          </span>
                        )}
                        {item.manualAdjustment !== undefined && item.manualAdjustment !== 0 && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold font-mono ${
                              item.manualAdjustment > 0
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                            title={item.manualNote || 'Manual Organizer Adjustment'}
                          >
                            {item.manualAdjustment > 0 ? `+${item.manualAdjustment}` : item.manualAdjustment} adj
                          </span>
                        )}
                      </div>
                      {team && (
                        <div className="text-xs text-slate-400">
                          Capt: {team.captain}
                          {item.manualNote && (
                            <span className="ml-2 text-[10px] text-amber-400 italic">
                              ({item.manualNote})
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Stats */}
                    <td className="py-3 px-3 text-center font-medium text-slate-300">{item.played}</td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">{item.won}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{item.lost}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{item.setsWon}</td>
                    <td className="py-3 px-3 text-center text-slate-400">{item.setsLost}</td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-300">
                      {item.setDifference > 0 ? `+${item.setDifference}` : item.setDifference}
                    </td>

                    {/* Points */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-base font-display">
                        {item.points}
                      </span>
                    </td>

                    {/* Organizer Adjust Button */}
                    {isOrganizer && (
                      <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenAdjust(item.teamId, item.manualAdjustment, item.manualNote)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                          title="Adjust Points / Penalty"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Adjust</span>
                        </button>
                      </td>
                    )}

                    {/* View Roster button */}
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950/60 p-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> 1st Place
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/60"></span> Top 8 (Quarterfinalists)
            </span>
          </div>
          <div>All 12 teams compete in the league stage. Tap any team to inspect squad members.</div>
        </div>
      </div>

      {/* Adjust Points Modal */}
      {adjustingTeamId && activeAdjustingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setAdjustingTeamId(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Edit3 className="w-4 h-4" />
              <span>Organizer Points Table Adjustment</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-2">
              {activeAdjustingTeam.name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Apply bonus points (positive) or disciplinary penalties / deductions (negative) to this team&apos;s standing.
            </p>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Points Adjustment (+ / - points):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAmount(prev => prev - 1)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-rose-400 font-bold text-base hover:bg-slate-700"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={e => setAdjustAmount(Number(e.target.value))}
                    className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-center font-bold text-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustAmount(prev => prev + 1)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-emerald-400 font-bold text-base hover:bg-slate-700"
                  >
                    +1
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Reason / Disciplinary Note:
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={e => setAdjustNote(e.target.value)}
                  placeholder="e.g. -1 pt Disciplinary sanction for late report"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingTeamId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Apply Adjustment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
