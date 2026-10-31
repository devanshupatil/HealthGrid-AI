import { useEffect, useRef } from 'react'

// Animated luxury backdrop: drifting gold glows, a faint grid, and floating gold dust.
export default function LuxBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, raf
    const dust = []

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.min(70, Math.round((w * h) / 22000))
      dust.length = 0
      for (let i = 0; i < n; i++) {
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vy: -(Math.random() * 0.25 + 0.05),
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.15,
          p: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dust) {
        if (!reduce) {
          d.x += d.vx
          d.y += d.vy
          if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w }
          if (d.x < -4) d.x = w + 4
          if (d.x > w + 4) d.x = -4
        }
        const tw = 0.6 + 0.4 * Math.sin(t / 1100 + d.p)
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(242,202,80,${d.a * tw})`
        ctx.shadowColor = 'rgba(242,202,80,0.8)'
        ctx.shadowBlur = 8
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="lux-grid absolute inset-0" />
      <div className="lux-orb lux-orb-a" />
      <div className="lux-orb lux-orb-b" />
      <div className="lux-orb lux-orb-c" />
      <canvas ref={ref} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(9,14,23,0.7)_100%)]" />
    </div>
  )
}
