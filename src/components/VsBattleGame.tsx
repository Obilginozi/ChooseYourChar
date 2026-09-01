import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createBattleState,
  updateBattle,
  type BattleState,
  type FighterSide,
  type PlayerInput,
} from '../game/vsBattleLogic'
import { PixelButton } from './PixelButton'
import { PixelPortrait } from './PixelPortrait'
import { ScreenFrame } from './ScreenFrame'
import { useSound } from '../hooks/useSound'
import { useIsMobile } from '../hooks/useIsMobile'
import type { Character } from '../types/character'

interface VsBattleGameProps {
  player: Character
  cpu: Character
  onExit: () => void
}

type IntroStep = 'matchup' | 'round' | 'fight'

const MAX_ROUNDS = 3
const INTRO_MATCHUP_MS = 900
const INTRO_ROUND_MS = 1100
const INTRO_FIGHT_MS = 800
const ROUND_RESULT_MS = 2200

type MatchPhase = 'roundIntro' | 'fighting' | 'roundResult' | 'matchResult'

interface MatchState {
  round: number
  playerWins: number
  cpuWins: number
  phase: MatchPhase
  matchWinner: FighterSide | null
  lastRoundWinner: FighterSide | null
}

function createMatchState(): MatchState {
  return {
    round: 1,
    playerWins: 0,
    cpuWins: 0,
    phase: 'roundIntro',
    matchWinner: null,
    lastRoundWinner: null,
  }
}

