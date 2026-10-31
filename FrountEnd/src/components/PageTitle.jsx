import Medallion from './Medallion'

export default function PageTitle({ eyebrow, title, accent, subtitle, icon, children }) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl relative z-10">
      <div className="flex items-start gap-space-lg max-w-3xl">
        {icon && <Medallion icon={icon} />}
        <div className="flex flex-col gap-space-xs">
          <span className="font-telemetry-mono-sm text-telemetry-mono-sm text-primary tracking-widest uppercase">{eyebrow}</span>
          <h1 className="font-display-hero text-headline-xl text-on-surface tracking-tight uppercase font-light">
            {title} <span className="text-primary italic font-normal font-display-hero">— {accent}</span>
          </h1>
          <p className="font-body-lg text-body-md text-on-surface-variant leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-space-md">{children}</div>}
    </header>
  )
}
