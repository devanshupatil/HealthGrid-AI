// Semicircular gauge for a 0-1 risk value.
export default function RiskGauge({ risk, muted }) {
  const a = Math.PI * (1 - risk)
  const nx = 100 + 70 * Math.cos(a)
  const ny = 100 - 70 * Math.sin(a)
  const arc = (from, to, color) => {
    const p = (t) => [100 + 80 * Math.cos(Math.PI * (1 - t)), 100 - 80 * Math.sin(Math.PI * (1 - t))]
    const [x1, y1] = p(from), [x2, y2] = p(to)
    return <path d={`M${x1} ${y1} A80 80 0 0 1 ${x2} ${y2}`} stroke={color} strokeWidth="12" fill="none" strokeLinecap="butt" opacity={muted ? 0.35 : 0.9} />
  }
  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-[260px] mx-auto" role="img" aria-label={`Risk gauge ${(risk * 100).toFixed(0)} percent`}>
      {arc(0, 0.35, '#58e7aa')}
      {arc(0.35, 0.6, '#f2ca50')}
      {arc(0.6, 1, '#ffb4ab')}
      <line x1="100" y1="100" x2={nx} y2={ny} stroke="#dee2f0" strokeWidth="3" strokeLinecap="round" style={{ transition: 'all .5s' }} />
      <circle cx="100" cy="100" r="7" fill="#dee2f0" />
      <text x="14" y="116" fontSize="9" fill="#8f909e" fontFamily="JetBrains Mono, monospace">Low</text>
      <text x="176" y="116" fontSize="9" fill="#8f909e" fontFamily="JetBrains Mono, monospace" textAnchor="end">High</text>
    </svg>
  )
}
