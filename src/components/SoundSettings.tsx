import { SOUND_OPTIONS } from '@/utils/sounds'
import type { SoundType } from '@/utils/sounds'
import type { SoundSettings as SoundSettingsType } from '@/hooks/useSoundSettings'

interface SoundSettingsProps {
  settings: SoundSettingsType
  onToggleEnabled: () => void
  onVolumeChange: (volume: number) => void
  onPomodoroSoundChange: (sound: SoundType) => void
  onSquatSoundChange: (sound: SoundType) => void
  onPreviewSound: (sound: SoundType) => void
}

export function SoundSettings({
  settings,
  onToggleEnabled,
  onVolumeChange,
  onPomodoroSoundChange,
  onSquatSoundChange,
  onPreviewSound,
}: SoundSettingsProps) {
  const volumePercent = Math.round(settings.volume * 100)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Sound Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Sound:
        </span>
        <button
          onClick={onToggleEnabled}
          style={{
            padding: '6px 16px',
            backgroundColor: settings.enabled ? '#22c55e' : '#ef4444',
            border: '2px solid #1c1917',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Volume Slider */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: settings.enabled ? 1 : 0.5,
          pointerEvents: settings.enabled ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          >
            Volume:
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {volumePercent}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volumePercent}
          onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
          style={{
            width: '100%',
            height: '8px',
            appearance: 'none',
            backgroundColor: '#fbbf24',
            border: '2px solid #1c1917',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Pomodoro Sound Selector */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: settings.enabled ? 1 : 0.5,
          pointerEvents: settings.enabled ? 'auto' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          }}
        >
          Pomo sound:
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={settings.pomodoroSound}
            onChange={(e) => onPomodoroSoundChange(e.target.value as SoundType)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#fef3c7',
              border: '2px solid #1c1917',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {SOUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onPreviewSound(settings.pomodoroSound)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fbbf24',
              border: '2px solid #1c1917',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
            }}
            title="Test sound"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Squat Sound Selector */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          opacity: settings.enabled ? 1 : 0.5,
          pointerEvents: settings.enabled ? 'auto' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          }}
        >
          Squat sound:
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={settings.squatSound}
            onChange={(e) => onSquatSoundChange(e.target.value as SoundType)}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#fef3c7',
              border: '2px solid #1c1917',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {SOUND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onPreviewSound(settings.squatSound)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fbbf24',
              border: '2px solid #1c1917',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
            }}
            title="Test sound"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  )
}
