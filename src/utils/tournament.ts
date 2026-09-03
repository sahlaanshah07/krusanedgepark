import { Team, Match, TournamentStanding } from '../types';

export function computeStandings(teams: Team[], matches: Match[]): TournamentStanding[] {
  const standingsMap = new Map<string, TournamentStanding>();

  teams.forEach(team => {
    standingsMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      lost: 0,
      setsWon: 0,
      setsLost: 0,
      points: 0,
      setDifference: 0
    });
  });

  matches.forEach(match => {
    // Only count competitive league matches for standings
    if (match.stage !== 'league' || match.status !== 'completed' || !match.teamAId || !match.teamBId) {
      return;
    }

    const statA = standingsMap.get(match.teamAId);
    const statB = standingsMap.get(match.teamBId);

    if (!statA || !statB) {
      return;
    }

    // Handle Walkovers (e.g., Match 3: The Cool Setters awarded 3 match points, 0 sets won or lost)
    if (match.isWalkover && match.walkoverWinnerId) {
      statA.played += 1;
      statB.played += 1;
      if (match.walkoverWinnerId === match.teamAId) {
        statA.won += 1;
        statA.points += 3;
        statB.lost += 1;
      } else if (match.walkoverWinnerId === match.teamBId) {
        statB.won += 1;
        statB.points += 3;
        statA.lost += 1;
      }
      return;
    }

    if (match.scoreA === null || match.scoreB === null) {
      return;
    }

    statA.played += 1;
    statB.played += 1;

    statA.setsWon += match.scoreA;
    statA.setsLost += match.scoreB;
    statB.setsWon += match.scoreB;
    statB.setsLost += match.scoreA;

    if (match.scoreA > match.scoreB) {
      statA.won += 1;
      statA.points += 3;
      statB.lost += 1;
    } else if (match.scoreB > match.scoreA) {
      statB.won += 1;
      statB.points += 3;
      statA.lost += 1;
    }
  });

  const list = Array.from(standingsMap.values()).map(item => {
    const team = teams.find(t => t.id === item.teamId);
    const adj = team?.manualPointsAdjustment || 0;
    return {
      ...item,
      points: item.points + adj,
      manualAdjustment: adj !== 0 ? adj : undefined,
      manualNote: team?.manualPointsNote,
      setDifference: item.setsWon - item.setsLost
    };
  });

  list.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.setDifference !== a.setDifference) return b.setDifference - a.setDifference;
    if (b.setsWon !== a.setsWon) return b.setsWon - a.setsWon;
    return a.teamName.localeCompare(b.teamName);
  });

  return list;
}

export function getShareMessage(appUrl: string, nextMatchInfo?: string): string {
  return `🏐 *KRUSAN EDGE TOURNAMENT 2026*\n\n` +
    `Check live scores, today's schedule, points table, and squad rosters:\n` +
    `${appUrl}\n\n` +
    (nextMatchInfo ? `🔥 *Next Up:* ${nextMatchInfo}\n\n` : '') +
    `📍 Venue: Green Park Volleyball Court, Krusan Lolab\n` +
    `Organized by Sahlaan Shah & Shahid Nazir`;
}

/**
 * Parses match date strings like:
 * - "Day 1 (Wed, 02 Sept 2026)"
 * - "Day 3 (Fri, 04 Sept 2026)"
 * - "04 September 2026"
 * - "2026-09-04"
 */
export function parseMatchDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const monthNames: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };

  // 1. Text date format: "04 Sept 2026" or "04 September 2026" or "4 Sep 2026"
  const textDateMatch = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (textDateMatch) {
    const day = parseInt(textDateMatch[1], 10);
    const monthKey = textDateMatch[2].toLowerCase();
    const year = parseInt(textDateMatch[3], 10);
    const month = monthNames[monthKey];
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return { year, month, day };
    }
  }

  // 2. ISO format: "2026-09-04"
  const isoMatch = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10) - 1,
      day: parseInt(isoMatch[3], 10)
    };
  }

  // 3. DD/MM/YYYY format: "04/09/2026"
  const ddmmyyyyMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    return {
      day: parseInt(ddmmyyyyMatch[1], 10),
      month: parseInt(ddmmyyyyMatch[2], 10) - 1,
      year: parseInt(ddmmyyyyMatch[3], 10)
    };
  }

  return null;
}

export type MatchDateRelation = 'today' | 'tomorrow' | null;

/**
 * Evaluates whether a given match date corresponds to today or tomorrow
 * relative to the system date. Also supports month/day matching if system
 * calendar year is different from the tournament year (2026).
 */
