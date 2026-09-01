import { useEffect, useState } from 'react'
import { PixelButton } from '../components/PixelButton'
import { ScreenFrame } from '../components/ScreenFrame'
import {
  getAnalytics,
  getPickLeaderboard,
  getTotalPicks,
  resetAnalytics,
} from '../lib/analytics'

interface AboutScreenProps {
  onBack: () => void
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const [statsVersion, setStatsVersion] = useState(0)
  const leaderboard = getPickLeaderboard()
  const totalPicks = getTotalPicks()
  const analytics = getAnalytics()
  // re-read stats after reset
  void statsVersion

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onBack()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onBack])

  return (
    <ScreenFrame>
      <header className="screen-header relative z-10 mt-4 mb-4 text-center">
        <h1 className="font-header text-xs sm:text-sm" style={{ color: '#FFD700' }}>
          CREDITS
        </h1>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 overflow-y-auto">
        <section className="dialogue-box px-4 py-4">
          <h2 className="font-header mb-2 text-[9px] text-[#FFD700]">ABOUT</h2>
          <p className="font-body text-xl leading-relaxed text-[#F5E6C8]">
            Retro arcade-style character select built as a playful portfolio piece.
            Pick a fighter, read their lines, compare stats — no quarters required.
          </p>
        </section>

        <section className="dialogue-box px-4 py-4">
          <h2 className="font-header mb-2 text-[9px] text-[#FFD700]">MADE BY</h2>
          <p className="font-body text-xl text-[#F5E6C8]">
            Oguzhan Alfred Bilgin 
          </p>
        </section>

        <section className="dialogue-box px-4 py-4">
          <h2 className="font-header mb-2 text-[9px] text-[#FFD700]">
            LOCAL STATS (privacy-friendly)
          </h2>
          <p className="font-body mb-3 text-lg leading-relaxed text-[#a89b7a]">
            Counts are stored only in <strong className="text-[#F5E6C8]">your browser</strong>{' '}
            — nothing is sent to a server. View them here or in DevTools console.
          </p>
          <p className="font-body mb-2 text-lg text-[#F5E6C8]">
            Total confirms: <span className="text-[#FFD700]">{totalPicks}</span>
            {' · '}
            VS screen opens: <span className="text-[#FFD700]">{analytics.vsViews}</span>
          </p>
          {leaderboard.length > 0 ? (
            <ul className="space-y-1">
              {leaderboard.map((row) => (
                <li
                  key={row.characterId}
                  className="font-body flex justify-between text-lg text-[#F5E6C8]"
                >
                  <span>{row.name}</span>
                  <span className="tabular-nums text-[#a89b7a]">{row.count}×</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-lg text-[#a89b7a]">No picks recorded yet.</p>
          )}
          <div className="mt-3">
            <PixelButton
              onClick={() => {
                resetAnalytics()
                setStatsVersion((v) => v + 1)
              }}
              variant="secondary"
            >
              RESET STATS
            </PixelButton>
          </div>
        </section>
      </div>

      <footer className="relative z-10 mt-4 flex justify-center">
        <PixelButton onClick={onBack} variant="secondary">
          BACK
        </PixelButton>
      </footer>
    </ScreenFrame>
  )
}
