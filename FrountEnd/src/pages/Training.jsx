import Icon from '../components/Icon'
import PageTitle from '../components/PageTitle'
import Constellation from '../components/Constellation'
import HeroVisual from '../components/HeroVisual'

const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl flex items-center gap-space-md'
const BTN = 'px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all flex items-center gap-space-sm shadow-md disabled:opacity-40'

// How far each hospital is through the current round.
function clientProgress(phase, round) {
  if (phase === 'training') return [50, 'Training locally']
  if (phase === 'sending') return [90, 'Sending update']
  if (phase === 'aggregating' || phase === 'broadcast') return [100, 'Update received']
  return round === 0 ? [0, 'Waiting'] : [100, 'Update received']
}

export default function Training({ fed, paramsPerUpdate }) {
  const { hospitals, round, history, phase, running, config, runRound, runAll, pause, reset } = fed
  const busy = phase !== 'idle'
  const done = round >= config.totalRounds
  const [pctDone, clientLabel] = clientProgress(phase, round)
  const received = phase === 'training' || (phase === 'idle' && round === 0) ? 0 : phase === 'sending' ? 0 : hospitals.length
  const gStatus = phase === 'aggregating' ? 'Updating' : round === 0 ? 'Untrained' : 'Updated'
  const cur = history[history.length - 1]

  return (
    <div className="relative z-10">
      <PageTitle icon="model_training" eyebrow="Round control" title="Federated Training" accent="Control Panel" subtitle="Monitor and control the federated learning process.">
        <button onClick={reset} disabled={busy || running} className={BTN}>
          <Icon name="restart_alt" className="text-[16px] text-primary" />
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Reset</span>
        </button>
        <button onClick={runRound} disabled={busy || running || done} className={BTN}>
          <Icon name="skip_next" className="text-[16px] text-primary" />
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Next Round</span>
        </button>
        <button
          onClick={running ? pause : runAll}
          disabled={(busy && !running) || done}
          className="px-space-lg py-space-sm rounded-lg bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase flex items-center gap-space-sm shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
        >
          <Icon name={running ? 'pause' : 'play_arrow'} className="text-[18px]" />
          <span>{running ? 'Pause' : done ? 'Training Complete' : 'Start Training'}</span>
        </button>
      </PageTitle>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mb-space-xl">
        {[
          ['sync', 'Current Round', `${round} / ${config.totalRounds}`],
          ['inbox', 'Model Updates Received', `${received} / ${hospitals.length}`],
          ['hub', 'Global Model Status', gStatus],
          ['trending_up', 'Training Progress', `${Math.round((round / config.totalRounds) * 100)}%`],
        ].map(([icon, label, value]) => (
          <div key={label} className={CARD}>
            <Icon name={icon} className="text-primary text-[28px]" />
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">{label}</span>
              <span className="font-headline-md text-headline-md text-on-surface">{value}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl mb-space-xl">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md">
          Training Progress <span className="text-outline font-normal text-body-md">(Current Round)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {hospitals.map((h) => (
            <div key={h.id} className="p-space-md rounded-lg bg-surface-container">
              <div className="flex items-center gap-space-xs mb-space-sm">
                <Icon name={pctDone === 100 ? 'check_circle' : 'pending'} className={`${pctDone === 100 ? 'text-tertiary' : 'text-primary'} text-[20px]`} />
                <span className="font-body-md text-body-md text-on-surface font-semibold">{h.name}</span>
              </div>
              <div className="flex justify-between font-telemetry-mono-sm text-telemetry-mono-sm text-outline mb-space-xs">
                <span>{clientLabel}</span>
                <span>{pctDone}%</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-container via-primary to-primary-fixed h-full rounded-full transition-all duration-500" style={{ width: `${pctDone}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-stretch gap-space-md mt-space-md">
          <div className="flex-1 p-space-md rounded-lg bg-surface-container flex items-center gap-space-sm">
            <Icon name="dns" className="text-primary text-[24px]" />
            <div><div className="font-body-md text-body-md text-on-surface font-semibold">Federated Server</div><div className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">FedAvg Aggregation</div></div>
          </div>
          <Icon name="arrow_forward" className="text-outline self-center" />
          <div className="flex-1 p-space-md rounded-lg bg-surface-container flex items-center gap-space-sm">
            <Icon name="psychology" className="text-primary text-[24px]" />
            <div><div className="font-body-md text-body-md text-on-surface font-semibold">Global Model</div><div className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">Accuracy {(cur.acc * 100).toFixed(1)}% • updated after each round</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <Constellation hospitals={hospitals} phase={phase} round={round} paramsPerUpdate={paramsPerUpdate} />
        <div className="xl:col-span-5 p-space-lg rounded-xl bg-surface-container-low shadow-xl flex flex-col gap-space-md">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Network View</h3>
            <p className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">Green: model updates to the server. Gold: global model back.</p>
          </div>
          <div className="max-w-md mx-auto w-full"><HeroVisual /></div>
        </div>
      </div>
    </div>
  )
}
