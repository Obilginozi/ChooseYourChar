export interface CharacterStats {
  hp: number
  atk: number
  spd: number
}

export interface Character {
  id: string
  name: string
  tagline: string
  accentColor: string
  spriteSrc: string
  stats: CharacterStats
  /** Native sprite width in pixels (default 384 for generated art). */
  spriteWidth?: number
  /** Native sprite height in pixels (default 576 for generated art). */
  spriteHeight?: number
  jokes: string[]
}
