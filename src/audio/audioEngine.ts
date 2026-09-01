type SfxName = 'start' | 'confirm' | 'cursor'
export type BattleSfxName = 'round' | 'fight' | 'hit' | 'ko'

let audioContext: AudioContext | null = null
let bgmOscillators: OscillatorNode[] = []
let bgmGain: GainNode | null = null
let bgmStep = 0
let bgmTimer: ReturnType<typeof setInterval> | null = null
let isMuted = false
let bgmRunning = false

const BGM_PATTERN = [
  [262, 330, 392, 523],
  [294, 370, 440, 587],
  [330, 392, 494, 659],
  [262, 330, 392, 523],
]

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export function setAudioMuted(muted: boolean) {
  isMuted = muted
  if (muted) {
    stopBgm()
  } else if (bgmRunning) {
    startBgm()
  }
}

function playTone(
  frequency: number,
  duration: number,
  volume = 0.08,
  type: OscillatorType = 'square',
) {
  if (isMuted) return

  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.value = volume
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

export function playSfx(name: SfxName) {
  if (isMuted) return

  switch (name) {
    case 'start':
      playTone(523, 0.08, 0.1)
      setTimeout(() => playTone(659, 0.08, 0.1), 80)
      setTimeout(() => playTone(784, 0.12, 0.1), 160)
      break
    case 'confirm':
      playTone(392, 0.06, 0.12)
      setTimeout(() => playTone(523, 0.06, 0.12), 60)
      setTimeout(() => playTone(659, 0.06, 0.12), 120)
      setTimeout(() => playTone(784, 0.15, 0.14), 180)
      break
    case 'cursor':
      playTone(880, 0.04, 0.05, 'triangle')
      break
  }
}

export function playBattleSfx(name: BattleSfxName) {
  if (isMuted) return

  switch (name) {
    case 'round':
      playTone(98, 0.18, 0.14, 'square')
      setTimeout(() => playTone(196, 0.1, 0.1, 'triangle'), 120)
      setTimeout(() => playTone(294, 0.22, 0.15, 'square'), 280)
      break
    case 'fight':
      playTone(130, 0.05, 0.16, 'sawtooth')
      setTimeout(() => playTone(523, 0.07, 0.13, 'square'), 50)
      setTimeout(() => playTone(784, 0.24, 0.17, 'square'), 130)
      break
    case 'hit':
      playTone(72, 0.05, 0.2, 'square')
      setTimeout(() => playTone(145, 0.04, 0.12, 'sawtooth'), 25)
      setTimeout(() => playTone(90, 0.03, 0.08, 'triangle'), 55)
      break
    case 'ko':
      playTone(494, 0.1, 0.13, 'square')
      setTimeout(() => playTone(370, 0.1, 0.12), 110)
      setTimeout(() => playTone(247, 0.18, 0.14), 220)
      setTimeout(() => playTone(659, 0.08, 0.12), 380)
      setTimeout(() => playTone(784, 0.22, 0.15), 460)
      break
  }
}

function hashCharacterId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** Character-specific confirm jingle — pitch varies by fighter. */
export function playCharacterConfirm(characterId: string) {
  if (isMuted) return

  const h = hashCharacterId(characterId)
  const base = 320 + (h % 180)
  const steps = [0, 1.25, 1.5, 2]
  const delays = [0, 55, 110, 170]
  const type: OscillatorType = h % 2 === 0 ? 'square' : 'triangle'

  steps.forEach((mult, i) => {
    setTimeout(
      () => playTone(Math.round(base * mult), i === 3 ? 0.16 : 0.07, 0.11, type),
      delays[i],
    )
  })
}

function playBgmStep() {
  if (isMuted || !bgmGain) return

  const ctx = getContext()
  const row = BGM_PATTERN[Math.floor(bgmStep / 4) % BGM_PATTERN.length]
  const freq = row[bgmStep % 4]

  const osc = ctx.createOscillator()
  const noteGain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.value = freq
  noteGain.gain.value = 0.04
  noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

  osc.connect(noteGain)
  noteGain.connect(bgmGain)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)

  bgmOscillators.push(osc)
  if (bgmOscillators.length > 8) {
    bgmOscillators = bgmOscillators.slice(-8)
  }

  bgmStep++
}

export function startBgm() {
  if (isMuted) {
    bgmRunning = true
    return
  }

  const ctx = getContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  if (bgmTimer) return

  bgmRunning = true
  bgmGain = ctx.createGain()
  bgmGain.gain.value = 0.5
  bgmGain.connect(ctx.destination)

  bgmTimer = setInterval(playBgmStep, 200)
}

export function stopBgm() {
  bgmRunning = false
  if (bgmTimer) {
    clearInterval(bgmTimer)
    bgmTimer = null
  }
  bgmOscillators.forEach((osc) => {
    try {
      osc.stop()
    } catch {
      // already stopped
    }
  })
  bgmOscillators = []
  if (bgmGain) {
    bgmGain.disconnect()
    bgmGain = null
  }
}

export async function resumeAudio() {
  const ctx = getContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}
