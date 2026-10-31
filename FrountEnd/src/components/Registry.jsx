import Icon from './Icon'

const HEAD = ['Hospital', 'Local Records', 'Condition Rate', 'Global Model Acc.', 'Local Loss', 'State']
const DOTS = ['bg-primary', 'bg-secondary', 'bg-primary-fixed']
const pct = (v) => `${(v * 100).toFixed(1)}%`

const STATE = {
  training: 'TRAINING LOCALLY',
  sending: 'SENDING UPDATE',
  aggregating: 'AWAITING GLOBAL',
}

export default function Registry({ hospitals, history, localLoss, phase, round }) {
  const cur = history[history.length - 1]

  return (
    <div className="xl:col-span-7 p-space-lg rounded-xl bg-surface-container-low shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <Icon name="domain" className="text-primary text-[20px]" />
            <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">Hospital Client Status</h3>
          </div>
          <span className="font-label-caps text-label-caps text-primary uppercase">Non-IID Data</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Each hospital has a different patient mix, so the global model is checked against every site's own held-out records. No patient records leave a hospital.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left font-body-sm text-body-sm">
            <thead>
              <tr className="text-outline font-label-caps text-label-caps uppercase tracking-wider">
                {HEAD.map((h, i) => (
                  <th key={h} className={`pb-space-sm font-semibold ${i === HEAD.length - 1 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {hospitals.map((h, i) => {
                const acc = cur.perHospital[i].acc
                return (
                  <tr key={h.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="py-space-sm font-medium text-on-surface">
                      <span className="flex items-center gap-space-xs">
                        <span className={`w-2 h-2 rounded-full ${DOTS[i]}`} />
                        {h.name}
                      </span>
                    </td>
                    <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-on-surface-variant">{h.train.length}</td>
                    <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-outline">{pct(h.prevalence)}</td>
                    <td className="py-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span className="font-telemetry-mono text-telemetry-mono text-primary font-medium">{pct(acc)}</span>
                        <div className="w-16 bg-surface-container-highest rounded-full h-1">
                          <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${acc * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-space-sm font-telemetry-mono text-telemetry-mono text-outline">{localLoss[i] == null ? '—' : localLoss[i].toFixed(3)}</td>
                    <td className="py-space-sm text-right">
                      <span className="px-space-xs py-0.5 rounded bg-tertiary-container/20 text-tertiary font-telemetry-mono-sm text-telemetry-mono-sm">
                        {STATE[phase] ?? (round === 0 ? 'READY' : 'SYNCED')}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-space-md pt-space-xs flex items-center justify-between text-outline font-telemetry-mono-sm text-telemetry-mono-sm">
        <span>Client updates are averaged weighted by local record count</span>
        <span className="text-primary flex items-center gap-0.5">FedAvg <Icon name="hub" className="text-[14px]" /></span>
      </div>
    </div>
  )
}
