import type { CharacterStats } from '../types/character'

export type FighterSide = 'player' | 'cpu'
export type FighterAnim = 'idle' | 'walk' | 'attack' | 'hurt' | 'ko'

export interface BattleFighter {
  side: FighterSide
  x: number
  hp: number
  maxHp: number
  anim: FighterAnim
  animTime: number
  attackLanded: boolean
  attackCooldown: number
}

export interface BattleState {
  player: BattleFighter
  cpu: BattleFighter
  winner: FighterSide | null
}

export interface PlayerInput {
  left: boolean
  right: boolean
  attack: boolean
}

const ARENA_MIN = 10
const ARENA_MAX = 90
const ATTACK_RANGE = 16
const ATTACK_DURATION = 320
const HURT_DURATION = 240
const ATTACK_ACTIVE_START = 70
const ATTACK_ACTIVE_END = 200

function moveSpeed(spd: number): number {
  return spd * 0.38
}

function attackCooldownMs(spd: number): number {
  return Math.max(280, 620 - spd * 3.5)
}

function damage(atk: number): number {
  return Math.max(4, Math.round(atk * 0.42))
}

function makeFighter(side: FighterSide, x: number, stats: CharacterStats): BattleFighter {
  return {
    side,
    x,
    hp: stats.hp,
    maxHp: stats.hp,
    anim: 'idle',
    animTime: 0,
    attackLanded: false,
    attackCooldown: 0,
  }
}

export function createBattleState(
  playerStats: CharacterStats,
  cpuStats: CharacterStats,
): BattleState {
  return {
    player: makeFighter('player', 28, playerStats),
    cpu: makeFighter('cpu', 72, cpuStats),
    winner: null,
  }
}

function clampX(x: number): number {
  return Math.max(ARENA_MIN, Math.min(ARENA_MAX, x))
}

function distance(a: BattleFighter, b: BattleFighter): number {
  return Math.abs(a.x - b.x)
}

function tryStartAttack(
  fighter: BattleFighter,
  target: BattleFighter,
  _spd: number,
  wantsAttack: boolean,
): BattleFighter {
  if (
    !wantsAttack ||
    fighter.anim === 'attack' ||
    fighter.anim === 'hurt' ||
    fighter.anim === 'ko' ||
    fighter.attackCooldown > 0 ||
    distance(fighter, target) > ATTACK_RANGE
  ) {
    return fighter
  }

  return {
    ...fighter,
    anim: 'attack',
    animTime: 0,
    attackLanded: false,
  }
}

function applyHit(
  attacker: BattleFighter,
  defender: BattleFighter,
  atkStat: number,
  defenderSpd: number,
): { attacker: BattleFighter; defender: BattleFighter; hit: boolean } {
  if (
    attacker.anim !== 'attack' ||
    attacker.attackLanded ||
    attacker.animTime < ATTACK_ACTIVE_START ||
    attacker.animTime > ATTACK_ACTIVE_END ||
    distance(attacker, defender) > ATTACK_RANGE
  ) {
    return { attacker, defender, hit: false }
  }

  const knockback = attacker.side === 'player' ? 4.5 : -4.5
  const nextHp = Math.max(0, defender.hp - damage(atkStat))

  return {
    attacker: { ...attacker, attackLanded: true },
    defender: {
      ...defender,
      hp: nextHp,
      x: clampX(defender.x + knockback),
      anim: nextHp <= 0 ? 'ko' : 'hurt',
      animTime: 0,
      attackCooldown: attackCooldownMs(defenderSpd) * 0.35,
    },
    hit: true,
  }
}

function tickFighterAnim(
  fighter: BattleFighter,
  spd: number,
  dt: number,
): BattleFighter {
  let next = {
    ...fighter,
    animTime: fighter.animTime + dt,
    attackCooldown: Math.max(0, fighter.attackCooldown - dt),
  }

  if (next.anim === 'attack' && next.animTime >= ATTACK_DURATION) {
    next = {
      ...next,
      anim: 'idle',
      animTime: 0,
      attackCooldown: attackCooldownMs(spd),
    }
  }

  if (next.anim === 'hurt' && next.animTime >= HURT_DURATION) {
    next = { ...next, anim: 'idle', animTime: 0 }
  }

  return next
}

