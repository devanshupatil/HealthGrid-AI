import { useCallback, useEffect, useRef, useState } from 'react'
import { createWorld, evaluate, fedAvg, initModel, localTrain, mulberry32, snapshot } from './engine'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const stamp = () => new Date().toLocaleTimeString([], { hour12: false })
const DEFAULT_SEED = 42

export function useFederation() {
  const [world, setWorld] = useState(() => createWorld(DEFAULT_SEED))
  const worldRef = useRef(world)
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const [dataUpdated, setDataUpdated] = useState(stamp)

  const [config, setConfigState] = useState({ epochs: 2, lr: 0.1, totalRounds: 20 })
  const configRef = useRef(config)

  const rngRef = useRef(mulberry32(7))
  const modelRef = useRef(initModel())
  const roundRef = useRef(0)
  const busyRef = useRef(false)
  const stopRef = useRef(false)
  const aliveRef = useRef(true)

  const [model, setModel] = useState(modelRef.current)
  const [round, setRound] = useState(0)
  const [history, setHistory] = useState(() => [snapshot(worldRef.current, modelRef.current, 0)])
  const [localLoss, setLocalLoss] = useState([null, null, null])
  const [lastUpdate, setLastUpdate] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState([])

  useEffect(() => {
    aliveRef.current = true
    return () => { aliveRef.current = false }
  }, [])

  const addLog = (text, tone = 'info') =>
    setLog((l) => [{ id: `${Date.now()}-${Math.random()}`, text, tone, time: stamp() }, ...l].slice(0, 100))

  const setConfig = (patch) =>
    setConfigState((c) => {
      const next = { ...c, ...patch }
      configRef.current = next
      return next
    })

  const resetState = () => {
    modelRef.current = initModel()
    roundRef.current = 0
    rngRef.current = mulberry32(7)
    setModel(modelRef.current)
    setRound(0)
    setHistory([snapshot(worldRef.current, modelRef.current, 0)])
    setLocalLoss([null, null, null])
    setLastUpdate(null)
    setLog([])
    setPhase('idle')
  }

  const runRound = useCallback(async () => {
    if (busyRef.current || roundRef.current >= configRef.current.totalRounds) return false
    busyRef.current = true
    const { hospitals } = worldRef.current
    const { epochs, lr } = configRef.current
    const r = roundRef.current + 1

    setPhase('training')
    addLog(`Round ${r}: global model sent to ${hospitals.length} hospitals`)
    await sleep(650)

    const updates = hospitals.map((h) => localTrain(modelRef.current, h.train, epochs, lr, rngRef.current))
    setLocalLoss(updates.map((u, i) => evaluate(u, hospitals[i].train).loss))
    setPhase('sending')
    addLog(`Round ${r}: local training done; only model updates sent`)
    await sleep(500)

    setPhase('aggregating')
    const next = fedAvg(updates, hospitals.map((h) => h.train.length))
    await sleep(600)

    modelRef.current = next
    roundRef.current = r
    const snap = snapshot(worldRef.current, next, r)
    setModel(next)
    setRound(r)
    setHistory((h) => [...h, snap])
    setLastUpdate(stamp())
    setPhase('broadcast')
    addLog(`Round ${r}: FedAvg complete — accuracy ${(snap.acc * 100).toFixed(1)}%, loss ${snap.loss.toFixed(3)}`, 'ok')
    await sleep(400)

    if (aliveRef.current) setPhase('idle')
    busyRef.current = false
    return true
  }, [])

  const runAll = useCallback(async () => {
    if (busyRef.current) return
    stopRef.current = false
    setRunning(true)
    while (!stopRef.current && aliveRef.current && roundRef.current < configRef.current.totalRounds) {
      if (!(await runRound())) break
    }
    if (aliveRef.current) setRunning(false)
  }, [runRound])

  const pause = () => { stopRef.current = true }

  const reset = useCallback(() => {
    if (busyRef.current) return
    resetState()
  }, [])

  // New synthetic hospital datasets (different random draw); training restarts from round 0.
  const regenerate = useCallback(() => {
    if (busyRef.current) return
    const next = Math.floor(Math.random() * 100000) + 1
    worldRef.current = createWorld(next)
    setWorld(worldRef.current)
    setSeed(next)
    setDataUpdated(stamp())
    resetState()
  }, [])

  return {
    hospitals: world.hospitals, seed, dataUpdated, config, setConfig, model, round, history, localLoss, lastUpdate,
    phase, running, log, runRound, runAll, pause, reset, regenerate,
  }
}
