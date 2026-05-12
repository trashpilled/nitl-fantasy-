interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  rank?: string
  tone?: 'default' | 'gold' | 'red' | 'green'
  serif?: boolean
}

export default function StatCard({ label, value, sub, rank, tone = 'default', serif }: StatCardProps) {
  const valueColor =
    tone === 'gold'  ? '#f4a300' :
    tone === 'red'   ? '#c8102e' :
    tone === 'green' ? '#047a3b' :
    '#1a1a1a'
  return (
    <div
      className="bg-white px-4 py-3"
      style={{ border: '0.5px solid #e5e5e5', borderRadius: 8 }}
    >
      <div className="label-caps mb-1">{label}</div>
      <div
        className="text-[22px] leading-tight"
        style={{
          fontFamily: serif ? 'Georgia, "Times New Roman", serif' : 'inherit',
          color: valueColor,
          fontWeight: 500,
        }}
      >
        {value}
      </div>
      {(sub || rank) && (
        <div className="text-[11px] mt-1" style={{ color: '#666' }}>
          {sub} {rank && <span style={{ color: '#1a1a1a' }}>· {rank}</span>}
        </div>
      )}
    </div>
  )
}
