import Icon from './Icon'

const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl flex flex-col justify-between relative overflow-hidden group hover:bg-surface-container transition-all'
const CAPTION = 'font-telemetry-mono-sm text-telemetry-mono-sm'
const LABEL = 'font-label-caps text-label-caps text-outline uppercase tracking-widest'
const pct = (v) => `${(v * 100).toFixed(1)}%`

function Sparkline({ history }) {
  const pts = history.map((h, i) => [(i / Math.max(history.length - 1, 1)) * 100, 22 - ((h.acc - 0.4) / 0.6) * 20])
  const d = pts.length > 1 ? pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') : 'M0,12 L100,12'
  return (
    <svg className="w-full h-full text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 24">
      <path d={d} stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function KpiCards({ hospitals, history, round, totalRounds, phase, paramsPerUpdate }) {
  const cur = history[history.length - 1]
  const delta = (cur.acc - history[0].acc) * 100
  const totalRecords = hospitals.reduce((s, h) => s + h.train.length, 0)
  const done = round >= totalRounds

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mb-space-xl relative z-10">
      <div className={CARD}>
        <div className="flex items-center justify-between mb-space-sm">
          <span className={LABEL}>Global Accuracy</span>
          <span className={`${CAPTION} px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary`}>Held-out test set</span>
        </div>
        <div className="flex items-baseline gap-space-sm my-space-xs">
          <span className="font-display-hero text-headline-xl text-primary font-normal">{pct(cur.acc)}</span>
          {round > 0 && (
            <span className={`font-telemetry-mono text-telemetry-mono flex items-center ${delta >= 0 ? 'text-tertiary' : 'text-error'}`}>
              <Icon name={delta >= 0 ? 'arrow_upward' : 'arrow_downward'} className="text-[14px]" /> {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        <div className="w-full h-8 mt-space-sm"><Sparkline history={history} /></div>
        <div className="flex items-center justify-between pt-space-xs mt-space-xs">
          <span className={`${CAPTION} text-outline`}>Gain vs Round 0</span>
          <span className={`${CAPTION} text-secondary-fixed`}>Loss {cur.loss.toFixed(3)}</span>
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center justify-between mb-space-sm">
          <span className={LABEL}>Training Progress</span>
          <span className={`${CAPTION} text-primary`}>FedAvg</span>
        </div>
        <div className="flex items-baseline gap-space-sm my-space-xs">
          <span className="font-display-hero text-[2rem] leading-none whitespace-nowrap text-on-surface font-normal">Round {String(round).padStart(2, '0')}</span>
          <span className="font-telemetry-mono text-telemetry-mono text-outline whitespace-nowrap">/ {totalRounds}</span>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-container via-primary to-primary-fixed h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(242,202,80,0.5)]" style={{ width: `${(round / totalRounds) * 100}%` }} />
        </div>
        <div className="flex items-center justify-between pt-space-xs mt-space-xs">
          <span className={`${CAPTION} text-outline`}>Aggregation</span>
          <span className={`${CAPTION} ${done ? 'text-tertiary' : 'text-primary'}`}>{done ? 'Training complete' : phase === 'idle' ? 'Ready' : phase}</span>
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center justify-between mb-space-sm">
          <span className={LABEL}>Hospital Clients</span>
          <span className={`${CAPTION} text-secondary-fixed`}>Simulated</span>
        </div>
        <div className="flex items-baseline gap-space-sm my-space-xs">
          <span className="font-display-hero text-headline-xl text-on-surface font-normal">{totalRecords.toLocaleString()}</span>
          <span className="font-telemetry-mono text-telemetry-mono text-primary font-medium">Records</span>
        </div>
        <div className="flex items-center gap-space-xs mt-space-sm">
          {hospitals.map((h, i) => (
            <div key={h.id} className={`px-space-xs py-0.5 rounded bg-surface-container-highest ${['text-primary', 'text-secondary', 'text-secondary-fixed-dim'][i]} ${CAPTION} font-semibold`}>{h.id} • {h.train.length}</div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-space-xs mt-space-xs">
          <span className={`${CAPTION} text-outline`}>Data</span>
          <span className={`${CAPTION} text-primary`}>Synthetic</span>
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center justify-between mb-space-sm">
          <span className={LABEL}>Raw Records Shared</span>
          <span className="px-space-xs py-0.5 rounded bg-primary-container/20 text-primary font-label-caps text-label-caps">LOCAL ONLY</span>
        </div>
        <div className="flex items-baseline gap-space-sm my-space-xs">
          <span className="font-display-hero text-headline-xl text-tertiary font-normal">0</span>
          <span className="font-telemetry-mono text-telemetry-mono text-outline">sent to server</span>
        </div>
        <div className="flex items-center gap-space-xs mt-space-sm">
          <Icon name="verified_user" className="text-[16px] text-primary" />
          <span className={`${CAPTION} text-on-surface-variant`}>Only model updates ({paramsPerUpdate} weights) are sent</span>
        </div>
        <div className="flex items-center justify-between pt-space-xs mt-space-xs">
          <span className={`${CAPTION} text-outline`}>Secure aggregation / DP</span>
          <span className={`${CAPTION} text-primary`}>Planned</span>
        </div>
      </div>
    </section>
  )
}
