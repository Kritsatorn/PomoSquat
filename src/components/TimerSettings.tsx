import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { TimerSettings as TimerSettingsType } from '@/hooks/useTimerSettings'

interface TimerSettingsProps {
  isOpen: boolean
  onClose: () => void
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

function DurationSelector({
  label,
  currentValue,
  options,
  onChange,
}: {
  label: string
  currentValue: number
  options: number[]
  onChange: (value: number) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}: {currentValue} min
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((value) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`
              px-4 py-2 text-sm font-semibold
              border-2 border-[var(--border)]
              rounded-lg
              transition-colors
              ${
                currentValue === value
                  ? 'bg-[var(--primary)]'
                  : 'bg-transparent hover:bg-[var(--secondary)]'
              }
            `}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TimerSettings({
  isOpen,
  onClose,
  settings,
  onPomodoroDurationChange,
  onShortBreakDurationChange,
  onLongBreakDurationChange,
  onPomodorosUntilLongBreakChange,
  onResetToDefaults,
}: TimerSettingsProps) {
  const pomodoroMinutes = Math.round(settings.pomodoro / 60)
  const shortBreakMinutes = Math.round(settings.shortBreak / 60)
  const longBreakMinutes = Math.round(settings.longBreak / 60)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Timer Settings">
      <div className="space-y-6">
        <DurationSelector
          label="Pomodoro"
          currentValue={pomodoroMinutes}
          options={DURATION_PRESETS.pomodoro}
          onChange={onPomodoroDurationChange}
        />

        <DurationSelector
          label="Short Break"
          currentValue={shortBreakMinutes}
          options={DURATION_PRESETS.shortBreak}
          onChange={onShortBreakDurationChange}
        />

        <DurationSelector
          label="Long Break"
          currentValue={longBreakMinutes}
          options={DURATION_PRESETS.longBreak}
          onChange={onLongBreakDurationChange}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Long break after: {settings.pomodorosUntilLongBreak} pomodoros
          </label>
          <div className="flex flex-wrap gap-2">
            {POMODOROS_UNTIL_LONG_BREAK_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => onPomodorosUntilLongBreakChange(count)}
                className={`
                  px-4 py-2 text-sm font-semibold
                  border-2 border-[var(--border)]
                  rounded-lg
                  transition-colors
                  ${
                    settings.pomodorosUntilLongBreak === count
                      ? 'bg-[var(--primary)]'
                      : 'bg-transparent hover:bg-[var(--secondary)]'
                  }
                `}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="h-0.5 bg-[var(--border)]" />

        <Button
          variant="outline"
          size="md"
          onClick={onResetToDefaults}
          className="w-full"
        >
          Reset to Defaults
        </Button>
      </div>
    </Modal>
  )
}
