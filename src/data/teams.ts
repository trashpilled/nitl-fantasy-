export type Caucus = 'WEST' | 'EAST'

export interface Team {
  id: string
  name: string
  manager: string
  caucus: Caucus
  wins: number
  losses: number
  ties?: number
  pointsFor: number
  pointsAgainst: number
  streak: string
  takeUSD: number
  roster: string[]        // legislator ids — 6 starters + 6 bench
  starters: string[]      // legislator ids — 6
  bench: string[]         // legislator ids — 6
  ir?: string             // legislator id for IR slot
  // Fixed weekly scores (17 entries) — used to simulate matchups against the user
  weeklyScores: number[]
  isYou?: boolean         // default user team flag
}

// Generate plausible weekly scores per team — deterministic.
function teamSeed(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function weeklyForTeam(id: string, avg: number, variance = 0.22): number[] {
  const r = rng(teamSeed(id))
  const out: number[] = []
  for (let i = 0; i < 17; i++) {
    const factor = 1 + (r() - 0.5) * 2 * variance
    out.push(Number((avg * factor).toFixed(1)))
  }
  return out
}

const _teams: Omit<Team, 'weeklyScores'>[] = [
  // WEST caucus
  {
    id: 'honorable-gentlemen',
    name: 'Honorable Gentlemen',
    manager: 'You',
    caucus: 'WEST',
    wins: 8,
    losses: 5,
    pointsFor: 9842.4,
    pointsAgainst: 9201.8,
    streak: 'W2',
    takeUSD: 72_400_000,
    starters: ['pelosi', 'tuberville', 'daines', 'crenshaw', 'gottheimer', 'khanna'],
    bench: ['schatz', 'murkowski', 'fischer', 'lankford', 'spanberger', 'crow'],
    roster: ['pelosi', 'tuberville', 'daines', 'crenshaw', 'gottheimer', 'khanna', 'schatz', 'murkowski', 'fischer', 'lankford', 'spanberger', 'crow'],
    ir: 'manchin',
    isYou: true,
  },
  {
    id: 'pork-barrel-boys',
    name: 'The Pork Barrel Boys',
    manager: 'M. Klein',
    caucus: 'WEST',
    wins: 10,
    losses: 3,
    pointsFor: 10421.7,
    pointsAgainst: 8920.4,
    streak: 'W4',
    takeUSD: 84_120_000,
    starters: ['schumer', 'wicker', 'mullin', 'greene', 'rscott', 'asmith'],
    bench: ['booker', 'reed', 'bennet', 'cassidy', 'tester', 'boozman'],
    roster: ['schumer', 'wicker', 'mullin', 'greene', 'rscott', 'asmith', 'booker', 'reed', 'bennet', 'cassidy', 'tester', 'boozman'],
  },
  {
    id: 'sunshine-state-index',
    name: 'Sunshine State Index',
    manager: 'R. Patel',
    caucus: 'WEST',
    wins: 8,
    losses: 5,
    pointsFor: 9412.2,
    pointsAgainst: 9180.1,
    streak: 'L1',
    takeUSD: 68_400_000,
    starters: ['rscott', 'tuberville', 'cassidy', 'crenshaw', 'spanberger', 'crow'],
    bench: ['daines', 'mullin', 'khanna', 'fischer', 'lankford', 'boozman'],
    roster: ['rscott', 'tuberville', 'cassidy', 'crenshaw', 'spanberger', 'crow', 'daines', 'mullin', 'khanna', 'fischer', 'lankford', 'boozman'],
  },
  {
    id: 'continuing-resolutions',
    name: 'Continuing Resolutions',
    manager: 'A. Diaz',
    caucus: 'WEST',
    wins: 6,
    losses: 7,
    pointsFor: 8742.3,
    pointsAgainst: 9018.4,
    streak: 'W1',
    takeUSD: 58_200_000,
    starters: ['daines', 'gottheimer', 'wicker', 'schatz', 'greene', 'asmith'],
    bench: ['booker', 'tester', 'reed', 'bennet', 'cassidy', 'spanberger'],
    roster: ['daines', 'gottheimer', 'wicker', 'schatz', 'greene', 'asmith', 'booker', 'tester', 'reed', 'bennet', 'cassidy', 'spanberger'],
  },
  {
    id: 'recess-appointments',
    name: 'Recess Appointments LLC',
    manager: 'S. Park',
    caucus: 'WEST',
    wins: 5,
    losses: 8,
    pointsFor: 8120.4,
    pointsAgainst: 8820.7,
    streak: 'L3',
    takeUSD: 49_200_000,
    starters: ['pelosi', 'khanna', 'spanberger', 'fischer', 'lankford', 'crow'],
    bench: ['bennet', 'boozman', 'toomey', 'reed', 'schatz', 'asmith'],
    roster: ['pelosi', 'khanna', 'spanberger', 'fischer', 'lankford', 'crow', 'bennet', 'boozman', 'toomey', 'reed', 'schatz', 'asmith'],
  },
  {
    id: 'the-markup',
    name: 'The Markup',
    manager: 'J. Wei',
    caucus: 'WEST',
    wins: 4,
    losses: 9,
    pointsFor: 7820.2,
    pointsAgainst: 9120.1,
    streak: 'L5',
    takeUSD: 41_800_000,
    starters: ['mullin', 'rscott', 'cassidy', 'bennet', 'asmith', 'toomey'],
    bench: ['boozman', 'lankford', 'crow', 'fischer', 'tester', 'schatz'],
    roster: ['mullin', 'rscott', 'cassidy', 'bennet', 'asmith', 'toomey', 'boozman', 'lankford', 'crow', 'fischer', 'tester', 'schatz'],
  },
  // EAST caucus
  {
    id: 'pocket-vetoes',
    name: 'Pocket Vetoes',
    manager: 'C. Hayes',
    caucus: 'EAST',
    wins: 11,
    losses: 2,
    pointsFor: 10820.4,
    pointsAgainst: 8620.1,
    streak: 'W6',
    takeUSD: 92_400_000,
    starters: ['schumer', 'pelosi', 'daines', 'mullin', 'greene', 'gottheimer'],
    bench: ['booker', 'wicker', 'crenshaw', 'murkowski', 'khanna', 'reed'],
    roster: ['schumer', 'pelosi', 'daines', 'mullin', 'greene', 'gottheimer', 'booker', 'wicker', 'crenshaw', 'murkowski', 'khanna', 'reed'],
  },
  {
    id: 'filibuster-holdings',
    name: 'Filibuster Holdings',
    manager: 'D. Romero',
    caucus: 'EAST',
    wins: 9,
    losses: 4,
    pointsFor: 9720.4,
    pointsAgainst: 8920.2,
    streak: 'W2',
    takeUSD: 78_200_000,
    starters: ['tuberville', 'murkowski', 'wicker', 'crenshaw', 'gottheimer', 'asmith'],
    bench: ['cassidy', 'reed', 'fischer', 'bennet', 'tester', 'spanberger'],
    roster: ['tuberville', 'murkowski', 'wicker', 'crenshaw', 'gottheimer', 'asmith', 'cassidy', 'reed', 'fischer', 'bennet', 'tester', 'spanberger'],
  },
  {
    id: 'quorum-quorum',
    name: 'Quorum Quorum',
    manager: 'L. Okafor',
    caucus: 'EAST',
    wins: 7,
    losses: 6,
    pointsFor: 9020.4,
    pointsAgainst: 9012.4,
    streak: 'L1',
    takeUSD: 62_400_000,
    starters: ['schatz', 'booker', 'reed', 'khanna', 'asmith', 'crow'],
    bench: ['spanberger', 'bennet', 'tester', 'pelosi', 'gottheimer', 'fischer'],
    roster: ['schatz', 'booker', 'reed', 'khanna', 'asmith', 'crow', 'spanberger', 'bennet', 'tester', 'pelosi', 'gottheimer', 'fischer'],
  },
  {
    id: 'sine-die-capital',
    name: 'Sine Die Capital',
    manager: 'V. Tran',
    caucus: 'EAST',
    wins: 6,
    losses: 7,
    pointsFor: 8620.4,
    pointsAgainst: 8920.4,
    streak: 'W1',
    takeUSD: 52_400_000,
    starters: ['rscott', 'cassidy', 'fischer', 'boozman', 'lankford', 'toomey'],
    bench: ['murkowski', 'wicker', 'daines', 'crenshaw', 'asmith', 'crow'],
    roster: ['rscott', 'cassidy', 'fischer', 'boozman', 'lankford', 'toomey', 'murkowski', 'wicker', 'daines', 'crenshaw', 'asmith', 'crow'],
  },
  {
    id: 'cloture-closure',
    name: 'Cloture Closure',
    manager: 'B. Singh',
    caucus: 'EAST',
    wins: 4,
    losses: 9,
    pointsFor: 7820.4,
    pointsAgainst: 9220.4,
    streak: 'L4',
    takeUSD: 38_400_000,
    starters: ['khanna', 'spanberger', 'asmith', 'crow', 'lankford', 'boozman'],
    bench: ['fischer', 'bennet', 'toomey', 'reed', 'tester', 'cassidy'],
    roster: ['khanna', 'spanberger', 'asmith', 'crow', 'lankford', 'boozman', 'fischer', 'bennet', 'toomey', 'reed', 'tester', 'cassidy'],
  },
  {
    id: 'joint-session',
    name: 'Joint Session',
    manager: 'N. Holloway',
    caucus: 'EAST',
    wins: 3,
    losses: 10,
    pointsFor: 7220.4,
    pointsAgainst: 9420.2,
    streak: 'L7',
    takeUSD: 31_200_000,
    starters: ['toomey', 'boozman', 'lankford', 'bennet', 'tester', 'spanberger'],
    bench: ['crow', 'fischer', 'khanna', 'reed', 'cassidy', 'asmith'],
    roster: ['toomey', 'boozman', 'lankford', 'bennet', 'tester', 'spanberger', 'crow', 'fischer', 'khanna', 'reed', 'cassidy', 'asmith'],
  },
]

export const TEAMS: Team[] = _teams.map(t => ({
  ...t,
  weeklyScores: weeklyForTeam(t.id, t.pointsFor / 17),
}))

export const getTeam = (id: string): Team | undefined => TEAMS.find(t => t.id === id)

export const DEFAULT_USER_TEAM_ID = 'honorable-gentlemen'

export const TEAM_NAME_OPTIONS = [
  'The Whip Count',
  'Quorum Quorum',
  'Pocket Vetoes',
  'Cloture Closure',
  'Filibuster Holdings',
  'Committee of the Whole',
  'The Speakers',
  'Conference Committee',
  'Recess Appointments',
  'Sergeant at Arms LLC',
  'The Gerrymanderers',
  'Yeas & Nays',
  'Bipartisan Holdings',
  'Continuing Appropriations',
  'Sine Die Capital',
  'Joint Session',
  'Floor Action',
  'Sub Rosa Caucus',
  'The Markup',
  'Closed Session',
]
