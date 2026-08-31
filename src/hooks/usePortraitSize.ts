import { useEffect, useState } from 'react'

/** Large portrait height for character showcase (px). */
export function usePortraitSize(): number {
  const [size, setSize] = useState(320)

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight
      const w = window.innerWidth
      const computed = Math.min(Math.floor(h * 0.55), Math.floor(w * 0.78), 680)
      setSize(Math.max(computed, 340))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}
