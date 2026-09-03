import React, { useState } from 'react';
import { ShieldCheck, Scale, Award, Users, AlertTriangle, ShieldAlert, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { DisciplinaryCommitteeData, CommitteePerson, DisciplinaryCaseItem } from '../types';

interface DisciplinaryCommitteeProps {
  data?: DisciplinaryCommitteeData;
  onUpdateData?: (newData: DisciplinaryCommitteeData) => void;
  isOrganizer?: boolean;
}

export const DisciplinaryCommittee: React.FC<DisciplinaryCommitteeProps> = ({
  data,
  onUpdateData,
  isOrganizer
}) => {
  // If data is passed as prop, use it; otherwise fallback
  const committee = data || {
    head: {
      name: 'Danish Fayaz',
      role: 'Official Tournament Referee & Committee Chairman',
      description: 'Empowered with final authority on refereeing decisions, on-court decorum, and compliance with official volleyball technical standards.'
    },
    boardMembers: [
      {
        id: 'bm-1',
        name: 'Bashir Shah',
        role: 'Captain, Legend Strikers · Disciplinary Board Member',
        teamName: 'Legend Strikers',
        description: 'Veteran sports leader representing player welfare, sportsmanship ethics, and resolving multi-team disputes.',
        isLeadership: true
      },
      {
        id: 'bm-2',
        name: 'Sajad Ahmad Tantray',
        role: 'Captain, Tantray Brothers · Disciplinary Board Member',
        teamName: 'Tantray Brothers',
        description: 'Co-leads captain consensus, ground conduct policies, and punctuality monitoring before kickoff times.',
        isLeadership: true
      }
    ],
    members: [
      { id: 'm-1', name: 'Md Amin', role: 'Captain', teamName: 'Dream Team Krusan' },
      { id: 'm-2', name: 'Mohammad Ishaq Khan', role: 'Captain', teamName: 'I3A3 Brothers' },
      { id: 'm-3', name: 'Showkat', role: 'Captain', teamName: 'The Cool Setters' },
      { id: 'm-4', name: 'Sharib Tantry', role: 'Captain', teamName: 'FVC Krusan' },
      { id: 'm-5', name: 'Burhan Naseer', role: 'Captain', teamName: 'Genz Sports' },
      { id: 'm-6', name: 'Tariq Ahmad Mir', role: 'Captain', teamName: 'Flying Squad Shartpora' },
      { id: 'm-7', name: 'Momin Nazir', role: 'Captain', teamName: 'All Stars' },
      { id: 'm-8', name: 'Bhat Faisal', role: 'Captain', teamName: 'Khushal Smashers' },
      { id: 'm-9', name: 'Shahid Shafi Khan', role: 'Captain', teamName: 'Khan Sports' },
      { id: 'm-10', name: 'Shamik Zahoor', role: 'Captain', teamName: 'The Aces' }
    ],
    rules: [
      'Punctuality & 15-Minute Rule: Teams must report 15 minutes before the scheduled prayer-aligned start time (5:30 PM after ASR / 7:20 PM after Maghrib).',
      'Zero Tolerance for Misconduct: Any abuse, disrespect, or physical altercations with referees or opposing squad members leads to immediate disciplinary sanction.',
      'Residency & Single-Team Representation: All rostered athletes must strictly belong to Krusan Lolab and cannot represent more than one team.',
      'Decisions Final: Verdicts resolved by Danish Fayaz, Bashir Shah, and Sajad Ahmad Tantray in consultation with committee captains are final and binding.'
    ],
    cases: [
      {
        id: 'case-1',
        title: 'Case 01 · Day 2 (Match 3) Ruling',
        date: '03/09/2026',
        matchDescription: 'The Cool Setters vs Dream Team Krusan: Following multiple attempts by tournament organizers to contact Dream Team Krusan and ensure their attendance, the squad failed to report to the court.',
        verdict: 'Match awarded as a Walkover to The Cool Setters (3 match points, no sets won or lost) under Article 2 of the Tournament Regulations.'
      }
    ]
  };

  // Modals state
  const [isEditingHead, setIsEditingHead] = useState(false);
  const [headName, setHeadName] = useState(committee.head.name);
  const [headRole, setHeadRole] = useState(committee.head.role);
  const [headDesc, setHeadDesc] = useState(committee.head.description);

  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [caseVerdict, setCaseVerdict] = useState('');

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Captain');
  const [newMemberTeam, setNewMemberTeam] = useState('');
  const [newMemberIsBoard, setNewMemberIsBoard] = useState(false);
  const [newMemberDesc, setNewMemberDesc] = useState('');

  const handleSaveHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateData) return;
    onUpdateData({
      ...committee,
      head: {
        name: headName,
        role: headRole,
        description: headDesc
      }
    });
    setIsEditingHead(false);
  };

  const handleOpenCaseModal = (c?: DisciplinaryCaseItem) => {
    if (c) {
      setEditingCaseId(c.id);
      setCaseTitle(c.title);
      setCaseDate(c.date);
      setCaseDescription(c.matchDescription);
      setCaseVerdict(c.verdict);
    } else {
      setEditingCaseId(null);
      setCaseTitle(`Case 0${committee.cases.length + 1} Ruling`);
      setCaseDate(new Date().toLocaleDateString('en-GB'));
      setCaseDescription('');
      setCaseVerdict('');
    }
    setIsCaseModalOpen(true);
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateData) return;

    if (editingCaseId) {
      const updatedCases = committee.cases.map(c =>
        c.id === editingCaseId
          ? { ...c, title: caseTitle, date: caseDate, matchDescription: caseDescription, verdict: caseVerdict }
          : c
      );
      onUpdateData({ ...committee, cases: updatedCases });
    } else {
      const newCase: DisciplinaryCaseItem = {
        id: `case-${Date.now()}`,
        title: caseTitle,
        date: caseDate,
        matchDescription: caseDescription,
        verdict: caseVerdict
      };
      onUpdateData({ ...committee, cases: [...committee.cases, newCase] });
    }

    setIsCaseModalOpen(false);
  };

  const handleDeleteCase = (id: string) => {
    if (!onUpdateData) return;
    if (confirm('Delete this disciplinary case record?')) {
      onUpdateData({
        ...committee,
        cases: committee.cases.filter(c => c.id !== id)
      });
    }
  };

  const handleSaveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateData || !newMemberName) return;

    const newPerson: CommitteePerson = {
      id: `p-${Date.now()}`,
      name: newMemberName,
      role: newMemberRole,
      teamName: newMemberTeam,
      description: newMemberDesc,
      isLeadership: newMemberIsBoard
    };

    if (newMemberIsBoard) {
      onUpdateData({
        ...committee,
        boardMembers: [...committee.boardMembers, newPerson]
      });
    } else {
      onUpdateData({
        ...committee,
        members: [...committee.members, newPerson]
      });
    }

    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberTeam('');
    setNewMemberDesc('');
  };

  const handleDeleteBoardMember = (id: string) => {
    if (!onUpdateData) return;
    if (confirm('Remove this board member from the committee?')) {
      onUpdateData({
        ...committee,
        boardMembers: committee.boardMembers.filter(m => m.id !== id)
      });
    }
  };

  const handleDeleteCaptainMember = (id: string) => {
    if (!onUpdateData) return;
    if (confirm('Remove this representative member from the committee?')) {
      onUpdateData({
        ...committee,
        members: committee.members.filter(m => m.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
            <Scale className="w-4 h-4" />
            <span>Fair Play &amp; Code of Conduct</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide font-display text-white">
            Tournament Disciplinary Committee
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Formed to ensure the Krusan Edge Tournament is conducted with the utmost professional spirit,
            uncompromising discipline, fair play, and strict adherence to all competition rules and regulations.
          </p>
        </div>

        {isOrganizer && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Member</span>
            </button>
            <button
              onClick={() => handleOpenCaseModal()}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider font-display inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Ruling</span>
            </button>
          </div>
        )}
      </div>

      {/* Leadership / Head Panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-display flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Committee Executive Leadership (Headed by)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Head: Danish Fayaz */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 relative overflow-hidden shadow-xl">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold font-display uppercase tracking-wider">
                Committee Chairman
              </span>
              <div className="flex items-center gap-1.5">
                {isOrganizer && (
                  <button
                    onClick={() => {
                      setHeadName(committee.head.name);
                      setHeadRole(committee.head.role);
                      setHeadDesc(committee.head.description);
                      setIsEditingHead(true);
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors cursor-pointer"
                    title="Edit Chairman Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xl font-extrabold text-white font-display uppercase tracking-wide">
                {committee.head.name}
              </h4>
              <p className="text-xs text-amber-300 font-semibold mt-0.5 font-display">
                {committee.head.role}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {committee.head.description}
              </p>
            </div>
          </div>

          {/* Board Members */}
          {committee.boardMembers.map(member => (
            <div
              key={member.id || member.name}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold font-display uppercase tracking-wider">
                    Disciplinary Board
                  </span>
                  <div className="flex items-center gap-1">
                    {isOrganizer && (
                      <button
                        onClick={() => handleDeleteBoardMember(member.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Board Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Scale className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-xl font-extrabold text-white font-display uppercase tracking-wide">
                    {member.name}
                  </h4>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5 font-display">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {member.description || 'Veteran sports leader representing player welfare, sportsmanship ethics, and resolving multi-team disputes.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Committee Members: Team Captains */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Committee Members (Team Captains)</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">{committee.members.length} Captain Members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {committee.members.map(member => (
            <div
              key={member.id || member.name}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-bold text-white font-display">
                  {member.name}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {member.role} {member.teamName && <span>· <strong className="text-amber-400/90">{member.teamName}</strong></span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Disciplinary Representative" />
                {isOrganizer && (
                  <button
                    onClick={() => handleDeleteCaptainMember(member.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Committee Mandate & Ruling Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Code of Enforcement */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Committee Code of Enforcement</span>
            </h4>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
            {committee.rules.map((rule, idx) => (
              <li key={idx}>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Case Resolutions List */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Official Disciplinary Case Resolutions</span>
            </h4>

            {isOrganizer && (
              <button
                onClick={() => handleOpenCaseModal()}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Ruling</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {committee.cases.map(caseItem => (
              <div key={caseItem.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase font-display">
                    {caseItem.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">{caseItem.date}</span>
                    {isOrganizer && (
                      <>
                        <button
                          onClick={() => handleOpenCaseModal(caseItem)}
                          className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Edit Ruling"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCase(caseItem.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Ruling"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {caseItem.matchDescription}
                </p>

                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
                  <strong>Official Verdict:</strong> {caseItem.verdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Head Modal */}
      {isEditingHead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setIsEditingHead(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Edit Committee Chairman
            </h3>
            <form onSubmit={handleSaveHead} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name:</label>
                <input
                  type="text"
                  value={headName}
                  onChange={e => setHeadName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Official Role:</label>
                <input
                  type="text"
                  value={headRole}
                  onChange={e => setHeadRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Mandate / Authority Description:</label>
                <textarea
                  rows={3}
                  value={headDesc}
                  onChange={e => setHeadDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingHead(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md"
                >
                  Save Chairman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Case Ruling Modal */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <button
              onClick={() => setIsCaseModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs font-display mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Disciplinary Resolution</span>
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              {editingCaseId ? 'Edit Disciplinary Ruling' : 'Record New Committee Ruling'}
            </h3>
            <form onSubmit={handleSaveCase} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Case Title:</label>
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={e => setCaseTitle(e.target.value)}
                    placeholder="e.g. Case 02 Ruling"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date of Ruling:</label>
                  <input
                    type="text"
                    value={caseDate}
                    onChange={e => setCaseDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Match Incident &amp; Summary:</label>
                <textarea
                  rows={3}
                  value={caseDescription}
                  onChange={e => setCaseDescription(e.target.value)}
                  placeholder="Details of the incident, absence, or disciplinary inquiry..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Official Verdict &amp; Sanctions Awarded:</label>
                <textarea
                  rows={2}
                  value={caseVerdict}
                  onChange={e => setCaseVerdict(e.target.value)}
                  placeholder="e.g. Match awarded as Walkover (3 match points) / Warning issued"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Ruling</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-extrabold text-white uppercase font-display mb-4">
              Add Committee Representative
            </h3>
            <form onSubmit={handleSaveNewMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name:</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="e.g. Shahid Nazir"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Role / Designation:</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Captain / Board Member"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Team Affiliation (if any):</label>
                <input
                  type="text"
                  value={newMemberTeam}
                  onChange={e => setNewMemberTeam(e.target.value)}
                  placeholder="e.g. The Cool Setters"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    checked={newMemberIsBoard}
                    onChange={e => setNewMemberIsBoard(e.target.checked)}
                  />
                  <span className="font-bold text-amber-300">Add to Executive Disciplinary Board</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider font-display shadow-md"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
