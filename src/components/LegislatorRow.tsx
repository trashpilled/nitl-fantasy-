import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { Legislator, partyShort } from '../data/legislators'

interface LegislatorRowProps {
  legislator: Legislator
  size?: number
  showCommittee?: boolean
}

export default function LegislatorRow({ legislator, size = 36, showCommittee = true }: LegislatorRowProps) {
  return (
    <Link
      to={`/player/${legislator.id}`}
      className="flex items-center gap-3 row-hover py-1 -mx-1 px-1 rounded"
    >
      <Avatar legislator={legislator} size={size} />
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[14px]" style={{ color: '#1a1a1a', fontWeight: 500 }}>
            {legislator.name}
          </span>
          <span className="text-[11px]" style={{ color: '#888' }}>
            {partyShort(legislator.party)} · {legislator.stateAbbr}
            {legislator.district ? `-${legislator.district}` : ''}
          </span>
        </div>
        {showCommittee && (
          <div className="text-[11px] truncate" style={{ color: '#666' }}>
            {legislator.committees[0]}
            {legislator.isChair && <span style={{ color: '#047a3b' }}> · Chair</span>}
            {legislator.isLeadership && <span style={{ color: '#047a3b' }}> · Leadership</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
