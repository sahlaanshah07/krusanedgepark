import React from 'react';
import { MapPin, Phone, Shield, Trophy, Users, Moon, Calendar, Lock } from 'lucide-react';
import { Team, Match, TournamentStatus } from '../types';
import { OFFICIAL_VENUE, MAPS_URL, ORGANIZERS, REFEREES } from '../data/initialData';

interface HeaderProps {
  teams: Team[];
  matches: Match[];
  onOpenTeam: (teamId: string) => void;
  onSelectTab: (tab: string) => void;
  onOpenOrganizer: () => void;
  isOrganizerMode: boolean;
  tournamentStatus?: TournamentStatus;
}

export const Header: React.FC<HeaderProps> = ({
  teams,
  matches,
  onOpenTeam,
  onSelectTab,
  onOpenOrganizer,
  isOrganizerMode,
  tournamentStatus = 'active'
}) => {
  const nextMatch = matches.find(m => m.status === 'upcoming') ||
    matches.find(m => m.status === 'pending' && m.teamAId);

  const completedMatches = matches.filter(m => m.status === 'completed');
  const lastMatch = completedMatches.length > 0 ? completedMatches[completedMatches.length - 1] : null;

  const getTeamName = (id: string | null) => {
    if (!id) return 'TBD';
    const found = teams.find(t => t.id === id);
    return found ? found.name : 'TBD';
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 border-b-4 border-amber-500 pt-8 pb-7 px-4 sm:px-6 lg:px-8">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-repeat bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px] pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-5">
        {/* Top bar: Venue & Admin status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 hover:text-amber-400 hover:bg-emerald-800/80 border border-emerald-600/30 font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{OFFICIAL_VENUE}</span>
          </a>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium">
              <span>krusanedge</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              tournamentStatus === 'finished'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${tournamentStatus === 'finished' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{tournamentStatus === 'finished' ? 'Tournament Finished' : 'Active'}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Lolab Valley, J&amp;K
            </span>

            <button
              onClick={onOpenOrganizer}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isOrganizerMode
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/90 text-amber-400 hover:bg-slate-800 border border-amber-500/40'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isOrganizerMode ? 'Admin Active' : 'Organizer Mode'}</span>
            </button>
          </div>
        </div>

        {/* Tournament Brand Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm font-display">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Official Volleyball Championship · Krusan Lolab</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-none">
            KRUSAN EDGE <span className="text-amber-400">TOURNAMENT 2026</span>
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            A prestigious local volleyball championship promoting unity, discipline, sportsmanship, teamwork,
            and positive youth engagement across Krusan Lolab.
          </p>
        </div>

        {/* Live Status Bar Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => onSelectTab('teams')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-850 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{teams.length} Registered Teams</span>
          </button>

          {nextMatch && (
            <button
              onClick={() => onSelectTab('matches')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Next: {getTeamName(nextMatch.teamAId)} vs {getTeamName(nextMatch.teamBId)} ({nextMatch.time})
              </span>
              {nextMatch.isNightSlot && <Moon className="w-3.5 h-3.5 text-amber-300" />}
            </button>
          )}

          {lastMatch && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 text-xs">
              <span className="text-emerald-400 font-semibold">Latest Result:</span>
              <span>
                {getTeamName(lastMatch.teamAId)} {lastMatch.scoreA}–{lastMatch.scoreB} {getTeamName(lastMatch.teamBId)}
              </span>
            </div>
          )}
        </div>

        {/* Organizers & Referees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-display">Organizers</div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-slate-200">
                {ORGANIZERS.map((org, i) => (
                  <span key={org.name} className="inline-flex items-center gap-1">
                    <span>{org.name}</span>
                    <a
                      href={`tel:${org.tel}`}
                      className="text-amber-400 hover:text-amber-300 inline-flex items-center"
                      title={`Call ${org.name}`}
                    >
                      <Phone className="w-3 h-3 ml-0.5" />
                    </a>
                    {i < ORGANIZERS.length - 1 && <span className="text-slate-600">·</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-display">Official Referees</div>
              <div className="text-xs font-semibold text-slate-200">
                {REFEREES.join(' · ')}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-display">Match Timings</div>
              <div className="text-xs text-slate-300 font-medium">
                Daylight: 5:30/5:45 PM · Floodlights: 7:20/7:45 PM
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
