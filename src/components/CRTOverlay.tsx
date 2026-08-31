interface CRTOverlayProps {
  enabled?: boolean
}

export function CRTOverlay({ enabled }: CRTOverlayProps) {
  if (!enabled) return null

  return <div className="crt-overlay" aria-hidden="true" />
}
