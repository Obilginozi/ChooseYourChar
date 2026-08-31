import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  playSfx as enginePlaySfx,
  resumeAudio,
  setAudioMuted,
  startBgm,
  stopBgm,
} from '../audio/audioEngine'

const MUTED_KEY = 'cyc-muted'

type SfxName = 'start' | 'confirm' | 'cursor'

interface SoundContextValue {
  muted: boolean
  hasInteracted: boolean
  toggleMute: () => void
  markInteracted: () => void
  playSfx: (name: SfxName) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTED_KEY) !== 'false'
    } catch {
      return true
    }
  })
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    setAudioMuted(muted)
  }, [muted])

  useEffect(() => {
    if (hasInteracted && !muted) {
      resumeAudio().then(() => startBgm())
    } else {
      stopBgm()
    }
    return () => stopBgm()
  }, [hasInteracted, muted])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem(MUTED_KEY, String(next))
      } catch {
        // ignore
      }
      setAudioMuted(next)
      return next
    })
  }, [])

  const markInteracted = useCallback(() => {
    setHasInteracted(true)
    resumeAudio()
  }, [])

  const playSfx = useCallback(
    (name: SfxName) => {
      if (!hasInteracted || muted) return
      enginePlaySfx(name)
    },
    [hasInteracted, muted],
  )

  const value = useMemo(
    () => ({ muted, hasInteracted, toggleMute, markInteracted, playSfx }),
    [muted, hasInteracted, toggleMute, markInteracted, playSfx],
  )

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  )
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSound must be used within SoundProvider')
  }
  return ctx
}
