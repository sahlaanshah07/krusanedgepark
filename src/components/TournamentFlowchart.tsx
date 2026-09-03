import React, { useState } from 'react';
import { GitFork, Trophy, Shield, ArrowDown, Award, Sparkles, Check, Copy, Info } from 'lucide-react';

export const TournamentFlowchart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');
  const [copiedAscii, setCopiedAscii] = useState(false);

  const asciiTree = `                    KRUSAN EDGE TOURNAMENT
                              │
                              ▼
                       12 PARTICIPATING
                            TEAMS
                              │
                              ▼
                    ┌──────────────────┐
                    │   LEAGUE STAGE   │
                    │  3 MATCHES EACH  │
                    │   18 MATCHES     │
                    └────────┬─────────┘
                             │
                             ▼
                     FINAL LEAGUE TABLE
                      RANK 1 ──── 12
                             │
             ┌───────────────┴────────────────┐
             │                                │
             ▼                                ▼
       ┌─────────────┐                 ┌──────────────┐
       │ RANK 1–4    │                 │ RANK 5–12    │
       │ DIRECT QF   │                 │ PRE-QF       │
       └──────┬──────┘                 └──────┬───────┘
              │                               │
              │                     ┌─────────┴─────────┐
              │                     │                   │
              │                     ▼                   ▼
              │              PQF 1: 5 vs 12      PQF 2: 6 vs 11
              │              PQF 3: 7 vs 10      PQF 4: 8 vs 9
              │                     │                   │
              │                     └─────────┬─────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                       QUARTERFINALS
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
             QF1             QF2             QF3             QF4
          1st vs PQF4     2nd vs PQF3     3rd vs PQF2     4th vs PQF1
              │               │               │               │
              └───────────────┼───────────────┘
                              ▼
                         SEMIFINALS
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
               SF 1                      SF 2
                 │                         │
                 └────────────┬────────────┘
                              ▼
                         GRAND FINAL
                              │
                              ▼
                       🏆 CHAMPION 🏆`;

  const handleCopyAscii = async () => {
    try {
      await navigator.clipboard.writeText(asciiTree);
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    } catch {
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
            <GitFork className="w-6 h-6 text-amber-400" />
            <span>Tournament Progression Flowchart</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Complete qualification pathway: 3 League Matches &rarr; Pre-Quarterfinals (Rank 5–12) &rarr; Quarterfinals &rarr; Semifinals &rarr; Grand Final.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Visual
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-3 py-1.5 rounded-lg font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                viewMode === 'ascii'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Official Flow Diagram
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'ascii' ? (
        /* ASCII View */
        <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-x-auto">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Official Structure Blueprint (18 League + 4 PQF + 4 QF + 2 SF + 1 Final)
            </span>
            <button
              onClick={handleCopyAscii}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAscii ? 'Copied' : 'Copy Diagram'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed overflow-x-auto selection:bg-amber-500 selection:text-slate-950">
            {asciiTree}
          </pre>
        </div>
      ) : (
        /* Visual Interactive Node Tree */
        <div className="space-y-6">
          {/* Level 1: Tournament Title */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-2 border-amber-500 shadow-lg shadow-amber-500/10">
              <div className="flex items-center gap-2 text-amber-400 font-display font-extrabold uppercase tracking-widest text-sm">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>KRUSAN EDGE TOURNAMENT 2026</span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                12 Participating Teams · Green Park Court, Herpora Krusan
              </p>
            </div>
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 2: League Stage */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-xl hover:border-slate-700 transition-all">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-display uppercase tracking-wider mb-2">
                Stage 1: Round-Robin League
              </div>
              <h3 className="text-lg font-extrabold text-white font-display uppercase">
                3 League Matches Per Team · 18 Matches Total
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Daily 2 matches: 5:30 PM (After ASR) &amp; 7:20 PM (Under Lights after Maghrib).
                Every team plays 3 opponents. Win = 3 Pts, Loss = 0 Pts, Set difference breaks ties.
              </p>
            </div>
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 3: Final League Table Split */}
          <div className="w-full max-w-3xl mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">
              Combined League Standings Table (Rank 1 to 12)
            </span>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {/* Top 4 Pathway */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase font-display">
                    Rank 1, 2, 3, 4
                  </span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display uppercase">
                  Direct Quarterfinal Entry
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The top 4 teams in the league table skip the play-in round and are seeded directly into the Quarterfinals with extra rest days.
                </p>
              </div>

              {/* Rank 5-12 Pathway */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase font-display">
                    Rank 5 to 12
                  </span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white font-display uppercase">
                  Pre-Quarterfinal Play-in (PQF)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Remaining 8 teams battle in 4 knockout play-in matches. Only the 4 winners join the top 4 in the Quarterfinals!
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 4: Pre-Quarterfinals Grid */}
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                Pre-Quarterfinals (4 Knockout Clashes)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {[
                { title: 'PQF 1', matchup: '5th Place vs 12th Place', target: 'Winner plays 4th Place in QF4' },
                { title: 'PQF 2', matchup: '6th Place vs 11th Place', target: 'Winner plays 3rd Place in QF3' },
                { title: 'PQF 3', matchup: '7th Place vs 10th Place', target: 'Winner plays 2nd Place in QF2' },
                { title: 'PQF 4', matchup: '8th Place vs 9th Place', target: 'Winner plays 1st Place in QF1' }
              ].map(pqf => (
                <div key={pqf.title} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-1">
                  <div className="text-xs font-bold text-amber-400 font-display uppercase">{pqf.title}</div>
                  <div className="text-xs font-extrabold text-white font-display">{pqf.matchup}</div>
                  <div className="text-[10px] text-slate-400">{pqf.target}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 5: Quarterfinals Grid */}
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
                Quarterfinals (Top 4 League + 4 PQF Winners)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {[
                { qf: 'QF 1', pairing: 'Rank 1st vs Winner PQF 4', dest: 'Advances to Semifinal 1' },
                { qf: 'QF 2', pairing: 'Rank 2nd vs Winner PQF 3', dest: 'Advances to Semifinal 1' },
                { qf: 'QF 3', pairing: 'Rank 3rd vs Winner PQF 2', dest: 'Advances to Semifinal 2' },
                { qf: 'QF 4', pairing: 'Rank 4th vs Winner PQF 1', dest: 'Advances to Semifinal 2' }
              ].map(item => (
                <div key={item.qf} className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-center space-y-1">
                  <div className="text-xs font-bold text-emerald-400 font-display uppercase">{item.qf}</div>
                  <div className="text-xs font-extrabold text-white font-display">{item.pairing}</div>
                  <div className="text-[10px] text-slate-400">{item.dest}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 6: Semifinals */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display">
                Semifinals (Final 4)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <div className="text-xs font-bold text-amber-400 font-display uppercase">Semifinal 1</div>
                <div className="text-sm font-extrabold text-white font-display">Winner QF 1 vs Winner QF 2</div>
                <div className="text-[11px] text-slate-400">Winner to Grand Final</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <div className="text-xs font-bold text-amber-400 font-display uppercase">Semifinal 2</div>
                <div className="text-sm font-extrabold text-white font-display">Winner QF 3 vs Winner QF 4</div>
                <div className="text-[11px] text-slate-400">Winner to Grand Final</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-6 h-6 text-amber-500/60 my-2" />
          </div>

          {/* Level 7: Grand Final & Trophy */}
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-display">
                  Championship Decider
                </span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="text-2xl font-black uppercase text-white font-display tracking-wide">
                GRAND FINAL
              </h3>
              <div className="text-sm font-bold text-slate-300 mt-1">
                Winner Semifinal 1 vs Winner Semifinal 2
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/30 flex items-center justify-center gap-2 text-amber-300 font-display font-extrabold text-base">
                <span>🏆 KRUSAN EDGE 2026 CHAMPION 🏆</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
