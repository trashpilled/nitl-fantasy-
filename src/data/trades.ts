export type TradeType = 'Buy' | 'Sell' | 'Call exercise' | 'Put purchase' | 'Sell (Partial)'
export type MultiplierTag = '3x CMT' | '5x SUB' | 'BNDL' | 'LATE' | '2x SCT' | 'STK'

export interface Trade {
  id: string
  date: string             // ISO yyyy-mm-dd
  legislatorId: string
  ticker: string
  company: string
  type: TradeType
  amountMin: number
  amountMax: number
  multiplier: MultiplierTag[]
  committeeContext?: string
  pointsAwarded: number
}

export const TRADES: Trade[] = [
  { id: 't1',  date: '2025-09-08', legislatorId: 'pelosi',     ticker: 'NVDA', company: 'NVIDIA Corp',           type: 'Call exercise', amountMin: 1_000_000, amountMax: 5_000_000, multiplier: ['3x CMT', '5x SUB'], committeeContext: 'CHIPS markup pending',       pointsAwarded: 342.4 },
  { id: 't2',  date: '2025-09-04', legislatorId: 'pelosi',     ticker: 'GOOGL', company: 'Alphabet Inc',         type: 'Buy',           amountMin: 500_000,   amountMax: 1_000_000, multiplier: ['3x CMT'],                                                            pointsAwarded: 182.1 },
  { id: 't3',  date: '2025-08-22', legislatorId: 'pelosi',     ticker: 'MSFT', company: 'Microsoft Corp',        type: 'Call exercise', amountMin: 1_000_000, amountMax: 5_000_000, multiplier: ['3x CMT'],                                                            pointsAwarded: 268.2 },
  { id: 't4',  date: '2025-08-15', legislatorId: 'pelosi',     ticker: 'AVGO', company: 'Broadcom Inc',          type: 'Buy',           amountMin: 250_000,   amountMax: 500_000,   multiplier: ['STK'],                                                               pointsAwarded: 96.4 },
  { id: 't5',  date: '2025-08-01', legislatorId: 'pelosi',     ticker: 'PANW', company: 'Palo Alto Networks',    type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['LATE'],         committeeContext: 'Filed 51 days late',          pointsAwarded: 78.4 },

  { id: 't6',  date: '2025-09-10', legislatorId: 'tuberville', ticker: 'LMT',  company: 'Lockheed Martin',       type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['2x SCT', 'LATE'], committeeContext: 'SASC NDAA conference',         pointsAwarded: 124.4 },
  { id: 't7',  date: '2025-09-02', legislatorId: 'tuberville', ticker: 'RTX',  company: 'RTX Corp',              type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['2x SCT'],                                                          pointsAwarded: 142.4 },
  { id: 't8',  date: '2025-08-18', legislatorId: 'tuberville', ticker: 'AVGO', company: 'Broadcom Inc',          type: 'Sell',          amountMin: 250_000,   amountMax: 500_000,   multiplier: ['LATE'],         committeeContext: 'Pre-CHIPS Act markup',       pointsAwarded: 188.1 },
  { id: 't9',  date: '2025-08-04', legislatorId: 'tuberville', ticker: 'NOC',  company: 'Northrop Grumman',      type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['2x SCT'],                                                          pointsAwarded: 118.8 },
  { id: 't10', date: '2025-07-22', legislatorId: 'tuberville', ticker: 'GE',   company: 'GE Aerospace',          type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['STK'],                                                             pointsAwarded: 72.4 },

  { id: 't11', date: '2025-09-09', legislatorId: 'daines',     ticker: 'XOM',  company: 'Exxon Mobil',           type: 'Buy',           amountMin: 250_000,   amountMax: 500_000,   multiplier: ['3x CMT', 'BNDL'], committeeContext: 'ENR markup',                  pointsAwarded: 218.4 },
  { id: 't12', date: '2025-08-29', legislatorId: 'daines',     ticker: 'CVX',  company: 'Chevron Corp',          type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['3x CMT'],                                                          pointsAwarded: 142.8 },
  { id: 't13', date: '2025-08-14', legislatorId: 'daines',     ticker: 'COP',  company: 'ConocoPhillips',        type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['STK'],                                                             pointsAwarded: 84.2 },

  { id: 't14', date: '2025-09-11', legislatorId: 'crenshaw',   ticker: 'PFE',  company: 'Pfizer Inc',            type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['3x CMT'],         committeeContext: 'E&C health subcommittee',     pointsAwarded: 168.2 },
  { id: 't15', date: '2025-08-25', legislatorId: 'crenshaw',   ticker: 'MRK',  company: 'Merck & Co',            type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['STK'],                                                             pointsAwarded: 78.4 },

  { id: 't16', date: '2025-09-07', legislatorId: 'gottheimer', ticker: 'JPM',  company: 'JPMorgan Chase',        type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['3x CMT', 'BNDL'], committeeContext: 'FinSrvcs markup',             pointsAwarded: 208.4 },
  { id: 't17', date: '2025-08-19', legislatorId: 'gottheimer', ticker: 'GS',   company: 'Goldman Sachs',         type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['3x CMT'],                                                          pointsAwarded: 142.8 },

  { id: 't18', date: '2025-09-03', legislatorId: 'mullin',     ticker: 'OXY',  company: 'Occidental Petroleum',  type: 'Buy',           amountMin: 250_000,   amountMax: 500_000,   multiplier: ['BNDL'],                                                            pointsAwarded: 178.4 },
  { id: 't19', date: '2025-08-21', legislatorId: 'mullin',     ticker: 'TSLA', company: 'Tesla Inc',             type: 'Sell',          amountMin: 100_000,   amountMax: 250_000,   multiplier: ['STK'],                                                             pointsAwarded: 104.2 },

  { id: 't20', date: '2025-09-06', legislatorId: 'greene',     ticker: 'DJT',  company: 'Trump Media',           type: 'Buy',           amountMin: 25_000,    amountMax: 50_000,    multiplier: ['LATE', 'STK'],   committeeContext: 'Filed 88 days late',           pointsAwarded: 142.4 },
  { id: 't21', date: '2025-08-28', legislatorId: 'greene',     ticker: 'GME',  company: 'GameStop',              type: 'Call exercise', amountMin: 15_000,    amountMax: 50_000,    multiplier: ['STK', 'LATE'],                                                     pointsAwarded: 88.4 },
  { id: 't22', date: '2025-08-12', legislatorId: 'greene',     ticker: 'COIN', company: 'Coinbase',              type: 'Buy',           amountMin: 15_000,    amountMax: 50_000,    multiplier: ['STK'],                                                             pointsAwarded: 62.4 },

  { id: 't23', date: '2025-09-05', legislatorId: 'rscott',     ticker: 'PFE',  company: 'Pfizer Inc',            type: 'Sell',          amountMin: 1_000_000, amountMax: 5_000_000, multiplier: ['LATE'],         committeeContext: 'Filed 42 days late',          pointsAwarded: 184.2 },
  { id: 't24', date: '2025-08-23', legislatorId: 'rscott',     ticker: 'UNH',  company: 'UnitedHealth Group',    type: 'Sell',          amountMin: 500_000,   amountMax: 1_000_000, multiplier: ['STK'],                                                             pointsAwarded: 124.4 },

  { id: 't25', date: '2025-09-01', legislatorId: 'murkowski',  ticker: 'CCJ',  company: 'Cameco Corp',           type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['3x CMT', '2x SCT'], committeeContext: 'ENR uranium hearing',      pointsAwarded: 162.4 },

  { id: 't26', date: '2025-08-30', legislatorId: 'wicker',     ticker: 'HII',  company: 'Huntington Ingalls',    type: 'Buy',           amountMin: 100_000,   amountMax: 250_000,   multiplier: ['3x CMT', '2x SCT'], committeeContext: 'SASC shipyard markup',     pointsAwarded: 174.8 },

  { id: 't27', date: '2025-09-10', legislatorId: 'schatz',     ticker: 'TMUS', company: 'T-Mobile US',           type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['3x CMT'],         committeeContext: 'Commerce broadband',          pointsAwarded: 108.2 },

  { id: 't28', date: '2025-08-27', legislatorId: 'cassidy',    ticker: 'CVS',  company: 'CVS Health',            type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['3x CMT'],                                                          pointsAwarded: 98.4 },

  { id: 't29', date: '2025-09-04', legislatorId: 'khanna',     ticker: 'AAPL', company: 'Apple Inc',             type: 'Buy',           amountMin: 15_000,    amountMax: 50_000,    multiplier: ['STK'],                                                             pointsAwarded: 42.4 },
  { id: 't30', date: '2025-08-15', legislatorId: 'khanna',     ticker: 'NVDA', company: 'NVIDIA Corp',           type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['STK'],                                                             pointsAwarded: 64.2 },

  { id: 't31', date: '2025-08-20', legislatorId: 'booker',     ticker: 'PFE',  company: 'Pfizer Inc',            type: 'Buy',           amountMin: 15_000,    amountMax: 50_000,    multiplier: ['STK'],                                                             pointsAwarded: 38.8 },
  { id: 't32', date: '2025-07-30', legislatorId: 'spanberger', ticker: 'DE',   company: 'Deere & Co',            type: 'Buy',           amountMin: 50_000,    amountMax: 100_000,   multiplier: ['3x CMT'],         committeeContext: 'Agriculture markup',         pointsAwarded: 92.4 },

  { id: 't33', date: '2025-09-12', legislatorId: 'pelosi',     ticker: 'TSM',  company: 'Taiwan Semiconductor',  type: 'Buy',           amountMin: 500_000,   amountMax: 1_000_000, multiplier: ['3x CMT', 'BNDL', 'LATE'], committeeContext: 'Filed 33 days late · CHIPS context', pointsAwarded: 412.4 },
]

