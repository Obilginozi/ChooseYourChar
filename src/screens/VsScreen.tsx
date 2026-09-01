import { useCallback, useEffect, useState } from 'react'
import { CharacterStatBars } from '../components/CharacterStatBars'
import { PixelButton } from '../components/PixelButton'
import { PixelPortrait } from '../components/PixelPortrait'
import { ScreenFrame } from '../components/ScreenFrame'
import { VsBattleGame } from '../components/VsBattleGame'
import { characters } from '../data/characters'
import { usePortraitSize } from '../hooks/usePortraitSize'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSound } from '../hooks/useSound'
import type { Character } from '../types/character'

interface VsScreenProps {
  initialLeftIndex?: number
  onBack: () => void
}

function FighterPanel({
  character,
  label,
  onPrev,
  onNext,
  portraitSize,
  compact = false,
}: {
  character: Character
  label: string
  onPrev: () => void
  onNext: () => void
  portraitSize: number
  compact?: boolean
}) {
  const size = compact ? Math.round(portraitSize * 0.5) : Math.round(portraitSize * 0.75)

  return (
    <div className="flex flex-1 flex-col items-center gap-1 min-w-0 sm:gap-2">
      <span className="font-header text-[8px] text-[#a89b7a]">{label}</span>
      <div className="character-idle">
        <PixelPortrait
          spriteSrc={character.spriteSrc}
          accentColor={character.accentColor}
          characterId={character.id}
          spriteWidth={character.spriteWidth}
          spriteHeight={character.spriteHeight}
          size={size}
          animate={false}
        />
      </div>
      <p
        className="font-body text-center text-base sm:text-xl"
        style={{ color: character.accentColor }}
      >
        {character.name}
      </p>
      <CharacterStatBars
        stats={character.stats}
        accentColor={character.accentColor}
        compact
      />
      <p className="font-body hidden text-center text-base leading-snug text-[#F5E6C8] sm:block sm:text-lg px-1">
        {character.tagline}
      </p>
      <div className="flex gap-2">
        <PixelButton
          onClick={onPrev}
          accentColor={character.accentColor}
          aria-label={`Previous ${label} fighter`}
        >
          ◀
        </PixelButton>
        <PixelButton
          onClick={onNext}
          accentColor={character.accentColor}
          aria-label={`Next ${label} fighter`}
        >
          ▶
        </PixelButton>
      </div>
    </div>
  )
}

export function VsScreen({ initialLeftIndex = 0, onBack }: VsScreenProps) {
  const portraitSize = usePortraitSize()
  const isMobile = useIsMobile()
  const { playSfx } = useSound()
  const [phase, setPhase] = useState<'pick' | 'fight'>('pick')
  const [leftIndex, setLeftIndex] = useState(initialLeftIndex)
  const [rightIndex, setRightIndex] = useState(() =>
    characters.length > 1 ? (initialLeftIndex + 1) % characters.length : 0,
  )

  const left = characters[leftIndex]!
  const right = characters[rightIndex]!

  const cycle = useCallback((side: 'left' | 'right', delta: number) => {
    playSfx('cursor')
    if (side === 'left') {
      setLeftIndex((i) => (i + delta + characters.length) % characters.length)
    } else {
      setRightIndex((i) => (i + delta + characters.length) % characters.length)
    }
  }, [playSfx])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onBack])

  const startFight = useCallback(() => {
    playSfx('start')
    setPhase('fight')
  }, [playSfx])

  if (phase === 'fight') {
    return (
      <VsBattleGame
        player={left}
        cpu={right}
        onExit={() => setPhase('pick')}
      />
    )
  }

  return (
    <ScreenFrame className="min-h-0">
      <header className="screen-header relative z-10 mb-2 mt-1 text-center sm:mb-4 sm:mt-4">
        <h1 className="font-header text-xs sm:text-sm" style={{ color: '#FFD700' }}>
          VERSUS
        </h1>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-stretch justify-center gap-2 overflow-y-auto sm:flex-row sm:items-start sm:gap-2">
        <FighterPanel
          character={left}
          label="PLAYER 1"
          portraitSize={portraitSize}
          compact={isMobile}
          onPrev={() => cycle('left', -1)}
          onNext={() => cycle('left', 1)}
        />

        <div className="flex shrink-0 flex-col items-center justify-center py-1 sm:py-16">
          <span
            className="font-header text-2xl sm:text-3xl"
            style={{
              color: '#E74C3C',
              textShadow: '3px 3px 0 #000',
            }}
          >
            VS
          </span>
        </div>

        <FighterPanel
          character={right}
          label="PLAYER 2"
          portraitSize={portraitSize}
          compact={isMobile}
          onPrev={() => cycle('right', -1)}
          onNext={() => cycle('right', 1)}
        />
      </div>

      <footer className="relative z-10 mt-2 flex shrink-0 flex-col items-center gap-2 sm:mt-4 sm:flex-row sm:justify-center sm:gap-3">
        <PixelButton onClick={startFight} accentColor="#E74C3C">
          FIGHT!
        </PixelButton>
        <PixelButton onClick={onBack} variant="secondary">
          BACK
        </PixelButton>
      </footer>
    </ScreenFrame>
  )
}
