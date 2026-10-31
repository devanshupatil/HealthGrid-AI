import { useState } from 'react'
import Icon from '../components/Icon'
import Medallion from '../components/Medallion'
import RiskGauge from '../components/RiskGauge'
import { FEATURE_META, predict, standardize } from '../fl/engine'

const CAP = 'font-telemetry-mono-sm text-telemetry-mono-sm'
const CARD = 'p-space-lg rounded-xl bg-surface-container-low shadow-xl'

export default function Predictions({ model, round }) {
  const [vals, setVals] = useState(() => FEATURE_META.map((f) => f.def))
  const risk = predict(model, standardize(vals))
  const [level, tone] = risk < 0.35 ? ['Low', 'text-tertiary'] : risk < 0.6 ? ['Moderate', 'text-primary'] : ['High', 'text-error']
  const maxW = Math.max(0.01, ...model.w.map(Math.abs))

  return (
    <div className="relative z-10">
      <header className="mb-space-xl max-w-3xl flex items-start gap-space-lg">
        <Medallion icon="query_stats" />
        <div className="flex flex-col gap-space-xs">
        <span className={`${CAP} text-primary tracking-widest uppercase`}>Global model • Round {round}</span>
        <h1 className="font-display-hero text-headline-xl text-on-surface tracking-tight uppercase font-light">
          Predictions <span className="text-primary italic font-normal font-display-hero">— Global Model</span>
        </h1>
        <p className="font-body-lg text-body-md text-on-surface-variant leading-relaxed">
          Try the federated global model on a hypothetical patient. It was trained across all three hospitals without any of them sharing raw records.
        </p>
        </div>
      </header>

      {round === 0 && (
        <div className="mb-space-md p-space-md rounded-xl bg-primary-container/10 border border-primary/30 text-primary font-body-sm text-body-sm">
          The model is untrained (round 0), so every prediction is 50%. Run some rounds on the Training Dashboard first.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
        <div className={`xl:col-span-7 ${CARD}`}>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md">Patient Features</h3>
          <div className="flex flex-col gap-space-lg">
            {FEATURE_META.map((f, i) => (
              <label key={f.key} className="flex flex-col gap-space-xs">
                <div className="flex justify-between">
                  <span className="font-body-md text-body-md text-on-surface">{f.label}</span>
                  <span className="font-telemetry-mono text-telemetry-mono text-primary">{vals[i]} {f.unit}</span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  value={vals[i]}
                  onChange={(e) => setVals((v) => v.map((x, k) => (k === i ? Number(e.target.value) : x)))}
                  className="w-full accent-[#f2ca50]"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col gap-gutter">
          <div className={CARD}>
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Predicted Risk</span>
            <div className="my-space-sm"><RiskGauge risk={risk} muted={round === 0} /></div>
            <div className="flex items-baseline gap-space-sm my-space-xs">
              <span className={`font-display-hero text-headline-xl font-normal ${round === 0 ? 'text-on-surface' : tone}`}>{(risk * 100).toFixed(1)}%</span>
              <span className={`font-telemetry-mono text-telemetry-mono ${round === 0 ? 'text-outline' : tone}`}>{round === 0 ? 'Untrained' : level}</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-container to-primary h-full rounded-full transition-all duration-300" style={{ width: `${risk * 100}%` }} />
            </div>
            <p className={`${CAP} text-outline mt-space-sm`}>Synthetic data demo only — not medical advice.</p>
          </div>

          <div className={CARD}>
            <div className="flex items-center gap-space-xs mb-space-sm">
              <Icon name="tune" className="text-primary text-[18px]" />
              <h3 className="font-headline-md text-headline-md text-on-surface">Learned Weights</h3>
            </div>
            <div className="flex flex-col gap-space-sm">
              {FEATURE_META.map((f, i) => (
                <div key={f.key} className="flex items-center gap-space-sm">
                  <span className="w-28 font-body-sm text-body-sm text-on-surface-variant">{f.label}</span>
                  <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className={`${model.w[i] >= 0 ? 'bg-primary' : 'bg-error'} h-full rounded-full transition-all duration-500`} style={{ width: `${(Math.abs(model.w[i]) / maxW) * 100}%` }} />
                  </div>
                  <span className={`${CAP} w-12 text-right text-on-surface`}>{model.w[i].toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
