import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react'
import { Legislator, getLegislator } from '../data/legislators'
import { TEAMS, TEAM_NAME_OPTIONS } from '../data/teams'
import { getWeeklyScore, REGULAR_SEASON_WEEKS } from '../data/weeklyScores'

const STORAGE_KEY = 'nitl:user-roster:v1'

export interface UserRoster {
  teamName: string
  legislatorIds: string[]   // exactly 12 (when complete)
  starterIds: string[]      // 6
  draftedAt: string
}

interface RosterContextValue {
  roster: UserRoster | null
  hasRoster: boolean
  draftSelection: string[]
  teamNameDraft: string
  setTeamNameDraft: (name: string) => void
  toggle: (legislatorId: string) => void
  remove: (legislatorId: string) => void
  reset: () => void
  finalize: (teamName?: string) => void
  isSelected: (legislatorId: string) => boolean
  slotCounts: { sen: number; hse: number; chr: number; flx: number; total: number }
  isValidForFinalize: boolean
}

const Ctx = createContext<RosterContextValue | undefined>(undefined)

function isChairOrLeader(l: Legislator): boolean {
  return Boolean(l.isChair || l.isLeadership)
}

export function RosterProvider({ children }: { children: ReactNode }) {
  const [roster, setRoster] = useState<UserRoster | null>(null)
  const [draftSelection, setDraftSelection] = useState<string[]>([])
  const [teamNameDraft, setTeamNameDraft] = useState<string>('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as UserRoster
        if (parsed && Array.isArray(parsed.legislatorIds)) {
          setRoster(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = (next: UserRoster | null) => {
    setRoster(next)
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const toggle = (legislatorId: string) => {
    setDraftSelection(prev => {
      if (prev.includes(legislatorId)) return prev.filter(id => id !== legislatorId)
      if (prev.length >= 12) return prev
      return [...prev, legislatorId]
    })
  }

  const remove = (legislatorId: string) => {
    setDraftSelection(prev => prev.filter(id => id !== legislatorId))
  }

  const reset = () => {
    setDraftSelection([])
    setTeamNameDraft('')
    persist(null)
  }

  const slotCounts = useMemo(() => {
    let sen = 0, hse = 0, chr = 0
    for (const id of draftSelection) {
      const l = getLegislator(id)
      if (!l) continue
      if (l.chamber === 'Senate') sen++
      if (l.chamber === 'House') hse++
      if (isChairOrLeader(l)) chr++
    }
    const total = draftSelection.length
    // FLX is satisfied by any pick beyond the minimum chamber requirements
    const flx = total >= 5 ? 1 : 0
    return { sen, hse, chr, flx, total }
  }, [draftSelection])

  const isValidForFinalize =
    slotCounts.total === 12 &&
    slotCounts.sen >= 2 &&
    slotCounts.hse >= 2 &&
    slotCounts.chr >= 1

  const finalize = (teamName?: string) => {
    if (!isValidForFinalize) return
    const chosenName = (teamName || teamNameDraft || '').trim() ||
      TEAM_NAME_OPTIONS[Math.floor(Math.random() * TEAM_NAME_OPTIONS.length)]
    // Pick top 6 by projected points as starters (deterministic-ish)
    const ranked = [...draftSelection]
      .map(id => getLegislator(id)!)
      .sort((a, b) => b.projectedPoints - a.projectedPoints)
    const starterIds = ranked.slice(0, 6).map(l => l.id)
    const newRoster: UserRoster = {
      teamName: chosenName,
      legislatorIds: [...draftSelection],
      starterIds,
      draftedAt: new Date().toISOString(),
    }
    persist(newRoster)
  }

  const value: RosterContextValue = {
    roster,
    hasRoster: !!roster && roster.legislatorIds.length === 12,
    draftSelection,
    teamNameDraft,
    setTeamNameDraft,
    toggle,
    remove,
    reset,
    finalize,
    isSelected: (id: string) => draftSelection.includes(id),
    slotCounts,
    isValidForFinalize,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useRoster() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useRoster must be inside <RosterProvider>')
  return v
}

// --- Season simulation helpers ---

export interface SeasonResult {
  weekly: { week: number; opponentTeamId: string; yourScore: number; oppScore: number; result: 'W' | 'L' | 'T' }[]
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  rank: number
  takeUSD: number
  totalPoints: number
}

export function simulateSeason(roster: UserRoster): SeasonResult {
  const otherTeams = TEAMS.filter(t => !t.isYou)
  const starters = roster.starterIds
  // Compute weekly scores summing starter weeklyScores
  const weekly: SeasonResult['weekly'] = []
  let pf = 0
  let pa = 0
  let w = 0, l = 0, t = 0
  for (let week = 0; week < REGULAR_SEASON_WEEKS; week++) {
    let yourScore = 0
    for (const id of starters) {
      const ws = getWeeklyScore(id)
      if (ws) yourScore += ws.weekScores[week]
    }
    yourScore = Number(yourScore.toFixed(1))
    const opp = otherTeams[week % otherTeams.length]
    const oppScore = Number(opp.weeklyScores[week].toFixed(1))
    let result: 'W' | 'L' | 'T'
    if (yourScore > oppScore) { result = 'W'; w++ }
    else if (yourScore < oppScore) { result = 'L'; l++ }
    else { result = 'T'; t++ }
    pf += yourScore
    pa += oppScore
    weekly.push({ week: week + 1, opponentTeamId: opp.id, yourScore, oppScore, result })
  }
  pf = Number(pf.toFixed(1))
  pa = Number(pa.toFixed(1))
  // Rank: count how many other teams' pointsFor exceed ours.
  const allPF = [...otherTeams.map(o => o.pointsFor), pf].sort((a, b) => b - a)
  const rank = allPF.indexOf(pf) + 1
  // Take: sum each starter+bench's weekly take totals.
  let takeUSD = 0
  for (const id of roster.legislatorIds) {
    const ws = getWeeklyScore(id)
    if (ws) takeUSD += ws.weeklyTakeUSD.reduce((a, b) => a + b, 0)
  }
  // Total points for full season (starters)
  let totalPoints = 0
  for (const id of starters) {
    const ws = getWeeklyScore(id)
    if (ws) totalPoints += ws.weekScores.reduce((a, b) => a + b, 0)
  }
  totalPoints = Number(totalPoints.toFixed(1))

  return {
    weekly,
    wins: w,
    losses: l,
    ties: t,
    pointsFor: pf,
    pointsAgainst: pa,
    rank,
    takeUSD,
    totalPoints,
  }
}

export interface PlayerSeasonRecap {
  legislatorId: string
  totalPoints: number
  totalTakeUSD: number
  bestWeek: { week: number; score: number }
  worstWeek: { week: number; score: number }
  isStarter: boolean
}

export function legislatorRecaps(roster: UserRoster): PlayerSeasonRecap[] {
  return roster.legislatorIds.map(id => {
    const ws = getWeeklyScore(id)
    const scores = ws ? ws.weekScores : []
    const takes = ws ? ws.weeklyTakeUSD : []
    let bestIdx = 0, worstIdx = 0
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > scores[bestIdx]) bestIdx = i
      if (scores[i] < scores[worstIdx]) worstIdx = i
    }
    return {
      legislatorId: id,
      totalPoints: Number(scores.reduce((a, b) => a + b, 0).toFixed(1)),
      totalTakeUSD: takes.reduce((a, b) => a + b, 0),
      bestWeek: { week: bestIdx + 1, score: scores[bestIdx] || 0 },
      worstWeek: { week: worstIdx + 1, score: scores[worstIdx] || 0 },
      isStarter: roster.starterIds.includes(id),
    }
  })
}
