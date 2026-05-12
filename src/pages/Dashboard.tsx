import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Newspaper, TrendingUp, Trophy, ListChecks } from 'lucide-react'
import { useRoster, simulateSeason } from '../context/RosterContext'
import { TEAMS, getTeam, DEFAULT_USER_TEAM_ID } from '../data/teams'
import { HEADLINES } from '../data/propLines'
import { getLegislator } from '../data/legislators'
import StatCard from '../components/StatCard'
import Avatar from '../components/Avatar'

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

export default function Dashboard() {
  const { roster, hasRoster } = useRoster()
  const defaultTeam = getTeam(DEFAULT_USER_TEAM_ID)!

  const sim = hasRoster && roster ? simulateSeason(roster) : null

  const teamName = hasRoster ? roster!.teamName : defaultTeam.name
  const wins = sim ? sim.wins : defaultTeam.wins
  const losses = sim ? sim.losses : defaultTeam.losses
  const rank = sim ? sim.rank : 4
  const takeUSD = sim ? sim.takeUSD : defaultTeam.takeUSD
  const weeklyScore = sim
    ? sim.weekly[sim.weekly.length - 1]?.yourScore ?? 0
    : 847.2

  // This-week opponent: rotate; use index 13 % otherTeams.length
  const otherTeams = TEAMS.filter(t => !t.isYou)
  const opponent = otherTeams[13 % otherTeams.length]
  const oppScore = opponent.weeklyScores[12]
  const yourThisWeekScore = sim
    ? sim.weekly[12]?.yourScore ?? weeklyScore
    : 847.2

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {!hasRoster && (
        <div
          className="mb-5 px-4 py-3 flex items-center justify-between gap-4"
          style={{
            border: '0.5px solid #e5e5e5',
            background: '#f4ecd8',
            borderRadius: 8,
          }}
        >
          <div>
            <div className="text-[13px]" style={{ fontWeight: 500 }}>
              You haven't built a roster yet.
            </div>
            <div className="text-[12px]" style={{ color: '#666' }}>
              Draft your team to see how you'd have done this season.
            </div>
          </div>
          <Link
            to="/draft"
            className="text-[12px] uppercase tracking-wider px-3 py-2 flex items-center gap-1"
            style={{
              background: '#047a3b',
              color: 'white',
              borderRadius: 6,
              letterSpacing: '0.08em',
              fontWeight: 500,
            }}
          >
            Draft Team <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Hero team card */}
      <div
        className="bg-white mb-5"
        style={{ border: '0.5px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}
      >
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#047a3b', color: '#fff' }}>
          <div>
            <div className="text-[11px] uppercase opacity-80" style={{ letterSpacing: '0.1em' }}>
              Your Team · 2025 Season
            </div>
            <div className="text-[22px] mt-0.5" style={{ fontWeight: 500 }}>
              {teamName}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase opacity-80" style={{ letterSpacing: '0.1em' }}>
              Record
            </div>
            <div className="text-[22px] serif">
              {wins}–{losses}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Weekly Score" value={weeklyScore.toFixed(1)} sub="Week 13" tone="green" />
          <StatCard label="Season Rank" value={`#${rank}`} sub="of 12 teams" />
          <StatCard label="$ Take · YTD" value={fmtMoney(takeUSD)} sub="Disclosed + Bundled" tone="gold" serif />
          <StatCard label="Sportsbook" value="8–5–1" sub="Last 4 wks: +84 pts" />
        </div>
      </div>

      {/* This week matchup preview */}
      <div className="grid md:grid-cols-3 gap-5 mb-5">
        <div className="md:col-span-2 bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
          <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
            <span className="label-caps-sm">This Week · Matchup Preview</span>
            <Link to="/matchup" className="text-[11px] uppercase tracking-wider flex items-center gap-1" style={{ color: '#047a3b', letterSpacing: '0.08em' }}>
              View Box Score <ChevronRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-5 grid grid-cols-3 items-center">
            <div>
              <div className="text-[11px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>You</div>
              <div className="text-[16px] mt-0.5" style={{ fontWeight: 500 }}>{teamName}</div>
              <div className="text-[11px] mt-0.5" style={{ color: '#666' }}>{wins}–{losses} · #{rank}</div>
              <div className="text-[36px] serif mt-2" style={{ color: '#047a3b', fontWeight: 500 }}>
                {yourThisWeekScore.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.12em' }}>vs</div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full live-dot" style={{ background: '#c8102e' }} />
                <span className="text-[10px] uppercase" style={{ color: '#c8102e', letterSpacing: '0.1em', fontWeight: 500 }}>
                  Live · Q4 in session
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>Opponent</div>
              <div className="text-[16px] mt-0.5" style={{ fontWeight: 500 }}>{opponent.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: '#666' }}>{opponent.wins}–{opponent.losses}</div>
              <div className="text-[36px] serif mt-2" style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {oppScore.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
          <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
            <span className="label-caps-sm">Top Disclosure · This Week</span>
          </div>
          <div className="px-4 py-4">
            {(() => {
              const top = getLegislator('pelosi')!
              return (
                <div className="flex items-center gap-3">
                  <Avatar legislator={top} size={48} />
                  <div className="min-w-0">
                    <div className="text-[14px]" style={{ fontWeight: 500 }}>{top.name}</div>
                    <div className="text-[11px]" style={{ color: '#666' }}>TSM · Buy · $500k–1M</div>
                    <div className="text-[11px] mt-1" style={{ color: '#047a3b', fontWeight: 500 }}>
                      +412.4 pts · 3x CMT · BNDL · LATE
                    </div>
                  </div>
                </div>
              )
            })()}
            <Link to="/player/pelosi" className="block mt-4 text-[11px] uppercase tracking-wider" style={{ color: '#047a3b', letterSpacing: '0.08em' }}>
              View profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation tiles */}
      <div className="grid sm:grid-cols-3 gap-5 mb-5">
        <Link to="/roster" className="bg-white block hover:shadow-sm transition" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <ListChecks size={16} style={{ color: '#047a3b' }} />
              <span className="label-caps-sm">Roster</span>
            </div>
            <div className="text-[16px] mt-2" style={{ fontWeight: 500 }}>Manage starters & bench</div>
            <div className="text-[12px]" style={{ color: '#666' }}>11/12 rostered · 1 open</div>
          </div>
        </Link>
        <Link to="/sportsbook" className="bg-white block hover:shadow-sm transition" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: '#f4a300' }} />
              <span className="label-caps-sm">House Cut Sportsbook</span>
            </div>
            <div className="text-[16px] mt-2" style={{ fontWeight: 500 }}>200 pts available · 3 open props</div>
            <div className="text-[12px]" style={{ color: '#666' }}>Lock by Friday close</div>
          </div>
        </Link>
        <Link to="/standings" className="bg-white block hover:shadow-sm transition" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
          <div className="px-4 py-4">
            <div className="flex items-center gap-2">
              <Trophy size={16} style={{ color: '#c8102e' }} />
              <span className="label-caps-sm">Standings</span>
            </div>
            <div className="text-[16px] mt-2" style={{ fontWeight: 500 }}>League · 12 teams · 2 caucuses</div>
            <div className="text-[12px]" style={{ color: '#666' }}>3 weeks until playoffs</div>
          </div>
        </Link>
      </div>

      {/* News ticker */}
      <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 12 }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <Newspaper size={14} style={{ color: '#666' }} />
          <span className="label-caps-sm">Latest News</span>
        </div>
        <ul>
          {HEADLINES.slice(0, 6).map(h => {
            const leg = h.legislatorId ? getLegislator(h.legislatorId) : undefined
            const inner = (
              <div className="flex items-center gap-3 px-4 py-3 row-hover">
                {leg && <Avatar legislator={leg} size={28} />}
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] truncate" style={{ color: '#1a1a1a' }}>{h.headline}</div>
                  <div className="text-[11px]" style={{ color: '#888' }}>{h.source} · {h.hoursAgo}h ago</div>
                </div>
                <ChevronRight size={14} style={{ color: '#ccc' }} />
              </div>
            )
            return (
              <li key={h.id} style={{ borderTop: '0.5px solid #f0f0f0' }}>
                {leg ? <Link to={`/player/${leg.id}`}>{inner}</Link> : inner}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