function HpBar({
  label,
  hp,
  maxHp,
  accentColor,
  align,
}: {
  label: string
  hp: number
  maxHp: number
  accentColor: string
  align: 'left' | 'right'
}) {
  const pct = maxHp > 0 ? Math.max(0, (hp / maxHp) * 100) : 0

  return (
    <div
      className={`flex min-w-0 flex-col gap-px sm:flex-1 sm:gap-0.5 ${align === 'right' ? 'items-end' : 'items-start'}`}
    >
      <span
        className="font-header max-w-full truncate text-[5px] leading-none sm:text-[8px]"
        style={{ color: accentColor }}
      >
        {label}
      </span>
      <div
        className="h-1.5 w-full min-w-0 border border-[#8B6914] bg-[#1a1a2e] sm:h-3 sm:max-w-[180px] sm:border-2"
        role="progressbar"
        aria-valuenow={hp}
        aria-valuemin={0}
        aria-valuemax={maxHp}
      >
        <div
          className="h-full transition-[width] duration-100"
          style={{
            width: `${pct}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </div>
  )
}

function TouchControl({
  label,
  active,
  onPress,
  accentColor,
  className = '',
  disabled = false,
}: {
  label: string
  active: boolean
  onPress: (pressed: boolean) => void
  accentColor: string
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`font-header flex select-none items-center justify-center touch-none disabled:opacity-40 h-12 w-12 text-sm sm:h-16 sm:w-16 sm:text-base ${className}`}
      style={{
        backgroundColor: active ? accentColor : '#1a1a2e',
        color: active ? '#0D0D1A' : '#F5E6C8',
        border: `3px solid ${accentColor}`,
        boxShadow: active ? '1px 1px 0 #8B6914' : '3px 3px 0 #8B6914, 6px 6px 0 #000',
      }}
      aria-label={label}
      onPointerDown={(e) => {
        if (disabled) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        onPress(true)
      }}
      onPointerUp={(e) => {
        e.preventDefault()
        onPress(false)
      }}
      onPointerCancel={() => onPress(false)}
      onLostPointerCapture={() => onPress(false)}
    >
      {label}
    </button>
  )
}

function BattleIntroOverlay({
  step,
  player,
  cpu,
  round,
}: {
  step: IntroStep
  player: Character
  cpu: Character
  round: number
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {step === 'matchup' && (
        <div className="vs-intro-text flex flex-col items-center gap-3 text-center">
          <p
            className="font-body text-2xl sm:text-3xl"
            style={{ color: player.accentColor }}
          >
            {player.name}
          </p>
          <span className="font-header text-sm text-[#E74C3C] sm:text-base">VS</span>
          <p
            className="font-body text-2xl sm:text-3xl"
            style={{ color: cpu.accentColor }}
          >
            {cpu.name}
          </p>
        </div>
      )}

      {step === 'round' && (
        <p
          key="round"
          className="vs-intro-text font-header text-lg sm:text-2xl"
          style={{ color: '#FFD700' }}
        >
          ROUND {round}
        </p>
      )}

      {step === 'fight' && (
        <p
          key="fight"
          className="vs-intro-text font-header text-2xl sm:text-4xl"
          style={{ color: '#E74C3C' }}
        >
          FIGHT!
        </p>
      )}
    </div>
  )
}

export function VsBattleGame({ player, cpu, onExit }: VsBattleGameProps) {
  const { playBattleSfx } = useSound()
  const isMobile = useIsMobile()
  const inputRef = useRef<PlayerInput>({ left: false, right: false, attack: false })
  const battleRef = useRef<BattleState>(createBattleState(player.stats, cpu.stats))
  const [renderState, setRenderState] = useState<BattleState>(() => battleRef.current)
  const [match, setMatch] = useState<MatchState>(createMatchState)
  const [touchActive, setTouchActive] = useState({ left: false, right: false, attack: false })
  const [introDone, setIntroDone] = useState(false)
  const [introStep, setIntroStep] = useState<IntroStep>('matchup')
  const [introRun, setIntroRun] = useState(0)
  const [introShowMatchup, setIntroShowMatchup] = useState(true)
  const [introRound, setIntroRound] = useState(1)
  const roundResolvedRef = useRef(false)

  const fightingActive = introDone && match.phase === 'fighting' && !renderState.winner

  const syncInput = useCallback((patch: Partial<PlayerInput>) => {
    if (!fightingActive) return
    inputRef.current = { ...inputRef.current, ...patch }
    setTouchActive((prev) => ({
      left: patch.left ?? prev.left,
      right: patch.right ?? prev.right,
      attack: patch.attack ?? prev.attack,
    }))
  }, [fightingActive])

  const beginRoundIntro = useCallback((round: number, showMatchup: boolean) => {
    inputRef.current = { left: false, right: false, attack: false }
    setTouchActive({ left: false, right: false, attack: false })
    setIntroDone(false)
    setIntroShowMatchup(showMatchup)
    setIntroRound(round)
    setIntroStep(showMatchup ? 'matchup' : 'round')
    setIntroRun((n) => n + 1)
  }, [])

  const resetIntro = useCallback(() => {
    beginRoundIntro(1, true)
  }, [beginRoundIntro])

  const rematch = useCallback(() => {
    const fresh = createBattleState(player.stats, cpu.stats)
    battleRef.current = fresh
    setRenderState(fresh)
    setMatch(createMatchState())
    roundResolvedRef.current = false
    resetIntro()
  }, [player.stats, cpu.stats, resetIntro])

  const startNextRound = useCallback(() => {
    const nextRound = match.round + 1
    const fresh = createBattleState(player.stats, cpu.stats)
    battleRef.current = fresh
    setRenderState(fresh)
    roundResolvedRef.current = false
    setMatch((m) => ({ ...m, round: nextRound, phase: 'roundIntro', lastRoundWinner: null }))
    beginRoundIntro(nextRound, false)
  }, [beginRoundIntro, cpu.stats, match.round, player.stats])

  useEffect(() => {
    const matchupDelay = introShowMatchup ? INTRO_MATCHUP_MS : 0

    const tRound = setTimeout(() => {
      setIntroStep('round')
      playBattleSfx('round')
    }, matchupDelay)

    const tFight = setTimeout(() => {
      setIntroStep('fight')
      playBattleSfx('fight')
    }, matchupDelay + INTRO_ROUND_MS)

    const tStart = setTimeout(() => {
      setIntroDone(true)
      setMatch((m) => (m.phase === 'roundIntro' ? { ...m, phase: 'fighting' } : m))
    }, matchupDelay + INTRO_ROUND_MS + INTRO_FIGHT_MS)

    return () => {
      clearTimeout(tRound)
      clearTimeout(tFight)
      clearTimeout(tStart)
    }
  }, [introRun, introShowMatchup, playBattleSfx])

  useEffect(() => {
    if (match.phase !== 'fighting' || !renderState.winner || roundResolvedRef.current) return

    roundResolvedRef.current = true
    const roundWinner = renderState.winner
    const newPlayerWins = match.playerWins + (roundWinner === 'player' ? 1 : 0)
    const newCpuWins = match.cpuWins + (roundWinner === 'cpu' ? 1 : 0)
    const matchOver =
      newPlayerWins >= 2 || newCpuWins >= 2 || match.round >= MAX_ROUNDS
    const matchWinner: FighterSide | null = matchOver
      ? newPlayerWins >= newCpuWins
        ? 'player'
        : 'cpu'
      : null

    setMatch({
      round: match.round,
      playerWins: newPlayerWins,
      cpuWins: newCpuWins,
      phase: 'roundResult',
      matchWinner,
      lastRoundWinner: roundWinner,
    })
  }, [match.phase, match.playerWins, match.cpuWins, match.round, renderState.winner])

  useEffect(() => {
    if (match.phase !== 'roundResult') return

    const timer = setTimeout(() => {
      if (match.matchWinner) {
        setMatch((m) => ({ ...m, phase: 'matchResult' }))
      } else {
        startNextRound()
      }
    }, ROUND_RESULT_MS)

    return () => clearTimeout(timer)
  }, [match.matchWinner, match.phase, startNextRound])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onExit()
        return
      }
      if (!fightingActive && match.phase !== 'matchResult') return

      if (match.phase === 'matchResult' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        rematch()
        return
      }
      if (!fightingActive) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        syncInput({ left: true })
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault()
        syncInput({ right: true })
      }
      if (e.key === ' ' || e.key === 'j' || e.key === 'J') {
        e.preventDefault()
        syncInput({ attack: true })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!fightingActive) return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        syncInput({ left: false })
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        syncInput({ right: false })
      }
      if (e.key === ' ' || e.key === 'j' || e.key === 'J') {
        syncInput({ attack: false })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [fightingActive, match.phase, onExit, rematch, syncInput])

  useEffect(() => {
    if (!fightingActive) return

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now

      const { state, events } = updateBattle(
        battleRef.current,
        inputRef.current,
        player.stats,
        cpu.stats,
        dt,
      )
      battleRef.current = state

      if (events.hit) playBattleSfx('hit')
      if (events.ko) playBattleSfx('ko')

      setRenderState(state)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [cpu.stats, fightingActive, player.stats, playBattleSfx])

  const scoreLabel = `${match.playerWins} - ${match.cpuWins}`

  const spriteSize = isMobile ? 52 : 72
  const playerFighter = renderState.player
  const cpuFighter = renderState.cpu

  return (
    <ScreenFrame lockHeight className="gap-1.5">
      <div className="relative z-20 flex shrink-0 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <PixelButton onClick={onExit} variant="secondary" className="!min-h-[36px] !px-3 !py-2 !text-[8px]">
            BACK
          </PixelButton>
          <span className="font-header text-[7px] text-[#E74C3C]">
            R{match.round} · {scoreLabel}
          </span>
          <span className="w-[4.5rem]" aria-hidden="true" />
        </div>

        <header className="w-full pr-[4.5rem] sm:hidden">
          <div className="grid grid-cols-2 gap-1.5">
            <HpBar
              label={player.name}
              hp={playerFighter.hp}
              maxHp={playerFighter.maxHp}
              accentColor={player.accentColor}
              align="left"
            />
            <HpBar
              label={cpu.name}
              hp={cpuFighter.hp}
              maxHp={cpuFighter.maxHp}
              accentColor={cpu.accentColor}
              align="right"
            />
          </div>
        </header>
      </div>

      <div
        className="relative z-10 mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-hidden border-4 border-[#FFD700] bg-[#12121f]"
      >
        <div
          className="absolute inset-x-0 bottom-[18%] h-1 bg-[#8B6914]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[18%] h-[2px] w-full bg-[#FFD700]/40"
          style={{ transform: 'translateY(4px)' }}
          aria-hidden="true"
        />

        <div
          className="absolute bottom-[20%] -translate-x-1/2 transition-transform duration-75"
          style={{
            left: `${playerFighter.x}%`,
            transform: `translateX(-50%) translateX(${playerFighter.anim === 'attack' ? 8 : 0}px)`,
          }}
        >
          <div
            className={
              playerFighter.anim === 'hurt'
                ? 'vs-fighter-hurt'
                : playerFighter.anim === 'attack'
                  ? 'vs-fighter-attack'
                  : ''
            }
          >
            <PixelPortrait
              spriteSrc={player.spriteSrc}
              accentColor={player.accentColor}
              characterId={player.id}
              spriteWidth={player.spriteWidth}
              spriteHeight={player.spriteHeight}
              size={spriteSize}
              animate={false}
            />
          </div>
        </div>

        <div
          className="absolute bottom-[20%] -translate-x-1/2 transition-transform duration-75"
          style={{
            left: `${cpuFighter.x}%`,
            transform: `translateX(-50%) scaleX(-1) translateX(${cpuFighter.anim === 'attack' ? 8 : 0}px)`,
          }}
        >
          <div
            className={
              cpuFighter.anim === 'hurt'
                ? 'vs-fighter-hurt'
                : cpuFighter.anim === 'attack'
                  ? 'vs-fighter-attack'
                  : ''
            }
          >
            <PixelPortrait
              spriteSrc={cpu.spriteSrc}
              accentColor={cpu.accentColor}
              characterId={cpu.id}
              spriteWidth={cpu.spriteWidth}
              spriteHeight={cpu.spriteHeight}
              size={spriteSize}
              animate={false}
            />
          </div>
        </div>

        {!introDone && match.phase !== 'roundResult' && match.phase !== 'matchResult' && (
          <BattleIntroOverlay
            step={introStep}
            player={player}
            cpu={cpu}
            round={introRound}
          />
        )}

        {match.phase === 'roundResult' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/60 px-4">
            <p className="font-header text-center text-[10px] sm:text-xs" style={{ color: '#FFD700' }}>
              ROUND {match.round}
            </p>
            <p className="font-header text-center text-xs sm:text-sm" style={{ color: '#F5E6C8' }}>
              {match.lastRoundWinner === 'player' ? 'YOU WIN!' : 'YOU LOSE'}
            </p>
            <p className="font-body text-lg text-[#a89b7a]">{scoreLabel}</p>
          </div>
        )}

        {match.phase === 'matchResult' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/55 px-4">
            <p className="font-header text-center text-[10px] sm:text-xs" style={{ color: '#FFD700' }}>
              WINNER
            </p>
            <p className="font-header text-center text-xs sm:text-sm" style={{ color: '#F5E6C8' }}>
              {match.matchWinner === 'player' ? 'YOU WIN THE MATCH!' : 'YOU LOSE THE MATCH'}
            </p>
            <p className="font-body text-xl text-[#a89b7a]">{scoreLabel}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <PixelButton onClick={rematch} accentColor="#FFD700">
                REMATCH
              </PixelButton>
              <PixelButton onClick={onExit} variant="secondary">
                BACK
              </PixelButton>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto mt-2 hidden w-full max-w-2xl shrink-0 items-center gap-4 sm:flex">
        <HpBar
          label={player.name}
          hp={playerFighter.hp}
          maxHp={playerFighter.maxHp}
          accentColor={player.accentColor}
          align="left"
        />
        <span className="font-header shrink-0 text-[10px] text-[#E74C3C]">
          R{match.round} · {scoreLabel}
        </span>
        <HpBar
          label={cpu.name}
          hp={cpuFighter.hp}
          maxHp={cpuFighter.maxHp}
          accentColor={cpu.accentColor}
          align="right"
        />
      </div>

      <p className="relative z-10 mt-1 hidden shrink-0 text-center font-body text-sm text-[#a89b7a] sm:block">
        ← → hareket · Space / J saldırı · Esc çık
      </p>

      <div className="relative z-10 mt-2 flex shrink-0 items-center justify-between gap-2 sm:hidden">
        <div className="flex gap-1.5">
          <TouchControl
            label="◀"
            active={touchActive.left}
            accentColor={player.accentColor}
            disabled={!fightingActive}
            onPress={(pressed) => syncInput({ left: pressed })}
          />
          <TouchControl
            label="▶"
            active={touchActive.right}
            accentColor={player.accentColor}
            disabled={!fightingActive}
            onPress={(pressed) => syncInput({ right: pressed })}
          />
        </div>
        <TouchControl
          label="⚔"
          active={touchActive.attack}
          accentColor="#E74C3C"
          className="h-12 w-16 text-base"
          disabled={!fightingActive}
          onPress={(pressed) => syncInput({ attack: pressed })}
        />
      </div>

      <footer className="relative z-10 mt-2 hidden shrink-0 justify-center sm:flex">
        <PixelButton onClick={onExit} variant="secondary">
          BACK
        </PixelButton>
      </footer>
    </ScreenFrame>
  )
}
