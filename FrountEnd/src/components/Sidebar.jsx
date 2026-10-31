import Icon from './Icon'
import { LogoutButton } from '@/components/ui/logout-button'

const NAV = [
  { title: 'Federated Learning', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'hospitals', label: 'Hospitals / Clients', icon: 'local_hospital' },
    { id: 'training', label: 'Federated Training', icon: 'model_training' },
    { id: 'performance', label: 'Model Performance', icon: 'monitoring' },
    { id: 'dataset', label: 'Dataset', icon: 'database' },
    { id: 'logs', label: 'Logs & Privacy', icon: 'shield_lock' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ] },
  { title: 'More', items: [
    { id: 'predictions', label: 'Predictions', icon: 'stethoscope' },
    { id: 'project', label: 'About the Project', icon: 'menu_book' },
  ] },
]

const IDLE = 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
const ACTIVE = 'bg-surface-container-high text-primary font-semibold border-l-2 border-primary shadow-[inset_0_0_12px_rgba(212,175,55,0.06)]'

export default function Sidebar({ page, setPage, round, totalRounds, paramsPerUpdate, open, onClose, user, onLogout }) {
  return (
    <>
    <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-700 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} aria-hidden="true" />
    <aside className={`fixed right-0 lg:right-auto lg:left-0 top-0 h-full w-72 bg-surface-container-lowest/95 lg:bg-surface-container-lowest/90 backdrop-blur-2xl z-50 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-outline-variant/30 transition-transform duration-700 ease-in-out lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="h-20 px-gutter flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-container via-primary to-primary-fixed flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.25)]">
              <Icon name="health_and_safety" className="text-surface-container-lowest text-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-lg text-body-lg text-primary tracking-widest font-normal uppercase">HealthGrid AI</span>
              <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline tracking-wider uppercase">Federated Healthcare ML</span>
            </div>
          </div>
          <div className="hidden lg:block w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#58e7aa]" />
          <button onClick={onClose} aria-label="Close menu" className="lg:hidden text-outline hover:text-primary"><Icon name="close" /></button>
        </div>

        <nav className="flex flex-col gap-space-lg px-gutter py-space-lg">
          {NAV.map((group) => (
            <div key={group.title} className="flex flex-col gap-space-xs">
              <div className="px-space-sm pb-space-xs font-label-caps text-label-caps text-outline tracking-widest uppercase opacity-70">{group.title}</div>
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  aria-current={page === item.id ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); setPage(item.id) }}
                  className={`group flex items-center gap-space-md px-space-sm py-space-sm rounded-lg transition-all ${page === item.id ? ACTIVE : IDLE}`}
                >
                  <Icon name={item.icon} className="text-[18px] text-outline group-hover:text-primary transition-colors" />
                  <span className="font-body-md text-body-md tracking-tight">{item.label}</span>
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-gutter">
        <div className="[@media(max-height:820px)]:hidden p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/30 backdrop-blur-md relative overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-primary/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-space-sm mb-space-sm">
            <div className="w-6 h-6 rounded-full bg-primary-container/20 border border-primary/40 flex items-center justify-center">
              <Icon name="lock" className="text-primary text-[14px]" />
            </div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Data Stays Local</span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mb-space-sm">Hospitals train locally and share only model updates with the federated server.</p>
          <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
            <div className="flex items-center gap-space-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-tertiary">0 RECORDS SHARED</span>
            </div>
            <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-on-surface-variant">ROUND {round}/{totalRounds}</span>
          </div>
          <div className="mt-space-xs font-telemetry-mono-sm text-telemetry-mono-sm text-outline">{paramsPerUpdate} weights per update</div>
        </div>
        <div className="mt-space-md flex flex-col gap-space-xs">
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline truncate">Signed in as {user}</span>
          <LogoutButton onClick={onLogout} className="w-full" />
        </div>
      </div>
    </aside>
    </>
  )
}
