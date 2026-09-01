import { useEffect, useState } from 'react'

type PortraitContext = 'select' | 'detail'

/** Responsive portrait height for character screens (px). */
export function usePortraitSize(context: PortraitContext = 'select'): number {
  const [size, setSize] = useState(context === 'detail' ? 300 : 320)

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight
      const w = window.innerWidth

      if (context === 'detail') {
        const computed = Math.min(
          Math.floor(h * 0.42),
          Math.floor(w * 0.72),
          560,
        )
        setSize(Math.max(computed, 280))
        return
      }

      const computed = Math.min(Math.floor(h * 0.55), Math.floor(w * 0.78), 680)
      setSize(Math.max(computed, 340))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [context])

  return size
}
