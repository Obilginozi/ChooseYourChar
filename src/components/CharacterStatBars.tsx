import type { CharacterStats } from '../types/character'

interface CharacterStatBarsProps {
  stats: CharacterStats
  accentColor: string
  compact?: boolean
}

const LABELS: { key: keyof CharacterStats; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'atk', label: 'ATK' },
  { key: 'spd', label: 'SPD' },
]

export function CharacterStatBars({
  stats,
  accentColor,
  compact = false,
}: CharacterStatBarsProps) {
  return (
    <div
      className={`flex w-full items-end justify-center gap-2 sm:gap-3 ${compact ? 'max-w-[180px]' : 'max-w-sm'}`}
      aria-label="Character stats"
    >
      {LABELS.map(({ key, label }) => (
        <div
          key={key}
          className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
        >
          <span
            className={`font-header text-[#a89b7a] ${compact ? 'text-[6px]' : 'text-[7px] sm:text-[8px]'}`}
          >
            {label}
          </span>
          <div
            className={`relative w-full overflow-hidden border border-[#333] bg-[#0d0d1a] ${compact ? 'h-1.5' : 'h-2'}`}
            style={{ boxShadow: 'inset 0 0 0 1px #000' }}
          >
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${stats[key]}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <span
            className={`font-body tabular-nums text-[#F5E6C8] ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  )
}
