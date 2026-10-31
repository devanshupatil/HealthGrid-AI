import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SIZES = {
  default: {
    btn: 'h-12 ps-6 pe-14 hover:ps-14 hover:pe-6',
    dot: 'w-10 h-10 group-hover:right-[calc(100%-44px)]',
  },
  sm: {
    btn: 'h-8 ps-5 pe-12 hover:ps-12 hover:pe-5',
    dot: 'w-6 h-6 group-hover:right-[calc(100%-36px)]',
  },
}

// Pill button: the round icon slides across and the label shifts on hover.
export default function ButtonWithIcon({ children = "Let's Collaborate", size = 'default', className = '', ...props }) {
  const s = SIZES[size]
  return (
    <Button
      className={`relative text-sm font-medium rounded-full p-1 group transition-all duration-500 w-fit overflow-hidden cursor-pointer ${s.btn} ${className}`}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500">{children}</span>
      <div className={`absolute right-1 bg-surface-container-lowest text-primary rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-45 ${s.dot}`}>
        <ArrowUpRight size={16} />
      </div>
    </Button>
  )
}
