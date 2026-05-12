import { useState } from 'react'
import { Legislator, partyColor, photoUrl } from '../data/legislators'

interface AvatarProps {
  legislator: Legislator
  size?: number
  shape?: 'circle' | 'square'
  ring?: boolean
  border?: 'thin' | 'thick' | 'none'
}

export default function Avatar({
  legislator,
  size = 40,
  shape = 'circle',
  ring = true,
  border = 'thin',
}: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const bg = partyColor(legislator.party)
  const initials = `${legislator.firstName[0]}${legislator.lastName[0]}`

  const borderWidth = border === 'thick' ? 3 : border === 'thin' ? 2 : 0
  const radius = shape === 'circle' ? '9999px' : '4px'
  const borderColor = border === 'thick' ? '#1a1a1a' : bg

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    background: bg,
    color: 'white',
    fontSize: Math.max(10, Math.round(size * 0.36)),
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: ring && border !== 'none' ? `0 0 0 ${borderWidth}px ${borderColor}` : 'none',
    boxSizing: 'border-box',
  }

  return (
    <span style={style} title={legislator.name}>
      {!errored ? (
        <img
          src={photoUrl(legislator.bioguideId)}
          alt={legislator.name}
          onError={() => setErrored(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            borderRadius: radius,
            display: 'block',
          }}
        />
      ) : (
        <span style={{ letterSpacing: 0.5 }}>{initials}</span>
      )}
    </span>
  )
}
