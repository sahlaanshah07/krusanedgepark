export interface Player {
  name: string;
  isCaptain?: boolean;
  isReserve?: boolean;
  tag?: string;
}

export interface Team {
  id: string;
  name: string;
  captain: string;
  contact: string;
  players: string[];
  feesPaid: number;
  paymentDetails?: string;
  pool?: string;
  timestamp?: string;
  manualPointsAdjustment?: number;
  manualPointsNote?: string;
}

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'pending';

export type TournamentStatus = 'active' | 'finished';

export interface Match {
  id: string;
  stage: 'inauguration' | 'league' | 'pqf' | 'qf' | 'sf' | 'final';
  roundLabel?: string;
  matchNumber?: number;
  leagueRound?: 1 | 2 | 3;
  isSuggested?: boolean;
  teamAId: string | null;
  teamBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  isWalkover?: boolean;
  walkoverWinnerId?: string;
  status: MatchStatus;
  date: string;
  time: string;
  isNightSlot?: boolean;
  notes?: string;
}

export interface TournamentStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  setsWon: number;
  setsLost: number;
  points: number;
  setDifference: number;
  manualAdjustment?: number;
  manualNote?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export interface PaymentConfig {
  upiId: string;
  payeeName: string;
  feePerTeam: number;
  qrImageUrl?: string;
}

export interface CommitteePerson {
  id: string;
  name: string;
  role: string;
  teamName?: string;
  description?: string;
  isLeadership?: boolean;
}

export interface DisciplinaryCaseItem {
  id: string;
  title: string;
  date: string;
  matchDescription: string;
  verdict: string;
}

export interface DisciplinaryCommitteeData {
  head: {
    name: string;
    role: string;
    description: string;
  };
  boardMembers: CommitteePerson[];
  members: CommitteePerson[];
  rules: string[];
  cases: DisciplinaryCaseItem[];
}

export interface ScheduledMatchItem {
  slotTime: string;
  type: 'daylight' | 'night';
  title: string;
  subtitle?: string;
  teamAName?: string;
  teamBName?: string;
}

export interface DailyUpdateItem {
  id: string;
  dayBadge: string;
  date: string;
  tag: string;
  isToday?: boolean;
  category: 'all' | 'upcoming' | 'results';
  summary: string;
  matches: ScheduledMatchItem[];
  verdictNote?: string;
}
