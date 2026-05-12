import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Plus, RotateCcw, Search } from 'lucide-react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { LEGISLATORS, Legislator, partyShort } from '../data/legislators'
import { useRoster } from '../context/RosterContext'

type ChamberFilter = 'All' | 'Senate' | 'House'
type PartyFilter = 'All' | 'D' | 'R' | 'I'
type SortKey = 'rank' | 'projected' | 'actual' | 'take'

const archetypeTone: Record<string, 'green' | 'red' | 'gold' | 'gray' | 'blue' | 'black'> = {
  'Volume King':          'red',
  'PAC Magnet':           'green',
  'Bundle Artist':        'gold',
  'Committee Whisperer':  'blue',
  'Sector Specialist':    'gray',
  'Late-Filer Special':   'gold',
  'Quiet Compounder':     'gray',
  'Memecoin Maven':       'red',
}

const SLOT_REQS = [
  { key: 'SEN', label: 'SEN', need: 2, desc: 'Senators' },
  { key: 'HSE', label: 'HSE', need: 2, desc: 'Representatives' },
  { key: 'FLX', label: 'FLX', need: 1, desc: 'Any chamber' },
  { key: 'CHR', label: 'CHR', need: 1, desc: 'Committee chair or leadership' },
  { key: 'BN',  label: 'BN',  need: 6, desc: 'Bench' },
]

