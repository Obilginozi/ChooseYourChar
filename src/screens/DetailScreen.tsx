import { useCallback, useEffect, useMemo, useState } from 'react'
import { DialogueBox } from '../components/DialogueBox'
import { PixelButton } from '../components/PixelButton'
import { PixelPortrait } from '../components/PixelPortrait'
import { getCharacterById } from '../data/characters'
import { useIsMobile } from '../hooks/useIsMobile'
import { useJokeCarousel } from '../hooks/useJokeCarousel'
import { useSwipe } from '../hooks/useSwipe'

interface DetailScreenProps {
  characterId: string
  onBack: () => void
}

export function DetailScreen({ characterId, onBack }: DetailScreenProps) {
  const character = getCharacterById(characterId)
  const jokeCount = character?.jokes.length ?? 0
  const { currentIndex, goNext, goPrev } = useJokeCarousel({ jokeCount })
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const canNavigate = jokeCount > 1

  const swipeHandlers = useSwipe(
    useMemo(
      () => ({
        onSwipeLeft: isMobile && canNavigate ? goNext : undefined,
        onSwipeRight: isMobile && canNavigate ? goPrev : undefined,
      }),
      [isMobile, canNavigate, goNext, goPrev],
    ),
  )

  const currentJoke = character?.jokes[currentIndex] ?? ''

  const handleCopy = useCallback(async () => {
    if (!currentJoke) return
    try {
      await navigator.clipboard.writeText(currentJoke)
      setCopyFeedback('Copied!')
      setTimeout(() => setCopyFeedback(null), 2000)
    } catch {
      setCopyFeedback('Failed')
      setTimeout(() => setCopyFeedback(null), 2000)
    }
  }, [currentJoke])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          goPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          goNext()
          break
        case 'Escape':
          e.preventDefault()
          onBack()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, onBack])

  if (!character) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
        <p className="font-body text-2xl text-[#a89b7a]">Character not found.</p>
        <PixelButton onClick={onBack}>GERİ</PixelButton>
      </div>
    )
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col p-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-4 pixel-border"
        style={{ borderColor: character.accentColor }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
        <div className="flex shrink-0 flex-col items-center gap-3 lg:w-1/3">
          <PixelPortrait
            spriteSrc={character.spriteSrc}
            accentColor={character.accentColor}
            characterId={character.id}
            size={192}
          />
          <p
            className="font-header text-center text-[10px] sm:text-xs"
            style={{ color: character.accentColor }}
          >
            {character.name}
          </p>
          <p className="font-body text-center text-lg text-[#a89b7a]">
            {character.tagline}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <DialogueBox
            text={currentJoke}
            characterName={character.name}
            accentColor={character.accentColor}
            jokeIndex={currentIndex}
            jokeTotal={jokeCount}
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <PixelButton
              onClick={goPrev}
              disabled={!canNavigate}
              accentColor={character.accentColor}
              aria-label="Previous joke"
            >
              ◀ PREV
            </PixelButton>
            <PixelButton
              onClick={goNext}
              disabled={!canNavigate}
              accentColor={character.accentColor}
              aria-label="Next joke"
            >
              NEXT ▶
            </PixelButton>
            <PixelButton
              onClick={handleCopy}
              variant="secondary"
              accentColor={character.accentColor}
            >
              {copyFeedback ?? 'COPY'}
            </PixelButton>
          </div>

          <div className="flex justify-center">
            <PixelButton onClick={onBack} variant="secondary">
              ← BACK TO SELECT
            </PixelButton>
          </div>

          <p className="text-center font-body text-base text-[#a89b7a] sm:hidden">
            Swipe left/right for jokes
          </p>
          <p className="hidden text-center font-body text-base text-[#a89b7a] sm:block">
            ← → prev/next joke · Esc back · auto-advances every 8s
          </p>
        </div>
      </div>
    </div>
  )
}
