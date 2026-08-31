import { useEffect, useState } from 'react'

interface ScreenTransitionProps {
  active: boolean
  onComplete: () => void
  color?: string
}

export function ScreenTransition({
  active,
  onComplete,
  color = '#FFD700',
}: ScreenTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'flash' | 'wipe'>('idle')

  useEffect(() => {
    if (!active) {
      setPhase('idle')
      return
    }

    setPhase('flash')
    const flashTimer = setTimeout(() => setPhase('wipe'), 100)
    const completeTimer = setTimeout(() => {
      setPhase('idle')
      onComplete()
    }, 400)

    return () => {
      clearTimeout(flashTimer)
      clearTimeout(completeTimer)
    }
  }, [active, onComplete])

  if (phase === 'idle') return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {phase === 'flash' && (
        <div
          className="absolute inset-0 screen-transition-flash"
          style={{ backgroundColor: color }}
        />
      )}
      {phase === 'wipe' && (
        <div
          className="absolute inset-0 screen-transition-wipe"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              ${color} 0px,
              ${color} 8px,
              #0D0D1A 8px,
              #0D0D1A 16px
            )`,
          }}
        />
      )}
    </div>
  )
}
