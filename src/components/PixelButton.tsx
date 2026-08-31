import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  accentColor?: string
  variant?: 'primary' | 'secondary'
}

export function PixelButton({
  children,
  accentColor = '#FFD700',
  variant = 'primary',
  className = '',
  style,
  ...props
}: PixelButtonProps) {
  const bgColor = variant === 'primary' ? '#1a1a2e' : '#0d0d1a'
  const textColor = variant === 'primary' ? '#F5E6C8' : accentColor

  return (
    <button
      type="button"
      className={`font-header min-h-[44px] min-w-[44px] px-4 py-3 text-xs transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `3px solid ${accentColor}`,
        boxShadow: `3px 3px 0 #8B6914, 6px 6px 0 #000`,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}
