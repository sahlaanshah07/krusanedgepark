import { Team, Match, PaymentConfig, DisciplinaryCommitteeData, DailyUpdateItem } from '../types';

export const OFFICIAL_VENUE = 'Green Park Volleyball Court, Herpora Krusan';
export const MAPS_URL = 'https://www.google.com/maps/dir//GCG3%2BQP5+Green+Park+Cricket+Ground,+Krusan,+193223/@34.5270801,74.401651,16.62z/data=!4m17!1m7!3m6!1s0x38e119552986849b:0x52e8d3f3a2238063!2sGreen+Park+Cricket+Ground!8m2!3d34.5268787!4d74.404352!16s%2Fg%2F11qgff10sl!4m8!1m0!1m5!1m1!1s0x38e119552986849b:0x52e8d3f3a2238063!2m2!1d74.404352!2d34.5268787!3e0?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D';

export const ORGANIZERS = [
  { name: 'Sahlaan Shah', phone: '+91 8082996690', tel: '+918082996690' },
  { name: 'Shahid Nazir', phone: '+91 8492092098', tel: '+918492092098' }
];

export const REFEREES = [
  'Danish Fayaz',
  'Sahlaan Shah'
];

export const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  upiId: 'aaqilnazir@phonepe', // Extracted from PhonePe QR of Aaqil Nazir
  payeeName: 'AAQIL NAZIR',
  feePerTeam: 1600
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'T1',
    name: 'Dream Team Krusan',
    captain: 'Md Amin',
    contact: '9682178517',
    players: [
      'Md Amin (C)',
      'Ishtiyaq Bhat',
      'Manzoor saab',
      'Md Iqbal',
      'Shaukat Ahmad',
      'Mudasir Ahmad',
      'Reyaz Ahmad (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-08-28 19:15:38'
  },
  {
    id: 'T2',
    name: 'I3A3 Brothers',
    captain: 'Mohammad Ishaq Khan',
    contact: '9622635519',
    players: [
      'Mohammad Ishaq Khan (C)',
      'Ishfaq Jabbar',
      'Mohd Iqbal Shah',
      'Aamir Khan',
      'Aaqib Mir',
      'Mohd Ashraf Zargar',
      'Talib Khan (R)',
      'Player 8'
    ],
    feesPaid: 1000,
    paymentDetails: '₹1,000 (UPI) on 02/09/2026',
    timestamp: '2026-08-28 21:26:16'
  },
  {
    id: 'T3',
    name: 'The Cool Setters',
    captain: 'Showkat',
    contact: '7006404205',
    players: [
      'Showkat (C)',
      'Zameer Ahmad',
      'Shahid Nazir',
      'Saqib Tantray',
      'Mohd Amin',
      'Sahil Jamal',
      'Umer farooq (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-08-30 23:07:08'
  },
  {
    id: 'T4',
    name: 'FVC Krusan',
    captain: 'Sharib Tantry',
    contact: '6006015379 / 9596960405',
    players: [
      'Sharib Tantry (C)',
      'Farhan masroor',
      'Basit Hameed',
      'Sakib tantray',
      'Akhill tantry',
      'Aamir tantry',
      'Saqib khan (R)',
      'Player 8'
    ],
    feesPaid: 500,
    paymentDetails: '₹500 (₹400 Cash, ₹100 UPI) on 02/09/2026',
    timestamp: '2026-08-30 20:17:58'
  },
  {
    id: 'T5',
    name: 'Genz Sports',
    captain: 'Burhan Naseer',
    contact: '7051896544',
    players: [
      'Burhan Naseer (C)',
      'Hilal jamal',
      'Owais aijaz',
      'Shahid mushtaq',
      'Shafqat',
      'Dansh altaf',
      'Umar ashiq (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-08-31 21:16:41'
  },
  {
    id: 'T6',
    name: 'Flying Squad Shartpora',
    captain: 'Tariq Ahmad Mir',
    contact: '9622862811',
    players: [
      'Tariq Ahmad Mir (C)',
      'Faisal Rasool Mir',
      'Danish Fayaz',
      'Shahid Mushtaq',
      'Sajad Akbar',
      'Shoaib Rashid',
      'Saleema Mir (R)',
      'Player 8'
    ],
    feesPaid: 650,
    paymentDetails: '₹650 (Cash) on 03/09/2026',
    timestamp: '2026-09-01 21:10:04'
  },
  {
    id: 'T7',
    name: 'Tantray Brothers',
    captain: 'Sajad Ahmad Tantray',
    contact: '9596055365',
    players: [
      'Sajad Ahmad Tantray (C)',
      'Mohd Ashraf Tantray',
      'Towseef tantray',
      'Burhan Nazir Tantray',
      'Master pervaiz Ahmad Tantray',
      'Pervaiz Tantray',
      'Uzair bashir (R)',
      'Player 8'
    ],
    feesPaid: 600,
    paymentDetails: '₹600 (UPI) on 02/09/2026',
    timestamp: '2026-09-02 22:30:13'
  },
  {
    id: 'T8',
    name: 'All Stars',
    captain: 'Momin Nazir',
    contact: '8493900147',
    players: [
      'Momin Nazir (C)',
      'IRFAN HAFEEZ',
      'ZEESHAN RASHID',
      'ISHTIYAQ SHAFI',
      'Irshad mir',
      'OWAIS MAQBOOL',
      'RASIK FAYAZ (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-09-02 20:27:50'
  },
  {
    id: 'T9',
    name: 'Khushal Smashers',
    captain: 'Bhat Faisal',
    contact: '6005571474',
    players: [
      'Faisal bhat (C)',
      'Farhan manzoor',
      'Wajid meer',
      'Bilal meer',
      'Basharat Ahmad Lone',
      'Uzair tantray',
      'Ehsan Bashir (R)',
      'Player 8'
    ],
    feesPaid: 600,
    paymentDetails: '₹600 (UPI) on 03/09/2026',
    timestamp: '2026-09-02 00:16:11'
  },
  {
    id: 'T10',
    name: 'Legend Strikers',
    captain: 'Bashir Shah',
    contact: '9796736439',
    players: [
      'Bashir Shah (C)',
      'Manzoor Sb',
      'Masood Sb.',
      'Parvaiz Sb',
      'Firdous Sb',
      'Myser Sb',
      'Rashid Sb',
      'Tufail Sb. (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-09-02 21:04:48'
  },
  {
    id: 'T11',
    name: 'Khan Sports',
    captain: 'Shahid Shafi Khan',
    contact: '8082380860',
    players: [
      'Shahid shafi (C)',
      'Faheem khan',
      'Khursheed lone',
      'Hameed zargar',
      'Sharik majloon',
      'Qaiser khan',
      'Adil khan (R)',
      'Player 8'
    ],
    feesPaid: 0,
    paymentDetails: 'Pending',
    timestamp: '2026-09-02 21:08:03'
  },
  {
    id: 'T12',
    name: 'The Aces',
    captain: 'Shamik Zahoor',
    contact: '9541064964',
    players: [
      'Shamik Zahoor (C)',
      'Imtiyaz Wani',
      'Shahid Bhat',
      'Manan Hameed',
      'Najmu Saqib',
      'Umer Shafi',
      'Shabir Ahmad Dar (R)',
      'Player 8'
    ],
    feesPaid: 650,
    paymentDetails: '₹650 (₹150 Cash, ₹500 UPI) on 02/09/2026',
    timestamp: '2026-08-29 21:13:09'
  }
];

export const INITIAL_DISCIPLINARY_DATA: DisciplinaryCommitteeData = {
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

export const INITIAL_DAILY_UPDATES: DailyUpdateItem[] = [
  {
    id: 'day-3',
    dayBadge: 'DAY 3 (TODAY)',
    date: 'Friday, 04 September 2026',
    tag: 'Live Matchday',
    isToday: true,
    category: 'upcoming',
    summary: 'Two pivotal first-round matches scheduled today at Green Park Volleyball Court, Krusan Lolab.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 5: Khushal Smashers vs Flying Squad Shartpora',
        subtitle: 'Daylight clash between two powerhouse attacking units',
        teamAName: 'Khushal Smashers',
        teamBName: 'Flying Squad Shartpora'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 6: FVC Krusan vs Tantray Brothers',
        subtitle: 'Night clash under floodlights with high local rivalry',
        teamAName: 'FVC Krusan',
        teamBName: 'Tantray Brothers'
      }
    ]
  },
  {
    id: 'day-4',
    dayBadge: 'DAY 4 · 2ND LEAGUE STAGE',
    date: 'Saturday, 05 September 2026',
    tag: 'Round 2 Begins',
    isToday: false,
    category: 'upcoming',
    summary: 'Second League Match Stage begins! Two blockbuster weekend clashes in daylight and under floodlights.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 7: Genz Sports vs Khushal Smashers',
        subtitle: 'Day Match: Genz Sports clashes with Khushal Smashers',
        teamAName: 'Genz Sports',
        teamBName: 'Khushal Smashers'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 8: Tantray Brothers vs Dream Team Krusan',
        subtitle: 'Lights Match: Marquee Saturday night showdown under floodlights',
        teamAName: 'Tantray Brothers',
        teamBName: 'Dream Team Krusan'
      }
    ]
  },
  {
    id: 'day-5',
    dayBadge: 'DAY 5 · 2ND LEAGUE STAGE',
    date: 'Sunday, 06 September 2026',
    tag: 'Sunday Doubleheader',
    isToday: false,
    category: 'upcoming',
    summary: 'Sunday Doubleheader: Daylight clash between Flying Squad and All Stars followed by The Aces vs The Cool Setters under lights.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 9: Flying Squad vs All Stars',
        subtitle: 'Day Match: High-intensity daylight volleyball action',
        teamAName: 'Flying Squad Shartpora',
        teamBName: 'All Stars'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 10: The Aces vs The Cool Setters',
        subtitle: 'Lights Match: Sunday night thriller under floodlights',
        teamAName: 'The Aces',
        teamBName: 'The Cool Setters'
      }
    ]
  },
  {
    id: 'day-6',
    dayBadge: 'DAY 6 · 2ND LEAGUE STAGE',
    date: 'Monday, 07 September 2026',
    tag: 'Monday Fixtures',
    isToday: false,
    category: 'upcoming',
    summary: 'Monday schedule features an open daylight slot and FVC Krusan squaring off against Khan Sports under lights.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 11: Slot Open (TBD)',
        subtitle: 'Day Match slot kept free — to be updated from Organizer Mode',
        teamAName: 'Slot Open',
        teamBName: 'TBD'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 12: FVC Krusan vs Khan Sports',
        subtitle: 'Lights Match: Monday night clash under floodlights',
        teamAName: 'FVC Krusan',
        teamBName: 'Khan Sports'
      }
    ]
  },
  {
    id: 'day-7',
    dayBadge: 'DAY 7 · 2ND LEAGUE STAGE',
    date: 'Tuesday, 08 September 2026',
    tag: 'Tuesday Fixtures',
    isToday: false,
    category: 'upcoming',
    summary: 'Tuesday schedule features an open daylight slot and i3A3 Brothers taking on Legend Strikers under lights.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 13: Slot Open (TBD)',
        subtitle: 'Day Match slot kept free — to be updated from Organizer Mode',
        teamAName: 'Slot Open',
        teamBName: 'TBD'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 14: i3A3 Brothers vs Legend Strikers',
        subtitle: 'Lights Match: Tuesday night battle under floodlights',
        teamAName: 'I3A3 Brothers',
        teamBName: 'Legend Strikers'
      }
    ]
  },
  {
    id: 'day-2',
    dayBadge: 'DAY 2 RECAP & RULING',
    date: 'Thursday, 03 September 2026',
    tag: 'Completed & Ruled',
    isToday: false,
    category: 'results',
    summary: 'Official Day 2 results including the Disciplinary Committee Walkover verdict for Match 3.',
    matches: [
      {
        slotTime: '5:30 PM (After ASR Prayers)',
        type: 'daylight',
        title: 'Match 3: The Cool Setters (Awarded Walkover) vs Dream Team Krusan',
        subtitle: 'Walkover awarded to Cool Setters (3 pts, 0-0 sets)',
        teamAName: 'The Cool Setters',
        teamBName: 'Dream Team Krusan'
      },
      {
        slotTime: '7:20 PM (After Maghrib Prayers)',
        type: 'night',
        title: 'Match 4: All Stars (1) vs The Aces (2)',
        subtitle: '3-setter night thriller under lights. The Aces edge victory 2-1!',
        teamAName: 'All Stars',
        teamBName: 'The Aces'
      }
    ],
    verdictNote: 'Official Committee Decision on Match 3: Match awarded to The Cool Setters with 3 match points (no sets won or lost) because Dream Team Krusan was not present on the ground even after contacting them several times.'
  },
  {
    id: 'day-1',
    dayBadge: 'DAY 1 RECAP',
    date: 'Wednesday, 02 September 2026',
    tag: 'Completed',
    isToday: false,
    category: 'results',
    summary: 'First official day of competitive league matches after inauguration.',
    matches: [
      {
        slotTime: '5:30 PM',
        type: 'daylight',
        title: 'Match 1: Genz Sports (2) vs Legend Strikers (0)',
        subtitle: 'Dominant 2-0 victory for Genz Sports',
        teamAName: 'Genz Sports',
        teamBName: 'Legend Strikers'
      },
      {
        slotTime: '7:20 PM',
        type: 'night',
        title: 'Match 2: Khan Sports (0) vs I3A3 Brothers (2)',
        subtitle: 'Electrifying night match won by I3A3 Brothers 2-0',
        teamAName: 'Khan Sports',
        teamBName: 'I3A3 Brothers'
      }
    ]
  }
];

