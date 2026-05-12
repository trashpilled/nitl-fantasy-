import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Avatar from '../components/Avatar'
import Badge, { PartyBadge } from '../components/Badge'
import {
  LEGISLATORS,
  Legislator,
  Party,
  Chamber,
  ageFromISO,
  getLegislator,
  partyLabel,
  partyShort,
  photoUrl,
  yearsInOffice,
} from '../data/legislators'
import { stateFlagUrl } from '../data/stateFlags'
import { TEAMS, getTeam, DEFAULT_USER_TEAM_ID } from '../data/teams'
import { tradesByLegislator, pacByLegislator, formatAmountRange } from '../data/trades'
import { PLAYER_NEWS } from '../data/propLines'
import { useRoster } from '../context/RosterContext'

const TABS = ['Overview', 'News', 'Trades', 'Bio', 'Splits', 'Game Log'] as const

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

export default function PlayerProfile() {
  const { id = 'pelosi' } = useParams()
  const legislator = getLegislator(id) || getLegislator('pelosi')!

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Overview')
  const [chamberFilter, setChamberFilter] = useState<'All' | Chamber>('All')
  const [partyFilter, setPartyFilter] = useState<'All' | Party>('All')

  const { roster, hasRoster } = useRoster()
  const defaultTeam = getTeam(DEFAULT_USER_TEAM_ID)!
  const teammates = hasRoster ? roster!.legislatorIds : [...defaultTeam.starters, ...defaultTeam.bench]

  const filteredTeammates = useMemo(() => {
    return teammates
      .map(tid => getLegislator(tid))
      .filter((l): l is Legislator => !!l)
      .filter(l => chamberFilter === 'All' || l.chamber === chamberFilter)
      .filter(l => partyFilter === 'All' || l.party === partyFilter)
  }, [teammates, chamberFilter, partyFilter])

  const trades = tradesByLegislator(legislator.id)
  const pacs = pacByLegislator(legislator.id)
  const news = PLAYER_NEWS[legislator.id] || [
    { id: 'd1', headline: `${legislator.lastName} adds to ${legislator.committees[0]} positioning`, source: 'The Capitol Tape', hoursAgo: 4 },
    { id: 'd2', headline: `${legislator.lastName} disclosure cadence accelerates in Q3`, source: 'House Cut Daily', hoursAgo: 18 },
    { id: 'd3', headline: `Analyst notes: ${legislator.archetype} archetype still mispriced at ADP ${legislator.adp}`, source: 'Cloak Room', hoursAgo: 36 },
  ]

  return (
    <div>
      {/* Hero */}
      <ProfileHero legislator={legislator} />

      {/* Tabs */}
      <div className="border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-[1240px] mx-auto px-5 flex items-center overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="px-3 py-3 text-[12px] uppercase whitespace-nowrap"
              style={{
                color: activeTab === t ? '#1a1a1a' : '#888',
                borderBottom: activeTab === t ? '3px solid #047a3b' : '3px solid transparent',
                letterSpacing: '0.08em',
                fontWeight: 500,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 py-6">
        <div className="grid grid-cols-12 gap-5">
          {/* Switch player sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
              <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
                <span className="label-caps-sm">Switch Player</span>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 gap-2">
                <select
                  className="text-[12px] px-2 py-1.5"
                  style={{ border: '0.5px solid #e5e5e5', borderRadius: 4, background: 'white' }}
                  value={chamberFilter}
                  onChange={e => setChamberFilter(e.target.value as any)}
                >
                  <option value="All">Chamber</option>
                  <option value="Senate">Senate</option>
                  <option value="House">House</option>
                </select>
                <select
                  className="text-[12px] px-2 py-1.5"
                  style={{ border: '0.5px solid #e5e5e5', borderRadius: 4, background: 'white' }}
                  value={partyFilter}
                  onChange={e => setPartyFilter(e.target.value as any)}
                >
                  <option value="All">Party</option>
                  <option value="D">D</option>
                  <option value="R">R</option>
                  <option value="I">I</option>
                </select>
              </div>
              <ul className="max-h-[420px] overflow-y-auto thin-scroll">
                {filteredTeammates.map((tm, i) => (
                  <li key={tm.id} style={{ borderTop: i === 0 ? 'none' : '0.5px solid #f0f0f0' }}>
                    <Link to={`/player/${tm.id}`} className="flex items-center gap-2.5 px-4 py-2 row-hover">
                      <Avatar legislator={tm} size={28} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] truncate" style={{ fontWeight: 500 }}>{tm.name}</div>
                        <div className="text-[10px]" style={{ color: '#888' }}>
                          {partyShort(tm.party)} · {tm.stateAbbr}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.06em' }}>
                        {tm.chamber === 'Senate' ? 'SEN' : 'HSE'}
                      </span>
                    </Link>
                  </li>
                ))}
                {filteredTeammates.length === 0 && (
                  <li className="px-4 py-3 text-[12px]" style={{ color: '#888' }}>No teammates match those filters.</li>
                )}
              </ul>
            </div>
          </aside>

          {/* Center column */}
          <div className="col-span-12 md:col-span-6">
            <SectionLabel>2025 Season · Disclosed Trades</SectionLabel>
            <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: '#fafafa', color: '#888' }}>
                    <Th align="left">DATE</Th>
                    <Th align="left">TICKER</Th>
                    <Th>TYPE</Th>
                    <Th>AMT</Th>
                    <Th>MULT</Th>
                    <Th align="left">CMT</Th>
                    <Th>PTS</Th>
                  </tr>
                </thead>
                <tbody>
                  {trades.slice(0, 6).map(t => (
                    <tr key={t.id} className="row-hover" style={{ borderTop: '0.5px solid #f0f0f0' }}>
                      <Td align="left"><span className="text-[12px]" style={{ color: '#666' }}>{t.date.slice(5)}</span></Td>
                      <Td align="left"><span style={{ fontWeight: 500 }}>{t.ticker}</span></Td>
                      <Td><span className="text-[12px]">{t.type}</span></Td>
                      <Td><span className="text-[12px]">{formatAmountRange(t.amountMin, t.amountMax)}</span></Td>
                      <Td>
                        <div className="flex justify-end gap-1 flex-wrap">
                          {t.multiplier.map(m => <Badge key={m} tone={m === 'LATE' ? 'gold' : 'green'}>{m}</Badge>)}
                        </div>
                      </Td>
                      <Td align="left">
                        <span className="text-[11px] truncate inline-block max-w-[160px]" style={{ color: '#666' }}>
                          {t.committeeContext || '—'}
                        </span>
                      </Td>
                      <Td><span style={{ color: '#047a3b', fontWeight: 500 }}>+{t.pointsAwarded.toFixed(1)}</span></Td>
                    </tr>
                  ))}
                  {trades.length === 0 && (
                    <tr><Td colSpan={7}><span className="text-[12px]" style={{ color: '#888' }}>No disclosed trades on file for this legislator.</span></Td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <SectionLabel>2025 Season · PAC Inflows</SectionLabel>
              <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr style={{ background: '#fafafa', color: '#888' }}>
                      <Th align="left">SOURCE</Th>
                      <Th align="left">INDUSTRY</Th>
                      <Th>AMT</Th>
                      <Th>BUNDLED</Th>
                      <Th>PTS</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacs.length === 0 ? (
                      <tr><Td colSpan={5}><span className="text-[12px]" style={{ color: '#888' }}>No PAC inflows on file.</span></Td></tr>
                    ) : (
                      pacs.map(p => (
                        <tr key={p.id} className="row-hover" style={{ borderTop: '0.5px solid #f0f0f0' }}>
                          <Td align="left"><span style={{ fontWeight: 500 }}>{p.source}</span></Td>
                          <Td align="left"><span className="text-[12px]" style={{ color: '#666' }}>{p.industry}</span></Td>
                          <Td><span className="text-[12px]">{fmtMoney(p.amountUSD)}</span></Td>
                          <Td>{p.bundled ? <Badge tone="green">BNDL</Badge> : <span style={{ color: '#888' }}>—</span>}</Td>
                          <Td><span style={{ color: '#047a3b', fontWeight: 500 }}>+{p.pointsAwarded.toFixed(1)}</span></Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5">
              <SectionLabel>Recent Disclosures</SectionLabel>
              <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
                <ul>
                  {trades.slice(0, 4).map((t, i) => (
                    <li key={t.id} className="px-4 py-3 row-hover" style={{ borderTop: i === 0 ? 'none' : '0.5px solid #f0f0f0' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[13px]" style={{ fontWeight: 500 }}>{t.ticker} · {t.type}</div>
                          <div className="text-[11px]" style={{ color: '#888' }}>{t.date} · {formatAmountRange(t.amountMin, t.amountMax)}</div>
                        </div>
                        <span style={{ color: '#047a3b', fontWeight: 500 }}>+{t.pointsAwarded.toFixed(1)} pts</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column — Latest News */}
          <div className="col-span-12 md:col-span-3">
            <SectionLabel>Latest News</SectionLabel>
            <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
              <ul>
                {news.map((n, i) => (
                  <li key={n.id} className="px-4 py-3 row-hover" style={{ borderTop: i === 0 ? 'none' : '0.5px solid #f0f0f0' }}>
                    <div className="flex gap-3">
                      <img
                        src={photoUrl(legislator.bioguideId)}
                        alt=""
                        onError={e => (e.currentTarget.style.display = 'none')}
                        style={{ width: 56, height: 56, borderRadius: 4, objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }}
                      />
                      <div className="min-w-0">
                        <div className="text-[12px] leading-snug" style={{ fontWeight: 500 }}>{n.headline}</div>
                        <div className="text-[10px] mt-1" style={{ color: '#888' }}>{n.source} · {n.hoursAgo}h ago</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileHero({ legislator }: { legislator: Legislator }) {
  return (
    <div className="bg-white border-b" style={{ borderColor: '#e5e5e5' }}>
      <div className="max-w-[1240px] mx-auto px-5 relative" style={{ minHeight: 200 }}>
        <div
          className="absolute inset-y-0 left-0 flag-clip"
          style={{
            width: '46%',
            backgroundImage: `url(${stateFlagUrl(legislator.state)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 flag-clip"
          style={{
            width: '46%',
            background: `linear-gradient(90deg, ${legislator.party === 'D' ? '#1a4d8a' : legislator.party === 'R' ? '#c8102e' : '#666'}33 0%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />
        <div className="relative grid grid-cols-12 gap-6 py-6 items-end">
          <div className="col-span-12 md:col-span-5 flex items-end gap-4">
            <div
              style={{
                width: 130,
                height: 160,
                background: '#f4ecd8',
                border: '3px solid #1a1a1a',
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
                borderRadius: 3,
              }}
            >
              <img
                src={photoUrl(legislator.bioguideId)}
                alt={legislator.name}
                onError={e => (e.currentTarget.style.display = 'none')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
              <div
                className="absolute top-1 left-1 px-1 py-0.5 text-[9px] uppercase"
                style={{
                  background: legislator.party === 'D' ? '#1a4d8a' : legislator.party === 'R' ? '#c8102e' : '#666',
                  color: 'white',
                  letterSpacing: '0.08em',
                  borderRadius: 2,
                }}
              >
                {legislator.chamber === 'Senate' ? 'Sen' : 'Rep'}
              </div>
            </div>
            <div className="pb-1 min-w-0">
              <div
                className="uppercase serif leading-[0.95]"
                style={{ fontSize: 42, fontWeight: 500, letterSpacing: '0.01em', color: '#1a1a1a' }}
              >
                <div>{legislator.firstName}</div>
                <div>{legislator.lastName}</div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <PartyBadge party={legislator.party} />
                <span className="text-[12px]" style={{ color: '#666' }}>
                  {legislator.state} {partyLabel(legislator.party)}s · {legislator.stateAbbr}
                  {legislator.district ? `-${legislator.district}` : ''} · {legislator.chamber === 'Senate' ? 'Senator' : 'Representative'}
                </span>
              </div>
              <button
                className="mt-3 px-3 py-1.5 text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5"
                style={{ background: '#1a4d8a', color: 'white', borderRadius: 999, letterSpacing: '0.08em', fontWeight: 500 }}
              >
                <Plus size={12} /> Follow
              </button>
            </div>
          </div>

          {/* Bio data column */}
          <div className="col-span-12 md:col-span-4 text-[13px]">
            <BioRow label="BORN"       value={`${formatBirth(legislator.bornISO)} (${ageFromISO(legislator.bornISO)})`} />
            <BioRow label="DISTRICT"   value={legislator.district ? `${legislator.state} ${districtSuffix(legislator.district)}` : legislator.state} />
            <BioRow label="SWORN IN"   value={`${legislator.swornInYear} (${yearsInOffice(legislator.swornInYear)} years in office)`} />
            <BioRow label="COMMITTEES" value={legislator.committees.join(', ')} />
            <BioRow
              label="STATUS"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: legislator.status === 'Active' ? '#047a3b' : '#888' }} />
                  {legislator.status}
                </span>
              }
            />
          </div>

          {/* Stat card */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white" style={{ borderTop: '4px solid #047a3b', border: '0.5px solid #e5e5e5', borderTopWidth: 4, borderRadius: 4, overflow: 'hidden' }}>
              <div className="px-3 py-2" style={{ background: '#047a3b', color: 'white' }}>
                <span className="text-[10px] uppercase tracking-widest" style={{ letterSpacing: '0.1em', fontWeight: 500 }}>2025 Season Stats</span>
              </div>
              <div className="grid grid-cols-4">
                <HeroStat label="TRADES" value={legislator.trades.toString()} rank={`${legislator.rank}${ord(legislator.rank)}`} />
                <HeroStat label="VOL"    value={fmtMoney(legislator.tradeVolumeUSD)} rank={`${Math.max(1, legislator.rank - 1)}${ord(Math.max(1, legislator.rank - 1))}`} />
                <HeroStat label="PTS"    value={legislator.totalPoints.toFixed(1)} rank={`${legislator.rank}${ord(legislator.rank)}`} />
                <HeroStat label="RANK"   value={`${legislator.rank}${ord(legislator.rank)}`} rank="LG" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroStat({ label, value, rank }: { label: string; value: string; rank: string }) {
  return (
    <div className="px-2 py-2 text-center" style={{ borderRight: '0.5px solid #e5e5e5' }}>
      <div className="text-[9px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>{label}</div>
      <div className="text-[16px] mt-1" style={{ fontWeight: 500 }}>{value}</div>
      <div className="text-[9px] mt-0.5" style={{ color: '#666' }}>{rank}</div>
    </div>
  )
}

function BioRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex py-1" style={{ borderBottom: '0.5px solid #f0f0f0' }}>
      <div className="w-[110px] text-[10px] uppercase pt-1" style={{ color: '#888', letterSpacing: '0.08em' }}>{label}</div>
      <div className="flex-1 text-[13px]">{value}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="label-caps-sm mb-2">{children}</div>
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th className="text-[10px] uppercase font-medium px-3 py-2" style={{ letterSpacing: '0.08em', textAlign: align }}>{children}</th>
}

function Td({ children, align = 'right', colSpan }: { children: React.ReactNode; align?: 'left' | 'right' | 'center'; colSpan?: number }) {
  return <td className="px-3 py-2" style={{ textAlign: align }} colSpan={colSpan}>{children}</td>
}

function ord(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

function districtSuffix(d: number): string {
  const last = d % 10
  const teen = d % 100
  if (teen >= 11 && teen <= 13) return `${d}th`
  if (last === 1) return `${d}st`
  if (last === 2) return `${d}nd`
  if (last === 3) return `${d}rd`
  return `${d}th`
}

function formatBirth(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${m}/${d}/${y}`
}
