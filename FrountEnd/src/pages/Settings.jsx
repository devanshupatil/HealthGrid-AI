import PageTitle from '../components/PageTitle'

const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl'

function Field({ label, hint, value, options, onChange, disabled }) {
  return (
    <label className="flex flex-col gap-space-xs">
      <span className="font-body-md text-body-md text-on-surface">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-surface-container border border-outline-variant/40 rounded-lg px-space-sm py-space-sm font-telemetry-mono text-telemetry-mono text-on-surface disabled:opacity-50"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="font-body-sm text-body-sm text-outline">{hint}</span>
    </label>
  )
}

export default function Settings({ fed }) {
  const { config, setConfig, round, phase, running } = fed
  const locked = phase !== 'idle' || running
  const roundOptions = [10, 20, 30].filter((n) => n >= round)

  return (
    <div className="relative z-10">
      <PageTitle icon="tune" eyebrow="Configuration" title="Settings" accent="Training Parameters" subtitle="Changes apply to the next round. They are locked while training is running." />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        <div className={`${CARD} flex flex-col gap-space-lg`}>
          <h3 className="font-headline-md text-headline-md text-primary">Training</h3>
          <Field label="Local epochs per round" hint="Passes each hospital makes over its own data before sending an update." value={config.epochs} options={[1, 2, 5]} onChange={(v) => setConfig({ epochs: v })} disabled={locked} />
          <Field label="Learning rate" hint="Step size for local training." value={config.lr} options={[0.05, 0.1, 0.3]} onChange={(v) => setConfig({ lr: v })} disabled={locked} />
          <Field label="Total rounds" hint={round > 0 ? 'Cannot go below the rounds already run.' : 'How many federated rounds to run.'} value={config.totalRounds} options={roundOptions} onChange={(v) => setConfig({ totalRounds: v })} disabled={locked} />
        </div>

        <div className={CARD}>
          <h3 className="font-headline-md text-headline-md text-primary mb-space-md">Fixed by the Prototype</h3>
          <dl className="flex flex-col gap-space-sm font-body-md text-body-md">
            {[
              ['Hospital clients', '3 (simulated)'],
              ['Model', 'Logistic regression'],
              ['Aggregation', 'FedAvg (weighted by records)'],
              ['Features', 'Age, BMI, glucose, blood pressure'],
              ['Data', 'Synthetic, non-IID across hospitals'],
              ['Batch size', '32'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-outline-variant/10 pb-space-xs">
                <dt className="text-on-surface-variant">{k}</dt>
                <dd className="text-on-surface font-telemetry-mono text-telemetry-mono text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
