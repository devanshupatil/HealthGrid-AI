// Animated illustration: three hospitals send model updates to the federated server, which returns the global model.
const HOSPITALS = [
  { id: 'a', x: 240, y: 70, label: 'Hospital A' },
  { id: 'b', x: 80, y: 390, label: 'Hospital B' },
  { id: 'c', x: 400, y: 390, label: 'Hospital C' },
]

function Hospital({ x, y, label }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-44" y="-36" width="88" height="72" rx="14" fill="#141a24" stroke="#f2ca50" strokeOpacity=".55" />
      <rect x="-44" y="-36" width="88" height="72" rx="14" fill="none" stroke="#f2ca50" strokeOpacity=".25" strokeWidth="6" />
      <path d="M-7 -20h14v10h10v14h-10v10h-14v-10h-10v-14h10z" fill="#f2ca50" />
      <text y="54" textAnchor="middle" fontSize="12" fill="#dee2f0" fontFamily="JetBrains Mono, monospace">{label}</text>
      <g transform="translate(30 -30)">
        <circle r="11" fill="#090e17" stroke="#58e7aa" />
        <path d="M-4 -1v-3a4 4 0 0 1 8 0v3M-5 -1h10v7h-10z" fill="none" stroke="#58e7aa" strokeWidth="1.4" />
      </g>
    </g>
  )
}

export default function HeroVisual() {
  const paths = HOSPITALS.map((h) => ({ ...h, d: `M${h.x} ${h.y} L240 240` }))
  return (
    <svg viewBox="0 0 480 505" className="w-full h-auto" role="img" aria-label="Three hospitals send model updates to a federated server, which returns a global model">
      <defs>
        <radialGradient id="hv-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2ca50" stopOpacity=".35" />
          <stop offset="100%" stopColor="#f2ca50" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="240" r="170" fill="url(#hv-core)" />
      {[70, 120, 170].map((r, i) => (
        <circle key={r} cx="240" cy="240" r={r} fill="none" stroke="#f2ca50" strokeOpacity=".12" strokeDasharray="3 7">
          <animateTransform attributeName="transform" type="rotate" from={`0 240 240`} to={`${i % 2 ? -360 : 360} 240 240`} dur={`${60 + i * 25}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {paths.map((p) => (
        <g key={p.id}>
          <path id={`hv-${p.id}`} d={p.d} stroke="#f2ca50" strokeOpacity=".3" strokeDasharray="4 6" fill="none" />
          <path id={`hv-${p.id}-r`} d={`M240 240 L${p.x} ${p.y}`} fill="none" />
          {[['#58e7aa', `hv-${p.id}`, 0], ['#f2ca50', `hv-${p.id}-r`, 1.6]].map(([fill, ref, off]) => {
            const begin = `${off + HOSPITALS.findIndex((h) => h.id === p.id) * 0.5}s`
            return (
              <circle key={ref} r="4.5" fill={fill} opacity="0">
                <set attributeName="opacity" to="1" begin={begin} />
                <animateMotion dur="3.2s" repeatCount="indefinite" begin={begin}><mpath href={`#${ref}`} /></animateMotion>
              </circle>
            )
          })}
        </g>
      ))}

      <g transform="translate(240 240)">
        <circle r="46" fill="#141a24" stroke="#f2ca50" strokeWidth="1.5" />
        <circle r="46" fill="none" stroke="#f2ca50" strokeOpacity=".5">
          <animate attributeName="r" values="46;66;46" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values=".5;0;.5" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <g stroke="#f2ca50" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <circle cx="0" cy="-14" r="5" /><circle cx="-14" cy="10" r="5" /><circle cx="14" cy="10" r="5" />
          <path d="M-3 -10 L-11 6 M3 -10 L11 6 M-9 10 H9" />
        </g>
        <text y="66" textAnchor="middle" fontSize="12" fill="#f2ca50" fontFamily="JetBrains Mono, monospace">FedAvg Server</text>
        <text y="82" textAnchor="middle" fontSize="10" fill="#8f909e" fontFamily="JetBrains Mono, monospace">Global Model</text>
      </g>

      {HOSPITALS.map((h) => <Hospital key={h.id} {...h} />)}

      <g transform="translate(14 490)" fontFamily="JetBrains Mono, monospace" fontSize="11">
        <circle cx="4" cy="-4" r="4" fill="#58e7aa" /><text x="14" fill="#c4c6d3">model update</text>
        <circle cx="124" cy="-4" r="4" fill="#f2ca50" /><text x="134" fill="#c4c6d3">global model</text>
        <text x="250" fill="#8f909e">no raw records</text>
      </g>
    </svg>
  )
}
