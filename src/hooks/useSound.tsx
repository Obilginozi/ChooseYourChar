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
  unlockAudioSync,
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
      unlockAudioSync()
      void resumeAudio().then(() => startBgm())
    }

    tryStartAudio()

    const unlock = () => tryStartAudio()
    const unlockOptions: AddEventListenerOptions = { capture: true, passive: true }
    window.addEventListener('pointerdown', unlock, unlockOptions)
    window.addEventListener('touchstart', unlock, unlockOptions)
    window.addEventListener('touchend', unlock, unlockOptions)
    window.addEventListener('click', unlock, unlockOptions)
    window.addEventListener('keydown', unlock)

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !muted) {
        unlockAudioSync()
        void resumeAudio().then(() => startBgm())
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stopBgm()
      window.removeEventListener('pointerdown', unlock, unlockOptions)
      window.removeEventListener('touchstart', unlock, unlockOptions)
      window.removeEventListener('touchend', unlock, unlockOptions)
      window.removeEventListener('click', unlock, unlockOptions)
      window.removeEventListener('keydown', unlock)
      document.removeEventListener('visibilitychange', onVisibility)
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
      if (!next) {
        unlockAudioSync()
        void resumeAudio().then(() => startBgm())
      }
      return next
    })
  }, [])

  const playSfx = useCallback(
    (name: SfxName) => {
      if (muted) return
      unlockAudioSync()
      void resumeAudio().then(() => enginePlaySfx(name))
    },
    [muted],
  )

  const playBattleSfx = useCallback(
    (name: BattleSfxName) => {
      if (muted) return
      unlockAudioSync()
      void resumeAudio().then(() => enginePlayBattleSfx(name))
    },
    [muted],
  )

  const playCharacterConfirm = useCallback(
    (characterId: string) => {
      if (muted) return
      unlockAudioSync()
      void resumeAudio().then(() => enginePlayCharacterConfirm(characterId))
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
