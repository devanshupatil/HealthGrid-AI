import Icon from './Icon'

const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'

function Step({ children, active, sub }) {
  return (
    <div className={`w-full rounded-lg border px-space-sm py-space-xs text-center transition-all ${active ? 'border-primary bg-primary/10 shadow-[0_0_14px_rgba(242,202,80,0.25)]' : 'border-outline-variant/40 bg-surface-container'}`}>
      <div className={`font-body-sm text-body-sm font-semibold ${active ? 'text-primary' : 'text-on-surface'}`}>{children}</div>
      {sub && <div className={`${CAP} text-outline`}>{sub}</div>}
    </div>
  )
}

const Arrow = () => <Icon name="arrow_downward" className="text-[14px] text-outline" />

export default function Constellation({ hospitals, phase, round, paramsPerUpdate }) {
  return (
    <div className="xl:col-span-7 p-space-lg rounded-xl bg-surface-container-low shadow-2xl flex flex-col justify-between relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <Icon name="account_tree" className="text-primary text-[18px]" />
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Federated Learning Flow</h2>
          </div>
          <span className={`${CAP} text-outline tracking-wider uppercase`}>Data stays local • only model updates travel</span>
        </div>
        <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded-full">
          <span className={`w-2 h-2 rounded-full ${phase === 'idle' ? 'bg-tertiary' : 'bg-primary animate-pulse'}`} />
          <span className={`${CAP} text-secondary-fixed uppercase`}>{phase === 'idle' ? 'Waiting' : phase}</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest/60 rounded-xl p-space-md my-space-xs">
        <div className="grid grid-cols-3 gap-space-md">
          {hospitals.map((h) => (
            <div key={h.id} className="flex flex-col items-center gap-space-xs">
              <Step sub={`${h.train.length} records`}>{h.name}</Step>
              <Arrow />
              <Step sub="never leaves site">Local Healthcare Data</Step>
              <Arrow />
              <Step active={phase === 'training'}>Local ML Training</Step>
              <Arrow />
              <Step active={phase === 'sending'}>Model Update</Step>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-space-xs mt-space-xs">
          <Arrow />
          <div className="w-2/3"><Step active={phase === 'aggregating'} sub="Aggregate Updates → Global Model">FEDERATED SERVER</Step></div>
          <Arrow />
          <div className="w-1/2"><Step active={phase === 'broadcast'} sub={`Global model v${round}`}>Global Model → Hospitals</Step></div>
        </div>
      </div>

      <div className={`mt-space-sm pt-space-sm flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant ${CAP}`}>
        <span className="flex items-center gap-1 text-primary"><Icon name="balance" className="text-[14px]" /> FedAvg weighted by local record count</span>
        <div className="flex items-center gap-space-sm">
          <span>Update size: <span className="text-on-surface font-semibold">{paramsPerUpdate} weights</span></span>
          <span className="text-outline">•</span>
          <span className="text-tertiary">No Patient Records Transferred</span>
        </div>
      </div>
    </div>
  )
}
