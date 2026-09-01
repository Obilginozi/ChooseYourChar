import { useEffect, useRef, useState } from 'react'
import type { Character } from '../types/character'
import { PixelPortrait } from './PixelPortrait'
import { usePortraitSize } from '../hooks/usePortraitSize'

interface CharacterShowcaseProps {
  characters: Character[]
  selectedIndex: number
  isConfirming: boolean
  onSelect: (index: number) => void
  portraitRef: React.RefObject<HTMLDivElement | null>
}

type SlideDir = 'next' | 'prev'

interface SlideState {
  from: number
  to: number
  dir: SlideDir
}

const SLIDE_MS = 400

function portraitWidth(size: number, character: Character) {
  const sw = character.spriteWidth ?? 256
  const sh = character.spriteHeight ?? 256
  return Math.round(size * (sw / sh))
}

function CarouselPortrait({
  character,
  size,
}: {
  character: Character
  size: number
}) {
  return (
    <PixelPortrait
      spriteSrc={character.spriteSrc}
      accentColor={character.accentColor}
      characterId={character.id}
      spriteWidth={character.spriteWidth}
      spriteHeight={character.spriteHeight}
      size={size}
      animate={false}
    />
  )
}

export function CharacterShowcase({
  characters,
  selectedIndex,
  isConfirming,
  onSelect,
  portraitRef,
}: CharacterShowcaseProps) {
  const portraitSize = usePortraitSize()
  const character = characters[selectedIndex]
  const prevIndexRef = useRef(selectedIndex)
  const [slide, setSlide] = useState<SlideState | null>(null)
  const [isSliding, setIsSliding] = useState(false)

  useEffect(() => {
    if (selectedIndex === prevIndexRef.current) return

    const from = prevIndexRef.current
    const dir: SlideDir = selectedIndex > from ? 'next' : 'prev'
    const target = selectedIndex

    setSlide({ from, to: target, dir })
    setIsSliding(true)

    const timer = window.setTimeout(() => {
      prevIndexRef.current = target
      setSlide(null)
      setIsSliding(false)
    }, SLIDE_MS)

    return () => {
      window.clearTimeout(timer)
      prevIndexRef.current = target
    }
  }, [selectedIndex])

  if (!character) return null

  const viewportW = Math.max(
    portraitWidth(portraitSize, character),
    slide
      ? Math.max(
          portraitWidth(portraitSize, characters[slide.from]!),
          portraitWidth(portraitSize, characters[slide.to]!),
        )
      : 0,
  )

  const displayCharacter = slide
    ? characters[slide.to]!
    : character

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-2">
      <div
        ref={portraitRef}
        className={`character-carousel ${isConfirming ? 'character-confirm-scale z-20' : ''}`}
      >
        {isConfirming && (
          <div
            className="character-confirm-flash absolute inset-0 z-30"
            style={{ backgroundColor: displayCharacter.accentColor }}
            aria-hidden="true"
          />
        )}

        <div
          className="character-carousel-viewport"
          style={{ width: viewportW, height: portraitSize }}
        >
          {slide ? (
            <>
              <div
                className={`character-carousel-slide character-carousel-exit-${slide.dir}`}
                key={`exit-${characters[slide.from]?.id}`}
              >
                <CarouselPortrait
                  character={characters[slide.from]!}
                  size={portraitSize}
                />
              </div>
              <div
                className={`character-carousel-slide character-carousel-enter-${slide.dir}`}
                key={`enter-${characters[slide.to]?.id}`}
              >
                <CarouselPortrait
                  character={characters[slide.to]!}
                  size={portraitSize}
                />
              </div>
            </>
          ) : (
            <div className="character-carousel-slide character-carousel-current character-idle">
              <CarouselPortrait character={character} size={portraitSize} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-2" aria-hidden="true">
        {characters.map((c, index) => (
          <button
            key={c.id}
            type="button"
            onClick={() => !isSliding && onSelect(index)}
            disabled={isSliding}
            className="min-h-[20px] min-w-[20px] border-0 p-1 disabled:opacity-40"
            aria-label={`Select ${c.name}`}
          >
            <span
              className="block h-2.5 w-2.5 sm:h-3 sm:w-3"
              style={{
                backgroundColor:
                  selectedIndex === index ? c.accentColor : '#333',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
