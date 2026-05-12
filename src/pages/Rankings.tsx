import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import { LEGISLATORS, partyShort } from '../data/legislators'
import { ANALYST_NOTES } from '../data/propLines'

const TABS = ['Rankings', 'By Position', 'Sleepers', 'Busts', 'Mock Drafts']

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

const noteTone: Record<string, 'green' | 'red' | 'gold' | 'gray' | 'blue' | 'black'> = {
  CONSENSUS: 'green',
  SLEEPER:   'gold',
  FADE:      'red',
  STRATEGY:  'blue',
}

export default function Rankings() {
  // Top 24 rostered legislators sorted by ADP
  const ranked = [...LEGISLATORS]
    .filter(l => l.totalPoints > 0)
    .sort((a, b) => a.adp - b.adp)

  const tiers = [
    { tier: 1, title: 'Tier 1 · Elite',          range: [0, 4]  as const, tint: '#fffbe6' },
    { tier: 2, title: 'Tier 2 · Starters',        range: [4, 10] as const, tint: 'transparent' },
    { tier: 3, title: 'Tier 3 · Mid-round value', range: [10, 16] as const, tint: 'transparent' },
    { tier: 4, title: 'Tier 4 · Late-round fliers', range: [16, 24] as const, tint: 'transparent' },
  ]

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Tabs */}
      <div className="flex items-center overflow-x-auto mb-4" style={{ borderBottom: '0.5px solid #e5e5e5' }}>
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

      {/* Dark consensus header */}
      <div className="px-5 py-4 mb-5 flex items-center justify-between" style={{ background: '#1a1a1a', color: 'white', borderRadius: 8 }}>
        <div>
          <div className="text-[11px] uppercase opacity-70" style={{ letterSpacing: '0.1em' }}>Draft Big Board · Consensus</div>
          <div className="text-[18px] mt-0.5" style={{ fontWeight: 500 }}>2025 Season · Pre-Draft Rankings</div>
        </div>
        <div className="text-right text-[12px] opacity-80">
          <div>Aggregated from <span style={{ color: '#f4a300' }}>8 analysts</span></div>
          <div>Updated Aug 14, 2025</div>
        </div>
      </div>

      <div className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
        {tiers.map(t => (
          <div key={t.tier}>
            <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#fafafa', borderTop: '0.5px solid #e5e5e5', borderBottom: '0.5px solid #e5e5e5' }}>
              <span className="label-caps-sm">{t.title}</span>
              <span className="text-[10px] uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>
                {t.range[1] - t.range[0]} legislators · ADP {ranked[t.range[0]]?.adp.toFixed(1)}–{ranked[t.range[1] - 1]?.adp.toFixed(1)}
              </span>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: '#888' }}>
                  <Th align="center">Rank</Th>
                  <Th align="left">Legislator</Th>
                  <Th align="left">Archetype</Th>
                  <Th>Proj</Th>
                  <Th>ADP</Th>
                </tr>
              </thead>
              <tbody>
                {ranked.slice(t.range[0], t.range[1]).map((l, i) => {
                  const rank = t.range[0] + i + 1
                  return (
                    <tr key={l.id} className="row-hover" style={{ borderTop: '0.5px solid #f0f0f0', background: t.tint }}>
                      <Td align="center"><span style={{ color: '#666', fontWeight: 500 }}>{rank}</span></Td>
                      <Td align="left">
                        <Link to={`/player/${l.id}`} className="flex items-center gap-2.5 py-1">
                          <Avatar legislator={l} size={32} />
                          <div className="min-w-0">
                            <div style={{ fontWeight: 500 }}>{l.name}</div>
                            <div className="text-[11px]" style={{ color: '#888' }}>
                              {partyShort(l.party)} · {l.stateAbbr}
                              {l.district ? `-${l.district}` : ''} · {l.committees[0]}
                            </div>
                          </div>
                        </Link>
                      </Td>
                      <Td align="left"><Badge tone={archetypeTone[l.archetype]}>{l.archetype}</Badge></Td>
                      <Td><span style={{ color: '#888' }}>{l.projectedPoints}</span></Td>
                      <Td><span style={{ fontWeight: 500 }}>{l.adp.toFixed(1)}</span></Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Analyst notes */}
      <div className="mt-6">
        <div className="label-caps-sm mb-2">Analyst Notes</div>
        <div className="grid md:grid-cols-2 gap-4">
          {ANALYST_NOTES.map(n => (
            <div key={n.id} className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone={noteTone[n.badge]}>{n.badge}</Badge>
                </div>
                <div className="text-[14px]" style={{ fontWeight: 500 }}>{n.title}</div>
                <div className="text-[12px] mt-1 leading-relaxed" style={{ color: '#666' }}>{n.body}</div>
                <div className="text-[10px] mt-2 uppercase" style={{ color: '#888', letterSpacing: '0.08em' }}>{n.byline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Th({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <th className="text-[10px] uppercase font-medium px-3 py-2" style={{ letterSpacing: '0.08em', textAlign: align }}>{children}</th>
}

function Td({ children, align = 'right' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
  return <td className="px-3 py-2.5" style={{ textAlign: align }}>{children}</td>
}
