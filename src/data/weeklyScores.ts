import { LEGISLATORS, ROSTERED_LEGISLATOR_IDS, getLegislator } from './legislators'

export interface WeeklyScore {
  legislatorId: string
  weekScores: number[]      // 17 entries, index 0 = week 1
  weeklyTakeUSD: number[]   // 17 entries, $ generated per week
}

// Deterministic seeded RNG so values are stable across reloads.
function mulberry32(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash a string id to a numeric seed.
function seedFor(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function generateWeekly(total: number, seed: number, variance = 0.45, spikeChance = 0.12): number[] {
  const rng = mulberry32(seed)
  const raw: number[] = []
  for (let i = 0; i < 17; i++) {
    let factor = 1 + (rng() - 0.5) * 2 * variance
    if (rng() < spikeChance) factor *= 1 + rng() * 0.9 // occasional 300+ spike for tier 1
    raw.push(Math.max(0.1, factor))
  }
  const sum = raw.reduce((a, b) => a + b, 0)
  return raw.map(w => Number(((w * total) / sum).toFixed(1)))
}

const WEEKLY_SCORES: Record<string, WeeklyScore> = {}

for (const id of ROSTERED_LEGISLATOR_IDS) {
  const leg = getLegislator(id)
  if (!leg) continue
  const seed = seedFor(id)
  const scores = generateWeekly(leg.totalPoints, seed)
  const takeTotal = leg.tradeVolumeUSD * 0.08 + leg.pacUSD * 0.15 + leg.bundledUSD * 0.1
  const takes = generateWeekly(takeTotal, seed ^ 0x9e3779b9, 0.55, 0.08)
  WEEKLY_SCORES[id] = {
    legislatorId: id,
    weekScores: scores,
    weeklyTakeUSD: takes.map(t => Math.round(t)),
  }
}

export const getWeeklyScore = (legislatorId: string): WeeklyScore | undefined =>
  WEEKLY_SCORES[legislatorId]

export const TOTAL_WEEKS = 17

export const REGULAR_SEASON_WEEKS = 14

export { WEEKLY_SCORES }
