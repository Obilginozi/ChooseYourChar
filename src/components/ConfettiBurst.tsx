import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  life: number
}

interface ConfettiBurstProps {
  active: boolean
  colors: string[]
  originX?: number
  originY?: number
  onComplete?: () => void
}

const DURATION_MS = 1200
const PARTICLE_COUNT = 48

export function ConfettiBurst({
  active,
  colors,
  originX = 0.5,
  originY = 0.5,
  onComplete,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const ox = canvas.width * originX
    const oy = canvas.height * originY

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 8
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.floor(Math.random() * 4),
        life: 1,
      }
    })

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = elapsed / DURATION_MS

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.35
        p.life = 1 - progress

        if (p.life <= 0) continue

        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      ctx.globalAlpha = 1

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active, colors, originX, originY, onComplete])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[90]"
      aria-hidden="true"
    />
  )
}
