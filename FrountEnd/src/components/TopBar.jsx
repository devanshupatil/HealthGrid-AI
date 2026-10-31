import { LogoutButton } from '@/components/ui/logout-button'

export default function TopBar({ phase, round, user, onLogout }) {
  const live = phase !== 'idle'
  return (
    <header className="fixed top-0 left-72 right-0 h-20 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/25 px-gutter-desktop flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-space-lg">
        <div className="hidden xl:flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-low/60 border border-outline-variant/30">
          <span className={`w-2 h-2 rounded-full ${live ? 'bg-primary animate-pulse' : 'bg-tertiary shadow-[0_0_6px_#58e7aa]'}`} />
          <span className="font-telemetry-mono text-telemetry-mono text-secondary-fixed-dim">{live ? `Round ${round + 1} in progress` : 'Federated Server Idle'}</span>
          <span className="text-outline font-telemetry-mono-sm text-telemetry-mono-sm">•</span>
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-outline">3 simulated hospital clients</span>
        </div>
      </div>
      <div className="flex items-center gap-space-lg">
        <div className="flex flex-col text-right">
          <span className="font-body-sm text-body-sm text-on-surface font-semibold tracking-tight">KDK College of Engineering, Nagpur</span>
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-wider uppercase">Dept. of AI &amp; Data Science</span>
        </div>
        <LogoutButton onClick={onLogout} title={`Logged in as ${user}`} />
      </div>
    </header>
  )
}
