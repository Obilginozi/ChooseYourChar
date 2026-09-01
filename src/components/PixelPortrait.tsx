import { useState } from 'react'

const DEFAULT_SPRITE_WIDTH = 256
const DEFAULT_SPRITE_HEIGHT = 256

interface PixelPortraitProps {
  spriteSrc: string
  accentColor: string
  characterId: string
  size?: number
  spriteWidth?: number
  spriteHeight?: number
  className?: string
  animate?: boolean
}

function PortraitPlaceholder({
  height,
  width,
  className,
}: {
  height: number
  width: number
  className?: string
}) {
  return (
    <div
      className={`pixelated flex items-center justify-center bg-[#1a1a2e] ${className ?? ''}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      <span className="font-pixel text-2xl text-[#555]">?</span>
    </div>
  )
}

export function PixelPortrait({
  spriteSrc,
  size = 128,
  spriteWidth = DEFAULT_SPRITE_WIDTH,
  spriteHeight = DEFAULT_SPRITE_HEIGHT,
  className = '',
  animate = true,
}: PixelPortraitProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const height = size
  const width = Math.round(size * (spriteWidth / spriteHeight))

  if (imgFailed) {
    return (
      <PortraitPlaceholder
        width={width}
        height={height}
        className={className}
      />
    )
  }

  return (
    <img
      src={spriteSrc}
      alt=""
      width={width}
      height={height}
      className={`pixelated ${animate ? 'character-enter' : ''} ${className}`}
      style={{ objectFit: 'contain' }}
      onError={() => setImgFailed(true)}
    />
  )
}
