import { useCallback, useEffect, useRef, useState } from 'react'
import { CharacterShowcase } from '../components/CharacterShowcase'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { PixelButton } from '../components/PixelButton'
import { characters } from '../data/characters'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import { useSound } from '../hooks/useSound'
import { useSwipe } from '../hooks/useSwipe'

interface SelectScreenProps {
  onBack: () => void
  onConfirm: (characterId: string) => void
}

export function SelectScreen({ onBack, onConfirm }: SelectScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0.5, y: 0.5 })
  const [confettiColors, setConfettiColors] = useState<string[]>(['#FFD700'])
  const portraitRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const { playSfx } = useSound()

  const selectedCharacter = characters[selectedIndex]

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const goToPrev = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1))
  }, [])

  const goToNext = useCallback(() => {
    setSelectedIndex((i) => Math.min(characters.length - 1, i + 1))
  }, [])

  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
  })

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    playSfx('cursor')
  }, [selectedIndex, playSfx])

  const handleConfirm = useCallback(
    (index: number) => {
      if (isConfirming) return
      const character = characters[index]
      if (!character) return

      const el = portraitRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        setConfettiOrigin({
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        })
      }

      setConfettiColors([
        character.accentColor,
        '#FFD700',
        '#FF69B4',
        '#00FF88',
        '#FFFFFF',
      ])
      setShowConfetti(true)
      setIsConfirming(true)
      setIsShaking(true)

      setTimeout(() => onConfirm(character.id), 450)
      setTimeout(() => setIsShaking(false), 250)
    },
    [isConfirming, onConfirm],
  )

  useKeyboardNav({
    itemCount: characters.length,
    columns: 1,
    selectedIndex,
    onSelect: handleSelect,
    onConfirm: handleConfirm,
    onEscape: onBack,
    enabled: !isConfirming,
  })

  return (
    <div
      className={`relative flex min-h-dvh flex-col p-4 ${isShaking ? 'screen-shake' : ''}`}
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-4 pixel-border"
        style={{ borderColor: '#FFD700' }}
        aria-hidden="true"
      />

      <header className="relative z-10 mb-2 text-center">
        <h1
          className="font-header text-xs sm:text-sm"
          style={{ color: '#FFD700' }}
        >
          KARAKTER SEÇ
        </h1>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4">
        <CharacterShowcase
          characters={characters}
          selectedIndex={selectedIndex}
          isConfirming={isConfirming}
          onPrev={goToPrev}
          onNext={goToNext}
          onSelect={handleSelect}
          portraitRef={portraitRef}
        />

        {selectedCharacter && (
          <div
            className="w-full max-w-2xl px-3 py-3 text-center"
            style={{
              borderTop: `2px solid ${selectedCharacter.accentColor}`,
              borderBottom: `2px solid ${selectedCharacter.accentColor}`,
              backgroundColor: '#1a1a2e',
            }}
          >
            <p
              className="font-header mb-2 text-[10px] sm:text-sm"
              style={{ color: selectedCharacter.accentColor }}
            >
              {selectedCharacter.name}
            </p>
            <p className="font-body text-xl leading-snug text-[#F5E6C8] sm:text-2xl">
              {selectedCharacter.tagline}
            </p>
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-3 flex flex-wrap items-center justify-center gap-3">
        <PixelButton
          onClick={() => handleConfirm(selectedIndex)}
          disabled={isConfirming}
          accentColor={selectedCharacter?.accentColor}
        >
          ONAYLA
        </PixelButton>
        <PixelButton onClick={onBack} variant="secondary" disabled={isConfirming}>
          GERİ
        </PixelButton>
      </footer>

      <p className="relative z-10 mt-2 hidden text-center font-body text-base text-[#a89b7a] sm:block">
        ← → change character · Enter confirm · Esc back
      </p>

      <ConfettiBurst
        active={showConfetti}
        colors={confettiColors}
        originX={confettiOrigin.x}
        originY={confettiOrigin.y}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  )
}
