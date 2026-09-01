import { useCallback, useState } from 'react'

const CRT_KEY = 'cyc-crt'

function getDefaultCrt(): boolean {
  if (typeof window === 'undefined') return false
  return !window.matchMedia('(max-width: 768px)').matches
}

export function useCrtToggle() {
  const [crtEnabled, setCrtEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(CRT_KEY)
      if (stored !== null) return stored === 'true'
    } catch {
      // ignore
    }
    return getDefaultCrt()
  })

  const toggleCrt = useCallback(() => {
    setCrtEnabled((prev) => {
      const next = !prev
      try {
        localStorage.setItem(CRT_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return {
    crtEnabled,
    crtToggleVisible: true,
    toggleCrt,
  }
}
