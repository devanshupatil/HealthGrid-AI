const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'
const W = 320
const H = 140
const PAD = 10
const pct = (v) => `${(v * 100).toFixed(1)}%`

function Chart({ history, total }) {
  const x = (r) => PAD + (r / total) * (W - 2 * PAD)
  const maxLoss = Math.max(0.8, ...history.map((h) => h.loss))
  const yAcc = (v) => PAD + (1 - (v - 0.4) / 0.6) * (H - 2 * PAD)
  const yLoss = (v) => PAD + (1 - v / maxLoss) * (H - 2 * PAD)
  const path = (fy) => history.map((h, i) => `${i ? 'L' : 'M'}${x(h.round).toFixed(1)},${fy(h).toFixed(1)}`).join(' ')
  const last = history[history.length - 1]

  return (
    <svg className="w-full h-auto" fill="none" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Accuracy and loss by round">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 4" x1="0" x2={W} y1={PAD + f * (H - 2 * PAD)} y2={PAD + f * (H - 2 * PAD)} />
      ))}
      <path className="text-secondary" d={path((h) => yLoss(h.loss))} stroke="currentColor" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path className="text-primary" d={path((h) => yAcc(h.acc))} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      <circle className="text-secondary" cx={x(last.round)} cy={yLoss(last.loss)} fill="currentColor" r="3" />
      <circle className="text-primary" cx={x(last.round)} cy={yAcc(last.acc)} fill="currentColor" r="4" />
    </svg>
  )
}

export default function Trajectory({ history, round, totalRounds }) {
  const cur = history[history.length - 1]
  const delta = (cur.acc - history[0].acc) * 100
  const accs = cur.perHospital.map((p) => p.acc)
  const spread = ((Math.max(...accs) - Math.min(...accs)) / 2) * 100

  return (
    <div className="xl:col-span-5 p-space-lg rounded-xl bg-surface-container-low shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Loss vs Accuracy</span>
          <span className={`${CAP} text-outline`}>Round 0 → Round {totalRounds}</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface font-medium">Model Performance</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Global model evaluated on records held out from every hospital after each FedAvg round.
        </p>
      </div>

      <div className="my-space-md bg-surface-container-lowest/80 p-space-md rounded-xl">
        <div className={`flex items-center justify-between ${CAP} mb-space-xs`}>
          <div className="flex items-center gap-space-xs">
            <span className="w-3 h-0.5 bg-primary rounded" />
            <span className="text-primary font-medium">Global Accuracy ({pct(cur.acc)})</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="w-3 h-0.5 bg-secondary border-t border-dashed border-secondary" />
            <span className="text-secondary font-medium">Loss ({cur.loss.toFixed(3)})</span>
          </div>
        </div>
        <Chart history={history} total={totalRounds} />
        <div className={`flex justify-between ${CAP} text-outline mt-space-xs`}>
          <span>Round 0</span>
          <span>Round {totalRounds / 2}</span>
          <span>Round {totalRounds} {round > 0 && `(now ${round})`}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
        <div className="p-space-sm rounded-lg bg-surface-container">
          <span className="font-label-caps text-label-caps text-outline uppercase block mb-0.5">Gain vs Round 0</span>
          <div className="font-headline-md text-headline-md text-primary">{delta >= 0 ? '+' : ''}{delta.toFixed(1)}%</div>
          <span className={`${CAP} text-outline`}>{round === 0 ? 'Untrained model' : `After ${round} rounds`}</span>
        </div>
        <div className="p-space-sm rounded-lg bg-surface-container">
          <span className="font-label-caps text-label-caps text-outline uppercase block mb-0.5">Hospital Spread</span>
          <div className="font-headline-md text-headline-md text-on-surface">± {spread.toFixed(1)}%</div>
          <span className={`${CAP} text-outline`}>Accuracy across 3 sites</span>
        </div>
      </div>
    </div>
  )
}
