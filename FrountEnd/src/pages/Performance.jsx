import { useState } from 'react'
import PageTitle from '../components/PageTitle'
import AxisChart from '../components/AxisChart'

const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'

export default function Performance({ fed }) {
  const { hospitals, history, config, round } = fed
  const [tab, setTab] = useState(-1)
  const tabs = [{ label: 'Global Model', i: -1 }, ...hospitals.map((h, i) => ({ label: h.name, i }))]
  const pick = (h, key) => (tab < 0 ? h[key] : h.perHospital[tab][key])
  const acc = history.map((h) => pick(h, 'acc'))
  const loss = history.map((h) => pick(h, 'loss'))
  const maxLoss = Math.max(0.8, ...loss)
  const lossMax = Math.ceil(maxLoss * 2) / 2

  return (
    <div className="relative z-10">
      <PageTitle icon="monitoring" eyebrow={`After ${round} round${round === 1 ? '' : 's'}`} title="Model Performance" accent="Metrics" subtitle="View global and local model performance metrics. Hospital tabs show the global model evaluated on that hospital's held-out records." />

      <div className="flex flex-wrap gap-space-sm mb-space-md">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.i)}
            className={`px-space-lg py-space-sm rounded-lg font-body-md text-body-md transition-all ${tab === t.i ? 'bg-surface-container-high text-primary font-semibold border-b-2 border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter mb-space-xl">
        <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl">
          <div className="flex justify-between mb-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Accuracy vs Rounds</h3>
            <span className={`${CAP} text-primary`}>{(acc[acc.length - 1] * 100).toFixed(1)}%</span>
          </div>
          <AxisChart values={acc} total={config.totalRounds} yMin={0} yMax={1} yStep={0.2} color="#f2ca50" yLabel="Accuracy" />
        </div>
        <div className="p-space-lg rounded-xl bg-surface-container-low shadow-xl">
          <div className="flex justify-between mb-space-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface">Loss vs Rounds</h3>
            <span className={`${CAP} text-secondary`}>{loss[loss.length - 1].toFixed(3)}</span>
          </div>
          <AxisChart values={loss} total={config.totalRounds} yMin={0} yMax={lossMax} yStep={lossMax / 4} color="#c4c7c9" yLabel="Loss" format={(v) => v.toFixed(2)} />
        </div>
      </div>

      {round === 0 && <p className="font-body-sm text-body-sm text-outline">No rounds have run yet. Start training to see the curves.</p>}
    </div>
  )
}
