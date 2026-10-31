// Single-series line chart with y ticks and x ticks (training rounds).
const W = 400
const H = 240
const M = { l: 44, r: 14, t: 14, b: 34 }

export default function AxisChart({ values, total, yMin, yMax, yStep, color, yLabel, format = (v) => v.toFixed(1) }) {
  const iw = W - M.l - M.r
  const ih = H - M.t - M.b
  const x = (r) => M.l + (r / total) * iw
  const y = (v) => M.t + (1 - (v - yMin) / (yMax - yMin)) * ih
  const yTicks = []
  for (let v = yMin; v <= yMax + 1e-9; v += yStep) yTicks.push(v)
  const xStep = total <= 10 ? 1 : total <= 20 ? 2 : 5
  const xTicks = []
  for (let r = 0; r <= total; r += xStep) xTicks.push(r)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <svg className="w-full h-auto" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${yLabel} by training round`}>
      {yTicks.map((v) => (
        <g key={v}>
          <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
          <text className="fill-outline" fontSize="10" textAnchor="end" x={M.l - 6} y={y(v) + 3}>{format(v)}</text>
        </g>
      ))}
      {xTicks.map((r) => (
        <text key={r} className="fill-outline" fontSize="10" textAnchor="middle" x={x(r)} y={H - M.b + 14}>{r}</text>
      ))}
      <text className="fill-on-surface-variant" fontSize="10" textAnchor="middle" x={M.l + iw / 2} y={H - 4}>Training Rounds</text>
      <path d={d} stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 4 : 2.5} fill={color} />)}
    </svg>
  )
}
