import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 639px)'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MOBILE_QUERY).matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const handleChange = () => setIsMobile(mq.matches)
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
