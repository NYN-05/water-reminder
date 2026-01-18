const AUDIO_CONTEXT = typeof window !== 'undefined'
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null

export const SOUND_OPTIONS = [
  { id: 'beep', name: 'Beep' },
  { id: 'chime', name: 'Chime' },
  { id: 'soft', name: 'Soft Pulse' },
]

function playTone({ frequency, duration, type = 'sine', volume = 0.2, startAt = 0 }) {
  if (!AUDIO_CONTEXT) return

  const oscillator = AUDIO_CONTEXT.createOscillator()
  const gainNode = AUDIO_CONTEXT.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency
  gainNode.gain.value = volume

  oscillator.connect(gainNode)
  gainNode.connect(AUDIO_CONTEXT.destination)

  const now = AUDIO_CONTEXT.currentTime
  oscillator.start(now + startAt)
  oscillator.stop(now + startAt + duration)
}

export function playSound(soundId, volumeMultiplier = 1) {
  if (!AUDIO_CONTEXT) return

  // Ensure the context is unlocked (some browsers require user interaction first).
  if (AUDIO_CONTEXT.state === 'suspended') {
    AUDIO_CONTEXT.resume().catch(() => {})
  }

  switch (soundId) {
    case 'chime':
      playTone({ frequency: 880, duration: 0.15, volume: 0.25 * volumeMultiplier })
      playTone({ frequency: 660, duration: 0.2, volume: 0.2 * volumeMultiplier, startAt: 0.18 })
      break
    case 'soft':
      playTone({
        frequency: 440,
        duration: 0.25,
        volume: 0.15 * volumeMultiplier,
        type: 'triangle',
      })
      break
    case 'beep':
    default:
      playTone({ frequency: 520, duration: 0.18, volume: 0.22 * volumeMultiplier })
      break
  }
}
