import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react'
import Avatar from '../components/Avatar'
import Badge, { StatusBadge } from '../components/Badge'
import { TEAMS, getTeam, DEFAULT_USER_TEAM_ID } from '../data/teams'
import { getLegislator, partyShort } from '../data/legislators'
import { useRoster } from '../context/RosterContext'

const STARTER_SLOTS = ['SEN', 'SEN', 'HSE', 'HSE', 'FLX', 'CHR']

export default function Roster() {
  const [week, setWeek] = useState(7)
  const { roster, hasRoster } = useRoster()
  const defaultTeam = getTeam(DEFAULT_USER_TEAM_ID)!

  const starters = hasRoster ? roster!.starterIds : defaultTeam.starters
  const bench = hasRoster
    ? roster!.legislatorIds.filter(id => !roster!.starterIds.includes(id))
    : defaultTeam.bench
  const teamName = hasRoster ? roster!.teamName : defaultTeam.name
  const ir = hasRoster ? null : defaultTeam.ir

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="label-caps-sm">{teamName}</div>
          <h1 className="text-[22px]" style={{ fontWeight: 500 }}>Team Roster</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1.5" style={{ background: 'white', border: '0.5px solid #e5e5e5', borderRadius: 6 }}>
            <button onClick={() => setWeek(Math.max(1, week - 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] px-1" style={{ fontWeight: 500 }}>Week {week}</span>
            <button onClick={() => setWeek(Math.min(17, week + 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight size={14} />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] uppercase tracking-wider" style={{ background: '#047a3b', color: 'white', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
            <Pencil size={12} /> Edit Lineup
          </button>
        </div>
      </div>

      {/* Starters */}
      <Section title="Starters">
        <RosterTable rows={starters.map((id, i) => ({ slot: STARTER_SLOTS[i] || 'FLX', legislatorId: id, dimmed: false }))} />
      </Section>

      {/* Bench */}
      <Section title="Bench">
        <RosterTable rows={bench.map(id => ({ slot: 'BN', legislatorId: id, dimmed: true }))} />
      </Section>

      {/* IR */}
      {ir && (
        <Section title="Injured Reserve">
          <RosterTable rows={[{ slot: 'IR', legislatorId: ir, dimmed: true, retired: true }]} />
        </Section>
      )}

      {/* Footer composition */}
      <div className="mt-4 text-[11px]" style={{ color: '#666' }}>
        Roster {starters.length + bench.length}/12 · SEN {starters.filter(id => getLegislator(id)?.chamber === 'Senate').length}/2 · HSE {starters.filter(id => getLegislator(id)?.chamber === 'House').length}/2 · CHR {starters.filter(id => getLegislator(id)?.isChair || getLegislator(id)?.isLeadership).length}/1
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/matchup" className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: '#047a3b', color: 'white', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          View Matchup
        </Link>
        <Link to="/standings" className="px-4 py-2 text-[12px] uppercase tracking-wider" style={{ background: 'white', color: '#1a1a1a', border: '0.5px solid #e5e5e5', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}>
          League Standings
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white mb-4" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
      <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
        <span className="label-caps-sm">{title}</span>
      </div>
      {children}
    </div>
  )
}

interface RowSpec {
  slot: string
  legislatorId: string
  dimmed?: boolean
  retired?: boolean
}

function RosterTable({ rows }: { rows: RowSpec[] }) {
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr style={{ background: '#fff', color: '#888' }}>
          <Th>SLOT</Th>
          <Th align="left">Legislator</Th>
          <Th>STATUS</Th>
          <Th align="left">Committee Context</Th>
          <Th>PROJ</Th>
          <Th>PTS</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const leg = getLegislator(r.legislatorId)
          if (!leg) return null
          const status = r.retired ? 'Retired' : leg.lateFilings > 4 ? 'Late' : leg.totalPoints > 1500 ? 'Hot' : 'Active'
          const proj = leg.projectedPoints / 14
          const pts = r.retired ? 0 : leg.totalPoints / 14
          return (
            <tr key={i} className="row-hover" style={{ borderTop: '0.5px solid #f0f0f0', opacity: r.dimmed ? 0.7 : 1 }}>
              <Td>
                <span className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>{r.slot}</span>
              </Td>
              <Td align="left">
                <Link to={`/player/${leg.id}`} className="flex items-center gap-2.5 py-1">
                  <Avatar legislator={leg} size={36} />
                  <div className="min-w-0">
                    <div style={{ fontWeight: 500 }}>{leg.name}</div>
                    <div className="text-[11px]" style={{ color: '#888' }}>
                      {partyShort(leg.party)} · {leg.chamber === 'Senate' ? 'Sen' : 'Rep'} · {leg.stateAbbr}
                      {leg.district ? `-${leg.district}` : ''}
                    </div>
                  </div>
                </Link>
              </Td>
              <Td><StatusBadge status={status} /></Td>
              <Td align="left">
                <span className="text-[12px]" style={{ color: '#666' }}>
                  {leg.committees[0]}
                  {leg.isChair && <span style={{ color: '#047a3b' }}> · Chair</span>}
                </span>
              </Td>
              <Td><span style={{ color: '#888' }}>{proj.toFixed(1)}</span></Td>
              <Td>
                {r.retired ? (
                  <span style={{ color: '#888' }}>—</span>
                ) : (
                  <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{pts.toFixed(1)}</span>
                )}
              </Td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return (
    <th className="text-[10px] uppercase font-medium px-3 py-2" style={{ letterSpacing: '0.08em', textAlign: align }}>
      {children}
    </th>
  )
}

function Td({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <td className="px-3 py-2" style={{ textAlign: align }}>{children}</td>
}
