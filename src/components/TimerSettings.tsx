import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { TimerSettings as TimerSettingsType } from '@/hooks/useTimerSettings'

interface TimerSettingsProps {
  settings: TimerSettingsType
  onPomodoroDurationChange: (minutes: number) => void
  onShortBreakDurationChange: (minutes: number) => void
  onLongBreakDurationChange: (minutes: number) => void
  onPomodorosUntilLongBreakChange: (count: number) => void
  onResetToDefaults: () => void
}

const DURATION_PRESETS = {
  pomodoro: [15, 20, 25, 30, 45, 50],
  shortBreak: [3, 5, 10, 15],
  longBreak: [10, 15, 20, 30],
}

const POMODOROS_UNTIL_LONG_BREAK_OPTIONS = [2, 3, 4, 5, 6]

export function TimerSettings({
  settings,
  onPomodoroDurationChange,
  onShortBreakDurationChange,
  onLongBreakDurationChange,
  onPomodorosUntilLongBreakChange,
  onResetToDefaults,
}: TimerSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const pomodoroMinutes = Math.round(settings.pomodoro / 60)
  const shortBreakMinutes = Math.round(settings.shortBreak / 60)
  const longBreakMinutes = Math.round(settings.longBreak / 60)

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        Timer Settings
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 p-4 min-w-[280px]"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '3px solid var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h3 className="font-bold mb-4 text-lg">Timer Durations</h3>

            {/* Pomodoro Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Pomodoro: {pomodoroMinutes} min
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.pomodoro.map((min) => (
                  <button
                    key={min}
                    onClick={() => onPomodoroDurationChange(min)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '13px',
                      backgroundColor: pomodoroMinutes === min ? 'var(--primary)' : 'transparent',
                      border: '2px solid var(--border)',
                      cursor: 'pointer',
                      color: 'var(--foreground)',
                    }}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>

            {/* Short Break Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Short Break: {shortBreakMinutes} min
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.shortBreak.map((min) => (
                  <button
                    key={min}
                    onClick={() => onShortBreakDurationChange(min)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '13px',
                      backgroundColor: shortBreakMinutes === min ? 'var(--primary)' : 'transparent',
                      border: '2px solid var(--border)',
                      cursor: 'pointer',
                      color: 'var(--foreground)',
                    }}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>

            {/* Long Break Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Long Break: {longBreakMinutes} min
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.longBreak.map((min) => (
                  <button
                    key={min}
                    onClick={() => onLongBreakDurationChange(min)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '13px',
                      backgroundColor: longBreakMinutes === min ? 'var(--primary)' : 'transparent',
                      border: '2px solid var(--border)',
                      cursor: 'pointer',
                      color: 'var(--foreground)',
                    }}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>

            {/* Pomodoros until long break */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Long break after: {settings.pomodorosUntilLongBreak} pomodoros
              </label>
              <div className="flex flex-wrap gap-2">
                {POMODOROS_UNTIL_LONG_BREAK_OPTIONS.map((count) => (
                  <button
                    key={count}
                    onClick={() => onPomodorosUntilLongBreakChange(count)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '13px',
                      backgroundColor: settings.pomodorosUntilLongBreak === count ? 'var(--primary)' : 'transparent',
                      border: '2px solid var(--border)',
                      cursor: 'pointer',
                      color: 'var(--foreground)',
                    }}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                height: '2px',
                backgroundColor: 'var(--border)',
                margin: '12px 0',
              }}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={onResetToDefaults}
              className="w-full"
            >
              Reset to Defaults
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
