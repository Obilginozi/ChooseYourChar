import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

interface ScreenFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  borderColor?: string
  style?: CSSProperties
  /** Use h-dvh + overflow hidden for game-like screens */
  lockHeight?: boolean
}

export function ScreenFrame({
  children,
  className = '',
  borderColor = '#FFD700',
  style,
  lockHeight = false,
  ...props
}: ScreenFrameProps) {
  return (
    <div
      className={`relative flex flex-col p-4 ${lockHeight ? 'h-dvh max-h-dvh overflow-hidden' : 'min-h-dvh'} ${className}`}
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        ...style,
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-4 pixel-border"
        style={{ borderColor }}
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
