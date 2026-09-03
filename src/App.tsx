import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ShareBar } from './components/ShareBar';
import { StandingsTable } from './components/StandingsTable';
import { MatchesView } from './components/MatchesView';
import { TeamsView } from './components/TeamsView';
import { DailyUpdatesView } from './components/DailyUpdatesView';
import { FeesView } from './components/FeesView';
import { StructureRulesView } from './components/StructureRulesView';
import { FeedbackView } from './components/FeedbackView';
import { TournamentFlowchart } from './components/TournamentFlowchart';
import { DisciplinaryCommittee } from './components/DisciplinaryCommittee';
import { OrganizerModal } from './components/OrganizerModal';
import {
  Team,
  Match,
  FeedbackItem,
  PaymentConfig,
  DisciplinaryCommitteeData,
  DailyUpdateItem,
  TournamentStatus
} from './types';
import {
  INITIAL_TEAMS,
  INITIAL_MATCHES,
  INITIAL_KNOCKOUTS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_DISCIPLINARY_DATA,
  INITIAL_DAILY_UPDATES,
  OFFICIAL_VENUE
} from './data/initialData';
import { computeStandings, getMatchesDateSummary } from './utils/tournament';
import { Trophy, Share2, Check } from 'lucide-react';

const STORAGE_PREFIX = 'krusan_edge_2026_';

