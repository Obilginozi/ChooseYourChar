interface CRTOverlayProps {
  enabled?: boolean
}

export function CRTOverlay({ enabled }: CRTOverlayProps) {
  if (!enabled) return null

  return (
    <>
      <div className="crt-frame" aria-hidden="true" />
      <div className="crt-overlay" aria-hidden="true">
        <div className="crt-phosphor" />
        <div className="crt-scanline-bar" />
        <div className="crt-noise" />
      </div>
    </>
  )
}
