// Small donut showing a share (0-1).
export default function Donut({ value, label, size = 96 }) {
  const r = 38, c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#30353f" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f2ca50" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${c * value} ${c}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-telemetry-mono text-telemetry-mono text-on-surface">{(value * 100).toFixed(0)}%</span>
        <span className="font-telemetry-mono-sm text-[9px] text-outline uppercase">{label}</span>
      </div>
    </div>
  )
}
