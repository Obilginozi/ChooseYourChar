import { useCallback, useEffect, useRef, useState } from 'react'
import { CharacterShowcase } from '../components/CharacterShowcase'
import { CharacterStatBars } from '../components/CharacterStatBars'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { PixelButton } from '../components/PixelButton'
import { ScreenFrame } from '../components/ScreenFrame'
import { characters, getCharacterIndexById } from '../data/characters'
import { useKeyboardNav } from '../hooks/useKeyboardNav'
import { useSound } from '../hooks/useSound'
import { useSwipe } from '../hooks/useSwipe'
import { getLastCharacterId, setLastCharacterId } from '../lib/lastCharacter'

interface SelectScreenProps {
  onBack: () => void
  onConfirm: (characterId: string) => void
  onVs: () => void
}

function resolveInitialIndex(): number {
  const lastId = getLastCharacterId()
  if (!lastId) return 0
  const idx = getCharacterIndexById(lastId)
  return idx >= 0 ? idx : 0
}

export function SelectScreen({ onBack, onConfirm, onVs }: SelectScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(resolveInitialIndex)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 0.5, y: 0.5 })
  const [confettiColors, setConfettiColors] = useState<string[]>(['#FFD700'])
  const [isCarouselSliding, setIsCarouselSliding] = useState(false)
  const portraitRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const { playSfx, playCharacterConfirm } = useSound()

  const selectedCharacter = characters[selectedIndex]
  const pinnedId = getLastCharacterId()

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
    const c = characters[index]
    if (c) setLastCharacterId(c.id)
  }, [])

  const goToPrev = useCallback(() => {
    handleSelect(Math.max(0, selectedIndex - 1))
  }, [handleSelect, selectedIndex])

  const goToNext = useCallback(() => {
    handleSelect(Math.min(characters.length - 1, selectedIndex + 1))
  }, [handleSelect, selectedIndex])

  const handleRandom = useCallback(() => {
    if (isConfirming || characters.length === 0) return
    if (characters.length === 1) {
      handleSelect(0)
      return
    }
    let next = selectedIndex
    while (next === selectedIndex) {
      next = Math.floor(Math.random() * characters.length)
    }
    handleSelect(next)
  }, [isConfirming, selectedIndex, handleSelect])

  const swipeHandlers = useSwipe({
    onSwipeLeft: isCarouselSliding || isConfirming ? undefined : goToNext,
    onSwipeRight: isCarouselSliding || isConfirming ? undefined : goToPrev,
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

      setLastCharacterId(character.id)
      playCharacterConfirm(character.id)

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
    [isConfirming, onConfirm, playCharacterConfirm],
  )

  useEffect(() => {
    if (isConfirming) return

    const handleRandomKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        handleRandom()
      }
    }

    window.addEventListener('keydown', handleRandomKey)
    return () => window.removeEventListener('keydown', handleRandomKey)
  }, [isConfirming, handleRandom])

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
    <ScreenFrame
      className={isShaking ? 'screen-shake' : ''}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <header className="screen-header relative z-10 mt-2 mb-1 text-center sm:mt-4">
        <h1
          className="font-header text-xs sm:text-sm"
          style={{ color: '#FFD700' }}
        >
          SELECT CHARACTER
        </h1>
        {pinnedId && selectedCharacter?.id === pinnedId && (
          <p className="font-body mt-0.5 text-xs text-[#1ABC9C]">★ LAST PICK</p>
        )}
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 sm:gap-3">
        <CharacterShowcase
          characters={characters}
          selectedIndex={selectedIndex}
          isConfirming={isConfirming}
          onSelect={handleSelect}
          onSlidingChange={setIsCarouselSliding}
          portraitRef={portraitRef}
        />

        {selectedCharacter && (
          <div
            className="flex w-full max-w-2xl flex-col items-center gap-1.5 px-2 py-2 sm:px-3"
            style={{
              borderTop: `2px solid ${selectedCharacter.accentColor}`,
              borderBottom: `2px solid ${selectedCharacter.accentColor}`,
              backgroundColor: '#1a1a2e',
            }}
          >
            <div className="flex w-full max-w-md flex-col items-center gap-1.5 sm:flex-row sm:justify-between sm:gap-3">
              <p
                className="font-body shrink-0 text-lg sm:text-xl"
                style={{ color: selectedCharacter.accentColor }}
              >
                {selectedCharacter.name}
              </p>
              <CharacterStatBars
                stats={selectedCharacter.stats}
                accentColor={selectedCharacter.accentColor}
              />
            </div>
            <p className="font-body text-center text-base leading-snug text-[#F5E6C8] sm:text-lg">
              {selectedCharacter.tagline}
            </p>
          </div>
        )}
      </div>

      <footer className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <PixelButton
          onClick={() => handleConfirm(selectedIndex)}
          disabled={isConfirming}
        >
          CONFIRM
        </PixelButton>
        <PixelButton
          onClick={handleRandom}
          variant="secondary"
          disabled={isConfirming}
          aria-label="Pick random character"
        >
          RANDOM
        </PixelButton>
        <PixelButton
          onClick={onVs}
          variant="secondary"
          disabled={isConfirming}
        >
          VS
        </PixelButton>
        <PixelButton onClick={onBack} variant="secondary" disabled={isConfirming}>
          BACK
        </PixelButton>
      </footer>

      <p className="relative z-10 mt-1 text-center font-body text-sm text-[#a89b7a] sm:hidden">
        Tap dots or swipe · RANDOM picks for you
      </p>
      <p className="relative z-10 mt-2 hidden text-center font-body text-base text-[#a89b7a] sm:block">
        ← → change · Enter confirm · R random · Esc back
      </p>

      <ConfettiBurst
        active={showConfetti}
        colors={confettiColors}
        originX={confettiOrigin.x}
        originY={confettiOrigin.y}
        onComplete={() => setShowConfetti(false)}
      />
    </ScreenFrame>
  )
}
