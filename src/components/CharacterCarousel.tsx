import { useCallback, useEffect, useRef } from 'react'
import type { Character } from '../types/character'
import { CharacterCard } from './CharacterCard'

interface CharacterCarouselProps {
  characters: Character[]
  selectedIndex: number
  isConfirming: boolean
  onSelect: (index: number) => void
  cardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>
}

export function CharacterCarousel({
  characters,
  selectedIndex,
  isConfirming,
  onSelect,
  cardRefs,
}: CharacterCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const container = scrollRef.current
    const slide = container?.children[index] as HTMLElement | undefined
    if (!slide || !container) return

    isScrolling.current = true
    const offset =
      slide.offsetLeft - (container.clientWidth - slide.offsetWidth) / 2
    container.scrollTo({
      left: offset,
      behavior: smooth ? 'smooth' : 'auto',
    })

    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      isScrolling.current = false
    }, smooth ? 350 : 50)
  }, [])

  useEffect(() => {
    scrollToIndex(selectedIndex)
  }, [selectedIndex, scrollToIndex])

  const syncIndexFromScroll = useCallback(() => {
    if (isScrolling.current) return

    const container = scrollRef.current
    if (!container) return

    const center = container.scrollLeft + container.clientWidth / 2
    let closest = 0
    let minDist = Infinity

    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement
      const elCenter = el.offsetLeft + el.offsetWidth / 2
      const dist = Math.abs(center - elCenter)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })

    if (closest !== selectedIndex) {
      onSelect(closest)
    }
  }, [onSelect, selectedIndex])

  const handleScroll = useCallback(() => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(syncIndexFromScroll, 80)
  }, [syncIndexFromScroll])

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-[calc(50%-80px)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="listbox"
        aria-label="Character carousel"
      >
        {characters.map((character, index) => (
          <div
            key={character.id}
            className="w-[160px] shrink-0 snap-center"
          >
            <CharacterCard
              ref={(el) => {
                cardRefs.current[index] = el
              }}
              character={character}
              isSelected={selectedIndex === index}
              isConfirming={isConfirming && selectedIndex === index}
              onSelect={() => onSelect(index)}
              portraitSize={96}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {characters.map((character, index) => (
          <button
            key={character.id}
            type="button"
            onClick={() => onSelect(index)}
            className="min-h-[12px] min-w-[12px] border-0 p-1"
            aria-label={`Select ${character.name}`}
          >
            <span
              className="block h-2 w-2"
              style={{
                backgroundColor:
                  selectedIndex === index ? character.accentColor : '#333',
              }}
            />
          </button>
        ))}
      </div>

      <p className="mt-2 text-center font-body text-base text-[#a89b7a]">
        Swipe to browse
      </p>
    </div>
  )
}
