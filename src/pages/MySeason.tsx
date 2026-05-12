import { Fragment, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Sparkles, RotateCcw } from 'lucide-react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { LEGISLATORS, getLegislator, partyShort } from '../data/legislators'
import { TEAMS, getTeam } from '../data/teams'
import { useRoster, simulateSeason, legislatorRecaps } from '../context/RosterContext'
import { getWeeklyScore } from '../data/weeklyScores'

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

const ord = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export default function MySeason() {
  const { roster, hasRoster, reset } = useRoster()
  const [openWeek, setOpenWeek] = useState<number | null>(null)

  if (!hasRoster || !roster) {
    return <Navigate to="/draft" replace />
  }

  const sim = simulateSeason(roster)
  const recaps = legislatorRecaps(roster)

  // MVP / Bust badges
  const startersRecap = recaps.filter(r => r.isStarter)
  const mvp = [...recaps].sort((a, b) => b.totalPoints - a.totalPoints)[0]
  const bust = [...recaps]
    .map(r => {
      const leg = getLegislator(r.legislatorId)
      const proj = leg?.projectedPoints ?? 0
      const delta = r.totalPoints - proj
      return { ...r, delta }
    })
    .sort((a, b) => a.delta - b.delta)[0]

  // Should-have-started analysis: bench player who outscored a starter most weeks
  const benchIds = roster.legislatorIds.filter(id => !roster.starterIds.includes(id))
  const shouldStart = (() => {
    let best = { benchId: '', startedId: '', weeksBeat: 0 }
    for (const bId of benchIds) {
      const bws = getWeeklyScore(bId)
      if (!bws) continue
      for (const sId of roster.starterIds) {
        const sws = getWeeklyScore(sId)
        if (!sws) continue
        let wb = 0
        for (let i = 0; i < bws.weekScores.length; i++) {
          if (bws.weekScores[i] > sws.weekScores[i]) wb++
        }
        if (wb > best.weeksBeat) best = { benchId: bId, startedId: sId, weeksBeat: wb }
      }
    }
    return best
  })()

  const biggestHit = useMemo(() => {
    let best = { legislatorId: '', week: 0, score: 0 }
    for (const id of roster.starterIds) {
      const ws = getWeeklyScore(id)
      if (!ws) continue
      ws.weekScores.forEach((s, i) => {
        if (s > best.score) best = { legislatorId: id, week: i + 1, score: s }
      })
    }
    return best
  }, [roster.starterIds])

  // Archetype profile
  const archetypeCounts = (() => {
    const counts: Record<string, number> = {}
    for (const id of roster.legislatorIds) {
      const l = getLegislator(id)
      if (!l) continue
      counts[l.archetype] = (counts[l.archetype] || 0) + 1
    }
    return counts
  })()
  const topArchetype = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Quiet Compounder'
  const draftStrategy = describeStrategy(archetypeCounts)

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Hero card */}
      <div className="bg-white mb-5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#047a3b', color: 'white' }}>
          <div>
            <div className="text-[11px] uppercase opacity-80" style={{ letterSpacing: '0.1em' }}>Your Team · 2025 Season Recap</div>
            <div className="text-[26px] mt-0.5" style={{ fontWeight: 500 }}>{roster.teamName}</div>
          </div>
          <button onClick={reset} className="flex items-center gap-1 text-[11px] uppercase px-2 py-1.5" style={{ color: 'white', letterSpacing: '0.08em', border: '0.5px solid rgba(255,255,255,0.4)', borderRadius: 6 }}>
            <RotateCcw size={12} /> Try a different roster
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4">
          <BigStat label="Final Record" value={`${sim.wins}–${sim.losses}${sim.ties ? `–${sim.ties}` : ''}`} sub="14-week regular season" />
          <BigStat label="Final Standings" value={`${sim.rank}${ord(sim.rank)}`} sub="of 12 teams" tone="green" />
          <BigStat label="Total Points" value={sim.pointsFor.toFixed(1)} sub={`Allowed ${sim.pointsAgainst.toFixed(1)}`} />
          <BigStat label="$ Take · Season" value={fmtMoney(sim.takeUSD)} sub="Roster-attributable" tone="gold" />
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <Insight title="Your biggest hit" tone="green">
          {(() => {
            const leg = getLegislator(biggestHit.legislatorId)
            return (
              <>
                <span style={{ fontWeight: 500 }}>{leg?.name || '—'}</span> in <span style={{ fontWeight: 500 }}>Week {biggestHit.week}</span>{' '}
                scored <span style={{ color: '#047a3b', fontWeight: 500 }}>{biggestHit.score.toFixed(1)} pts</span> — the single best
                outing on your roster all year.
              </>
            )
          })()}
        </Insight>
        <Insight title="Should have started" tone="gold">
          {(() => {
            const benchLeg = getLegislator(shouldStart.benchId)
            const startedLeg = getLegislator(shouldStart.startedId)
            if (!benchLeg || !startedLeg) return <>No bench misses worth flagging — your starters held up.</>
            return (
              <>
                <span style={{ fontWeight: 500 }}>{benchLeg.lastName}</span> outscored <span style={{ fontWeight: 500 }}>{startedLeg.lastName}</span>{' '}
                in <span style={{ fontWeight: 500 }}>{shouldStart.weeksBeat} of 14 weeks</span>. Costly bench miss for a top-2 floor.
              </>
            )
          })()}
        </Insight>
        <Insight title="Your draft strategy" tone="blue">
          <span style={{ fontWeight: 500 }}>{topArchetype}-heavy build.</span> {draftStrategy}
        </Insight>
        <Insight title="If the season ended today" tone="green">
          Your <span style={{ fontWeight: 500 }}>{sim.wins}–{sim.losses}</span> record would have finished{' '}
          <span style={{ fontWeight: 500 }}>{sim.rank}{ord(sim.rank)}</span> of 12 teams. {sim.rank <= 4 ? 'Playoff-bound.' : sim.rank <= 8 ? 'Just outside the cut.' : 'Better luck in the next draft.'}
        </Insight>
      </div>

      {/* Roster recap */}
      <div className="bg-white mb-5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
        <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <span className="label-caps-sm">Roster Recap · Season Totals</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: '#888' }}>
              <Th align="left">Legislator</Th>
              <Th>Slot</Th>
              <Th>Total Pts</Th>
              <Th>$ Take</Th>
              <Th>Best Wk</Th>
              <Th>Worst Wk</Th>
              <Th align="center">Tag</Th>
            </tr>
          </thead>
          <tbody>
            {recaps
              .sort((a, b) => b.totalPoints - a.totalPoints)
              .map((r, i) => {
                const leg = getLegislator(r.legislatorId)!
                const isMVP = r.legislatorId === mvp.legislatorId
                const isBust = r.legislatorId === bust.legislatorId
                return (
                  <tr key={r.legislatorId} className="row-hover" style={{ borderTop: i === 0 ? '0.5px solid #e5e5e5' : '0.5px solid #f0f0f0' }}>
                    <Td align="left">
                      <Link to={`/player/${leg.id}`} className="flex items-center gap-2.5 py-1">
                        <Avatar legislator={leg} size={32} />
                        <div className="min-w-0">
                          <div style={{ fontWeight: 500 }}>{leg.name}</div>
                          <div className="text-[11px]" style={{ color: '#888' }}>
                            {partyShort(leg.party)} · {leg.stateAbbr} · {leg.committees[0]}
                          </div>
                        </div>
                      </Link>
                    </Td>
                    <Td>
                      <span className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.06em' }}>
                        {r.isStarter ? 'STR' : 'BN'}
                      </span>
                    </Td>
                    <Td><span style={{ fontWeight: 500 }}>{r.totalPoints.toFixed(1)}</span></Td>
                    <Td><span className="gold-money">{fmtMoney(r.totalTakeUSD)}</span></Td>
                    <Td><span className="text-[12px]" style={{ color: '#047a3b' }}>W{r.bestWeek.week} · {r.bestWeek.score.toFixed(1)}</span></Td>
                    <Td><span className="text-[12px]" style={{ color: '#888' }}>W{r.worstWeek.week} · {r.worstWeek.score.toFixed(1)}</span></Td>
                    <Td align="center">
                      {isMVP && <Badge tone="green">MVP</Badge>}
                      {isBust && <Badge tone="red">BUST</Badge>}
                    </Td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* Weekly results */}
      <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
        <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <span className="label-caps-sm">Week-by-Week Results</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ color: '#888' }}>
              <Th align="left">Week</Th>
              <Th align="left">Opponent</Th>
              <Th>Your Score</Th>
              <Th>Opp Score</Th>
              <Th align="center">Result</Th>
              <Th align="right">{' '}</Th>
            </tr>
          </thead>
          <tbody>
            {sim.weekly.map((w, i) => {
              const opp = getTeam(w.opponentTeamId)
              const open = openWeek === w.week
              return (
                <Fragment key={w.week}>
                  <tr
                    className="row-hover cursor-pointer"
                    style={{ borderTop: i === 0 ? '0.5px solid #e5e5e5' : '0.5px solid #f0f0f0' }}
                    onClick={() => setOpenWeek(open ? null : w.week)}
                  >
                    <Td align="left"><span style={{ fontWeight: 500 }}>W{w.week}</span></Td>
                    <Td align="left">
                      <span>{opp?.name}</span>
                      <span className="text-[11px] ml-1" style={{ color: '#888' }}>({opp?.wins}–{opp?.losses})</span>
                    </Td>
                    <Td><span style={{ fontWeight: 500 }}>{w.yourScore.toFixed(1)}</span></Td>
                    <Td><span style={{ color: '#888' }}>{w.oppScore.toFixed(1)}</span></Td>
                    <Td align="center">
                      <span style={{
                        color: w.result === 'W' ? '#047a3b' : w.result === 'L' ? '#c8102e' : '#888',
                        fontWeight: 500,
                      }}>
                        {w.result}
                      </span>
                    </Td>
                    <Td align="right">
                      {open ? <ChevronUp size={14} style={{ color: '#888' }} /> : <ChevronDown size={14} style={{ color: '#888' }} />}
                    </Td>
                  </tr>
                  {open && (
                    <tr style={{ background: '#fafafa' }}>
                      <td colSpan={6} className="px-5 py-3">
                        <div className="label-caps mb-2">Week {w.week} Starters</div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {roster.starterIds.map(id => {
                            const leg = getLegislator(id)!
                            const ws = getWeeklyScore(id)
                            const s = ws?.weekScores[w.week - 1] ?? 0
                            return (
                              <div key={id} className="bg-white px-3 py-2 flex items-center gap-2" style={{ border: '0.5px solid #e5e5e5', borderRadius: 4 }}>
                                <Avatar legislator={leg} size={28} />
                                <div className="min-w-0 flex-1">
                                  <div className="text-[12px] truncate" style={{ fontWeight: 500 }}>{leg.name}</div>
                                  <div className="text-[10px]" style={{ color: '#888' }}>{partyShort(leg.party)} · {leg.stateAbbr}</div>
                                </div>
                                <div className="text-[14px] serif" style={{ color: '#047a3b', fontWeight: 500 }}>{s.toFixed(1)}</div>
                              </div>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/draft" className="px-4 py-2 text-[12px] uppercase tracking-wider flex items-center gap-1" style={{ background: 'white', color: '#1a1a1a', border: '0.5px solid #e5e5e5', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          <RotateCcw size={12} /> Try a different roster
        </Link>
        <Link to="/standings" className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: '#047a3b', color: 'white', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          See League Standings
        </Link>
      </div>
    </div>
  )
}

function BigStat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'green' | 'gold' }) {
  const c = tone === 'green' ? '#047a3b' : tone === 'gold' ? '#f4a300' : '#1a1a1a'
  return (
    <div className="px-5 py-4" style={{ borderRight: '0.5px solid #e5e5e5' }}>
      <div className="label-caps">{label}</div>
      <div className="text-[26px] serif mt-1" style={{ color: c, fontWeight: 500 }}>{value}</div>
      {sub && <div className="text-[11px]" style={{ color: '#666' }}>{sub}</div>}
    </div>
  )
}

function Insight({ title, tone, children }: { title: string; tone: 'green' | 'gold' | 'blue'; children: React.ReactNode }) {
  const accent = tone === 'green' ? '#047a3b' : tone === 'gold' ? '#f4a300' : '#1a4d8a'
  return (
    <div className="bg-white px-4 py-3" style={{ border: '0.5px solid #e5e5e5', borderLeft: `3px solid ${accent}`, borderRadius: 8 }}>
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles size={12} style={{ color: accent }} />
        <span className="text-[11px] uppercase" style={{ color: accent, letterSpacing: '0.08em', fontWeight: 500 }}>{title}</span>
      </div>
      <div className="text-[13px] leading-relaxed">{children}</div>
    </div>
  )
}

function describeStrategy(counts: Record<string, number>): string {
  const hasVolume = (counts['Volume King'] || 0) >= 2
  const hasPAC = (counts['PAC Magnet'] || 0) >= 2
  const hasBundle = (counts['Bundle Artist'] || 0) >= 2
  const hasMeme = (counts['Memecoin Maven'] || 0) >= 1
  if (hasVolume && !hasPAC) return 'Heavy on raw disclosure cadence — high floor, but you missed the bundled-PAC ceiling weeks.'
  if (hasPAC && !hasVolume) return 'Strong PAC-tilted build — steady contributions, but exposed when committee context lights up.'
  if (hasBundle) return 'Bundle-artist core gave you correlated outcomes — high variance, big upside when conferences hit.'
  if (hasMeme) return 'You took a flier on the memecoin tier — fun, but lopsided variance.'
  return 'Balanced across archetypes — solid floor, modest ceiling. Classic median-finish build.'
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th className="text-[10px] uppercase font-medium px-3 py-2" style={{ letterSpacing: '0.08em', textAlign: align }}>{children}</th>
}

function Td({ children, align = 'right', colSpan }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; colSpan?: number }) {
  return <td className="px-3 py-2.5" style={{ textAlign: align }} colSpan={colSpan}>{children}</td>
}
