import Icon from '../components/Icon'
import PageTitle from '../components/PageTitle'

const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'
const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl'
const STATUS = {
  active: ['Active', 'bg-tertiary-container/20 text-tertiary'],
  planned: ['Planned', 'bg-surface-container-highest text-outline'],
}

export default function Logs({ log, paramsPerUpdate }) {
  const techniques = [
    ['active', 'Local training', 'Each hospital trains only on its own records.'],
    ['active', 'Federated Averaging (FedAvg)', 'Server combines model updates, weighted by record count.'],
    ['planned', 'Secure aggregation', 'Server would not see individual updates.'],
    ['planned', 'Differential privacy', 'Noise added to updates to limit leakage.'],
    ['planned', 'Authorized EHR / API integration', 'Real hospital systems, for future deployment.'],
  ]
  const shared = [
    ['Raw patient records', 'Never leave the hospital', 'text-tertiary'],
    ['Model update', `${paramsPerUpdate} numbers per hospital per round`, 'text-primary'],
    ['Global model', 'Sent back to every hospital', 'text-primary'],
  ]

  return (
    <div className="relative z-10">
      <PageTitle icon="shield" eyebrow="Audit trail" title="Logs & Privacy" accent="What Leaves a Hospital" subtitle="Training activity for each round, and the privacy techniques the prototype uses now versus those planned." />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <div className={`xl:col-span-7 ${CARD}`}>
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <Icon name="receipt_long" className="text-primary text-[20px]" />
              <h3 className="font-headline-md text-headline-md text-on-surface">Activity Log</h3>
            </div>
            <span className={`${CAP} px-space-xs py-0.5 rounded bg-primary/10 text-primary`}>{log.length} events</span>
          </div>
          <div className="flex flex-col gap-space-sm max-h-[480px] overflow-y-auto">
            {log.length === 0 && <p className="font-body-sm text-body-sm text-outline">No activity yet. Start training to generate a log.</p>}
            {log.map((e) => (
              <div key={e.id} className="p-space-sm rounded-lg bg-surface-container flex items-start justify-between gap-space-sm">
                <div className="flex items-start gap-space-sm">
                  <Icon name={e.tone === 'ok' ? 'check_circle' : 'sync_alt'} className={`${e.tone === 'ok' ? 'text-tertiary' : 'text-primary'} text-[18px] mt-0.5`} />
                  <span className="font-body-sm text-body-sm text-on-surface">{e.text}</span>
                </div>
                <span className={`${CAP} text-secondary-fixed whitespace-nowrap`}>{e.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-gutter">
          <div className={CARD}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">What Is Shared</h3>
            <div className="flex flex-col gap-space-sm">
              {shared.map(([k, v, c]) => (
                <div key={k} className="flex justify-between gap-space-md border-b border-outline-variant/10 pb-space-xs">
                  <span className="font-body-md text-body-md text-on-surface-variant">{k}</span>
                  <span className={`${CAP} ${c} text-right`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={CARD}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Privacy Techniques</h3>
            <ul className="flex flex-col gap-space-sm">
              {techniques.map(([s, t, d]) => (
                <li key={t} className="flex items-start justify-between gap-space-md">
                  <div>
                    <div className="font-body-md text-body-md text-on-surface">{t}</div>
                    <div className="font-body-sm text-body-sm text-outline">{d}</div>
                  </div>
                  <span className={`${CAP} px-space-xs py-0.5 rounded whitespace-nowrap ${STATUS[s][1]}`}>{STATUS[s][0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
