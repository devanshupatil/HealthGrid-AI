// Illustrated preview of the dashboard shown on the home page.
const NAVS = ['Dashboard', 'Hospitals', 'Training', 'Performance', 'Dataset', 'Logs']

export default function DashPreview() {
  const acc = 'M0 100 C40 96 60 80 100 70 S170 48 220 40 S300 30 340 26'
  const loss = 'M0 20 C40 30 70 50 110 60 S180 80 230 86 S300 92 340 94'
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-outline-variant/25 bg-surface-container-low">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 px-3 py-0.5 rounded-full bg-surface-dim font-telemetry-mono-sm text-telemetry-mono-sm text-outline">healthgrid.ai / dashboard</span>
      </div>
      <div className="flex">
        <aside className="hidden sm:flex flex-col gap-1 w-36 p-3 border-r border-outline-variant/25">
          {NAVS.map((n, i) => (
            <div key={n} className={`px-2 py-1.5 rounded font-telemetry-mono-sm text-telemetry-mono-sm ${i === 0 ? 'bg-primary/15 text-primary' : 'text-outline'}`}>{n}</div>
          ))}
        </aside>
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
          <div className="grid grid-cols-3 gap-2">
            {[['Global Accuracy', '79%', 'text-primary'], ['Round', '20 / 20', 'text-on-surface'], ['Raw Shared', '0', 'text-tertiary']].map(([k, v, c]) => (
              <div key={k} className="rounded-lg bg-surface-container-low p-2.5">
                <div className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline truncate">{k}</div>
                <div className={`font-display-hero text-headline-md ${c}`}>{v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-surface-container-low p-3">
            <div className="flex justify-between font-telemetry-mono-sm text-telemetry-mono-sm text-outline mb-1">
              <span>Accuracy &amp; Loss vs Rounds</span>
              <span><span className="text-primary">━</span> acc <span className="text-tertiary">━</span> loss</span>
            </div>
            <svg viewBox="0 0 340 110" className="w-full h-auto">
              {[20, 50, 80].map((y) => <line key={y} x1="0" x2="340" y1={y} y2={y} stroke="#434651" strokeOpacity=".4" strokeDasharray="2 5" />)}
              <path d={acc} fill="none" stroke="#f2ca50" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="420" strokeDashoffset="420">
                <animate attributeName="stroke-dashoffset" from="420" to="0" dur="2.4s" fill="freeze" begin="0s" />
              </path>
              <path d={loss} fill="none" stroke="#58e7aa" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="420" strokeDashoffset="420">
                <animate attributeName="stroke-dashoffset" from="420" to="0" dur="2.4s" fill="freeze" begin="0.3s" />
              </path>
            </svg>
          </div>
          <div className="flex gap-2">
            {['Hospital A', 'Hospital B', 'Hospital C'].map((h) => (
              <div key={h} className="flex-1 flex items-center gap-1.5 rounded-lg bg-surface-container-low px-2.5 py-2 font-telemetry-mono-sm text-telemetry-mono-sm text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />{h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
