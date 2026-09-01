import { useCallback, useEffect, useRef, useState } from 'react'

const AUTO_ADVANCE_MS = 4000
const MANUAL_PAUSE_MS = 15000

interface UseJokeCarouselOptions {
  jokeCount: number
  autoAdvance?: boolean
}

export function useJokeCarousel({
  jokeCount,
  autoAdvance = true,
}: UseJokeCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pauseAutoAdvance = useCallback(() => {
    setIsPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), MANUAL_PAUSE_MS)
  }, [])

  const goNext = useCallback(() => {
    if (jokeCount <= 1) return
    setCurrentIndex((i) => (i + 1) % jokeCount)
    pauseAutoAdvance()
  }, [jokeCount, pauseAutoAdvance])

  const goPrev = useCallback(() => {
    if (jokeCount <= 1) return
    setCurrentIndex((i) => (i - 1 + jokeCount) % jokeCount)
    pauseAutoAdvance()
  }, [jokeCount, pauseAutoAdvance])

  useEffect(() => {
    setCurrentIndex(0)
    setIsPaused(false)
  }, [jokeCount])

  useEffect(() => {
    if (!autoAdvance || isPaused || jokeCount <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % jokeCount)
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(timer)
  }, [autoAdvance, isPaused, jokeCount])

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [])

  return { currentIndex, goNext, goPrev, isPaused }
}
