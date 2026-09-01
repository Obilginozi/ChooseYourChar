import { forwardRef } from 'react'
import type { Character } from '../types/character'
import { PixelPortrait } from './PixelPortrait'

interface CharacterCardProps {
  character: Character
  isSelected: boolean
  isConfirming: boolean
  onSelect: () => void
  portraitSize?: number
}

export const CharacterCard = forwardRef<HTMLButtonElement, CharacterCardProps>(
  function CharacterCard(
    { character, isSelected, isConfirming, onSelect, portraitSize = 64 },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        className={`relative flex min-h-[100px] min-w-[72px] cursor-pointer flex-col items-center justify-center p-2 transition-transform outline-none ${
          isConfirming ? 'character-confirm-scale z-20' : ''
        }`}
        style={{
          backgroundColor: isSelected ? '#1a1a2e' : 'transparent',
          border: `3px solid ${isSelected ? character.accentColor : '#333'}`,
          boxShadow: isSelected
            ? `0 0 12px ${character.accentColor}66, 3px 3px 0 #000`
            : '2px 2px 0 #000',
          transform: isSelected && !isConfirming ? 'scale(1.05)' : undefined,
        }}
        aria-label={character.name}
        aria-pressed={isSelected}
      >
        {isConfirming && (
          <div
            className="character-confirm-flash absolute inset-0"
            style={{ backgroundColor: character.accentColor }}
            aria-hidden="true"
          />
        )}
        <PixelPortrait
          spriteSrc={character.spriteSrc}
          accentColor={character.accentColor}
          characterId={character.id}
          spriteWidth={character.spriteWidth}
          spriteHeight={character.spriteHeight}
          size={portraitSize}
          className="pointer-events-none"
        />
      </button>
    )
  },
)
