import Icon from './Icon'

const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'

export default function Ledger({ log }) {
  return (
    <div className="xl:col-span-5 p-space-lg rounded-xl bg-surface-container-low shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <Icon name="receipt_long" className="text-primary text-[20px]" />
            <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">Training Log</h3>
          </div>
          <span className={`${CAP} px-space-xs py-0.5 rounded bg-primary/10 text-primary`}>{log.length} events</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
          Each round: global model out, local training, model updates back, FedAvg aggregation.
        </p>
        <div className="flex flex-col gap-space-sm max-h-64 overflow-y-auto pr-1 [mask-image:linear-gradient(to_bottom,#000_85%,transparent)]">
          {log.length === 0 && <p className="font-body-sm text-body-sm text-outline">No rounds yet. Press Next Round or Run All Rounds.</p>}
          {log.map((e) => (
            <div key={e.id} className="p-space-sm rounded-lg bg-surface-container flex items-start justify-between gap-space-sm hover:bg-surface-container-high transition-all">
              <div className="flex items-start gap-space-sm">
                <Icon name={e.tone === 'ok' ? 'check_circle' : 'sync_alt'} className={`${e.tone === 'ok' ? 'text-tertiary' : 'text-primary'} text-[18px] mt-0.5`} />
                <span className="font-body-sm text-body-sm text-on-surface">{e.text}</span>
              </div>
              <span className={`${CAP} text-secondary-fixed whitespace-nowrap`}>{e.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`mt-space-md pt-space-xs flex items-center justify-between text-outline ${CAP}`}>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Only model updates leave each hospital
        </span>
        <span className="text-on-surface-variant">FedAvg</span>
      </div>
    </div>
  )
}
