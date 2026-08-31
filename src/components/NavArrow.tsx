interface NavArrowProps {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
  accentColor?: string
  label: string
}

export function NavArrow({
  direction,
  onClick,
  disabled,
  accentColor = '#FFD700',
  label,
}: NavArrowProps) {
  const symbol = direction === 'left' ? '◀' : '▶'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="font-header flex min-h-[52px] min-w-[52px] shrink-0 cursor-pointer items-center justify-center border-[3px] bg-[#1a1a2e] text-lg text-[#F5E6C8] transition-transform active:translate-x-[2px] active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-30 sm:min-h-[60px] sm:min-w-[60px] sm:text-xl"
      style={{
        borderColor: accentColor,
        boxShadow: disabled ? 'none' : '3px 3px 0 #8B6914, 5px 5px 0 #000',
      }}
    >
      {symbol}
    </button>
  )
}
