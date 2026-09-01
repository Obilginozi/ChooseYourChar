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
  playBattleSfx as enginePlayBattleSfx,
  playCharacterConfirm as enginePlayCharacterConfirm,
  playSfx as enginePlaySfx,
  resumeAudio,
  setAudioMuted,
  startBgm,
  stopBgm,
  type BattleSfxName,
} from '../audio/audioEngine'

const MUTED_KEY = 'cyc-muted'

type SfxName = 'start' | 'confirm' | 'cursor'

interface SoundContextValue {
  muted: boolean
  toggleMute: () => void
  playSfx: (name: SfxName) => void
  playBattleSfx: (name: BattleSfxName) => void
  playCharacterConfirm: (characterId: string) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTED_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    setAudioMuted(muted)

    const tryStartAudio = () => {
      if (muted) {
        stopBgm()
        return
      }
      resumeAudio().then(() => startBgm())
    }

    tryStartAudio()

    const unlock = () => tryStartAudio()
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock, { passive: true })

    return () => {
      stopBgm()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [muted])

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

  const playSfx = useCallback(
    (name: SfxName) => {
      if (muted) return
      resumeAudio().then(() => enginePlaySfx(name))
    },
    [muted],
  )

  const playBattleSfx = useCallback(
    (name: BattleSfxName) => {
      if (muted) return
      resumeAudio().then(() => enginePlayBattleSfx(name))
    },
    [muted],
  )

  const playCharacterConfirm = useCallback(
    (characterId: string) => {
      if (muted) return
      resumeAudio().then(() => enginePlayCharacterConfirm(characterId))
    },
    [muted],
  )

  const value = useMemo(
    () => ({ muted, toggleMute, playSfx, playBattleSfx, playCharacterConfirm }),
    [muted, toggleMute, playSfx, playBattleSfx, playCharacterConfirm],
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
