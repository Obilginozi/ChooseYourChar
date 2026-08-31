import { useCallback, useRef } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const SWIPE_THRESHOLD = 50

export function useSwipe(handlers: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.current.x
      const dy = touch.clientY - touchStart.current.y
      touchStart.current = null

      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return

      if (dx < 0) {
        handlers.onSwipeLeft?.()
      } else {
        handlers.onSwipeRight?.()
      }
    },
    [handlers],
  )

  return { onTouchStart, onTouchEnd }
}
