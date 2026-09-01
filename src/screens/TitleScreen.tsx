import { useEffect, useState } from 'react'
import { ScreenFrame } from '../components/ScreenFrame'

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
  onAbout: () => void
}

export function TitleScreen({ onStart, onAbout }: TitleScreenProps) {
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
    <ScreenFrame className="w-full items-center justify-center">
      <Starfield />

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        aria-hidden="true"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,215,0,0.1) 2px, rgba(255,215,0,0.1) 4px)',
        }}
      />

      <p
        className="screen-header absolute left-0 right-0 top-[max(1.25rem,env(safe-area-inset-top))] z-10 text-center font-body text-lg text-[#a89b7a]"
        aria-hidden="true"
      >
        INSERT COIN
      </p>

      <button
        type="button"
        onClick={onStart}
        className="relative z-10 flex cursor-pointer flex-col items-center gap-8 border-0 bg-transparent text-center outline-none"
        aria-label="Start game"
      >
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
            OUZAN
          </h1>
        </div>

        <p
          className="font-header animate-blink text-xs sm:text-sm"
          style={{ color: '#F5E6C8' }}
        >
          {isTouch ? '▶ TAP TO CONTINUE ◀' : '▶ PRESS START TO CONTINUE ◀'}
        </p>
      </button>

      <button
        type="button"
        onClick={onAbout}
        className="relative z-10 mt-8 font-header text-[8px] text-[#a89b7a] underline-offset-4 hover:text-[#FFD700] hover:underline"
      >
        CREDITS & STATS
      </button>

      <p
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 z-10 text-center font-body text-sm text-[#555]"
        aria-hidden="true"
      >
        © 2026 OUZANSOFT — FREE PLAY
      </p>
    </ScreenFrame>
  )
}
