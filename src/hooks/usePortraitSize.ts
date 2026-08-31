import { useEffect, useState } from 'react'

/** Large portrait height for character showcase (px). */
export function usePortraitSize(): number {
  const [size, setSize] = useState(320)

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight
      const w = window.innerWidth
      const computed = Math.min(Math.floor(h * 0.44), Math.floor(w * 0.62), 460)
      setSize(Math.max(computed, 240))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}
