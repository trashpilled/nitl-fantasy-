import { NavLink, useLocation } from 'react-router-dom'
import { useRoster } from '../context/RosterContext'

const NITL_GREEN = '#047a3b'
const NITL_GREEN_DARK = '#03612f'

interface Tab {
  label: string
  to: string
  match?: (path: string) => boolean
}

export default function NavBar() {
  const { hasRoster } = useRoster()
  const location = useLocation()

  const myTeamHref = hasRoster ? '/my-season' : '/draft'

  const tabs: Tab[] = [
    { label: 'Matchup', to: '/matchup' },
    { label: 'Roster', to: '/roster' },
    { label: 'My Team', to: myTeamHref, match: p => p === '/draft' || p === '/my-season' },
    { label: 'Players', to: '/player/pelosi', match: p => p.startsWith('/player') },
    { label: 'Sportsbook', to: '/sportsbook' },
    { label: 'Rankings', to: '/rankings' },
    { label: 'League', to: '/standings', match: p => p === '/standings' },
  ]

  return (
    <header className="w-full">
      <div
        className="w-full text-white"
        style={{ background: NITL_GREEN }}
      >
        <div className="max-w-[1240px] mx-auto px-5 h-12 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center text-[12px] font-medium tracking-wider"
              style={{
                background: '#ffffff',
                color: NITL_GREEN,
                width: 32,
                height: 32,
                borderRadius: 4,
                letterSpacing: '0.04em',
              }}
            >
              NITL
            </span>
            <span className="text-[14px] font-medium tracking-wide hidden sm:inline">
              Not Insider Trading League
            </span>
            <span className="text-[14px] font-medium tracking-wide sm:hidden">
              NITL
            </span>
          </NavLink>
          <div className="text-[11px] uppercase opacity-90" style={{ letterSpacing: '0.1em' }}>
            Week 13 · 119th Congress
          </div>
        </div>

        <div style={{ background: NITL_GREEN_DARK }}>
          <div className="max-w-[1240px] mx-auto px-3 flex items-center overflow-x-auto">
            {tabs.map(t => {
              const active = t.match ? t.match(location.pathname) : location.pathname === t.to
              return (
                <NavLink
                  key={t.label}
                  to={t.to}
                  className={`px-3 py-2 text-[12px] uppercase tracking-wider whitespace-nowrap`}
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    borderBottom: active ? '3px solid #fff' : '3px solid transparent',
                    letterSpacing: '0.08em',
                    fontWeight: 500,
                  }}
                >
                  {t.label}
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