function updateMovement(
  fighter: BattleFighter,
  delta: number,
  spd: number,
  dt: number,
): BattleFighter {
  if (fighter.anim === 'attack' || fighter.anim === 'hurt' || fighter.anim === 'ko') {
    return fighter
  }

  if (delta === 0) {
    return fighter.anim === 'walk' ? { ...fighter, anim: 'idle' } : fighter
  }

  const nextX = clampX(fighter.x + delta * moveSpeed(spd) * (dt / 1000))
  return {
    ...fighter,
    x: nextX,
    anim: 'walk',
  }
}

function cpuWantsAttack(state: BattleState, cpuSpd: number): boolean {
  const dist = distance(state.player, state.cpu)
  if (dist > ATTACK_RANGE) return false
  if (state.cpu.attackCooldown > 0) return false
  return Math.random() < 0.04 + cpuSpd * 0.00025
}

function separateFighters(
  player: BattleFighter,
  cpu: BattleFighter,
  minGap = 9,
): { player: BattleFighter; cpu: BattleFighter } {
  const gap = cpu.x - player.x
  if (gap >= minGap) {
    return { player, cpu }
  }

  const mid = (player.x + cpu.x) / 2
  return {
    player: { ...player, x: clampX(mid - minGap / 2) },
    cpu: { ...cpu, x: clampX(mid + minGap / 2) },
  }
}

function cpuMoveDelta(state: BattleState, _cpuSpd: number): number {
  if (state.cpu.anim === 'attack' || state.cpu.anim === 'hurt' || state.cpu.anim === 'ko') {
    return 0
  }

  const dist = distance(state.player, state.cpu)
  if (dist > ATTACK_RANGE * 0.85) {
    return state.player.x < state.cpu.x ? -1 : 1
  }

  if (dist < ATTACK_RANGE * 0.45 && Math.random() < 0.02) {
    return state.player.x < state.cpu.x ? 1 : -1
  }

  return 0
}

export function updateBattle(
  state: BattleState,
  input: PlayerInput,
  playerStats: CharacterStats,
  cpuStats: CharacterStats,
  dt: number,
): { state: BattleState; events: { hit: boolean; ko: FighterSide | null } } {
  if (state.winner) {
    return { state, events: { hit: false, ko: null } }
  }

  let player = tickFighterAnim(state.player, playerStats.spd, dt)
  let cpu = tickFighterAnim(state.cpu, cpuStats.spd, dt)

  const playerDelta =
    input.left && !input.right ? -1 : input.right && !input.left ? 1 : 0
  player = updateMovement(player, playerDelta, playerStats.spd, dt)

  const cpuDelta = cpuMoveDelta({ ...state, player, cpu }, cpuStats.spd)
  cpu = updateMovement(cpu, cpuDelta, cpuStats.spd, dt)

  ;({ player, cpu } = separateFighters(player, cpu))

  player = tryStartAttack(player, cpu, playerStats.spd, input.attack)
  cpu = tryStartAttack(cpu, player, cpuStats.spd, cpuWantsAttack({ ...state, player, cpu }, cpuStats.spd))

  let hit = false
  const playerHit = applyHit(player, cpu, playerStats.atk, cpuStats.spd)
  player = playerHit.attacker
  cpu = playerHit.defender
  if (playerHit.hit) hit = true

  const cpuHit = applyHit(cpu, player, cpuStats.atk, playerStats.spd)
  cpu = cpuHit.attacker
  player = cpuHit.defender
  if (cpuHit.hit) hit = true

  let winner: FighterSide | null = null
  if (player.hp <= 0 && player.anim !== 'ko') {
    player = { ...player, anim: 'ko', hp: 0 }
  }
  if (cpu.hp <= 0 && cpu.anim !== 'ko') {
    cpu = { ...cpu, anim: 'ko', hp: 0 }
  }

  if (player.anim === 'ko' && cpu.anim !== 'ko') winner = 'cpu'
  if (cpu.anim === 'ko' && player.anim !== 'ko') winner = 'player'
  if (player.anim === 'ko' && cpu.anim === 'ko') winner = 'player'

  return {
    state: { player, cpu, winner },
    events: { hit, ko: winner },
  }
}
