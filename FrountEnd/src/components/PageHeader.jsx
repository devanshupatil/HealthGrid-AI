import Medallion from './Medallion'
import Icon from './Icon'

export default function PageHeader({ round, totalRounds, busy, running, onNext, onRunAll, onPause, onReset }) {
  const done = round >= totalRounds
  const btn = 'px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all flex items-center gap-space-sm shadow-md disabled:opacity-40'

  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl relative z-10">
      <div className="flex items-start gap-space-lg max-w-3xl">
        <Medallion icon="dashboard" />
        <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-widest uppercase">Privacy-Preserving Federated ML</span>
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">•</span>
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-tertiary">Synthetic hospital data</span>
        </div>
        <h1 className="font-display-hero text-headline-xl text-on-surface tracking-tight uppercase font-light">
          HealthGrid AI <span className="text-primary italic font-normal font-display-hero">— Training Dashboard</span>
        </h1>
        <p className="font-body-lg text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
          Three simulated hospitals train a shared model locally. Only model updates reach the federated server, which combines them with FedAvg and sends the improved global model back.
        </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-space-md">
        <button onClick={onReset} disabled={busy || running} className={btn}>
          <Icon name="restart_alt" className="text-[16px] text-primary" />
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Reset</span>
        </button>
        <button onClick={onNext} disabled={busy || running || done} className={btn}>
          <Icon name="skip_next" className="text-[16px] text-primary" />
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Next Round</span>
        </button>
        <button
          onClick={running ? onPause : onRunAll}
          disabled={(busy && !running) || done}
          className="px-space-lg py-space-sm rounded-lg bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase flex items-center gap-space-sm shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
        >
          <Icon name={running ? 'pause' : 'all_inclusive'} className="text-[18px]" />
          <span>{running ? 'Pause' : done ? 'Training Complete' : 'Run All Rounds'}</span>
        </button>
      </div>
    </header>
  )
}
