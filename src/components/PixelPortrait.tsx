import { useEffect, useRef, useState } from 'react'
import characterPixels from '../data/characterPixels.json'

type PixelMatrix = (string | null)[][]

const SPRITE_WIDTH = 32
const SPRITE_HEIGHT = 48

const PLACEHOLDER_MATRICES: Record<string, PixelMatrix> =
  characterPixels as Record<string, PixelMatrix>

interface PixelPortraitProps {
  spriteSrc: string
  accentColor: string
  characterId: string
  size?: number
  className?: string
}

function CanvasFallback({
  characterId,
  accentColor,
  height,
  width,
  className,
}: {
  characterId: string
  accentColor: string
  height: number
  width: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const matrix =
      PLACEHOLDER_MATRICES[characterId] ??
      Array.from({ length: SPRITE_HEIGHT }, () =>
        Array.from({ length: SPRITE_WIDTH }, () => '#888888'),
      )
    const rows = matrix.length
    const cols = matrix[0]?.length ?? SPRITE_WIDTH
    const pixelW = width / cols
    const pixelH = height / rows

    ctx.clearRect(0, 0, width, height)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const color = matrix[y][x]
        if (color) {
          ctx.fillStyle = color
          ctx.fillRect(x * pixelW, y * pixelH, pixelW, pixelH)
        }
      }
    }

    ctx.strokeStyle = accentColor
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)
  }, [characterId, accentColor, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`pixelated ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}

export function PixelPortrait({
  spriteSrc,
  accentColor,
  characterId,
  size = 128,
  className = '',
}: PixelPortraitProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const height = size
  const width = Math.round(size * (SPRITE_WIDTH / SPRITE_HEIGHT))

  if (!imgFailed) {
    return (
      <img
        src={spriteSrc}
        alt=""
        width={width}
        height={height}
        className={`pixelated ${className}`}
        style={{
          border: `3px solid ${accentColor}`,
          objectFit: 'contain',
        }}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <CanvasFallback
      characterId={characterId}
      accentColor={accentColor}
      width={width}
      height={height}
      className={className}
    />
  )
}
