import { useEffect, useState } from 'react'

/** True on phones, tablets, and other coarse-pointer touch devices. */
export function useTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches
    )
  })

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const noHover = window.matchMedia('(hover: none)')

    const update = () => {
      setIsTouch(coarse.matches || noHover.matches)
    }

    update()
    coarse.addEventListener('change', update)
    noHover.addEventListener('change', update)
    return () => {
      coarse.removeEventListener('change', update)
      noHover.removeEventListener('change', update)
    }
  }, [])

  return isTouch
}
