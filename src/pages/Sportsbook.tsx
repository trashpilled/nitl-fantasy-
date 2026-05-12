import { useState } from 'react'
import { Zap, Lock } from 'lucide-react'
import { PROP_LINES, PASSIVE_POOL } from '../data/propLines'

export default function Sportsbook() {
  const [wagers, setWagers] = useState<Record<string, { amount: number; side?: 'A' | 'B' }>>(() => {
    const init: Record<string, { amount: number; side?: 'A' | 'B' }> = {}
    for (const p of PROP_LINES) init[p.id] = { amount: p.defaultWager }
    return init
  })

  const totalWagered = Object.values(wagers).reduce((a, w) => a + (w.side ? w.amount : 0), 0)
  const budget = 200
  const remaining = budget - totalWagered

  return (
    <div className="max-w-[1240px] mx-auto px-5 py-6">
      {/* Dark header */}
      <div
        className="px-5 py-5 mb-5"
        style={{ background: '#1a1a1a', color: 'white', borderRadius: 12 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase opacity-70" style={{ letterSpacing: '0.1em' }}>The House Cut · Sportsbook</div>
            <div className="text-[22px] mt-1" style={{ color: '#f4a300', fontWeight: 500, fontFamily: 'Georgia, serif' }}>
              Your Wager Budget · Week 13
            </div>
            <div className="text-[13px] mt-1 opacity-80">{remaining} pts available · {totalWagered} pts in play</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase opacity-70" style={{ letterSpacing: '0.1em' }}>Season Record</div>
            <div className="text-[26px] serif mt-1" style={{ color: '#f4a300', fontWeight: 500 }}>8–5–1</div>
            <div className="text-[11px] opacity-80">+84 pts last 4 weeks</div>
          </div>
        </div>
      </div>

      {/* Passive Pool */}
      <div className="bg-white mb-5" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
        <div className="px-4 py-2" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
          <span className="label-caps-sm">Passive Pool · Week 13 Alignment Vote</span>
        </div>
        <div className="px-5 py-5">
          <div className="text-[13px] mb-2" style={{ color: '#1a1a1a' }}>
            Caucus stance on NDAA conference report — your default wager follows your caucus's tally.
          </div>
          <div className="mt-3 flex items-stretch gap-0.5" style={{ height: 30, borderRadius: 4, overflow: 'hidden' }}>
            {PASSIVE_POOL.map(p => (
              <div
                key={p.caucus}
                className="flex items-center justify-center text-[11px]"
                style={{
                  width: `${p.pickPct}%`,
                  background: p.side === 'Yea' ? '#047a3b' : '#c8102e',
                  color: 'white',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {p.caucus} · {p.side} {p.pickPct}%
              </div>
            ))}
          </div>
          <div className="text-[11px] mt-2" style={{ color: '#888' }}>
            Pool autobets your slot at the caucus consensus. Override below to take an active position.
          </div>
        </div>
      </div>

      {/* Active wagers */}
      <div className="mb-5">
        <div className="label-caps-sm mb-2">Active Wagers</div>
        <div className="grid md:grid-cols-3 gap-4">
          {PROP_LINES.map(p => {
            const w = wagers[p.id]
            return (
              <div key={p.id} className="bg-white" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8, overflow: 'hidden' }}>
                <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#fafafa', borderBottom: '0.5px solid #e5e5e5' }}>
                  <span className="label-caps-sm">{p.category}</span>
                  <span className="text-[11px]" style={{ color: '#666' }}>{p.line}</span>
                </div>
                <div className="px-4 py-4">
                  <div className="text-[14px]" style={{ fontWeight: 500 }}>{p.title}</div>
                  <div className="text-[12px]" style={{ color: '#666' }}>{p.description}</div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() => setWagers(prev => ({ ...prev, [p.id]: { ...prev[p.id], side: prev[p.id].side === 'A' ? undefined : 'A' } }))}
                      className="px-3 py-2 text-[12px] uppercase"
                      style={{
                        border: '1px solid ' + (w.side === 'A' ? '#047a3b' : '#e5e5e5'),
                        background: w.side === 'A' ? '#047a3b' : 'white',
                        color: w.side === 'A' ? 'white' : '#1a1a1a',
                        borderRadius: 6,
                        letterSpacing: '0.06em',
                        fontWeight: 500,
                      }}
                    >
                      {p.optionA}
                    </button>
                    <button
                      onClick={() => setWagers(prev => ({ ...prev, [p.id]: { ...prev[p.id], side: prev[p.id].side === 'B' ? undefined : 'B' } }))}
                      className="px-3 py-2 text-[12px] uppercase"
                      style={{
                        border: '1px solid ' + (w.side === 'B' ? '#c8102e' : '#e5e5e5'),
                        background: w.side === 'B' ? '#c8102e' : 'white',
                        color: w.side === 'B' ? 'white' : '#1a1a1a',
                        borderRadius: 6,
                        letterSpacing: '0.06em',
                        fontWeight: 500,
                      }}
                    >
                      {p.optionB}
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-[11px] uppercase" style={{ color: '#666', letterSpacing: '0.06em' }}>pts</label>
                    <input
                      type="number"
                      value={w.amount}
                      onChange={e => setWagers(prev => ({ ...prev, [p.id]: { ...prev[p.id], amount: Number(e.target.value) } }))}
                      className="flex-1 px-2 py-1.5 text-[13px]"
                      style={{ border: '0.5px solid #e5e5e5', borderRadius: 4 }}
                      min={0}
                      max={budget}
                    />
                    <span className="text-[11px]" style={{ color: '#888' }}>of {budget}</span>
                  </div>

                  <div className="mt-3 flex items-start gap-1.5 text-[11px] italic" style={{ color: '#888' }}>
                    <Zap size={12} style={{ marginTop: 2, flexShrink: 0, color: '#f4a300' }} />
                    {p.catalyst}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weekly summary */}
      <div className="grid md:grid-cols-3 gap-3 mb-5">
        <SummaryCell label="Passive Pool" value="50 pts" sub="Auto-aligned · WEST · Yea" />
        <SummaryCell label="Active Wagers" value={`${totalWagered} pts`} sub={`${Object.values(wagers).filter(w => w.side).length} of ${PROP_LINES.length} props live`} />
        <SummaryCell label="Max Upside" value={`+${(totalWagered * 1.8).toFixed(0)} pts`} sub="Assumes best-case payout" tone="gold" />
      </div>

      <button
        className="px-4 py-2.5 text-[12px] uppercase tracking-wider flex items-center gap-2"
        style={{ background: '#047a3b', color: 'white', borderRadius: 6, letterSpacing: '0.08em', fontWeight: 500 }}
      >
        <Lock size={13} /> Lock in Wagers
      </button>
    </div>
  )
}

function SummaryCell({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: 'gold' }) {
  return (
    <div className="bg-white px-4 py-3" style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}>
      <div className="label-caps">{label}</div>
      <div className="text-[20px] mt-1 serif" style={{ fontWeight: 500, color: tone === 'gold' ? '#f4a300' : '#1a1a1a' }}>{value}</div>
      <div className="text-[11px]" style={{ color: '#888' }}>{sub}</div>
    </div>
  )
}
