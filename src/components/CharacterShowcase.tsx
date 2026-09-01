import { useEffect, useRef, useState } from 'react'
import type { Character } from '../types/character'
import { usePortraitSize } from '../hooks/usePortraitSize'
import { useTouchDevice } from '../hooks/useTouchDevice'
import { PixelPortrait } from './PixelPortrait'

interface CharacterShowcaseProps {
  characters: Character[]
  selectedIndex: number
  isConfirming: boolean
  onSelect: (index: number) => void
  onSlidingChange?: (sliding: boolean) => void
  portraitRef: React.RefObject<HTMLDivElement | null>
}

type SlideDir = 'next' | 'prev'

interface SlideState {
  from: number
  to: number
  dir: SlideDir
}

const SLIDE_MS_DESKTOP = 400
const SLIDE_MS_TOUCH = 260
const DRAG_COMMIT_PX = 52

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
  onSlidingChange,
  portraitRef,
}: CharacterShowcaseProps) {
  const isTouch = useTouchDevice()
  const slideMs = isTouch ? SLIDE_MS_TOUCH : SLIDE_MS_DESKTOP
  const portraitSize = usePortraitSize()
  const character = characters[selectedIndex]
  const prevIndexRef = useRef(selectedIndex)
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStartXRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const dragActiveRef = useRef(false)
  const [slide, setSlide] = useState<SlideState | null>(null)
  const [isSliding, setIsSliding] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    onSlidingChange?.(isSliding)
  }, [isSliding, onSlidingChange])

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
    }, slideMs)

    return () => {
      window.clearTimeout(timer)
      prevIndexRef.current = target
    }
  }, [selectedIndex, slideMs])

  useEffect(() => {
    if (!isTouch) return
    const el = viewportRef.current
    if (!el) return

    const finishDrag = () => {
      if (!dragActiveRef.current) return
      dragActiveRef.current = false
      setIsDragging(false)

      const dx = dragOffsetRef.current
      dragOffsetRef.current = 0
      setDragOffset(0)

      if (isSliding || isConfirming) return

      if (dx < -DRAG_COMMIT_PX && selectedIndex < characters.length - 1) {
        onSelect(selectedIndex + 1)
      } else if (dx > DRAG_COMMIT_PX && selectedIndex > 0) {
        onSelect(selectedIndex - 1)
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      if (isSliding || isConfirming) return
      e.stopPropagation()
      dragActiveRef.current = true
      dragStartXRef.current = e.touches[0].clientX
      dragOffsetRef.current = 0
      setIsDragging(true)
      setDragOffset(0)
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!dragActiveRef.current || isSliding) return
      const dx = e.touches[0].clientX - dragStartXRef.current
      if (Math.abs(dx) > 8) e.preventDefault()
      dragOffsetRef.current = dx
      setDragOffset(dx)
    }

    const onTouchEnd = (e: TouchEvent) => {
      e.stopPropagation()
      finishDrag()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [characters.length, isConfirming, isSliding, isTouch, onSelect, selectedIndex])

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
        className={`character-carousel ${isTouch ? 'character-carousel-touch' : ''} ${isConfirming ? 'character-confirm-scale z-20' : ''}`}
      >
        {isConfirming && (
          <div
            className="character-confirm-flash absolute inset-0 z-30"
            style={{ backgroundColor: displayCharacter.accentColor }}
            aria-hidden="true"
          />
        )}

        <div
          ref={viewportRef}
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
            <div
              className="character-carousel-slide character-carousel-current character-idle"
              style={{
                transform:
                  dragOffset !== 0
                    ? `translate3d(${dragOffset}px, 0, 0)`
                    : undefined,
                transition: isDragging ? 'none' : undefined,
              }}
            >
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
