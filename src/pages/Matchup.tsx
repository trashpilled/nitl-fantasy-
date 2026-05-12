import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Badge, { StatusBadge } from '../components/Badge'
import { TEAMS, getTeam, DEFAULT_USER_TEAM_ID } from '../data/teams'
import { getLegislator, partyShort } from '../data/legislators'
import { useRoster, simulateSeason } from '../context/RosterContext'

interface Row {
  slot: string
  legislatorId: string
  status: 'Active' | 'Hot' | 'Late' | 'Retired'
  trd: number
  vol: number
  cmt: number
  pac: number
  bns: number
  pts: number
  proj: number
}

const STARTER_SLOTS = ['SEN', 'SEN', 'HSE', 'HSE', 'FLX', 'CHR']

function buildRows(starterIds: string[]): Row[] {
  // Stable mocked weekly contributions per legislator.
  return starterIds.slice(0, 6).map((id, i) => {
    const leg = getLegislator(id)!
    const base = leg.totalPoints / 14
    const variance = ((id.charCodeAt(0) + i) % 7) - 3
    const pts = Number((base + variance * 8).toFixed(1))
    const proj = Number((base - 2).toFixed(1))
    return {
      slot: STARTER_SLOTS[i] || 'BN',
      legislatorId: id,
      status: leg.lateFilings > 4 ? 'Late' : leg.totalPoints > 1500 ? 'Hot' : 'Active',
      trd: Math.round(pts * 0.32),
      vol: Math.round(pts * 0.18),
      cmt: Math.round(pts * 0.24),
      pac: Math.round(pts * 0.16),
      bns: Math.round(pts * 0.10),
      pts,
      proj,
    }
  })
}

const TopTrade = ({ legId, mult, summary, pts }: { legId: string; mult: string; summary: string; pts: number }) => {
  const leg = getLegislator(legId)!
  return (
    <Link to={`/player/${legId}`} className="bg-white block" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar legislator={leg} size={32} />
          <div className="min-w-0 flex-1">
            <div className="text-[12px]" style={{ fontWeight: 500 }}>{leg.lastName}</div>
            <div className="text-[10px]" style={{ color: '#888' }}>{summary}</div>
          </div>
          <Badge tone="green">{mult}</Badge>
        </div>
        <div className="text-[14px] mt-2" style={{ color: '#047a3b', fontWeight: 500 }}>+{pts.toFixed(1)} pts</div>
      </div>
    </Link>
  )
}

