import React from 'react';
import { BookOpen, Trophy, ShieldAlert, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export const StructureRulesView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold uppercase tracking-wide font-display text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <span>Tournament Structure &amp; Official Rules</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Governing regulations and competition blueprint for Krusan Edge Tournament 2026.
        </p>
      </div>

      {/* Visual Tournament Flow Diagram */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-display mb-4">
          Official Tournament Qualification Pathway:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center relative">
            <div className="text-2xl font-extrabold text-amber-400 font-display">18</div>
            <div className="text-xs font-bold uppercase text-slate-200 mt-1 font-display">League Matches</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Every team plays 3 league matches. Top 4 advance straight to QF.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center relative">
            <div className="text-2xl font-extrabold text-amber-300 font-display">8</div>
            <div className="text-xs font-bold uppercase text-slate-200 mt-1 font-display">Pre-QF Teams</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Teams ranked 5th to 12th clash in 4 single-elimination play-in ties.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center relative">
            <div className="text-2xl font-extrabold text-emerald-400 font-display">8</div>
            <div className="text-xs font-bold uppercase text-slate-200 mt-1 font-display">Quarterfinalists</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Top 4 direct qualifiers + 4 Pre-Quarterfinal play-in winners.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center relative">
            <div className="text-2xl font-extrabold text-indigo-400 font-display">4</div>
            <div className="text-xs font-bold uppercase text-slate-200 mt-1 font-display">Semifinalists</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Winners of QF 1-4 battle for a spot in the final showdown.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-center relative">
            <div className="text-2xl font-extrabold text-amber-300 font-display flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-amber-400 inline" /> 1
            </div>
            <div className="text-xs font-bold uppercase text-amber-300 mt-1 font-display">Champion</div>
            <div className="text-[11px] text-amber-200/80 mt-1">
              Grand Final winner crowned champion of Krusan Lolab.
            </div>
          </div>
        </div>
      </div>

      {/* Official Rules & Regulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scoring & Standings */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-lg uppercase">
            <Award className="w-5 h-5" />
            <span>Points System &amp; Tie-Breakers</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <span><strong>Match Points:</strong> 3 Points for a Match Win · 0 Points for a Match Loss.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <span><strong>Match Duration:</strong> All matches are Best-of-3 Sets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong>Tie-Breaking Order:</strong> When teams finish equal on points, standings are determined strictly by:
                <br />
                1. Highest total points
                <br />
                2. Set Difference (Sets Won minus Sets Lost)
                <br />
                3. Total Sets Won
                <br />
                4. Head-to-Head result between the tied teams
              </span>
            </li>
          </ul>
        </div>

        {/* Residency & Eligibility */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-lg uppercase">
            <CheckCircle2 className="w-5 h-5" />
            <span>Residency &amp; Squad Eligibility</span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span><strong>Local Residency:</strong> All registered players must be bona fide residents of Krusan Lolab.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span><strong>Single Team Representation:</strong> A player registered with one team cannot participate or play for any other team under any circumstances.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span><strong>Squad Composition:</strong> Each squad consists of up to 7–8 players (6 on court + designated reserve/substitutes).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Code of Conduct & Captain's Responsibility */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-lg uppercase">
          <ShieldAlert className="w-5 h-5" />
          <span>Captain's Responsibility &amp; Disciplinary Code</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          As signed and acknowledged by all 12 team captains during official team registration:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">1. Punctuality &amp; Walkover:</strong>
            Teams must report to the Green Park Volleyball Court at least 15 minutes before the scheduled start time. Teams failing to report may forfeit the match via walkover.
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">2. Absolute Authority of Referees:</strong>
            The on-court decision of the referee is final and incontestable. Dissent or disrespectful gestures will attract immediate penalties.
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">3. Team Captain Liability:</strong>
            Captains bear personal and collective responsibility for the conduct and discipline of their players and traveling supporters.
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-white block mb-1">4. Disqualification Clause:</strong>
            Any physical altercation, verbal abuse, or unsporting conduct will result in immediate disqualification of the offending team and disciplinary ban.
          </div>
        </div>
      </div>
    </div>
  );
};
