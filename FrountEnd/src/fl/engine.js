// Minimal federated learning engine: logistic regression + FedAvg on synthetic hospital data.
export const FEATURE_META = [
  { key: 'age', label: 'Age', unit: 'yrs', min: 20, max: 85, mean: 52, std: 12, def: 50 },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', min: 16, max: 45, mean: 29, std: 5, def: 28 },
  { key: 'glucose', label: 'Fasting glucose', unit: 'mg/dL', min: 70, max: 220, mean: 115, std: 25, def: 110 },
  { key: 'bp', label: 'Systolic BP', unit: 'mmHg', min: 90, max: 190, mean: 127, std: 12, def: 125 },
]
export const FEATURES = FEATURE_META.map((f) => f.key)
const MEAN = FEATURE_META.map((f) => f.mean)
const STD = FEATURE_META.map((f) => f.std)
export const standardize = (x) => x.map((v, i) => (v - MEAN[i]) / STD[i])
const TRUE_W = [0.9, 0.7, 1.4, 0.5]
const TRUE_B = -0.2

// Each hospital has a different patient mix (non-IID).
export const HOSPITAL_SPECS = [
  { id: 'A', name: 'Hospital A', n: 900, means: [56, 27, 108, 128] },
  { id: 'B', name: 'Hospital B', n: 700, means: [44, 31, 112, 121] },
  { id: 'C', name: 'Hospital C', n: 500, means: [58, 28, 127, 136] },
]

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gauss = (rng) => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng())
export const sigmoid = (z) => 1 / (1 + Math.exp(-z))

function makeRecords(spec, n, rng) {
  const rows = []
  for (let k = 0; k < n; k++) {
    const z = spec.means.map((m, i) => (m + gauss(rng) * STD[i] - MEAN[i]) / STD[i])
    const logit = TRUE_B + z.reduce((s, v, i) => s + v * TRUE_W[i], 0)
    rows.push({ x: z, y: rng() < sigmoid(logit) ? 1 : 0 })
  }
  return rows
}

export function createWorld(seed = 42) {
  const rng = mulberry32(seed)
  const hospitals = HOSPITAL_SPECS.map((spec) => {
    const train = makeRecords(spec, spec.n, rng)
    const test = makeRecords(spec, Math.round(spec.n * 0.25), rng)
    return { ...spec, train, test, prevalence: train.reduce((s, r) => s + r.y, 0) / train.length }
  })
  return { hospitals, globalTest: hospitals.flatMap((h) => h.test) }
}

export const initModel = () => ({ w: FEATURES.map(() => 0), b: 0 })
export const predict = (m, z) => sigmoid(m.b + z.reduce((s, v, i) => s + v * m.w[i], 0))

export function evaluate(m, data) {
  let loss = 0
  let correct = 0
  for (const { x, y } of data) {
    const p = Math.min(Math.max(predict(m, x), 1e-9), 1 - 1e-9)
    loss += -(y * Math.log(p) + (1 - y) * Math.log(1 - p))
    if ((p >= 0.5 ? 1 : 0) === y) correct++
  }
  return { loss: loss / data.length, acc: correct / data.length }
}

// Local training on the hospital's own records; only the resulting weights leave.
export function localTrain(global, data, epochs, lr, rng, batch = 32) {
  const m = { w: [...global.w], b: global.b }
  const idx = data.map((_, i) => i)
  for (let e = 0; e < epochs; e++) {
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[idx[i], idx[j]] = [idx[j], idx[i]]
    }
    for (let s = 0; s < idx.length; s += batch) {
      const chunk = idx.slice(s, s + batch)
      const gw = m.w.map(() => 0)
      let gb = 0
      for (const k of chunk) {
        const { x, y } = data[k]
        const err = predict(m, x) - y
        x.forEach((v, i) => (gw[i] += err * v))
        gb += err
      }
      m.w = m.w.map((w, i) => w - (lr * gw[i]) / chunk.length)
      m.b -= (lr * gb) / chunk.length
    }
  }
  return m
}

// Federated Averaging, weighted by each client's number of local records.
export function fedAvg(models, sizes) {
  const total = sizes.reduce((a, b) => a + b, 0)
  const out = { w: FEATURES.map(() => 0), b: 0 }
  models.forEach((m, k) => {
    const f = sizes[k] / total
    m.w.forEach((v, i) => (out.w[i] += v * f))
    out.b += m.b * f
  })
  return out
}

export function snapshot(world, model, round) {
  const g = evaluate(model, world.globalTest)
  return { round, loss: g.loss, acc: g.acc, perHospital: world.hospitals.map((h) => evaluate(model, h.test)) }
}
