import React from 'react';
import { Calendar, Award, Users, Clock, CreditCard, BookOpen, MessageSquare, GitFork, Scale } from 'lucide-react';

export interface MatchesTabBadge {
  text: string;
  type: 'today' | 'tomorrow';
  count: number;
}

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  teamCount: number;
  matchesBadge?: MatchesTabBadge | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  teamCount,
  matchesBadge
}) => {
  const tabs = [
    { id: 'matches', label: 'Matches & Fixtures', icon: Calendar },
    { id: 'standings', label: 'Points Table', icon: Award },
    { id: 'flowchart', label: 'Flowchart', icon: GitFork },
    { id: 'committee', label: 'Disciplinary Committee', icon: Scale },
    { id: 'teams', label: `Teams (${teamCount})`, icon: Users },
    { id: 'updates', label: 'Daily Updates', icon: Clock },
    { id: 'fees', label: 'Fee Clearance', icon: CreditCard },
    { id: 'structure', label: 'Rules & Format', icon: BookOpen },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ];

  return (
    <nav className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-display text-xs sm:text-sm uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>

              {tab.id === 'matches' && matchesBadge && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-display ${
                    matchesBadge.type === 'today'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  }`}
                  title={`${matchesBadge.count} matches scheduled for ${matchesBadge.type}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      matchesBadge.type === 'today'
                        ? 'bg-slate-950 animate-ping'
                        : 'bg-sky-400 animate-pulse'
                    }`}
                  />
                  <span>{matchesBadge.text}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