export default function App() {
  // Determine active share URL
  const appUrl = typeof window !== 'undefined' && window.location.href.includes('http')
    ? window.location.origin
    : 'https://ais-pre-atrkax24f3yd24xdga77x6-641177984093.asia-southeast1.run.app';

  // State with LocalStorage Persistence
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}teams_v3`);
      if (saved) {
        const parsed: Team[] = JSON.parse(saved);
        // Ensure every squad has the requested Player 8 slot if missing
        return parsed.map(t => {
          if (t.players.length < 8) {
            return {
              ...t,
              players: [...t.players, 'Player 8']
            };
          }
          return t;
        });
      }
      return INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}matches_v4`);
      if (saved) return JSON.parse(saved);

      const v3 = localStorage.getItem(`${STORAGE_PREFIX}matches_v3`);
      if (v3) {
        const parsed: Match[] = JSON.parse(v3);
        // Preserve any completed match scores from earlier rounds (M-EX, M-1, M-2, M-3, M-4), while taking new 2nd league fixtures (M-7..M-14)
        return INITIAL_MATCHES.map(initM => {
          const oldMatch = parsed.find(m => m.id === initM.id);
          if (oldMatch && oldMatch.status === 'completed' && ['M-EX', 'M-1', 'M-2', 'M-3', 'M-4'].includes(oldMatch.id)) {
            return oldMatch;
          }
          return initM;
        });
      }
      return INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [knockouts, setKnockouts] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}knockouts_v3`);
      return saved ? JSON.parse(saved) : INITIAL_KNOCKOUTS;
    } catch {
      return INITIAL_KNOCKOUTS;
    }
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}payment_v3`);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  });

  const [disciplinaryData, setDisciplinaryData] = useState<DisciplinaryCommitteeData>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}disciplinary_v3`);
      return saved ? JSON.parse(saved) : INITIAL_DISCIPLINARY_DATA;
    } catch {
      return INITIAL_DISCIPLINARY_DATA;
    }
  });

  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdateItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}daily_updates_v4`);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_UPDATES;
    } catch {
      return INITIAL_DAILY_UPDATES;
    }
  });

  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}feedback`);
      return saved ? JSON.parse(saved) : [
        {
          id: 'fb-1',
          name: 'Lolab Sports Council',
          message: 'Heartiest congratulations to the organizers for putting together such a high-spirited volleyball tournament under floodlights!',
          timestamp: '01/09/2026'
        },
        {
          id: 'fb-2',
          name: 'Krusan Youth Fan',
          message: 'The match under lights between Khushal Smashers and Flying Squad was pure excitement! Great officiating.',
          timestamp: '03/09/2026'
        }
      ];
    } catch {
      return [];
    }
  });

  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}tournament_status`);
      return saved === 'finished' ? 'finished' : 'active';
    } catch {
      return 'active';
    }
  });

  const [activeTab, setActiveTab] = useState<string>('matches');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false);
  const [copiedPortalUrl, setCopiedPortalUrl] = useState(false);

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Krusan Edge Tournament 2026',
          text: 'Official Krusan Edge Volleyball Tournament 2026 - Live Daily Fixtures, Points Table & Scores',
          url: appUrl
        });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedPortalUrl(true);
      setTimeout(() => setCopiedPortalUrl(false), 2500);
    } catch {
      setCopiedPortalUrl(true);
      setTimeout(() => setCopiedPortalUrl(false), 2500);
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}teams_v3`, JSON.stringify(teams));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}matches_v4`, JSON.stringify(matches));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}knockouts_v3`, JSON.stringify(knockouts));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [knockouts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}payment_v3`, JSON.stringify(paymentConfig));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [paymentConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}disciplinary_v3`, JSON.stringify(disciplinaryData));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [disciplinaryData]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}daily_updates_v4`, JSON.stringify(dailyUpdates));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [dailyUpdates]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}feedback`, JSON.stringify(feedbackList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [feedbackList]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}tournament_status`, tournamentStatus);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [tournamentStatus]);

  const handleToggleTournamentStatus = () => {
    setTournamentStatus(prev => (prev === 'active' ? 'finished' : 'active'));
  };

  // Compute standings in real time
  const standings = computeStandings(teams, matches);

  // Handlers
  const handleSelectTeam = (teamId: string | null) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
    if (teamId) {
      setTimeout(() => {
        const el = document.getElementById(`team-${teamId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleAuthenticate = (pin: string) => {
    if (pin.trim() === '042339') {
      setIsOrganizer(true);
      return true;
    }
    return false;
  };

  // Match operations
  const handleUpdateMatchResult = (matchId: string, scoreA: number, scoreB: number, notes?: string) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            scoreA,
            scoreB,
            status: 'completed' as const,
            notes: notes || m.notes
          };
        }
        return m;
      })
    );
  };

  const handleAddMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    setKnockouts(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));
  };

  const handleDeleteMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    setKnockouts(prev => prev.filter(m => m.id !== matchId));
  };

  // Team & Player operations
  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
  };

  const handleAddTeam = (newTeam: Team) => {
    setTeams(prev => [...prev, newTeam]);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  // Points Table Adjustment
  const handleAdjustPoints = (teamId: string, adjustment: number, note: string) => {
    setTeams(prev =>
      prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            manualPointsAdjustment: adjustment,
            manualPointsNote: note
          };
        }
        return t;
      })
    );
  };

  // Fees operations
  const handleUpdateTeamFee = (teamId: string, newTotalPaid: number, details: string) => {
    setTeams(prev =>
      prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            feesPaid: newTotalPaid,
            paymentDetails: details
          };
        }
        return t;
      })
    );
  };

  const handleUpdatePaymentConfig = (config: PaymentConfig) => {
    setPaymentConfig(config);
  };

  // Disciplinary operations
  const handleUpdateDisciplinaryData = (newData: DisciplinaryCommitteeData) => {
    setDisciplinaryData(newData);
  };

  // Daily Updates operations
  const handleAddDailyUpdate = (item: DailyUpdateItem) => {
    setDailyUpdates(prev => [item, ...prev]);
  };

  const handleUpdateDailyUpdate = (item: DailyUpdateItem) => {
    setDailyUpdates(prev => prev.map(u => u.id === item.id ? item : u));
  };

  const handleDeleteDailyUpdate = (id: string) => {
    setDailyUpdates(prev => prev.filter(u => u.id !== id));
  };

  const handleResetData = () => {
    setTeams(INITIAL_TEAMS);
    setMatches(INITIAL_MATCHES);
    setKnockouts(INITIAL_KNOCKOUTS);
    setPaymentConfig(INITIAL_PAYMENT_CONFIG);
    setDisciplinaryData(INITIAL_DISCIPLINARY_DATA);
    setDailyUpdates(INITIAL_DAILY_UPDATES);
    setTournamentStatus('active');
    localStorage.removeItem(`${STORAGE_PREFIX}teams_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}matches_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}matches_v4`);
    localStorage.removeItem(`${STORAGE_PREFIX}knockouts_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}payment_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}disciplinary_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}daily_updates_v3`);
    localStorage.removeItem(`${STORAGE_PREFIX}daily_updates_v4`);
    localStorage.removeItem(`${STORAGE_PREFIX}tournament_status`);
    alert('Tournament data has been reset to the official data from the PDF!');
  };

  const handleSubmitFeedback = (name: string, message: string) => {
    const newItem: FeedbackItem = {
      id: `fb-${Date.now()}`,
      name,
      message,
      timestamp: new Date().toLocaleDateString('en-GB')
    };
    setFeedbackList(prev => [newItem, ...prev]);
  };

  // Next match text for WhatsApp broadcast
  const nextMatch = matches.find(m => m.status === 'upcoming');
  const nextMatchText = nextMatch
    ? `${teams.find(t => t.id === nextMatch.teamAId)?.name || 'TBD'} vs ${teams.find(t => t.id === nextMatch.teamBId)?.name || 'TBD'} (${nextMatch.time})`
    : undefined;

  // Visual notification badge on Matches tab based on system date
  const matchesDateSummary = useMemo(() => {
    return getMatchesDateSummary([...matches, ...knockouts]);
  }, [matches, knockouts]);

  const matchesBadge = matchesDateSummary.badgeText && matchesDateSummary.badgeType
    ? {
        text: matchesDateSummary.badgeText,
        type: matchesDateSummary.badgeType,
        count: matchesDateSummary.badgeType === 'today' ? matchesDateSummary.todayCount : matchesDateSummary.tomorrowCount
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* 1. Header Banner */}
      <Header
        teams={teams}
        matches={matches}
        onOpenTeam={handleSelectTeam}
        onSelectTab={setActiveTab}
        onOpenOrganizer={() => setIsOrganizerModalOpen(true)}
        isOrganizerMode={isOrganizer}
        tournamentStatus={tournamentStatus}
      />

      {/* 2. Direct Share Bar */}
      <ShareBar appUrl={appUrl} nextMatchText={nextMatchText} />

      {/* 3. Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        teamCount={teams.length}
        matchesBadge={matchesBadge}
      />

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'matches' && (
          <MatchesView
            matches={matches}
            knockouts={knockouts}
            teams={teams}
            onSelectTeam={handleSelectTeam}
            isOrganizer={isOrganizer}
            onAddMatch={handleAddMatch}
            onUpdateMatch={handleUpdateMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsTable
            standings={standings}
            teams={teams}
            onSelectTeam={handleSelectTeam}
            isOrganizer={isOrganizer}
            onAdjustPoints={handleAdjustPoints}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            teams={teams}
            standings={standings}
            selectedTeamId={selectedTeamId}
            onSelectTeam={handleSelectTeam}
            isOrganizer={isOrganizer}
            onUpdateTeam={handleUpdateTeam}
            onAddTeam={handleAddTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        )}

        {activeTab === 'updates' && (
          <DailyUpdatesView
            matches={matches}
            teams={teams}
            appUrl={appUrl}
            dailyUpdates={dailyUpdates}
            onAddDailyUpdate={handleAddDailyUpdate}
            onUpdateDailyUpdate={handleUpdateDailyUpdate}
            onDeleteDailyUpdate={handleDeleteDailyUpdate}
            isOrganizer={isOrganizer}
          />
        )}

        {activeTab === 'fees' && (
          <FeesView
            teams={teams}
            paymentConfig={paymentConfig}
            isOrganizer={isOrganizer}
            onUpdateTeamFee={handleUpdateTeamFee}
            onUpdatePaymentConfig={handleUpdatePaymentConfig}
          />
        )}

        {activeTab === 'flowchart' && <TournamentFlowchart />}

        {activeTab === 'committee' && (
          <DisciplinaryCommittee
            data={disciplinaryData}
            onUpdateData={handleUpdateDisciplinaryData}
            isOrganizer={isOrganizer}
          />
        )}

        {activeTab === 'structure' && <StructureRulesView />}

        {activeTab === 'feedback' && (
          <FeedbackView
            feedbackList={feedbackList}
            onSubmitFeedback={handleSubmitFeedback}
            isOrganizer={isOrganizer}
          />
        )}
      </main>

      {/* 5. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-slate-300 font-display font-bold uppercase tracking-wider text-sm">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Krusan Edge Tournament 2026</span>
          </div>
          <p className="max-w-xl mx-auto text-slate-400">
            Official digital bulletin board for players, captains, and supporters.
            Held at {OFFICIAL_VENUE}.
          </p>
          <div className="pt-2 text-[11px] text-slate-600">
            Organized by Sahlaan Shah (+91 8082996690) &amp; Shahid Nazir (+91 8492092098) · Referees: Danish Fayaz &amp; Sahlaan Shah
          </div>
        </div>
      </footer>

      {/* 6. Floating Action Button for Generic Share */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={handleShareApp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display text-xs shadow-xl shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
          title="Share tournament link"
        >
          {copiedPortalUrl ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedPortalUrl ? 'Link Copied!' : 'Share Tournament'}</span>
        </button>
      </div>

      {/* 7. Organizer Mode Modal */}
      <OrganizerModal
        isOpen={isOrganizerModalOpen}
        onClose={() => setIsOrganizerModalOpen(false)}
        isOrganizer={isOrganizer}
        onAuthenticate={handleAuthenticate}
        onExitOrganizer={() => setIsOrganizer(false)}
        matches={matches}
        knockouts={knockouts}
        teams={teams}
        feePerTeam={paymentConfig.feePerTeam || 1600}
        tournamentStatus={tournamentStatus}
        onToggleTournamentStatus={handleToggleTournamentStatus}
        onUpdateMatchResult={handleUpdateMatchResult}
        onUpdateTeamFee={handleUpdateTeamFee}
        onResetData={handleResetData}
        onAddMatch={handleAddMatch}
        onUpdateMatch={handleUpdateMatch}
        onAddTeam={handleAddTeam}
        onAdjustPoints={handleAdjustPoints}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
