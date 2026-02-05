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

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'square'
): void {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)

  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.02)
  gain.gain.setValueAtTime(volume * 0.25, startTime + duration * 0.7)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

  osc.connect(gain).connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

// Apple-style melodic bell - repeating chime pattern (~2.5s)
function createPixelBell(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  // Melodic pattern like Apple's "Reflection" tone
  const pattern = [
    { freq: 1047, time: 0, dur: 0.15 },      // C6
    { freq: 1319, time: 0.15, dur: 0.15 },   // E6
    { freq: 1568, time: 0.3, dur: 0.2 },     // G6
    { freq: 0, time: 0.5, dur: 0.3 },        // pause
    // Repeat
    { freq: 1047, time: 0.8, dur: 0.15 },    // C6
    { freq: 1319, time: 0.95, dur: 0.15 },   // E6
    { freq: 1568, time: 1.1, dur: 0.2 },     // G6
    { freq: 0, time: 1.3, dur: 0.3 },        // pause
    // Third time with ending
    { freq: 1047, time: 1.6, dur: 0.15 },    // C6
    { freq: 1319, time: 1.75, dur: 0.15 },   // E6
    { freq: 1568, time: 1.9, dur: 0.15 },    // G6
    { freq: 2093, time: 2.05, dur: 0.4 },    // C7 (high ending)
  ]

  pattern.forEach(({ freq, time, dur }) => {
    if (freq > 0) {
      playNote(ctx, freq, startTime + time, dur, volume, 'square')
    }
  })
}

// Victory fanfare - longer celebratory sound (~2.5s)
function createPixelComplete(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  // Triumphant arpeggio pattern
  const pattern = [
    // First phrase
    { freq: 523, time: 0, dur: 0.12 },       // C5
    { freq: 659, time: 0.12, dur: 0.12 },    // E5
    { freq: 784, time: 0.24, dur: 0.12 },    // G5
    { freq: 1047, time: 0.36, dur: 0.25 },   // C6
    { freq: 0, time: 0.6, dur: 0.2 },        // pause
    // Second phrase (higher)
    { freq: 659, time: 0.8, dur: 0.12 },     // E5
    { freq: 784, time: 0.92, dur: 0.12 },    // G5
    { freq: 1047, time: 1.04, dur: 0.12 },   // C6
    { freq: 1319, time: 1.16, dur: 0.25 },   // E6
    { freq: 0, time: 1.4, dur: 0.2 },        // pause
    // Final flourish
    { freq: 784, time: 1.6, dur: 0.1 },      // G5
    { freq: 1047, time: 1.7, dur: 0.1 },     // C6
    { freq: 1319, time: 1.8, dur: 0.1 },     // E6
    { freq: 1568, time: 1.9, dur: 0.1 },     // G6
    { freq: 2093, time: 2.0, dur: 0.5 },     // C7
  ]

  pattern.forEach(({ freq, time, dur }) => {
    if (freq > 0) {
      playNote(ctx, freq, startTime + time, dur, volume, 'square')
    }
  })
}

// Urgent alert - repeating alarm pattern (~2.5s)
function createPixelAlert(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  // Urgent two-tone alarm like Apple's "Alarm" sound
  const pattern: { freq: number; time: number; dur: number }[] = []

  // Create 4 repeats of the alarm pattern
  for (let i = 0; i < 4; i++) {
    const offset = i * 0.6
    pattern.push(
      { freq: 880, time: offset, dur: 0.12 },        // A5
      { freq: 1109, time: offset + 0.12, dur: 0.12 }, // C#6
      { freq: 880, time: offset + 0.24, dur: 0.12 },  // A5
      { freq: 1109, time: offset + 0.36, dur: 0.12 }, // C#6
    )
  }

  pattern.forEach(({ freq, time, dur }) => {
    playNote(ctx, freq, startTime + time, dur, volume, 'sawtooth')
  })
}

// Coin/notification - cheerful repeating chime (~2s)
function createPixelCoin(ctx: AudioContext, volume: number): void {
  const startTime = ctx.currentTime
  // Playful coin-like pattern
  const pattern = [
    // First chime
    { freq: 988, time: 0, dur: 0.1 },        // B5
    { freq: 1319, time: 0.1, dur: 0.2 },     // E6
    { freq: 0, time: 0.3, dur: 0.15 },       // pause
    // Second chime
    { freq: 988, time: 0.45, dur: 0.1 },     // B5
    { freq: 1319, time: 0.55, dur: 0.2 },    // E6
    { freq: 0, time: 0.75, dur: 0.15 },      // pause
    // Third chime with flourish
    { freq: 988, time: 0.9, dur: 0.1 },      // B5
    { freq: 1319, time: 1.0, dur: 0.1 },     // E6
    { freq: 1480, time: 1.1, dur: 0.1 },     // F#6
    { freq: 1760, time: 1.2, dur: 0.35 },    // A6
    { freq: 0, time: 1.55, dur: 0.15 },      // pause
    // Final double chime
    { freq: 1319, time: 1.7, dur: 0.12 },    // E6
    { freq: 1760, time: 1.82, dur: 0.35 },   // A6
  ]

  pattern.forEach(({ freq, time, dur }) => {
    if (freq > 0) {
      playNote(ctx, freq, startTime + time, dur, volume, 'square')
    }
  })
}

// Short tick/click sound for button feedback
export function playTickSound(volume: number): void {
  if (volume <= 0) return

  const ctx = getAudioContext()
  const startTime = ctx.currentTime

  // Short percussive click
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(800, startTime)
  osc.frequency.exponentialRampToValueAtTime(400, startTime + 0.05)

  gain.gain.setValueAtTime(volume * 0.2, startTime)
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06)

  osc.connect(gain).connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + 0.06)
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
  { value: 'pixel-bell', label: 'Pixel Bell', description: 'Melodic 8-bit chime (~2.5s)' },
  { value: 'pixel-complete', label: 'Pixel Complete', description: 'Victory fanfare (~2.5s)' },
  { value: 'pixel-alert', label: 'Pixel Alert', description: 'Urgent alarm (~2.5s)' },
  { value: 'pixel-coin', label: 'Pixel Coin', description: 'Cheerful chime (~2s)' },
]

export function startSoundLoop(soundType: SoundType, volume: number, intervalMs: number = 3000): () => void {
  if (volume <= 0) return () => {}

  // Play immediately
  playSound(soundType, volume)

  // Set up interval for repeated plays
  const intervalId = window.setInterval(() => {
    playSound(soundType, volume)
  }, intervalMs)

  // Return cleanup function
  return () => {
    window.clearInterval(intervalId)
  }
}
