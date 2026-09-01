import { useCallback, useEffect, useMemo, useState } from 'react'
import { DialogueBox } from '../components/DialogueBox'
import { PixelButton } from '../components/PixelButton'
import { PixelPortrait } from '../components/PixelPortrait'
import { ScreenFrame } from '../components/ScreenFrame'
import { getCharacterById } from '../data/characters'
import { useTouchDevice } from '../hooks/useTouchDevice'
import { useJokeCarousel } from '../hooks/useJokeCarousel'
import { usePortraitSize } from '../hooks/usePortraitSize'
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
  const isTouch = useTouchDevice()
  const portraitSize = usePortraitSize('detail')
  const canNavigate = jokeCount > 1

  const swipeHandlers = useSwipe(
    useMemo(
      () => ({
        onSwipeLeft: isTouch && canNavigate ? goNext : undefined,
        onSwipeRight: isTouch && canNavigate ? goPrev : undefined,
      }),
      [isTouch, canNavigate, goNext, goPrev],
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
        <PixelButton onClick={onBack}>BACK</PixelButton>
      </div>
    )
  }

  return (
    <ScreenFrame
      borderColor={character.accentColor}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-3 sm:px-5 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
        <div className="flex shrink-0 flex-col items-center gap-4 lg:w-[38%]">
          <PixelPortrait
            key={character.id}
            spriteSrc={character.spriteSrc}
            accentColor={character.accentColor}
            characterId={character.id}
            spriteWidth={character.spriteWidth}
            spriteHeight={character.spriteHeight}
            size={portraitSize}
          />
          <p
            className="font-body text-center text-xl sm:text-2xl"
            style={{ color: character.accentColor }}
          >
            {character.name}
          </p>
          <p className="font-body text-center text-xl text-[#a89b7a] sm:text-2xl">
            {character.tagline}
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 lg:max-w-2xl lg:flex-1 lg:self-center">
          <div className="mr-auto w-full max-w-[min(100%,36rem)]">
            <DialogueBox
              text={currentJoke}
              characterName={character.name}
              accentColor={character.accentColor}
              jokeIndex={currentIndex}
              jokeTotal={jokeCount}
            />
          </div>

          <div className="mr-auto flex w-full max-w-[min(100%,36rem)] flex-wrap items-center justify-center gap-3 sm:justify-start">
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
            <PixelButton onClick={onBack} variant="secondary">
              ← BACK TO SELECT
            </PixelButton>
          </div>

          <p className="mr-auto w-full max-w-[min(100%,36rem)] text-center font-body text-base text-[#a89b7a] sm:text-left lg:hidden">
            Swipe left/right for jokes
          </p>
          <p className="mr-auto hidden w-full max-w-[min(100%,36rem)] font-body text-base text-[#a89b7a] sm:block">
            ← → prev/next joke · Esc back · auto-advances every 4s
          </p>
        </div>
      </div>
    </ScreenFrame>
  )
}
