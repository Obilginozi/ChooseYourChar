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

function SexologLedBackdrop() {
  return (
    <div className="sexolog-led-backdrop" aria-hidden="true">
      <div className="sexolog-led-sign">
        <div className="sexolog-led-bulbs">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="sexolog-led-bulb"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <svg className="sexolog-led-lips" viewBox="0 0 14 7" role="presentation">
          <rect x="3" y="0" width="2" height="1" />
          <rect x="9" y="0" width="2" height="1" />
          <rect x="2" y="1" width="10" height="1" />
          <rect x="1" y="2" width="12" height="1" />
          <rect x="2" y="3" width="10" height="1" />
          <rect x="3" y="4" width="8" height="1" />
          <rect x="4" y="5" width="6" height="1" />
        </svg>
        <span className="sexolog-led-text">SEX</span>
      </div>
    </div>
  )
}

export function PixelPortrait({
  spriteSrc,
  accentColor: _accentColor,
  characterId,
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
    <div
      className="relative inline-block"
      style={{ width, height }}
    >
      {characterId === 'sexolog' && <SexologLedBackdrop />}
      <img
        src={spriteSrc}
        alt=""
        width={width}
        height={height}
        className={`pixelated relative z-10 ${animate ? 'character-enter' : ''} ${className}`}
        style={{ objectFit: 'contain' }}
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}
