import type { Character } from '../types/character'
import { NavArrow } from './NavArrow'
import { PixelPortrait } from './PixelPortrait'
import { usePortraitSize } from '../hooks/usePortraitSize'

interface CharacterShowcaseProps {
  characters: Character[]
  selectedIndex: number
  isConfirming: boolean
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
  portraitRef: React.RefObject<HTMLDivElement | null>
}

export function CharacterShowcase({
  characters,
  selectedIndex,
  isConfirming,
  onPrev,
  onNext,
  onSelect,
  portraitRef,
}: CharacterShowcaseProps) {
  const portraitSize = usePortraitSize()
  const character = characters[selectedIndex]
  if (!character) return null

  const atStart = selectedIndex === 0
  const atEnd = selectedIndex === characters.length - 1

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="flex w-full items-center justify-center gap-3 sm:gap-6">
        <NavArrow
          direction="left"
          onClick={onPrev}
          disabled={atStart || isConfirming}
          accentColor={character.accentColor}
          label="Previous character"
        />

        <div
          ref={portraitRef}
          className={`relative flex flex-col items-center ${isConfirming ? 'character-confirm-scale z-20' : ''}`}
          style={{
            filter: `drop-shadow(0 0 16px ${character.accentColor}55)`,
          }}
        >
          {isConfirming && (
            <div
              className="character-confirm-flash absolute inset-0 z-10"
              style={{ backgroundColor: character.accentColor }}
              aria-hidden="true"
            />
          )}
          <PixelPortrait
            spriteSrc={character.spriteSrc}
            accentColor={character.accentColor}
            characterId={character.id}
            size={portraitSize}
          />
        </div>

        <NavArrow
          direction="right"
          onClick={onNext}
          disabled={atEnd || isConfirming}
          accentColor={character.accentColor}
          label="Next character"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-2" aria-hidden="true">
        {characters.map((c, index) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(index)}
            className="min-h-[20px] min-w-[20px] border-0 p-1"
            aria-label={`Select ${c.name}`}
          >
            <span
              className="block h-2.5 w-2.5 sm:h-3 sm:w-3"
              style={{
                backgroundColor:
                  selectedIndex === index ? c.accentColor : '#333',
                boxShadow:
                  selectedIndex === index
                    ? `0 0 6px ${c.accentColor}`
                    : undefined,
              }}
            />
          </button>
        ))}
      </div>

      <p className="font-body text-center text-base text-[#a89b7a] sm:hidden">
        Kaydır veya oklara dokun
      </p>
    </div>
  )
}
