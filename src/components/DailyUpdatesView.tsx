import React, { useState } from 'react';
import { Clock, Calendar, Moon, Sun, Flame, CheckCircle2, AlertTriangle, ShieldCheck, Trophy, Edit2, Plus, Trash2, X, Save } from 'lucide-react';
import { Match, Team, DailyUpdateItem, ScheduledMatchItem } from '../types';

interface DailyUpdatesViewProps {
  matches: Match[];
  teams: Team[];
  appUrl: string;
  dailyUpdates?: DailyUpdateItem[];
  onAddDailyUpdate?: (item: DailyUpdateItem) => void;
  onUpdateDailyUpdate?: (item: DailyUpdateItem) => void;
  onDeleteDailyUpdate?: (id: string) => void;
  isOrganizer?: boolean;
}

export const DailyUpdatesView: React.FC<DailyUpdatesViewProps> = ({
  matches,
  teams,
  appUrl,
  dailyUpdates,
  onAddDailyUpdate,
  onUpdateDailyUpdate,
  onDeleteDailyUpdate,
  isOrganizer
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'results' | 'upcoming'>('all');
  const [editingItem, setEditingItem] = useState<DailyUpdateItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New bulletin form state
  const [newDayBadge, setNewDayBadge] = useState('DAY 6 · 2ND LEAGUE STAGE');
  const [newDate, setNewDate] = useState('Monday, 07 September 2026');
  const [newTag, setNewTag] = useState('Matchday Scheduled');
  const [newIsToday, setNewIsToday] = useState(false);
  const [newCategory, setNewCategory] = useState<'upcoming' | 'results'>('upcoming');
  const [newSummary, setNewSummary] = useState('');
  const [newM1Title, setNewM1Title] = useState('Match 11: Team A vs Team B');
  const [newM1Subtitle, setNewM1Subtitle] = useState('Daylight clash after ASR prayers');
  const [newM1Time, setNewM1Time] = useState('5:30 PM (After ASR Prayers)');
  const [newM2Title, setNewM2Title] = useState('Match 12: Team C vs Team D');
  const [newM2Subtitle, setNewM2Subtitle] = useState('Night clash under floodlights');
  const [newM2Time, setNewM2Time] = useState('7:20 PM (After Maghrib Prayers)');
  const [newVerdictNote, setNewVerdictNote] = useState('');

  const updatesList = dailyUpdates || [];

  const filteredUpdates = updatesList.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return item.category === 'upcoming' || item.isToday;
    if (activeFilter === 'results') return item.category === 'results';
    return true;
  });

  const handleOpenEdit = (item: DailyUpdateItem) => {
    setEditingItem({
      ...item,
      matches: item.matches ? [...item.matches.map(m => ({ ...m }))] : []
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !onUpdateDailyUpdate) return;
    onUpdateDailyUpdate(editingItem);
    setEditingItem(null);
  };

  const handleCreateBulletin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddDailyUpdate) return;

    const newMatches: ScheduledMatchItem[] = [
      {
        slotTime: newM1Time,
        type: 'daylight',
        title: newM1Title,
        subtitle: newM1Subtitle
      },
      {
        slotTime: newM2Time,
        type: 'night',
        title: newM2Title,
        subtitle: newM2Subtitle
      }
    ];

    const newBulletin: DailyUpdateItem = {
      id: `day-${Date.now()}`,
      dayBadge: newDayBadge,
      date: newDate,
      tag: newTag,
      isToday: newIsToday,
      category: newCategory,
      summary: newSummary,
      matches: newMatches,
      verdictNote: newVerdictNote.trim() ? newVerdictNote.trim() : undefined
    };

    onAddDailyUpdate(newBulletin);
    setIsNewModalOpen(false);
    setNewSummary('');
    setNewVerdictNote('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <span>Daily Match Updates &amp; Bulletins</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Official daily schedule: exactly 2 matches per day (5:30 PM Daylight after ASR &amp; 7:20 PM Under Floodlights after Maghrib).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOrganizer && onAddDailyUpdate && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Post Bulletin</span>
            </button>
          )}

          {/* Filter buttons */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Days
            </button>
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeFilter === 'upcoming'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveFilter('results')}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeFilter === 'results'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past Results
            </button>
          </div>
        </div>
      </div>

      {/* Daily Match Cards */}
      <div className="space-y-5">
        {filteredUpdates.map(bulletin => {
          const isToday = bulletin.isToday;

          return (
            <div
              key={bulletin.id}
              className={`p-6 rounded-2xl border relative overflow-hidden shadow-xl transition-all ${
                isToday
                  ? 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/60'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold uppercase font-display text-xs flex items-center gap-1 ${
                      isToday
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isToday && <Flame className="w-3.5 h-3.5 fill-current" />}
                    {bulletin.dayBadge}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {bulletin.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold font-display uppercase ${
                      isToday
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bulletin.tag}
                  </span>

                  {isOrganizer && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(bulletin)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                        title="Edit Bulletin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteDailyUpdate && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this daily update bulletin?')) {
                              onDeleteDailyUpdate(bulletin.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors cursor-pointer border border-slate-700"
                          title="Delete Bulletin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-slate-300 mb-4 font-medium leading-relaxed">
                {bulletin.summary}
              </p>

              {/* Matches Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bulletin.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                      m.type === 'night'
                        ? 'bg-slate-950/80 border-amber-500/20'
                        : 'bg-slate-950/50 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-amber-400 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {m.slotTime}
                      </span>
                      {m.type === 'night' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase">
                          <Moon className="w-3 h-3 text-amber-400" /> Under Lights
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                          <Sun className="w-3 h-3 text-amber-400" /> Daylight Match
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base font-display">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disciplinary Verdict Note (if any) */}
              {bulletin.verdictNote && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>{bulletin.verdictNote}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Bulletin Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Edit2 className="w-4 h-4" />
              <span>Organizer Bulletin Management</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Edit Daily Bulletin
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Day Badge:</label>
                  <input
                    type="text"
                    value={editingItem.dayBadge}
                    onChange={e => setEditingItem({ ...editingItem, dayBadge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date:</label>
                  <input
                    type="text"
                    value={editingItem.date}
                    onChange={e => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status Tag:</label>
                  <input
                    type="text"
                    value={editingItem.tag}
                    onChange={e => setEditingItem({ ...editingItem, tag: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category:</label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="upcoming">Upcoming Day</option>
                    <option value="results">Past Results</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.isToday || false}
                      onChange={e => setEditingItem({ ...editingItem, isToday: e.target.checked })}
                    />
                    <span className="text-[11px] text-amber-300 font-bold">Mark as TODAY</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Summary / Header Overview:</label>
                <textarea
                  rows={2}
                  value={editingItem.summary}
                  onChange={e => setEditingItem({ ...editingItem, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              {/* Matches 1 & 2 */}
              {editingItem.matches.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-amber-400 font-bold uppercase font-display">
                    Match {idx + 1} Slot Details
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={m.slotTime}
                      onChange={e => {
                        const updated = [...editingItem.matches];
                        updated[idx].slotTime = e.target.value;
                        setEditingItem({ ...editingItem, matches: updated });
                      }}
                      placeholder="Slot Time"
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                    <select
                      value={m.type}
                      onChange={e => {
                        const updated = [...editingItem.matches];
                        updated[idx].type = e.target.value as any;
                        setEditingItem({ ...editingItem, matches: updated });
                      }}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="daylight">Daylight</option>
                      <option value="night">Under Lights</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={m.title}
                    onChange={e => {
                      const updated = [...editingItem.matches];
                      updated[idx].title = e.target.value;
                      setEditingItem({ ...editingItem, matches: updated });
                    }}
                    placeholder="Match Title"
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={m.subtitle}
                    onChange={e => {
                      const updated = [...editingItem.matches];
                      updated[idx].subtitle = e.target.value;
                      setEditingItem({ ...editingItem, matches: updated });
                    }}
                    placeholder="Match Subtitle"
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                  />
                </div>
              ))}

              <div>
                <label className="block text-slate-400 font-bold mb-1">Disciplinary / Verdict Note (Optional):</label>
                <textarea
                  rows={2}
                  value={editingItem.verdictNote || ''}
                  onChange={e => setEditingItem({ ...editingItem, verdictNote: e.target.value })}
                  placeholder="Official resolution or note..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bulletin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Bulletin Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <Plus className="w-4 h-4" />
              <span>Publish Daily Matchday Bulletin</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Post Tournament Bulletin
            </h3>

            <form onSubmit={handleCreateBulletin} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Day Badge:</label>
                  <input
                    type="text"
                    value={newDayBadge}
                    onChange={e => setNewDayBadge(e.target.value)}
                    placeholder="e.g. DAY 6 · 2ND LEAGUE STAGE"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date:</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="Monday, 07 September 2026"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status Tag:</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="upcoming">Upcoming Day</option>
                    <option value="results">Past Results</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsToday}
                      onChange={e => setNewIsToday(e.target.checked)}
                    />
                    <span className="text-[11px] text-amber-300 font-bold">Mark as TODAY</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Summary Overview:</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Summary of today's key matches..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  required
                />
              </div>

              {/* Match 1 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase font-display">Match 1 (Daylight Slot)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newM1Time}
                    onChange={e => setNewM1Time(e.target.value)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    value={newM1Title}
                    onChange={e => setNewM1Title(e.target.value)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={newM1Subtitle}
                  onChange={e => setNewM1Subtitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                />
              </div>

              {/* Match 2 */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold uppercase font-display">Match 2 (Under Lights Slot)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newM2Time}
                    onChange={e => setNewM2Time(e.target.value)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    value={newM2Title}
                    onChange={e => setNewM2Title(e.target.value)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
                <input
                  type="text"
                  value={newM2Subtitle}
                  onChange={e => setNewM2Subtitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Disciplinary Verdict / Notes (optional):</label>
                <input
                  type="text"
                  value={newVerdictNote}
                  onChange={e => setNewVerdictNote(e.target.value)}
                  placeholder="Optional committee rulings..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md"
                >
                  Publish Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
