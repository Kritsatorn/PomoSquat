import { Button } from '@/components/ui/Button'
import type { TimerMode } from '@/types'

interface ModeSelectorProps {
  currentMode: TimerMode
  onModeChange: (mode: TimerMode) => void
}

const modes: { key: TimerMode; label: string }[] = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
]

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {modes.map(({ key, label }) => (
        <Button
          key={key}
          variant={currentMode === key ? 'primary' : 'outline'}
          size="md"
          onClick={() => onModeChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
