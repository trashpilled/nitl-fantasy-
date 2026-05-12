export interface PropLine {
  id: string
  category: 'House Take O/U' | 'Memecoin Spike' | 'Vote Margin' | 'Disclosure Lag'
  title: string
  description: string
  optionA: string
  optionB: string
  line: string
  defaultWager: number
  catalyst: string
}

export const PROP_LINES: PropLine[] = [
  {
    id: 'prop-1',
    category: 'House Take O/U',
    title: 'House Take · Week 13',
    description: 'Total disclosed trade volume across all rostered legislators',
    optionA: 'Over 42.5M',
    optionB: 'Under 42.5M',
    line: '$42.5M',
    defaultWager: 25,
    catalyst: 'CHIPS Act markup scheduled Thursday — sector reshuffle expected',
  },
  {
    id: 'prop-2',
    category: 'Memecoin Spike',
    title: 'Memecoin Disclosure · Week 13',
    description: 'Will any rostered legislator disclose a memecoin or sub-$1B ticker?',
    optionA: 'Yes',
    optionB: 'No',
    line: '+180 / -240',
    defaultWager: 15,
    catalyst: 'MTG filed DJT call exercise last cycle — pattern continuing',
  },
  {
    id: 'prop-3',
    category: 'Vote Margin',
    title: 'NDAA Conference · Vote Margin',
    description: 'Final passage vote margin in the Senate',
    optionA: 'Over 18.5',
    optionB: 'Under 18.5',
    line: '18.5',
    defaultWager: 30,
    catalyst: 'Three R holdouts on Ukraine amendment — could narrow the spread',
  },
]

export interface PassivePoolEntry {
  caucus: string
  pickPct: number
  side: 'Yea' | 'Nay'
}

export const PASSIVE_POOL: PassivePoolEntry[] = [
  { caucus: 'West', pickPct: 62, side: 'Yea' },
  { caucus: 'East', pickPct: 38, side: 'Nay' },
]

export interface NewsHeadline {
  id: string
  headline: string
  source: string
  hoursAgo: number
  legislatorId?: string
}

export const HEADLINES: NewsHeadline[] = [
  { id: 'n1', headline: 'Pelosi files Q3 disclosure — top tickers revealed', source: 'The Capitol Tape', hoursAgo: 2, legislatorId: 'pelosi' },
  { id: 'n2', headline: 'Tuberville exits AVGO position ahead of CHIPS Act markup', source: 'House Cut Daily', hoursAgo: 4, legislatorId: 'tuberville' },
  { id: 'n3', headline: 'Gottheimer adds $250k JPM ahead of Financial Services vote', source: 'Cloak Room', hoursAgo: 7, legislatorId: 'gottheimer' },
  { id: 'n4', headline: 'Daines bundled $320k from energy PAC — sets Week 13 PAC record', source: 'PAC Pulse', hoursAgo: 11, legislatorId: 'daines' },
  { id: 'n5', headline: 'MTG discloses DJT call exercise 88 days late — LATE multiplier triggered', source: 'The Capitol Tape', hoursAgo: 18, legislatorId: 'greene' },
  { id: 'n6', headline: 'Speaker Emerita\'s tech holdings now exceed $50M', source: 'House Cut Daily', hoursAgo: 23, legislatorId: 'pelosi' },
  { id: 'n7', headline: 'Top 5 House traders for September — leaderboard shake-up', source: 'PAC Pulse', hoursAgo: 30, legislatorId: 'pelosi' },
]

export const PLAYER_NEWS: Record<string, NewsHeadline[]> = {
  pelosi: [
    { id: 'pn1', headline: 'Pelosi files Q3 disclosure: NVDA position increased ahead of CHIPS vote', source: 'The Capitol Tape', hoursAgo: 2 },
    { id: 'pn2', headline: 'Speaker Emerita\'s tech holdings now exceed $50M', source: 'House Cut Daily', hoursAgo: 14 },
    { id: 'pn3', headline: 'Trade volume report: top 5 House traders for September', source: 'PAC Pulse', hoursAgo: 26 },
    { id: 'pn4', headline: 'Analysts upgrade Pelosi to Tier 1A as TSM call hits', source: 'Cloak Room', hoursAgo: 38 },
  ],
}

export interface AnalystNote {
  id: string
  badge: 'CONSENSUS' | 'SLEEPER' | 'FADE' | 'STRATEGY'
  title: string
  body: string
  byline: string
}

export const ANALYST_NOTES: AnalystNote[] = [
  {
    id: 'an1',
    badge: 'CONSENSUS',
    title: 'Pelosi locks 1.01 for the third straight cycle',
    body: 'No analyst on our consensus panel ranked her outside the top three. Volume floor is unchallenged and CHIPS-adjacent positioning gives her CMT multiplier exposure every committee day.',
    byline: 'Aggregated from 8 analysts',
  },
  {
    id: 'an2',
    badge: 'SLEEPER',
    title: 'Cassidy\'s HELP chairmanship is mispriced',
    body: 'ADP slots him in the late teens, but pharma reauthorization is a near-certain CMT trigger across Q4. Easy 3x multiplier window through January markups.',
    byline: 'M. Quan',
  },
  {
    id: 'an3',
    badge: 'FADE',
    title: 'Sinema\'s ADP is still too high',
    body: 'Retirement is priced in but lazily. Disclosure cadence has slowed and there\'s no committee context left to harvest. Pass entirely outside of FLX flier rounds.',
    byline: 'D. Owens',
  },
  {
    id: 'an4',
    badge: 'STRATEGY',
    title: 'Stack chair + leadership early — bundle artists late',
    body: 'The CMT multiplier is the single highest-variance lever in the scoring rules. Front-loading committee chairs and party leadership gives you a stable floor; chase bundle volume in rounds 9+.',
    byline: 'R. Castellanos',
  },
]
