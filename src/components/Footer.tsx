export default function Footer() {
  return (
    <footer className="mt-12 border-t" style={{ borderColor: '#e5e5e5' }}>
      <div className="max-w-[1240px] mx-auto px-5 py-6 text-[11px]" style={{ color: '#888' }}>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-flex items-center justify-center text-[10px] font-medium tracking-wider"
            style={{
              background: '#047a3b',
              color: '#fff',
              width: 26,
              height: 26,
              borderRadius: 3,
              letterSpacing: '0.04em',
            }}
          >
            NITL
          </span>
          <span className="uppercase tracking-wider" style={{ letterSpacing: '0.08em' }}>
            Not Insider Trading League · v0.1 prototype
          </span>
        </div>
        <p className="max-w-[760px] leading-relaxed">
          All disclosure data is illustrative. Not affiliated with the SEC, FEC, or any federal
          agency. None of this activity is illegal — that's sort of the point.
        </p>
      </div>
    </footer>
  )
}
