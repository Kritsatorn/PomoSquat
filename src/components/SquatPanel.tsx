import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Modal } from '@/components/ui/Modal'
import { SquatCharacter } from './SquatCharacter'
import { SoundSettings } from './SoundSettings'
import type { SoundSettings as SoundSettingsType } from '@/hooks/useSoundSettings'
import type { SoundType } from '@/utils/sounds'

interface SquatPanelProps {
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

function SettingsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function SquatPanel({
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
}: SquatPanelProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isWarning = timeUntilSquat <= 60 && timeUntilSquat > 0

  if (isSquatTime && !isDoingSquats) {
    onStartSquats()
  }

  return (
    <>
      <Card className="p-0 overflow-hidden">
        {/* Yellow accent header strip */}
        <div className="bg-[var(--primary)] px-4 py-3 border-b-2 border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide">Squat Timer</h3>
            <div className="flex items-center gap-2">
              <IconButton
                icon={<SettingsIcon />}
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                aria-label="Open squat settings"
                className="bg-white/80 hover:bg-white"
              />
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 hover:bg-white/30 rounded-lg transition-colors lg:hidden"
                aria-label={isCollapsed ? 'Expand squat panel' : 'Collapse squat panel'}
              >
                <ChevronIcon isExpanded={!isCollapsed} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible content */}
        {isCollapsed ? (
          <div className="flex items-center justify-between px-4 py-3 lg:hidden">
            <span className="text-sm text-[var(--text-muted)]">Next squat:</span>
            <span className={`font-bold ${isWarning ? 'text-red-500' : ''}`}>
              {isDoingSquats ? 'Squatting!' : formattedTime}
            </span>
          </div>
        ) : (
          <div className="p-6 pt-5">
            {/* Character in inset panel */}
            <div className="bg-[var(--surface-secondary)] border-2 border-[var(--border)] rounded-xl p-4 mb-5 flex justify-center">
              <SquatCharacter
                isSquatting={isDoingSquats}
                onSquatsComplete={onCompleteSquats}
              />
            </div>

            {/* Countdown */}
            <div className="text-center mb-5">
              <p className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
                Next squat in
              </p>
              <p
                className={`text-4xl font-black font-[var(--font-heading)] tabular-nums ${
                  isWarning ? 'squat-warning text-red-600' : ''
                }`}
              >
                {isDoingSquats ? '--:--' : formattedTime}
              </p>
            </div>

            {/* Action button */}
            <Button
              variant="success"
              size="md"
              onClick={() => {
                onStartSquats()
                onPlaySquatSound()
              }}
              disabled={isDoingSquats}
              className="w-full h-12"
            >
              {isDoingSquats ? 'Squatting...' : 'Do Squats!'}
            </Button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Squat Settings"
      >
        <div className="space-y-6">
          <div>
            <p className="font-semibold mb-3 text-sm">Squat interval</p>
            <div className="flex flex-wrap gap-2">
              {INTERVAL_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => onConfigureInterval(minutes)}
                  className={`
                    px-4 py-2 text-sm font-semibold
                    border-2 border-[var(--border)]
                    rounded-xl
                    transition-colors
                    ${
                      squatInterval === minutes
                        ? 'bg-[var(--primary)]'
                        : 'bg-transparent hover:bg-[var(--secondary)]'
                    }
                  `}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[var(--border)]" />

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
      </Modal>
    </>
  )
}