export default function Matchup() {
  const { roster, hasRoster } = useRoster()
  const sim = hasRoster && roster ? simulateSeason(roster) : null

  const defaultTeam = getTeam(DEFAULT_USER_TEAM_ID)!
  const starterIds = hasRoster ? roster!.starterIds : defaultTeam.starters
  const teamName = hasRoster ? roster!.teamName : defaultTeam.name

  const rows = buildRows(starterIds)
  const yourTotal = sim ? sim.weekly[12]?.yourScore ?? 847.2 : 847.2

  const otherTeams = TEAMS.filter(t => !t.isYou)
  const opponent = otherTeams[13 % otherTeams.length]

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Header showing the two teams + scores */}
      <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <span className="label-caps-sm">Week 13 · Box Score</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full live-dot" style={{ background: '#c8102e' }} />
            <span className="text-[10px] uppercase" style={{ color: '#c8102e', letterSpacing: '0.1em', fontWeight: 500 }}>Live</span>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x" style={{ borderColor: '#e5e5e5' }}>
          <div className="px-5 py-5">
            <div className="text-[11px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>You</div>
            <div className="text-[16px]" style={{ fontWeight: 500 }}>{teamName}</div>
            <div className="text-[42px] serif" style={{ color: '#047a3b', fontWeight: 500 }}>
              {yourTotal.toFixed(1)}
            </div>
            <div className="text-[11px]" style={{ color: '#666' }}>
              Proj 812.4 · Bench 142.6
            </div>
          </div>
          <div className="px-5 py-5 text-right">
            <div className="text-[11px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>vs · {opponent.manager}</div>
            <div className="text-[16px]" style={{ fontWeight: 500 }}>{opponent.name}</div>
            <div className="text-[42px] serif" style={{ color: '#1a1a1a', fontWeight: 500 }}>
              {opponent.weeklyScores[12].toFixed(1)}
            </div>
            <div className="text-[11px]" style={{ color: '#666' }}>
              Proj 698.4 · Bench 124.8
            </div>
          </div>
        </div>
      </div>

      {/* Starters table */}
      <div className="bg-white mt-5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <span className="label-caps-sm">Your Starters</span>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: '#fafafa', color: '#666' }}>
              <Th>SLOT</Th>
              <Th align="left">Legislator</Th>
              <Th>STATUS</Th>
              <Th>TRD</Th>
              <Th>VOL</Th>
              <Th>CMT</Th>
              <Th>PAC</Th>
              <Th>BNS</Th>
              <Th>PROJ</Th>
              <Th>PTS</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const leg = getLegislator(r.legislatorId)!
              const above = r.pts >= r.proj
              return (
                <tr key={i} className="row-hover" style={{ borderTop: '0.5px solid #f0f0f0' }}>
                  <Td>
                    <span className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>{r.slot}</span>
                  </Td>
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
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>{r.trd}</Td>
                  <Td>{r.vol}</Td>
                  <Td>{r.cmt}</Td>
                  <Td>{r.pac}</Td>
                  <Td>{r.bns}</Td>
                  <Td><span style={{ color: '#888' }}>{r.proj.toFixed(1)}</span></Td>
                  <Td>
                    <span style={{ color: above ? '#047a3b' : '#1a1a1a', fontWeight: 500 }}>
                      {r.pts.toFixed(1)}
                    </span>
                  </Td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: '#fafafa', borderTop: '0.5px solid #e5e5e5' }}>
              <Td colSpan={2}><span className="text-[11px] uppercase" style={{ color: '#666', letterSpacing: '0.08em' }}>Totals</span></Td>
              <Td>—</Td>
              <Td>{rows.reduce((a, r) => a + r.trd, 0)}</Td>
              <Td>{rows.reduce((a, r) => a + r.vol, 0)}</Td>
              <Td>{rows.reduce((a, r) => a + r.cmt, 0)}</Td>
              <Td>{rows.reduce((a, r) => a + r.pac, 0)}</Td>
              <Td>{rows.reduce((a, r) => a + r.bns, 0)}</Td>
              <Td><span style={{ color: '#888' }}>{rows.reduce((a, r) => a + r.proj, 0).toFixed(1)}</span></Td>
              <Td><span style={{ color: '#047a3b', fontWeight: 500 }}>{yourTotal.toFixed(1)}</span></Td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Top trades this week */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="label-caps-sm">Top Disclosed Trades · This Week</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <TopTrade legId="pelosi"     mult="3x CMT"  summary="TSM · Buy · $500k–1M"   pts={412.4} />
          <TopTrade legId="daines"     mult="5x SUB"  summary="XOM · Buy · $250–500k"  pts={218.4} />
          <TopTrade legId="gottheimer" mult="BNDL"    summary="JPM · Buy · $100–250k"  pts={208.4} />
          <TopTrade legId="rscott"     mult="LATE"    summary="PFE · Sell · $1M–5M"    pts={184.2} />
        </div>
      </div>

      {/* CTA buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/roster" className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: '#047a3b', color: 'white', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          View Full Roster
        </Link>
        <Link to="/standings" className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: 'white', color: '#1a1a1a', border: '0.5px solid #e5e5e5', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          League Standings
        </Link>
        <Link to={`/player/${starterIds[0] || 'pelosi'}`} className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: 'white', color: '#1a1a1a', border: '0.5px solid #e5e5e5', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          Player Profile
        </Link>
      </div>
    </div>
  )
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return (
    <th
      className="text-[10px] uppercase font-medium px-3 py-2"
      style={{ letterSpacing: '0.08em', textAlign: align }}
    >
      {children}
    </th>
  )
}

function Td({ children, align = 'right', colSpan }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; colSpan?: number }) {
  return (
    <td className="px-3 py-2" style={{ textAlign: align }} colSpan={colSpan}>
      {children}
    </td>
  )
}