export const DISCIPLINARY_COMMITTEE = INITIAL_DISCIPLINARY_DATA;

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'M-EX',
    stage: 'inauguration',
    roundLabel: 'Inauguration Match',
    teamAId: 'T1', // Dream Team Krusan
    teamBId: 'T3', // The Cool Setters
    scoreA: 1,
    scoreB: 2,
    status: 'completed',
    date: 'Sun, 31 Aug 2026',
    time: '7:45 PM (After Isha Prayers)',
    isNightSlot: true,
    notes: 'Exhibition match played under floodlights in front of community elders and guests of honour to inaugurate the 2026 edition.'
  },
  // --- ROUND 1 MATCHES ---
  {
    id: 'M-1',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 1 · Match 1',
    matchNumber: 1,
    teamAId: 'T12', // The Aces
    teamBId: 'T7',  // Tantray Brothers
    scoreA: 0,
    scoreB: 3,
    status: 'completed',
    date: 'Day 1 (Wed, 02 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Tantray Brothers secured a commanding 3-0 clean sweep opening victory.'
  },
  {
    id: 'M-2',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 1 · Match 2',
    matchNumber: 2,
    teamAId: 'T2',  // I3A3 Brothers
    teamBId: 'T4',  // FVC Krusan
    scoreA: 2,
    scoreB: 1,
    status: 'completed',
    date: 'Day 1 (Wed, 02 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Thrilling 3-setter under the lights; I3A3 Brothers edged out FVC Krusan 2-1.'
  },
  {
    id: 'M-3',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 2 · Match 3',
    matchNumber: 3,
    teamAId: 'T3',  // The Cool Setters
    teamBId: 'T1',  // Dream Team Krusan
    scoreA: 0,
    scoreB: 0,
    isWalkover: true,
    walkoverWinnerId: 'T3',
    status: 'completed',
    date: 'Day 2 (Thu, 03 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Match awarded to The Cool Setters with 3 match points (no sets won or lost). Dream Team Krusan was not present on the ground even after contacting them several times.'
  },
  {
    id: 'M-4',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 2 · Match 4',
    matchNumber: 4,
    teamAId: 'T9',  // Khushal Smashers
    teamBId: 'T6',  // Flying Squad Shartpora
    scoreA: 2,
    scoreB: 1,
    status: 'completed',
    date: 'Day 2 (Thu, 03 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Electrifying night clash where Khushal Smashers fought back to clinch a 2-1 win.'
  },
  {
    id: 'M-5',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 3 · Match 5',
    matchNumber: 5,
    teamAId: 'T10', // Legend Strikers
    teamBId: 'T11', // Khan Sports
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 3 (Fri, 04 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Clash of two formidable local rosters in daylight slot.'
  },
  {
    id: 'M-6',
    stage: 'league',
    leagueRound: 1,
    roundLabel: 'Day 3 · Match 6',
    matchNumber: 6,
    teamAId: 'T8',  // All Stars
    teamBId: 'T5',  // Genz Sports
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 3 (Fri, 04 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'High-octane night match under the lights featuring youth talents.'
  },

  // --- ROUND 2 MATCHES (2nd League Match Stage) ---
  {
    id: 'M-7',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 4 · Match 7 (2nd League)',
    matchNumber: 7,
    teamAId: 'T5',  // Genz Sports
    teamBId: 'T9',  // Khushal Smashers
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 4 (Sat, 05 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Day Match: Genz Sports vs Khushal Smashers.'
  },
  {
    id: 'M-8',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 4 · Match 8 (2nd League)',
    matchNumber: 8,
    teamAId: 'T7',  // Tantray Brothers
    teamBId: 'T1',  // Dream Team Krusan
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 4 (Sat, 05 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Lights Match: Tantray Brothers vs Dream Team Krusan under floodlights.'
  },
  {
    id: 'M-9',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 5 · Match 9 (2nd League)',
    matchNumber: 9,
    teamAId: 'T6',  // Flying Squad Shartpora
    teamBId: 'T8',  // All Stars
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 5 (Sun, 06 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Day Match: Flying Squad vs All Stars.'
  },
  {
    id: 'M-10',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 5 · Match 10 (2nd League)',
    matchNumber: 10,
    teamAId: 'T12', // The Aces
    teamBId: 'T3',  // The Cool Setters
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 5 (Sun, 06 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Lights Match: The Aces vs The Cool Setters under floodlights.'
  },
  {
    id: 'M-11',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 6 · Match 11 (2nd League)',
    matchNumber: 11,
    teamAId: null,  // Slot Free - To be updated from organizer mode
    teamBId: null,  // Slot Free - To be updated from organizer mode
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 6 (Mon, 07 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Day Match slot kept free — open for organizer assignment in Organizer Mode.'
  },
  {
    id: 'M-12',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 6 · Match 12 (2nd League)',
    matchNumber: 12,
    teamAId: 'T4',  // FVC Krusan
    teamBId: 'T11', // Khan Sports
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 6 (Mon, 07 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Lights Match: FVC Krusan vs Khan Sports under floodlights.'
  },
  {
    id: 'M-13',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 7 · Match 13 (2nd League)',
    matchNumber: 13,
    teamAId: null,  // Slot Free - To be updated from organizer mode
    teamBId: null,  // Slot Free - To be updated from organizer mode
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 7 (Tue, 08 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Day Match slot kept free — open for organizer assignment in Organizer Mode.'
  },
  {
    id: 'M-14',
    stage: 'league',
    leagueRound: 2,
    roundLabel: 'Day 7 · Match 14 (2nd League)',
    matchNumber: 14,
    teamAId: 'T2',  // I3A3 Brothers
    teamBId: 'T10', // Legend Strikers
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 7 (Tue, 08 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Lights Match: i3A3 Brothers vs Legend Strikers under floodlights.'
  },
  {
    id: 'M-15',
    stage: 'league',
    leagueRound: 3,
    isSuggested: true,
    roundLabel: 'Day 8 · Match 15 (3rd League)',
    matchNumber: 15,
    teamAId: 'T3',  // The Cool Setters
    teamBId: 'T5',  // Genz Sports
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 8 (Wed, 09 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Suggested 3rd League Day Match: The Cool Setters vs Genz Sports.'
  },
  {
    id: 'M-16',
    stage: 'league',
    leagueRound: 3,
    isSuggested: true,
    roundLabel: 'Day 8 · Match 16 (3rd League)',
    matchNumber: 16,
    teamAId: 'T7',  // Tantray Brothers
    teamBId: 'T2',  // I3A3 Brothers
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 8 (Wed, 09 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Suggested 3rd League Night Match: Marquee clash Tantray Brothers vs I3A3 Brothers under lights.'
  },
  {
    id: 'M-17',
    stage: 'league',
    leagueRound: 3,
    isSuggested: true,
    roundLabel: 'Day 9 · Match 17 (3rd League)',
    matchNumber: 17,
    teamAId: 'T9',  // Khushal Smashers
    teamBId: 'T11', // Khan Sports
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 9 (Thu, 10 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Suggested 3rd League Day Match: Khushal Smashers vs Khan Sports.'
  },
  {
    id: 'M-18',
    stage: 'league',
    leagueRound: 3,
    isSuggested: true,
    roundLabel: 'Day 9 · Match 18 (3rd League)',
    matchNumber: 18,
    teamAId: 'T10', // Legend Strikers
    teamBId: 'T12', // The Aces
    scoreA: null,
    scoreB: null,
    status: 'upcoming',
    date: 'Day 9 (Thu, 10 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Suggested 3rd League Night Match: Final league decider Legend Strikers vs The Aces.'
  }
];

export const INITIAL_KNOCKOUTS: Match[] = [
  // --- PRE-QUARTERFINALS (Rank 5 to 12) ---
  {
    id: 'PQF-1',
    stage: 'pqf',
    roundLabel: 'Pre-Quarterfinal 1',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 10 (Fri, 11 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Matchup: League Rank 5 vs League Rank 12'
  },
  {
    id: 'PQF-2',
    stage: 'pqf',
    roundLabel: 'Pre-Quarterfinal 2',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 10 (Fri, 11 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Matchup: League Rank 6 vs League Rank 11'
  },
  {
    id: 'PQF-3',
    stage: 'pqf',
    roundLabel: 'Pre-Quarterfinal 3',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 11 (Sat, 12 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Matchup: League Rank 7 vs League Rank 10'
  },
  {
    id: 'PQF-4',
    stage: 'pqf',
    roundLabel: 'Pre-Quarterfinal 4',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 11 (Sat, 12 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Matchup: League Rank 8 vs League Rank 9'
  },

  // --- QUARTERFINALS (Top 4 League + 4 PQF Winners) ---
  {
    id: 'QF-1',
    stage: 'qf',
    roundLabel: 'Quarterfinal 1',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 12 (Sun, 13 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Seeding: Rank 1st Place vs Winner of PQF 4'
  },
  {
    id: 'QF-2',
    stage: 'qf',
    roundLabel: 'Quarterfinal 2',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 12 (Sun, 13 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Seeding: Rank 2nd Place vs Winner of PQF 3'
  },
  {
    id: 'QF-3',
    stage: 'qf',
    roundLabel: 'Quarterfinal 3',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 13 (Mon, 14 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Seeding: Rank 3rd Place vs Winner of PQF 2'
  },
  {
    id: 'QF-4',
    stage: 'qf',
    roundLabel: 'Quarterfinal 4',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 13 (Mon, 14 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Seeding: Rank 4th Place vs Winner of PQF 1'
  },

  // --- SEMIFINALS ---
  {
    id: 'SF-1',
    stage: 'sf',
    roundLabel: 'Semifinal 1',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 14 (Tue, 15 Sept 2026)',
    time: '5:30 PM (After ASR Prayers)',
    isNightSlot: false,
    notes: 'Clash: Winner QF 1 vs Winner QF 2'
  },
  {
    id: 'SF-2',
    stage: 'sf',
    roundLabel: 'Semifinal 2',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 14 (Tue, 15 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Clash: Winner QF 3 vs Winner QF 4'
  },

  // --- GRAND FINAL ---
  {
    id: 'FN-1',
    stage: 'final',
    roundLabel: '🏆 Grand Final Decider',
    teamAId: null,
    teamBId: null,
    scoreA: null,
    scoreB: null,
    status: 'pending',
    date: 'Day 15 (Wed, 16 Sept 2026)',
    time: '7:20 PM (After Maghrib Prayers)',
    isNightSlot: true,
    notes: 'Winner SF 1 vs Winner SF 2 · 🏆 KRUSAN EDGE 2026 CHAMPIONSHIP TROPHY 🏆'
  }
];
