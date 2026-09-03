import React, { useState, useEffect } from 'react';
import { Clock, Zap, Timer, Flame, Sparkles, Trophy, Calendar, Moon, Sun } from 'lucide-react';
import { Match, Team } from '../types';
import { parseMatchDateTime, calculateMatchCountdown, MatchCountdownData } from '../utils/tournament';

interface NextMatchHeroCountdownProps {
  nextMatch: Match | null;
  teamA: Team | null;
  teamB: Team | null;
  onSelectMatch?: (matchId: string) => void;
  onSelectTeam?: (teamId: string) => void;
}

/**
 * Prominent marquee visual countdown timer showcasing the next upcoming clash
 * to build excitement and anticipation for athletes, captains, and spectators.
 */
export const NextMatchHeroCountdown: React.FC<NextMatchHeroCountdownProps> = ({
  nextMatch,
  teamA,
  teamB,
  onSelectMatch,
  onSelectTeam
}) => {
  const [countdown, setCountdown] = useState<MatchCountdownData | null>(null);

  useEffect(() => {
    if (!nextMatch) {
      setCountdown(null);
      return;
    }

    const targetDate = parseMatchDateTime(nextMatch.date, nextMatch.time, nextMatch.isNightSlot);
    if (!targetDate) {
      setCountdown(null);
      return;
    }

    // Immediate initial computation
    setCountdown(calculateMatchCountdown(targetDate));

    // Update every second
    const timer = setInterval(() => {
      setCountdown(calculateMatchCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [nextMatch?.id, nextMatch?.date, nextMatch?.time, nextMatch?.isNightSlot]);

  if (!nextMatch || !countdown || countdown.isPast) {
    return null;
  }

  const isLive = countdown.isLive || nextMatch.status === 'live';
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 sm:p-7 shadow-2xl shadow-amber-500/10">
      {/* Background ambient lighting element */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Match Details */}
        <div className="w-full lg:w-3/5 space-y-3.5 text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-amber-500 text-slate-950 font-display shadow-md shadow-amber-500/20">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Next Upcoming Clash</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-amber-500/30 font-display">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{nextMatch.roundLabel || `Match ${nextMatch.matchNumber || ''}`}</span>
            </span>

            {nextMatch.isNightSlot ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Under Floodlights</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Daylight Slot</span>
              </span>
            )}
          </div>

          {/* Teams Header */}
          <div className="pt-1">
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap font-display">
              <button
                type="button"
                onClick={() => nextMatch.teamAId && onSelectTeam && onSelectTeam(nextMatch.teamAId)}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-white hover:text-amber-400 transition-colors cursor-pointer"
              >
                {teamA ? teamA.name : 'Slot Open'}
              </button>

              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs sm:text-sm font-black uppercase tracking-wider">
                VS
              </span>

              <button
                type="button"
                onClick={() => nextMatch.teamBId && onSelectTeam && onSelectTeam(nextMatch.teamBId)}
                className="text-xl sm:text-2xl lg:text-3xl font-black text-white hover:text-amber-400 transition-colors cursor-pointer"
              >
                {teamB ? teamB.name : 'Slot Open'}
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 mt-1.5 flex-wrap">
              {teamA && <span>Capt: <strong className="text-slate-200">{teamA.captain}</strong></span>}
              {teamA && teamB && <span className="text-slate-600">·</span>}
              {teamB && <span>Capt: <strong className="text-slate-200">{teamB.captain}</strong></span>}
            </div>
          </div>

          {/* Slot, Date & Venue */}
          <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-300 pt-1 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{nextMatch.date}</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{nextMatch.time}</span>
            </span>
          </div>
        </div>

        {/* Right Side: Visual Countdown Digital Display */}
        <div className="w-full lg:w-auto flex flex-col items-center">
          <div className="text-center mb-2 flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 font-display">
              {isLive ? 'Match Status' : 'Countdown to Kickoff'}
            </span>
          </div>

          {isLive ? (
            /* Live Court Indicator */
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 shadow-lg shadow-emerald-500/20 text-center animate-pulse">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-lg sm:text-xl uppercase tracking-wider font-display">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span>Court Action Underway</span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">
                Teams warm up and take court positions at Green Park Krusan
              </p>
            </div>
          ) : (
            /* 4-Block Digital Countdown Display */
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-inner flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                    {pad(countdown.days)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 mt-1 font-display">
                  Days
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-black text-slate-600 mb-5">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-inner flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {pad(countdown.hours)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 mt-1 font-display">
                  Hours
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-black text-slate-600 mb-5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-inner flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                    {pad(countdown.minutes)}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 mt-1 font-display">
                  Mins
                </span>
              </div>

              <span className="text-xl sm:text-2xl font-black text-slate-600 mb-5">:</span>

              {/* Seconds (Animated) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950/90 border border-amber-500/50 shadow-inner flex items-center justify-center relative overflow-hidden">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight animate-pulse">
                    {pad(countdown.seconds)}
                  </span>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-400 mt-1 font-display">
                  Secs
                </span>
              </div>
            </div>
          )}

          {/* Quick jump anchor or match button */}
          {onSelectMatch && (
            <button
              type="button"
              onClick={() => onSelectMatch(nextMatch.id)}
              className="mt-3.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Focus Fixture Card</span>
              <span>↓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface MatchCardCountdownProps {
  dateStr: string;
  timeStr?: string;
  isNightSlot?: boolean;
  status: string;
  isCompact?: boolean;
}

/**
 * A compact, visually dynamic countdown timer badge designed to sit directly on
 * each upcoming match card, displaying remaining days, hours, minutes, and live ticking seconds.
 */
export const MatchCardCountdown: React.FC<MatchCardCountdownProps> = ({
  dateStr,
  timeStr,
  isNightSlot,
  status,
  isCompact = false
}) => {
  const [countdown, setCountdown] = useState<MatchCountdownData | null>(null);

  useEffect(() => {
    if (status !== 'upcoming' && status !== 'pending' && status !== 'live') {
      setCountdown(null);
      return;
    }

    const targetDate = parseMatchDateTime(dateStr, timeStr, isNightSlot);
    if (!targetDate) {
      setCountdown(null);
      return;
    }

    setCountdown(calculateMatchCountdown(targetDate));

    const timer = setInterval(() => {
      setCountdown(calculateMatchCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [dateStr, timeStr, isNightSlot, status]);

  if (!countdown) return null;

  if (countdown.isPast) {
    return null;
  }

  const isLive = status === 'live' || countdown.isLive;
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>Court In Progress</span>
      </span>
    );
  }

  // Urgent styling if < 2 hours
  if (countdown.isUrgent) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[11px] font-bold font-mono shadow-sm animate-pulse">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] uppercase font-bold font-display text-amber-200">Starts in</span>
        <span className="font-extrabold text-amber-300">
          {pad(countdown.hours)}h {pad(countdown.minutes)}m {pad(countdown.seconds)}s
        </span>
      </div>
    );
  }

  // Standard upcoming countdown
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 font-mono ${
        isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={`Starts in ${countdown.formattedShort}`}
    >
      <Timer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
      <span className="text-[10px] font-bold font-display uppercase tracking-wider text-slate-400">
        Starts in:
      </span>
      <div className="flex items-center gap-1 font-bold text-white">
        {countdown.days > 0 && (
          <>
            <span className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
              {countdown.days}d
            </span>
            <span className="text-slate-600">:</span>
          </>
        )}
        <span className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
          {pad(countdown.hours)}h
        </span>
        <span className="text-slate-600">:</span>
        <span className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
          {pad(countdown.minutes)}m
        </span>
        <span className="text-slate-600">:</span>
        <span className="px-1 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-400">
          {pad(countdown.seconds)}s
        </span>
      </div>
    </div>
  );
};
