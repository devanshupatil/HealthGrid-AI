import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Label fades out and the icon strip widens to fill the button on hover.
export function LogoutButton({ className = '', ...props }) {
  return (
    <Button className={`group relative overflow-hidden ${className}`} {...props}>
      <span className="w-20 translate-x-2 transition-opacity duration-500 group-hover:opacity-0">Logout</span>
      <i className="absolute inset-0 z-10 grid w-1/4 place-items-center bg-surface-container-lowest/15 transition-all duration-500 group-hover:w-full">
        <LogOut className="opacity-70" size={16} strokeWidth={2} aria-hidden="true" />
      </i>
    </Button>
  )
}
