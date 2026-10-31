import Icon from './Icon'

export default function Medallion({ icon }) {
  return (
    <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-full items-center justify-center bg-primary/10 border border-primary/40 shadow-[0_0_32px_rgba(242,202,80,0.25)]">
      <Icon name={icon} className="text-primary text-[30px]" />
    </div>
  )
}
