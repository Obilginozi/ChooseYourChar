import { useSound } from '../hooks/useSound'

interface GameControlsProps {
  crtEnabled: boolean
  crtToggleVisible: boolean
  onToggleCrt: () => void
}

export function GameControls({
  crtEnabled,
  crtToggleVisible,
  onToggleCrt,
}: GameControlsProps) {
  const { muted, toggleMute } = useSound()

  return (
    <div
      className="fixed z-[60] flex gap-2"
      style={{
        top: 'max(0.5rem, env(safe-area-inset-top))',
        right: 'max(0.5rem, env(safe-area-inset-right))',
      }}
    >
      <button
        type="button"
        onClick={toggleMute}
        className="font-header min-h-[44px] min-w-[44px] cursor-pointer border-[3px] border-[#FFD700] bg-[#1a1a2e] px-2 py-2 text-[8px] text-[#F5E6C8] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
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
          className="font-header min-h-[44px] min-w-[44px] cursor-pointer border-[3px] border-[#FFD700] bg-[#1a1a2e] px-2 py-2 text-[8px] text-[#F5E6C8] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
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