const fmtMoney = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`
  return `$${n}`
}

export default function Draft() {
  const navigate = useNavigate()
  const {
    draftSelection,
    toggle,
    remove,
    reset,
    finalize,
    isSelected,
    slotCounts,
    isValidForFinalize,
    teamNameDraft,
    setTeamNameDraft,
    hasRoster,
  } = useRoster()

  const [chamber, setChamber] = useState<ChamberFilter>('All')
  const [party, setParty] = useState<PartyFilter>('All')
  const [sort, setSort] = useState<SortKey>('rank')
  const [q, setQ] = useState('')

  const pool = useMemo(() => {
    let l = LEGISLATORS.filter(x => x.totalPoints > 0)
    if (chamber !== 'All') l = l.filter(x => x.chamber === chamber)
    if (party !== 'All') l = l.filter(x => x.party === party)
    if (q.trim()) {
      const qq = q.trim().toLowerCase()
      l = l.filter(x => x.name.toLowerCase().includes(qq))
    }
    const sorters: Record<SortKey, (a: Legislator, b: Legislator) => number> = {
      rank: (a, b) => a.adp - b.adp,
      projected: (a, b) => b.projectedPoints - a.projectedPoints,
      actual: (a, b) => b.totalPoints - a.totalPoints,
      take: (a, b) => (b.tradeVolumeUSD + b.pacUSD + b.bundledUSD) - (a.tradeVolumeUSD + a.pacUSD + a.bundledUSD),
    }
    return [...l].sort(sorters[sort])
  }, [chamber, party, q, sort])

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="label-caps-sm">Team Builder</div>
          <h1 className="text-[22px]" style={{ fontWeight: 500 }}>Build your mock roster</h1>
          <div className="text-[13px]" style={{ color: '#666' }}>
            Pick 12 legislators from the 2025 pool. We'll simulate the season retrospectively against the other 11 teams.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>Selected</div>
            <div className="text-[22px] serif" style={{ fontWeight: 500, color: slotCounts.total === 12 ? '#047a3b' : '#1a1a1a' }}>
              {slotCounts.total} <span className="text-[14px]" style={{ color: '#888' }}>/ 12</span>
            </div>
          </div>
          <button onClick={() => { reset(); navigate('/draft', { replace: true }) }} className="flex items-center gap-1 text-[11px] uppercase px-2 py-1.5" style={{ color: '#888', letterSpacing: '0.08em', border: '0.5px solid #e5e5e5', borderRadius: 6 }}>
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {hasRoster && (
        <div className="mb-5 px-4 py-3" style={{ background: '#fffbe6', border: '0.5px solid #f4a300', borderRadius: 8 }}>
          <div className="text-[12px]" style={{ color: '#1a1a1a' }}>
            <strong style={{ fontWeight: 500 }}>You already have a roster saved.</strong> You can view its results on <Link to="/my-season" style={{ color: '#047a3b', textDecoration: 'underline' }}>My Season</Link> or build a new one here. Hit Reset to clear.
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-5">
        {/* Pool */}
        <div className="col-span-12 lg:col-span-8">
          {/* Filters */}
          <div className="bg-white mb-3 px-3 py-3 grid grid-cols-2 md:grid-cols-4 gap-2" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
            <div className="relative">
              <Search size={13} style={{ position: 'absolute', left: 8, top: 9, color: '#888' }} />
              <input
                placeholder="Search legislators"
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full text-[12px] pl-7 pr-2 py-1.5"
                style={{ border: '0.5px solid #e5e5e5', borderRadius: 4 }}
              />
            </div>
            <select value={chamber} onChange={e => setChamber(e.target.value as ChamberFilter)} className="text-[12px] px-2 py-1.5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 4, background: 'white' }}>
              <option value="All">All chambers</option>
              <option value="Senate">Senate</option>
              <option value="House">House</option>
            </select>
            <select value={party} onChange={e => setParty(e.target.value as PartyFilter)} className="text-[12px] px-2 py-1.5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 4, background: 'white' }}>
              <option value="All">All parties</option>
              <option value="D">Democrat</option>
              <option value="R">Republican</option>
              <option value="I">Independent</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="text-[12px] px-2 py-1.5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 4, background: 'white' }}>
              <option value="rank">Sort: Rank (ADP)</option>
              <option value="projected">Sort: Projected</option>
              <option value="actual">Sort: 2025 Actual</option>
              <option value="take">Sort: $ Take</option>
            </select>
          </div>

          <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
            <div className="px-4 py-2 grid grid-cols-12 gap-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5', color: '#888' }}>
              <div className="col-span-5 text-[10px] uppercase" style={{ letterSpacing: '0.08em' }}>Legislator</div>
              <div className="col-span-3 text-[10px] uppercase" style={{ letterSpacing: '0.08em' }}>Archetype</div>
              <div className="col-span-1 text-[10px] uppercase text-right" style={{ letterSpacing: '0.08em' }}>Proj</div>
              <div className="col-span-1 text-[10px] uppercase text-right" style={{ letterSpacing: '0.08em' }}>2025</div>
              <div className="col-span-2"></div>
            </div>
            <ul>
              {pool.map((l, i) => {
                const selected = isSelected(l.id)
                return (
                  <li key={l.id} className="px-4 py-2 grid grid-cols-12 gap-2 items-center" style={{ borderTop: i === 0 ? 'none' : '0.5px solid #f0f0f0' }}>
                    <div className="col-span-5 flex items-center gap-2.5">
                      <Avatar legislator={l} size={36} />
                      <div className="min-w-0">
                        <div className="text-[13px]" style={{ fontWeight: 500 }}>{l.name}</div>
                        <div className="text-[11px]" style={{ color: '#888' }}>
                          {partyShort(l.party)} · {l.chamber === 'Senate' ? 'Sen' : 'Rep'} · {l.stateAbbr}{l.district ? `-${l.district}` : ''}
                          {(l.isChair || l.isLeadership) && <span style={{ color: '#047a3b' }}> · {l.isChair ? 'Chair' : 'Ldr'}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3"><Badge tone={archetypeTone[l.archetype]}>{l.archetype}</Badge></div>
                    <div className="col-span-1 text-right text-[12px]" style={{ color: '#888' }}>{l.projectedPoints}</div>
                    <div className="col-span-1 text-right text-[12px]" style={{ fontWeight: 500 }}>{l.totalPoints.toFixed(0)}</div>
                    <div className="col-span-2 flex justify-end">
                      <button
                        onClick={() => toggle(l.id)}
                        disabled={!selected && slotCounts.total >= 12}
                        className="px-2.5 py-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1"
                        style={{
                          background: selected ? '#047a3b' : 'white',
                          color: selected ? 'white' : '#1a1a1a',
                          border: '0.5px solid ' + (selected ? '#047a3b' : '#e5e5e5'),
                          borderRadius: 6,
                          letterSpacing: '0.06em',
                          fontWeight: 500,
                          opacity: (!selected && slotCounts.total >= 12) ? 0.4 : 1,
                          cursor: (!selected && slotCounts.total >= 12) ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {selected ? <><Check size={12} /> Added</> : <><Plus size={12} /> Add</>}
                      </button>
                    </div>
                  </li>
                )
              })}
              {pool.length === 0 && (
                <li className="px-4 py-6 text-[12px]" style={{ color: '#888' }}>No legislators match those filters.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Roster panel */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-white sticky top-3" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
            <div className="px-4 py-2" style={{ background: '#047a3b', color: 'white' }}>
              <span className="text-[11px] uppercase" style={{ letterSpacing: '0.1em', fontWeight: 500 }}>Your Roster</span>
            </div>
            <div className="px-4 py-3">
              <label className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>Team Name</label>
              <input
                value={teamNameDraft}
                onChange={e => setTeamNameDraft(e.target.value)}
                placeholder="Auto-generated on save"
                className="mt-1 w-full text-[13px] px-2 py-1.5"
                style={{ border: '0.5px solid #e5e5e5', borderRadius: 4 }}
              />
            </div>
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 gap-2">
                <SlotPill label="SEN" current={slotCounts.sen} need={2} />
                <SlotPill label="HSE" current={slotCounts.hse} need={2} />
                <SlotPill label="FLX" current={slotCounts.flx} need={1} />
                <SlotPill label="CHR" current={slotCounts.chr} need={1} />
              </div>
              <div className="mt-2 text-[11px]" style={{ color: '#888' }}>
                Bench: {Math.max(0, slotCounts.total - 6)} of 6
              </div>
            </div>
            <div style={{ borderTop: '0.5px solid #f0f0f0' }} />
            <ul className="max-h-[420px] overflow-y-auto thin-scroll">
              {draftSelection.length === 0 && (
                <li className="px-4 py-6 text-[12px] text-center" style={{ color: '#888' }}>
                  No legislators added yet — pick from the pool to start building your roster.
                </li>
              )}
              {draftSelection.map((id, i) => {
                const l = LEGISLATORS.find(x => x.id === id)!
                return (
                  <li key={id} className="px-4 py-2 flex items-center gap-2" style={{ borderTop: i === 0 ? 'none' : '0.5px solid #f0f0f0' }}>
                    <Avatar legislator={l} size={28} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] truncate" style={{ fontWeight: 500 }}>{l.name}</div>
                      <div className="text-[10px]" style={{ color: '#888' }}>{partyShort(l.party)} · {l.stateAbbr} · {l.chamber === 'Senate' ? 'SEN' : 'HSE'}</div>
                    </div>
                    <button onClick={() => remove(id)} className="text-[11px]" style={{ color: '#c8102e' }}>
                      Drop
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="px-4 py-3" style={{ borderTop: '0.5px solid #e5e5e5' }}>
              <button
                disabled={!isValidForFinalize}
                onClick={() => {
                  finalize()
                  setTimeout(() => navigate('/my-season'), 0)
                }}
                className="w-full px-3 py-2.5 text-[12px] uppercase tracking-wider"
                style={{
                  background: isValidForFinalize ? '#047a3b' : '#e5e5e5',
                  color: isValidForFinalize ? 'white' : '#888',
                  borderRadius: 6,
                  letterSpacing: '0.08em',
                  fontWeight: 500,
                  cursor: isValidForFinalize ? 'pointer' : 'not-allowed',
                }}
              >
                Save Roster & See Results
              </button>
              {!isValidForFinalize && (
                <div className="text-[10px] mt-2" style={{ color: '#888' }}>
                  Need 12 total picks · min 2 SEN · 2 HSE · 1 CHR.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SlotPill({ label, current, need }: { label: string; current: number; need: number }) {
  const filled = current >= need
  return (
    <div
      className="px-2 py-1.5 text-[11px] flex items-center justify-between"
      style={{
        border: '0.5px solid ' + (filled ? '#047a3b' : '#e5e5e5'),
        background: filled ? '#e8f5ee' : 'white',
        borderRadius: 4,
      }}
    >
      <span className="uppercase" style={{ letterSpacing: '0.06em', fontWeight: 500, color: filled ? '#047a3b' : '#888' }}>{label}</span>
      <span style={{ color: filled ? '#047a3b' : '#1a1a1a', fontWeight: 500 }}>{current}/{need}</span>
    </div>
  )
}