export function getMatchDateRelation(dateStr: string, baseDate?: Date): MatchDateRelation {
  const parsed = parseMatchDate(dateStr);
  if (!parsed) return null;

  const now = baseDate || new Date();
  const today = {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate()
  };

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = {
    year: tomorrowDate.getFullYear(),
    month: tomorrowDate.getMonth(),
    day: tomorrowDate.getDate()
  };

  // Standard match (Year, Month, Day)
  if (parsed.year === today.year && parsed.month === today.month && parsed.day === today.day) {
    return 'today';
  }
  if (parsed.year === tomorrow.year && parsed.month === tomorrow.month && parsed.day === tomorrow.day) {
    return 'tomorrow';
  }

  // Fallback: If client system is set to a different year (e.g. 2025), match by month & day
  if (today.year !== 2026) {
    if (parsed.month === today.month && parsed.day === today.day) {
      return 'today';
    }
    if (parsed.month === tomorrow.month && parsed.day === tomorrow.day) {
      return 'tomorrow';
    }
  }

  return null;
}

export interface MatchesDateSummary {
  todayCount: number;
  tomorrowCount: number;
  badgeText: string | null;
  badgeType: 'today' | 'tomorrow' | null;
}

export function getMatchesDateSummary(matches: Match[], baseDate?: Date): MatchesDateSummary {
  let todayCount = 0;
  let tomorrowCount = 0;

  for (const m of matches) {
    const rel = getMatchDateRelation(m.date, baseDate);
    if (rel === 'today') {
      todayCount++;
    } else if (rel === 'tomorrow') {
      tomorrowCount++;
    }
  }

  let badgeText: string | null = null;
  let badgeType: 'today' | 'tomorrow' | null = null;

  if (todayCount > 0) {
    badgeText = `${todayCount} Today`;
    badgeType = 'today';
  } else if (tomorrowCount > 0) {
    badgeText = `${tomorrowCount} Tomorrow`;
    badgeType = 'tomorrow';
  }

  return {
    todayCount,
    tomorrowCount,
    badgeText,
    badgeType
  };
}

/**
 * Parses match date and time into a concrete JavaScript Date object.
 * Automatically aligns with prayer slot times (5:30 PM ASR / 7:20 PM Maghrib).
 */
export function parseMatchDateTime(
  dateStr: string,
  timeStr?: string,
  isNightSlot?: boolean,
  baseDate?: Date
): Date | null {
  const parsed = parseMatchDate(dateStr);
  if (!parsed) return null;

  const now = baseDate || new Date();
  let targetYear = parsed.year;

  // If system year differs from tournament year 2026 (e.g., local 2025 machine clock),
  // align with current system year so countdown reflects relative calendar timing
  if (now.getFullYear() !== 2026) {
    targetYear = now.getFullYear();
  }

  let hours = isNightSlot ? 19 : 17;
  let minutes = isNightSlot ? 20 : 30; // Default 5:30 PM (Day) or 7:20 PM (Night)

  if (timeStr && typeof timeStr === 'string') {
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3]?.toLowerCase();

      if (meridiem === 'pm' && h < 12) {
        h += 12;
      } else if (meridiem === 'am' && h === 12) {
        h = 0;
      } else if (!meridiem && isNightSlot && h < 12) {
        h += 12;
      }
      hours = h;
      minutes = m;
    }
  }

  return new Date(targetYear, parsed.month, parsed.day, hours, minutes, 0, 0);
}

export interface MatchCountdownData {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isLive: boolean; // within 2.5 hours of scheduled start
  isUrgent: boolean; // less than 2 hours to start
  formattedShort: string;
  formattedClock: string;
}

export function calculateMatchCountdown(targetDate: Date, now: Date = new Date()): MatchCountdownData {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    // Check if match started recently (within 2.5 hours)
    const hoursElapsed = Math.abs(diff) / (1000 * 60 * 60);
    const isLive = hoursElapsed <= 2.5;

    return {
      totalMs: diff,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: !isLive,
      isLive,
      isUrgent: isLive,
      formattedShort: isLive ? 'Live On Court' : 'Concluded',
      formattedClock: isLive ? 'LIVE' : 'FINAL'
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const isUrgent = diff < 2 * 60 * 60 * 1000; // less than 2 hours away

  let formattedShort = '';
  if (days > 0) {
    formattedShort = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formattedShort = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    formattedShort = `${minutes}m ${seconds}s`;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedClock = days > 0
    ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    isLive: false,
    isUrgent,
    formattedShort,
    formattedClock
  };
}
