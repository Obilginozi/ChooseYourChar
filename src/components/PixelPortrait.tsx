import { useState } from 'react'

const SPRITE_WIDTH = 160
const SPRITE_HEIGHT = 240

interface PixelPortraitProps {
  spriteSrc: string
  accentColor: string
  characterId: string
  size?: number
  className?: string
}

function PortraitPlaceholder({
  accentColor,
  height,
  width,
  className,
}: {
  accentColor: string
  height: number
  width: number
  className?: string
}) {
  return (
    <div
      className={`pixelated flex items-center justify-center bg-[#1a1a2e] ${className ?? ''}`}
      style={{
        width,
        height,
        border: `4px solid ${accentColor}`,
      }}
      aria-hidden="true"
    >
      <span className="font-pixel text-2xl text-[#555]">?</span>
    </div>
  )
}

export function PixelPortrait({
  spriteSrc,
  accentColor,
  size = 128,
  className = '',
}: PixelPortraitProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const height = size
  const width = Math.round(size * (SPRITE_WIDTH / SPRITE_HEIGHT))

  if (imgFailed) {
    return (
      <PortraitPlaceholder
        accentColor={accentColor}
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
      className={`pixelated ${className}`}
      style={{
        border: `4px solid ${accentColor}`,
        objectFit: 'contain',
      }}
      onError={() => setImgFailed(true)}
    />
  )
}
