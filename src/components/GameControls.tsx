import type { CSSProperties } from 'react'
import { useSound } from '../hooks/useSound'

interface GameControlsProps {
  crtEnabled: boolean
  crtToggleVisible: boolean
  onToggleCrt: () => void
  className?: string
  style?: CSSProperties
}

const btnClass =
  'font-header cursor-pointer border-[3px] border-[#FFD700] bg-[#1a1a2e] text-[#F5E6C8] transition-transform active:translate-x-[1px] active:translate-y-[1px] min-h-[36px] min-w-[36px] h-9 w-9 px-1 py-1 text-[7px] sm:min-h-[40px] sm:min-w-[40px] sm:h-10 sm:w-10 sm:text-[8px]'

export function GameControls({
  crtEnabled,
  crtToggleVisible,
  onToggleCrt,
  className = '',
  style,
}: GameControlsProps) {
  const { muted, toggleMute } = useSound()

  return (
    <div
      className={`absolute z-[60] flex gap-1.5 sm:gap-2 ${className}`}
      style={{
        top: 'max(1.25rem, calc(env(safe-area-inset-top) + 0.25rem))',
        right: 'max(1.25rem, calc(env(safe-area-inset-right) + 0.25rem))',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={toggleMute}
        className={btnClass}
        style={{ boxShadow: '2px 2px 0 #8B6914, 4px 4px 0 #000' }}
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? 'MUTE' : 'SND'}
      </button>

      {crtToggleVisible && (
        <button
          type="button"
          onClick={onToggleCrt}
          className={btnClass}
          style={{
            boxShadow: '2px 2px 0 #8B6914, 4px 4px 0 #000',
            opacity: crtEnabled ? 1 : 0.6,
          }}
          aria-label={crtEnabled ? 'Disable CRT effect' : 'Enable CRT effect'}
          title={crtEnabled ? 'CRT ON' : 'CRT OFF'}
        >
          CRT
        </button>
      )}
    </div>
  )
}
