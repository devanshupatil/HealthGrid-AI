import { useState } from 'react'
import Icon from '../components/Icon'
import PageTitle from '../components/PageTitle'
import HeroVisual from '../components/HeroVisual'
import { FEATURE_META } from '../fl/engine'

const TONES = ['text-primary', 'text-secondary', 'text-secondary-fixed-dim']
const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'
const pct = (v) => `${(v * 100).toFixed(1)}%`

export const featureStats = (h) =>
  FEATURE_META.map((f, i) => {
    const vals = h.train.map((r) => r.x[i] * f.std + f.mean)
    const mean = vals.reduce((s, v) => s + v, 0) / vals.length
    return { ...f, mean }
  })

export default function Hospitals({ fed }) {
  const { hospitals, round, history, localLoss, lastUpdate, phase, running, config } = fed
  const [sel, setSel] = useState(null)
  const cur = history[history.length - 1]
  const status = running || phase !== 'idle' ? 'Running' : round >= config.totalRounds ? 'Complete' : round === 0 ? 'Ready' : 'Idle'

  return (
    <div className="relative z-10">
      <PageTitle icon="local_hospital" eyebrow="Connected clients" title="Hospitals / Clients" accent="Simulated Sites" subtitle="View and manage the three simulated hospital clients. Each one holds its own data and trains locally." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter mb-space-xl">
        {hospitals.map((h, i) => (
          <div key={h.id} className="p-space-lg rounded-xl bg-surface-container-low shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <Icon name="local_hospital" className={`${TONES[i]} text-[28px]`} />
                <h3 className="font-headline-md text-headline-md text-on-surface">{h.name}</h3>
              </div>
              <span className={`${CAP} px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary flex items-center gap-1`}>
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Online
              </span>
            </div>
            <dl className="flex flex-col gap-space-sm font-body-md text-body-md">
              {[
                ['Dataset Size', (h.train.length + h.test.length).toLocaleString()],
                ['Training Status', status],
                ['Current Round', `${round} / ${config.totalRounds}`],
                ['Last Update', lastUpdate ?? '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-outline-variant/10 pb-space-xs">
                  <dt className="text-on-surface-variant">{k}</dt>
                  <dd className="text-on-surface font-telemetry-mono text-telemetry-mono">{v}</dd>
                </div>
              ))}
            </dl>
            <button
              onClick={() => setSel(sel === i ? null : i)}
              className="px-space-lg py-space-sm rounded-lg bg-gradient-to-r from-primary via-primary-container to-primary text-on-primary font-label-caps text-label-caps tracking-widest uppercase flex items-center justify-center gap-space-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              {sel === i ? 'Hide Details' : 'View Details'} <Icon name={sel === i ? 'expand_less' : 'arrow_forward'} className="text-[16px]" />
            </button>
          </div>
        ))}
      </div>

      {sel !== null && (
        <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl">
          <h3 className="font-headline-md text-headline-md text-primary mb-space-md">{hospitals[sel].name} — Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-md">
            {[
              ['Training records', hospitals[sel].train.length],
              ['Held-out records', hospitals[sel].test.length],
              ['Condition rate', pct(hospitals[sel].prevalence)],
              ['Global model accuracy', pct(cur.perHospital[sel].acc)],
              ['Last local loss', localLoss[sel] == null ? '—' : localLoss[sel].toFixed(3)],
            ].map(([k, v]) => (
              <div key={k} className="p-space-sm rounded-lg bg-surface-container">
                <span className="font-label-caps text-label-caps text-outline uppercase block mb-0.5">{k}</span>
                <span className="font-headline-md text-headline-md text-on-surface">{v}</span>
              </div>
            ))}
          </div>
          <span className="font-label-caps text-label-caps text-outline uppercase block mb-space-xs">Average patient profile</span>
          <div className="flex flex-wrap gap-space-sm">
            {featureStats(hospitals[sel]).map((f) => (
              <span key={f.key} className={`${CAP} px-space-sm py-space-xs rounded bg-surface-container-highest text-on-surface-variant`}>
                {f.label}: <span className="text-primary">{f.mean.toFixed(1)} {f.unit}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-space-xl grid grid-cols-1 xl:grid-cols-12 gap-gutter items-center p-space-lg rounded-xl bg-surface-container-low shadow-xl">
        <div className="xl:col-span-7 flex flex-col gap-space-sm">
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-widest uppercase">Network</span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Three sites, one shared model</h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Each hospital keeps its records on site and trains locally. Only small model updates travel to the federated server, which averages them with FedAvg and returns the improved global model.
          </p>
        </div>
        <div className="xl:col-span-5 max-w-sm mx-auto w-full"><HeroVisual /></div>
      </div>
    </div>
  )
}
