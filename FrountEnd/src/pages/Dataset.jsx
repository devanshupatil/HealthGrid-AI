import { useState } from 'react'
import Icon from '../components/Icon'
import PageTitle from '../components/PageTitle'
import Donut from '../components/Donut'
import { featureStats } from './Hospitals'

const pct = (v) => `${(v * 100).toFixed(1)}%`
const TH = 'pb-space-sm font-semibold'

export default function Dataset({ fed }) {
  const { hospitals, dataUpdated, seed, regenerate, phase, running } = fed
  const [sel, setSel] = useState(null)

  return (
    <div className="relative z-10">
      <PageTitle icon="database" eyebrow="Synthetic data" title="Dataset Management" accent="Per Hospital" subtitle="View dataset information for each hospital. This prototype uses synthetic healthcare data to represent separate hospitals.">
        <button
          onClick={regenerate}
          disabled={phase !== 'idle' || running}
          className="px-space-lg py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-all flex items-center gap-space-sm shadow-md disabled:opacity-40"
        >
          <Icon name="autorenew" className="text-[16px] text-primary" />
          <span className="font-label-caps text-label-caps tracking-widest uppercase">Regenerate Synthetic Data</span>
        </button>
      </PageTitle>

      <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl mb-space-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="text-outline font-label-caps text-label-caps uppercase tracking-wider">
                {['Hospital', 'Dataset Name', 'Total Records', 'Features', 'Status', 'Last Updated', 'Action'].map((h) => <th key={h} className={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {hospitals.map((h, i) => (
                <tr key={h.id} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-space-sm font-medium text-on-surface">{h.name}</td>
                  <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-on-surface-variant">synthetic_hospital_{h.id.toLowerCase()}</td>
                  <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-on-surface">{(h.train.length + h.test.length).toLocaleString()}</td>
                  <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-on-surface-variant">4</td>
                  <td className="py-space-sm"><span className="px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary font-telemetry-mono-sm text-telemetry-mono-sm">Ready</span></td>
                  <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-outline">{dataUpdated}</td>
                  <td className="py-space-sm">
                    <button onClick={() => setSel(sel === i ? null : i)} className="px-space-md py-space-xs rounded bg-primary/10 text-primary hover:bg-primary/20 font-label-caps text-label-caps uppercase transition-all">
                      {sel === i ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-space-md font-telemetry-mono-sm text-telemetry-mono-sm text-outline">
          Data seed {seed}. Each dataset is split 75% training / 25% held-out testing. Uploading real patient data is not supported in this prototype.
        </p>
      </div>

      <div className="mt-space-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Data Profile</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Each hospital has a different patient mix (non-IID). The ring shows how many patients have the condition; the bars show where each average sits within the feature's range.</p>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
          {hospitals.map((h) => {
            const prev = h.train.concat(h.test).reduce((s, r) => s + r.y, 0) / (h.train.length + h.test.length)
            return (
              <div key={h.id} className="p-space-lg rounded-xl bg-surface-container-low shadow-xl">
                <div className="flex items-center gap-space-md mb-space-md">
                  <Donut value={prev} label="positive" />
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">{h.name}</div>
                    <div className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">{h.train.length + h.test.length} records</div>
                  </div>
                </div>
                <div className="flex flex-col gap-space-sm">
                  {featureStats(h).map((f) => (
                    <div key={f.key}>
                      <div className="flex justify-between font-telemetry-mono-sm text-telemetry-mono-sm text-on-surface-variant"><span>{f.label}</span><span className="text-primary">{f.mean.toFixed(1)} {f.unit}</span></div>
                      <div className="h-1.5 rounded-full bg-surface-container-highest mt-1"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(2, ((f.mean - f.min) / (f.max - f.min)) * 100))}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {sel !== null && (
        <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl">
          <h3 className="font-headline-md text-headline-md text-primary mb-space-md">{hospitals[sel].name} — Dataset</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-md">
            {[
              ['Training records', hospitals[sel].train.length],
              ['Held-out records', hospitals[sel].test.length],
              ['Condition rate', pct(hospitals[sel].prevalence)],
              ['Label', 'Condition present (0/1)'],
            ].map(([k, v]) => (
              <div key={k} className="p-space-sm rounded-lg bg-surface-container">
                <span className="font-label-caps text-label-caps text-outline uppercase block mb-0.5">{k}</span>
                <span className="font-headline-md text-headline-md text-on-surface">{v}</span>
              </div>
            ))}
          </div>
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead><tr className="text-outline font-label-caps text-label-caps uppercase"><th className={TH}>Feature</th><th className={TH}>Unit</th><th className={TH}>Mean</th></tr></thead>
            <tbody className="divide-y divide-outline-variant/10">
              {featureStats(hospitals[sel]).map((f) => (
                <tr key={f.key}>
                  <td className="py-space-sm text-on-surface">{f.label}</td>
                  <td className="py-space-sm text-outline">{f.unit}</td>
                  <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-primary">{f.mean.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
