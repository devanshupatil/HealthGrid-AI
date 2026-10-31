import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PageHeader from './components/PageHeader'
import KpiCards from './components/KpiCards'
import Constellation from './components/Constellation'
import Trajectory from './components/Trajectory'
import Registry from './components/Registry'
import Ledger from './components/Ledger'
import Predictions from './pages/Predictions'
import Project from './pages/Project'
import Hospitals from './pages/Hospitals'
import Training from './pages/Training'
import Performance from './pages/Performance'
import Dataset from './pages/Dataset'
import Logs from './pages/Logs'
import Settings from './pages/Settings'
import Home from './pages/Home'
import LuxBackground from './components/LuxBackground'
import { useFederation } from './fl/useFederation'
import { FEATURES } from './fl/engine'

const PARAMS_PER_UPDATE = FEATURES.length + 1

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const fed = useFederation()
  const busy = fed.phase !== 'idle'
  const TOTAL_ROUNDS = fed.config.totalRounds

  if (!user) return <Home onLogin={setUser} />

  return (
    <>
      <LuxBackground />
      <Sidebar user={user} onLogout={() => { setUser(null); setPage('dashboard'); setMenuOpen(false) }} open={menuOpen} onClose={() => setMenuOpen(false)} page={page} setPage={(p) => { setPage(p); setMenuOpen(false) }} round={fed.round} totalRounds={TOTAL_ROUNDS} paramsPerUpdate={PARAMS_PER_UPDATE} />
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        <TopBar onMenu={() => setMenuOpen(true)} phase={fed.phase} round={fed.round} />
        <main className="w-full pt-28 px-4 md:px-gutter-desktop py-space-xl flex-1">
          <div className="flex flex-col w-full">
            <div className="relative w-full overflow-hidden">

              {page === 'dashboard' && (
                <>
              <PageHeader
                round={fed.round}
                totalRounds={TOTAL_ROUNDS}
                busy={busy}
                running={fed.running}
                onNext={fed.runRound}
                onRunAll={fed.runAll}
                onPause={fed.pause}
                onReset={fed.reset}
              />
              <KpiCards hospitals={fed.hospitals} history={fed.history} round={fed.round} totalRounds={TOTAL_ROUNDS} phase={fed.phase} paramsPerUpdate={PARAMS_PER_UPDATE} />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter mb-space-xl relative z-10">
                <Constellation hospitals={fed.hospitals} phase={fed.phase} round={fed.round} paramsPerUpdate={PARAMS_PER_UPDATE} />
                <Trajectory history={fed.history} round={fed.round} totalRounds={TOTAL_ROUNDS} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter relative z-10">
                <Registry hospitals={fed.hospitals} history={fed.history} localLoss={fed.localLoss} phase={fed.phase} round={fed.round} />
                <Ledger log={fed.log} />
              </div>
                </>
              )}
              {page === 'hospitals' && <Hospitals fed={fed} />}
              {page === 'training' && <Training fed={fed} paramsPerUpdate={PARAMS_PER_UPDATE} />}
              {page === 'performance' && <Performance fed={fed} />}
              {page === 'dataset' && <Dataset fed={fed} />}
              {page === 'logs' && <Logs log={fed.log} paramsPerUpdate={PARAMS_PER_UPDATE} />}
              {page === 'settings' && <Settings fed={fed} />}
              {page === 'predictions' && <Predictions model={fed.model} round={fed.round} />}
              {page === 'project' && <Project />}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
