import { useState } from 'react'
import { SquatCharacter } from './SquatCharacter'
import { SoundSettings } from './SoundSettings'
import type { SoundSettings as SoundSettingsType } from '@/hooks/useSoundSettings'
import type { SoundType } from '@/utils/sounds'

interface SquatTimerProps {
  formattedTime: string
  timeUntilSquat: number
  isSquatTime: boolean
  isDoingSquats: boolean
  squatInterval: number
  soundSettings: SoundSettingsType
  notificationsEnabled?: boolean
  notificationsSupported?: boolean
  onStartSquats: () => void
  onCompleteSquats: () => void
  onConfigureInterval: (minutes: number) => void
  onToggleSoundEnabled: () => void
  onVolumeChange: (volume: number) => void
  onAlarmVolumeChange: (volume: number) => void
  onPomodoroSoundChange: (sound: SoundType) => void
  onSquatSoundChange: (sound: SoundType) => void
  onPreviewSound: (sound: SoundType) => void
  onPlaySquatSound: () => void
  onToggleNotifications?: () => void
}

const INTERVAL_OPTIONS = [15, 20, 30, 45, 60]

export function SquatTimer({
  formattedTime,
  timeUntilSquat,
  isSquatTime,
  isDoingSquats,
  squatInterval,
  soundSettings,
  notificationsEnabled,
  notificationsSupported,
  onStartSquats,
  onCompleteSquats,
  onConfigureInterval,
  onToggleSoundEnabled,
  onVolumeChange,
  onAlarmVolumeChange,
  onPomodoroSoundChange,
  onSquatSoundChange,
  onPreviewSound,
  onPlaySquatSound,
  onToggleNotifications,
}: SquatTimerProps) {
  const [showSettings, setShowSettings] = useState(false)

  // Warning state when less than 1 minute remaining
  const isWarning = timeUntilSquat <= 60 && timeUntilSquat > 0

  const handleIntervalChange = (minutes: number) => {
    onConfigureInterval(minutes)
  }

  // If it's squat time and not doing squats yet, start them
  if (isSquatTime && !isDoingSquats) {
    onStartSquats()
  }

  return (
    <div
      className="squat-timer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: '32px',
        backgroundColor: 'var(--card-secondary)',
        border: '4px solid var(--border)',
        boxShadow: '6px 6px 0px var(--border)',
        minWidth: '220px',
      }}
    >
      {/* Character */}
      <SquatCharacter
        isSquatting={isDoingSquats}
        onSquatsComplete={onCompleteSquats}
      />

      {/* Timer display */}
      <div
        className="squat-timer-display"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--foreground)',
          }}
        >
          Next squat in:
        </span>
        <span
          className={isWarning ? 'squat-warning' : ''}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '32px',
            color: isWarning ? '#dc2626' : 'var(--foreground)',
            fontWeight: 'bold',
          }}
        >
          {isDoingSquats ? '--:--' : formattedTime}
        </span>
      </div>

      {/* Manual Squat Button */}
      <button
        onClick={() => {
          onStartSquats()
          onPlaySquatSound()
        }}
        disabled={isDoingSquats}
        style={{
          padding: '12px 24px',
          backgroundColor: isDoingSquats ? 'var(--secondary)' : '#22c55e',
          border: '3px solid var(--border)',
          boxShadow: isDoingSquats ? 'none' : '3px 3px 0px var(--border)',
          cursor: isDoingSquats ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: isDoingSquats ? 'var(--text-muted)' : '#fff',
        }}
      >
        {isDoingSquats ? 'Squatting...' : 'Do Squats!'}
      </button>

      {/* Settings button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--primary)',
            border: '3px solid var(--border)',
            boxShadow: '3px 3px 0px var(--border)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Settings</span>
        </button>

        {/* Settings dropdown */}
        {showSettings && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              backgroundColor: 'var(--card-bg)',
              border: '3px solid var(--border)',
              boxShadow: '4px 4px 0px var(--border)',
              padding: '16px',
              zIndex: 10,
              minWidth: '240px',
            }}
          >
            {/* Squat Interval */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                marginBottom: '12px',
                fontWeight: '600',
              }}
            >
              Squat interval:
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '16px',
              }}
            >
              {INTERVAL_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => handleIntervalChange(minutes)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: squatInterval === minutes ? 'var(--primary)' : 'transparent',
                    border: '2px solid var(--border)',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                  }}
                >
                  {minutes}m
                </button>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: '2px',
                backgroundColor: 'var(--border)',
                margin: '16px 0',
              }}
            />

            {/* Sound Settings */}
            <SoundSettings
              settings={soundSettings}
              notificationsEnabled={notificationsEnabled}
              notificationsSupported={notificationsSupported}
              onToggleEnabled={onToggleSoundEnabled}
              onVolumeChange={onVolumeChange}
              onAlarmVolumeChange={onAlarmVolumeChange}
              onPomodoroSoundChange={onPomodoroSoundChange}
              onSquatSoundChange={onSquatSoundChange}
              onPreviewSound={onPreviewSound}
              onToggleNotifications={onToggleNotifications}
            />
          </div>
        )}
      </div>
    </div>
  )
}
