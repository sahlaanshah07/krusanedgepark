import React, { useState } from 'react';
import { Users, Search, CheckCircle2, AlertCircle, Shield, UserCheck, Edit2, Plus, Trash2, X, Save, ShieldAlert } from 'lucide-react';
import { Team, TournamentStanding } from '../types';

interface TeamsViewProps {
  teams: Team[];
  standings: TournamentStanding[];
  selectedTeamId: string | null;
  onSelectTeam: (teamId: string | null) => void;
  isOrganizer?: boolean;
  onUpdateTeam?: (team: Team) => void;
  onAddTeam?: (team: Team) => void;
  onDeleteTeam?: (teamId: string) => void;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  standings,
  selectedTeamId,
  onSelectTeam,
  isOrganizer,
  onUpdateTeam,
  onAddTeam,
  onDeleteTeam
}) => {
  const [search, setSearch] = useState('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCaptain, setNewTeamCaptain] = useState('');
  const [newTeamContact, setNewTeamContact] = useState('');
  const [newTeamPlayers, setNewTeamPlayers] = useState<string[]>([
    'Captain Name (C)',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
    'Player 7 (R)',
    'Player 8'
  ]);

  const filteredTeams = teams.filter(team => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    if (team.name.toLowerCase().includes(q)) return true;
    if (team.captain.toLowerCase().includes(q)) return true;
    return team.players.some(p => p.toLowerCase().includes(q));
  });

  const getTeamStanding = (teamId: string) => {
    return standings.find(s => s.teamId === teamId);
  };

  const handleOpenEdit = (team: Team) => {
    // Clone team for editing
    setEditingTeam({
      ...team,
      players: [...team.players]
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam || !onUpdateTeam) return;
    onUpdateTeam(editingTeam);
    setEditingTeam(null);
  };

  const handlePlayerChange = (index: number, value: string) => {
    if (!editingTeam) return;
    const updatedPlayers = [...editingTeam.players];
    updatedPlayers[index] = value;
    setEditingTeam({ ...editingTeam, players: updatedPlayers });
  };

  const handleAddPlayer = () => {
    if (!editingTeam) return;
    const nextNum = editingTeam.players.length + 1;
    setEditingTeam({
      ...editingTeam,
      players: [...editingTeam.players, `Player ${nextNum}`]
    });
  };

  const handleRemovePlayer = (index: number) => {
    if (!editingTeam) return;
    if (editingTeam.players.length <= 6) {
      alert('A volleyball squad must have at least 6 active players.');
      return;
    }
    const updatedPlayers = editingTeam.players.filter((_, i) => i !== index);
    setEditingTeam({ ...editingTeam, players: updatedPlayers });
  };

  const handleCreateNewTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamCaptain.trim() || !onAddTeam) return;

    const newTeam: Team = {
      id: `T${Date.now()}`,
      name: newTeamName.trim(),
      captain: newTeamCaptain.trim(),
      contact: newTeamContact.trim() || 'N/A',
      players: newTeamPlayers.map(p => p.trim()).filter(Boolean),
      feesPaid: 0,
      paymentDetails: 'Pending',
      timestamp: new Date().toISOString()
    };

    onAddTeam(newTeam);
    setIsNewTeamModalOpen(false);
    setNewTeamName('');
    setNewTeamCaptain('');
    setNewTeamContact('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            <span>Participating Teams &amp; Squad Rosters</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            All registered teams representing local youth from Krusan Lolab. Standard squad rosters include up to 8 players.
          </p>
        </div>

        {/* Controls: Search and Organizer Add Team */}
        <div className="flex items-center gap-3">
          {isOrganizer && onAddTeam && (
            <button
              onClick={() => setIsNewTeamModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Team</span>
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team, captain, player..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map(team => {
          const standing = getTeamStanding(team.id);
          const isSelected = selectedTeamId === team.id;
          const feePaid = team.feesPaid || 0;
          const isFeeCleared = feePaid >= 1600;

          return (
            <div
              key={team.id}
              id={`team-${team.id}`}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top: Team Name & Standing Badge */}
              <div className="space-y-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide leading-tight">
                      {team.name}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Captain: <strong className="text-slate-200">{team.captain}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {standing && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold font-display bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                        {standing.points} PTS · {standing.won}W-{standing.lost}L
                      </span>
                    )}

                    {isOrganizer && (
                      <button
                        onClick={() => handleOpenEdit(team)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                        title="Edit Squad &amp; Players"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Squad</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub row */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>Total Squad: {team.players.length} Players</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-mono">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    <span>Committee Rep</span>
                  </span>
                </div>
              </div>

              {/* Player Roster List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  <span>Squad Roster:</span>
                  <span className="text-[10px] text-slate-500">{team.players.length} Registered</span>
                </div>

                <ul className="space-y-1 text-xs">
                  {team.players.map((player, idx) => {
                    const isCaptain = idx === 0 || player.toLowerCase().includes('(c)');
                    const isReserve = player.toLowerCase().includes('(r)');
                    const isPlayer8 = idx === 7 || player.toLowerCase().includes('player 8');

                    return (
                      <li
                        key={idx}
                        className={`flex items-center justify-between py-1 px-2.5 rounded-lg border transition-colors ${
                          isPlayer8 && player.toLowerCase().includes('player 8')
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            : 'bg-slate-950/50 border-slate-800/60 text-slate-300'
                        }`}
                      >
                        <span className="font-medium truncate mr-2">
                          {player.replace(/\s*\([CR]\)/gi, '')}
                        </span>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isCaptain ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Captain
                            </span>
                          ) : isReserve ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-400">
                              Reserve
                            </span>
                          ) : isPlayer8 ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                              Player 8 Slot
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-display font-semibold">
                              #{idx + 1}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Bottom: Fee Status */}
              <div className="border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Registration Fee:</span>
                {isFeeCleared ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full Cleared (₹{feePaid})
                  </span>
                ) : feePaid > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                    <span>₹{feePaid} Paid</span>
                    <span className="text-slate-500">(₹{1600 - feePaid} left)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending (₹0/₹1,600)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Organizer Squad Edit Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingTeam(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Edit2 className="w-4 h-4" />
              <span>Organizer Squad Management</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Edit {editingTeam.name}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Team Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                  Team Name:
                </label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Captain Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                    Captain Name:
                  </label>
                  <input
                    type="text"
                    value={editingTeam.captain}
                    onChange={e => setEditingTeam({ ...editingTeam, captain: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                    Contact Number:
                  </label>
                  <input
                    type="text"
                    value={editingTeam.contact}
                    onChange={e => setEditingTeam({ ...editingTeam, contact: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Players List Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                    Squad Players (Edit names, add or remove):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPlayer}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Player</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Tip: Slot 8 can be renamed from &quot;Player 8&quot; to any player name as soon as confirmed.
                </p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {editingTeam.players.map((player, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-display w-6 text-center font-bold">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={player}
                        onChange={e => handlePlayerChange(idx, e.target.value)}
                        placeholder={`Player ${idx + 1} Name`}
                        className={`flex-1 p-2 rounded-xl text-sm border focus:outline-none ${
                          idx === 7 || player.toLowerCase().includes('player 8')
                            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(idx)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove Player"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {onDeleteTeam && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete team "${editingTeam.name}" from the tournament?`)) {
                        onDeleteTeam(editingTeam.id);
                        setEditingTeam(null);
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    Delete Team
                  </button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingTeam(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs transition-colors cursor-pointer shadow-md inline-flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Team Modal */}
      {isNewTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsNewTeamModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Plus className="w-4 h-4" />
              <span>Register New Squad</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Add New Team to Tournament
            </h3>

            <form onSubmit={handleCreateNewTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                  Team Name:
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  placeholder="e.g. Lolab Warriors"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                    Captain Name:
                  </label>
                  <input
                    type="text"
                    value={newTeamCaptain}
                    onChange={e => setNewTeamCaptain(e.target.value)}
                    placeholder="e.g. Aaqib Mir"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                    Contact Phone:
                  </label>
                  <input
                    type="text"
                    value={newTeamContact}
                    onChange={e => setNewTeamContact(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-display mb-1">
                  8 Players (Auto-generated slots):
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {newTeamPlayers.map((p, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={p}
                      onChange={e => {
                        const updated = [...newTeamPlayers];
                        updated[idx] = e.target.value;
                        setNewTeamPlayers(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs shadow-md"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
