import { useEffect, useState } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.7 ? 3 : 2,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }))
}

export function Starfield() {
  const [stars] = useState(() => generateStars(60))

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches)
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onStart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStart])

  return (
    <button
      type="button"
      onClick={onStart}
      className="relative flex min-h-dvh w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent p-4 outline-none"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      aria-label="Start game"
    >
      <Starfield />

      <div
        className="absolute inset-4 pointer-events-none pixel-border"
        style={{ borderColor: '#FFD700' }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,215,0,0.1) 2px, rgba(255,215,0,0.1) 4px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-4">
          <h1
            className="font-header text-xl leading-relaxed sm:text-2xl md:text-3xl lg:text-4xl"
            style={{
              color: '#FFD700',
              textShadow:
                '3px 3px 0 #8B6914, 6px 6px 0 #000, 0 0 20px rgba(255,215,0,0.3)',
            }}
          >
            CHOOSE YOUR
          </h1>
          <h1
            className="font-header text-xl leading-relaxed sm:text-2xl md:text-3xl lg:text-4xl"
            style={{
              color: '#FFD700',
              textShadow:
                '3px 3px 0 #8B6914, 6px 6px 0 #000, 0 0 20px rgba(255,215,0,0.3)',
            }}
          >
            CHARACTER
          </h1>
        </div>

        <p
          className="font-header animate-blink text-xs sm:text-sm"
          style={{ color: '#F5E6C8' }}
        >
          {isTouch ? '▶ DOKUN BAŞLA ◀' : '▶ PRESS START ◀'}
        </p>
      </div>
    </button>
  )
}
