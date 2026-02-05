import { SOUND_OPTIONS } from '@/utils/sounds'
import type { SoundType } from '@/utils/sounds'
import type { SoundSettings as SoundSettingsType } from '@/hooks/useSoundSettings'

interface SoundSettingsProps {
  settings: SoundSettingsType
  notificationsEnabled?: boolean
  notificationsSupported?: boolean
  onToggleEnabled: () => void
  onVolumeChange: (volume: number) => void
  onAlarmVolumeChange: (volume: number) => void
  onPomodoroSoundChange: (sound: SoundType) => void
  onSquatSoundChange: (sound: SoundType) => void
  onPreviewSound: (sound: SoundType) => void
  onToggleNotifications?: () => void
}

export function SoundSettings({
  settings,
  notificationsEnabled = false,
  notificationsSupported = true,
  onToggleEnabled,
  onVolumeChange,
  onAlarmVolumeChange,
  onPomodoroSoundChange,
  onSquatSoundChange,
  onPreviewSound,
  onToggleNotifications,
}: SoundSettingsProps) {
  const volumePercent = Math.round(settings.volume * 100)
  const alarmVolumePercent = Math.round(settings.alarmVolume * 100)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Notifications Toggle */}
      {notificationsSupported && onToggleNotifications && (
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
            Notifications:
          </span>
          <button
            onClick={onToggleNotifications}
            style={{
              padding: '6px 16px',
              backgroundColor: notificationsEnabled ? '#22c55e' : '#ef4444',
              border: '2px solid var(--border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            {notificationsEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      )}

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
            border: '2px solid var(--border)',
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
            backgroundColor: 'var(--primary)',
            border: '2px solid var(--border)',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Alarm Volume Slider */}
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
            Alarm vol:
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {alarmVolumePercent}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={alarmVolumePercent}
          onChange={(e) => onAlarmVolumeChange(Number(e.target.value) / 100)}
          style={{
            width: '100%',
            height: '8px',
            appearance: 'none',
            backgroundColor: 'var(--primary)',
            border: '2px solid var(--border)',
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
              backgroundColor: 'var(--input-bg)',
              border: '2px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--foreground)',
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
              backgroundColor: 'var(--primary)',
              border: '2px solid var(--border)',
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
              backgroundColor: 'var(--input-bg)',
              border: '2px solid var(--border)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--foreground)',
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
              backgroundColor: 'var(--primary)',
              border: '2px solid var(--border)',
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