export const tradesByLegislator = (legislatorId: string): Trade[] =>
  TRADES.filter(t => t.legislatorId === legislatorId)

export const recentTrades = (limit = 8): Trade[] =>
  [...TRADES].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit)

export const formatAmountRange = (min: number, max: number): string => {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M` : `$${(n / 1_000).toFixed(0)}k`
  return `${fmt(min)}–${fmt(max)}`
}

export interface PacInflow {
  id: string
  legislatorId: string
  source: string
  industry: string
  amountUSD: number
  bundled: boolean
  pointsAwarded: number
  date: string
}

export const PAC_INFLOWS: PacInflow[] = [
  { id: 'p1', legislatorId: 'pelosi',     source: 'Tech Sector Action',         industry: 'Tech',         amountUSD: 240_000, bundled: true,  pointsAwarded: 96.2,  date: '2025-09-06' },
  { id: 'p2', legislatorId: 'pelosi',     source: 'Pacific Heights Bundlers',   industry: 'Finance',      amountUSD: 180_000, bundled: true,  pointsAwarded: 72.4,  date: '2025-08-22' },
  { id: 'p3', legislatorId: 'pelosi',     source: 'Hollywood for Democracy',    industry: 'Media',        amountUSD: 120_000, bundled: false, pointsAwarded: 38.6,  date: '2025-08-04' },
  { id: 'p4', legislatorId: 'pelosi',     source: 'Greater SF PAC',             industry: 'Real Estate',  amountUSD:  88_000, bundled: false, pointsAwarded: 24.2,  date: '2025-07-18' },
  { id: 'p5', legislatorId: 'tuberville', source: 'Defense Industries Fund',    industry: 'Defense',      amountUSD: 220_000, bundled: false, pointsAwarded: 78.4,  date: '2025-09-02' },
  { id: 'p6', legislatorId: 'tuberville', source: 'Heartland Agriculture',      industry: 'Agriculture', amountUSD: 140_000, bundled: false, pointsAwarded: 44.2,  date: '2025-08-12' },
  { id: 'p7', legislatorId: 'daines',     source: 'Energy Future Coalition',    industry: 'Energy',       amountUSD: 320_000, bundled: true,  pointsAwarded: 112.4, date: '2025-09-04' },
  { id: 'p8', legislatorId: 'gottheimer', source: 'Wall Street Forward',        industry: 'Finance',      amountUSD: 280_000, bundled: true,  pointsAwarded: 102.8, date: '2025-08-30' },
  { id: 'p9', legislatorId: 'crenshaw',   source: 'Texas Medical PAC',          industry: 'Healthcare',   amountUSD: 180_000, bundled: false, pointsAwarded: 58.4,  date: '2025-08-18' },
  { id: 'p10', legislatorId: 'booker',    source: 'Justice Reform PAC',         industry: 'Civic',        amountUSD: 140_000, bundled: false, pointsAwarded: 46.8,  date: '2025-08-08' },
]

export const pacByLegislator = (legislatorId: string): PacInflow[] =>
  PAC_INFLOWS.filter(p => p.legislatorId === legislatorId)
