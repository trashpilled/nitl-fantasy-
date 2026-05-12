import { Party, partyColor, partyShort } from '../data/legislators'

interface BadgeProps {
  children: React.ReactNode
  tone?: 'green' | 'red' | 'gold' | 'gray' | 'blue' | 'black'
  outline?: boolean
  className?: string
}

const toneMap: Record<string, { bg: string; fg: string }> = {
  green: { bg: '#047a3b', fg: '#ffffff' },
  red:   { bg: '#c8102e', fg: '#ffffff' },
  gold:  { bg: '#f4a300', fg: '#1a1a1a' },
  gray:  { bg: '#e5e5e5', fg: '#1a1a1a' },
  blue:  { bg: '#1a4d8a', fg: '#ffffff' },
  black: { bg: '#1a1a1a', fg: '#ffffff' },
}

export default function Badge({ children, tone = 'gray', outline, className = '' }: BadgeProps) {
  const t = toneMap[tone]
  const style: React.CSSProperties = outline
    ? { border: `1px solid ${t.bg}`, color: t.bg, background: 'transparent' }
    : { background: t.bg, color: t.fg }
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${className}`}
      style={{ letterSpacing: '0.06em', ...style }}
    >
      {children}
    </span>
  )
}

export function PartyBadge({ party }: { party: Party }) {
  return (
    <span
      className="inline-flex items-center justify-center text-[10px] font-medium px-1 py-0.5 rounded"
      style={{
        background: partyColor(party),
        color: 'white',
        width: 22,
        height: 16,
        letterSpacing: '0.06em',
      }}
    >
      {partyShort(party)[0]}
    </span>
  )
}

export function StatusBadge({ status }: { status: 'Active' | 'Hot' | 'Late' | 'Retired' | 'IR' }) {
  const cfg: Record<string, { tone: BadgeProps['tone']; label: string }> = {
    Active:  { tone: 'green', label: 'Active' },
    Hot:     { tone: 'red',   label: 'HOT' },
    Late:    { tone: 'gold',  label: 'LATE' },
    Retired: { tone: 'gray',  label: 'OUT' },
    IR:      { tone: 'gray',  label: 'IR' },
  }
  const c = cfg[status]
  return <Badge tone={c.tone}>{c.label}</Badge>
}
