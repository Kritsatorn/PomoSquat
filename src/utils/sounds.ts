export type SoundType = 'pixel-bell' | 'pixel-complete' | 'pixel-alert' | 'pixel-coin'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  // Resume if suspended (happens on browsers that require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

function createPixelBell(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(880, startTime)
  osc.frequency.setValueAtTime(1100, startTime + 0.1)
  osc.frequency.setValueAtTime(880, startTime + 0.2)

  gain.gain.setValueAtTime(volume * 0.3, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

  osc.connect(gain).connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + 0.4)
}

function createPixelComplete(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6 - victory arpeggio

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, startTime + i * 0.1)

    gain.gain.setValueAtTime(0, startTime + i * 0.1)
    gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + i * 0.1 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.15)

    osc.connect(gain).connect(ctx.destination)
    osc.start(startTime + i * 0.1)
    osc.stop(startTime + i * 0.1 + 0.2)
  })
}

function createPixelAlert(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime

  // Create two oscillators for a more urgent sound
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, startTime + i * 0.15)
    osc.frequency.setValueAtTime(880, startTime + i * 0.15 + 0.05)

    gain.gain.setValueAtTime(volume * 0.2, startTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.15 + 0.12)

    osc.connect(gain).connect(ctx.destination)
    osc.start(startTime + i * 0.15)
    osc.stop(startTime + i * 0.15 + 0.12)
  }
}

function createPixelCoin(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(988, startTime) // B5
  osc.frequency.setValueAtTime(1319, startTime + 0.08) // E6

  gain.gain.setValueAtTime(volume * 0.25, startTime)
  gain.gain.setValueAtTime(volume * 0.25, startTime + 0.08)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

  osc.connect(gain).connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + 0.3)
}

export function playSound(soundType: SoundType, volume: number): void {
  if (volume <= 0) return

  const ctx = getAudioContext()

  switch (soundType) {
    case 'pixel-bell':
      createPixelBell(ctx, volume)
      break
    case 'pixel-complete':
      createPixelComplete(ctx, volume)
      break
    case 'pixel-alert':
      createPixelAlert(ctx, volume)
      break
    case 'pixel-coin':
      createPixelCoin(ctx, volume)
      break
  }
}

export const SOUND_OPTIONS: { value: SoundType; label: string; description: string }[] = [
  { value: 'pixel-bell', label: 'Pixel Bell', description: 'Classic 8-bit bell chime' },
  { value: 'pixel-complete', label: 'Pixel Complete', description: 'Victory/level-up sound' },
  { value: 'pixel-alert', label: 'Pixel Alert', description: 'Urgent arcade alert' },
  { value: 'pixel-coin', label: 'Pixel Coin', description: 'Coin collect sound' },
]
