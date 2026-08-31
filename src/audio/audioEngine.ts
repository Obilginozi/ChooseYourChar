type SfxName = 'start' | 'confirm' | 'cursor'

let audioContext: AudioContext | null = null
let bgmOscillators: OscillatorNode[] = []
let bgmGain: GainNode | null = null
let bgmStep = 0
let bgmTimer: ReturnType<typeof setInterval> | null = null
let isMuted = true
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
