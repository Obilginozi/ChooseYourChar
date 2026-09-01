import { useEffect, useState } from 'react'

interface UseTypewriterOptions {
  text: string
  speedMs?: number
  enabled?: boolean
}

export function useTypewriter({
  text,
  speedMs = 24,
  enabled = true,
}: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text)
  const [done, setDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
        setDone(true)
      }
    }, speedMs)

    return () => window.clearInterval(id)
  }, [text, speedMs, enabled])

  return { displayed, done }
}
