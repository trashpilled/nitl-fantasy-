import { Link } from 'react-router-dom'
import { TEAMS, Team, Caucus, getTeam, DEFAULT_USER_TEAM_ID } from '../data/teams'
import { useRoster, simulateSeason } from '../context/RosterContext'

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

const TABS = ['Standings', 'Schedule', 'Power Rankings', 'Transactions', 'Constitution']

export default function Standings() {
  const { roster, hasRoster } = useRoster()
  const sim = hasRoster && roster ? simulateSeason(roster) : null

  // Compose final team list — replace default user team with simulated values when applicable
  const teams: Team[] = TEAMS.map(t => {
    if (t.isYou && sim && roster) {
      return {
        ...t,
        name: roster.teamName,
        manager: 'You',
        wins: sim.wins,
        losses: sim.losses,
        ties: sim.ties,
        pointsFor: sim.pointsFor,
        pointsAgainst: sim.pointsAgainst,
        takeUSD: sim.takeUSD,
        streak: streakFromWeekly(sim.weekly.map(w => w.result)),
      }
    }
    return t
  })

  const totalTake = teams.reduce((a, t) => a + t.takeUSD, 0)

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Tab strip */}
      <div className="flex items-center overflow-x-auto mb-5" style={{ borderBottom: '0.5px solid #e5e5e5' }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            className="px-3 py-2.5 text-[12px] uppercase whitespace-nowrap"
            style={{
              color: i === 0 ? '#1a1a1a' : '#888',
              borderBottom: i === 0 ? '3px solid #047a3b' : '3px solid transparent',
              letterSpacing: '0.08em',
              fontWeight: 500,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Dark take banner */}
      <div className="mb-5 px-5 py-4 flex items-center justify-between" style={{ background: '#1a1a1a', color: 'white', borderRadius: 8 }}>
        <div>
          <div className="text-[11px] uppercase opacity-70" style={{ letterSpacing: '0.1em' }}>League-Wide Rostered Take · YTD</div>
          <div className="text-[28px] serif mt-1" style={{ color: '#f4a300', fontWeight: 500 }}>
            {fmtMoney(totalTake)}
          </div>
        </div>
        <div className="text-right text-[12px] opacity-80">
          <div>119th Congress · 14 of 17 weeks</div>
          <div className="mt-1" style={{ color: '#f4a300' }}>+8.4% w/w</div>
        </div>
      </div>

      <CaucusTable caucus="WEST" teams={teams.filter(t => t.caucus === 'WEST')} />
      <CaucusTable caucus="EAST" teams={teams.filter(t => t.caucus === 'EAST')} />

      <div className="mt-3 text-[11px]" style={{ color: '#666' }}>
        x = clinched playoff berth · 3 weeks until playoffs
      </div>
    </div>
  )
}

function CaucusTable({ caucus, teams }: { caucus: Caucus; teams: Team[] }) {
  const sorted = [...teams].sort((a, b) => b.wins * 100 + b.pointsFor / 100 - (a.wins * 100 + a.pointsFor / 100))
  return (
    <div className="bg-white mb-5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
      <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
        <span className="label-caps-sm">{caucus} Caucus</span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ color: '#888' }}>
            <Th align="center">#</Th>
            <Th align="left">Team</Th>
            <Th>W-L</Th>
            <Th>PF</Th>
            <Th>PA</Th>
            <Th>Streak</Th>
            <Th>$ Take</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, i) => {
            const clinched = i < 2
            return (
              <tr
                key={t.id}
                style={{
                  borderTop: '0.5px solid #f0f0f0',
                  background: clinched ? '#e8f5ee' : t.isYou ? '#fffdf6' : 'transparent',
                }}
              >
                <Td align="center">
                  <span className="text-[12px]" style={{ color: '#666', fontWeight: 500 }}>
                    {i + 1}
                    {clinched && <span className="ml-1" style={{ color: '#047a3b', fontSize: 10 }}>x</span>}
                  </span>
                </Td>
                <Td align="left">
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 500 }}>{t.name}</span>
                    {t.isYou && <span className="text-[9px] uppercase px-1 py-0.5" style={{ background: '#047a3b', color: 'white', borderRadius: 2, letterSpacing: '0.06em' }}>YOU</span>}
                  </div>
                  <div className="text-[11px]" style={{ color: '#888' }}>{t.manager}</div>
                </Td>
                <Td>{t.wins}-{t.losses}{t.ties ? `-${t.ties}` : ''}</Td>
                <Td><span className="text-[12px]">{t.pointsFor.toFixed(1)}</span></Td>
                <Td><span className="text-[12px]" style={{ color: '#888' }}>{t.pointsAgainst.toFixed(1)}</span></Td>
                <Td>
                  <span
                    className="text-[11px]"
                    style={{
                      color: t.streak.startsWith('W') ? '#047a3b' : t.streak.startsWith('L') ? '#c8102e' : '#666',
                      fontWeight: 500,
                    }}
                  >
                    {t.streak}
                  </span>
                </Td>
                <Td><span className="gold-money">{fmtMoney(t.takeUSD)}</span></Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function streakFromWeekly(results: ('W' | 'L' | 'T')[]): string {
  if (results.length === 0) return '—'
  const last = results[results.length - 1]
  let count = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i] === last) count++
    else break
  }
  return `${last}${count}`
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th className="text-[10px] uppercase font-medium px-3 py-2" style={{ letterSpacing: '0.08em', textAlign: align }}>{children}</th>
}

function Td({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <td className="px-3 py-2.5" style={{ textAlign: align }}>{children}</td>
}
