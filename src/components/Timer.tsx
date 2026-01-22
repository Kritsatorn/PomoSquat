import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { TimerMode, Task } from '@/types'

interface TimerProps {
  formattedTime: string
  isRunning: boolean
  mode: TimerMode
  selectedTask: Task | null
  onToggle: () => void
  onReset: () => void
}

const modeMessages: Record<TimerMode, string> = {
  pomodoro: 'Time to focus!',
  shortBreak: 'Take a short break!',
  longBreak: 'Take a long break!',
}

export function Timer({
  formattedTime,
  isRunning,
  mode,
  selectedTask,
  onToggle,
  onReset,
}: TimerProps) {
  return (
    <Card className="text-center py-10 px-8">
      <p className="text-xl mb-6 font-medium">{modeMessages[mode]}</p>

      <div className="text-9xl font-[var(--font-heading)] tracking-tight mb-10">
        {formattedTime}
      </div>

      <div className="flex justify-center gap-10">
        <Button
          size="lg"
          variant="primary"
          onClick={onToggle}
          className="min-w-[160px]"
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      {selectedTask && (
        <div className="mt-16 p-4 bg-[var(--secondary)] border-[3px] border-[var(--border)]">
          <p className="text-sm text-gray-600 mb-1">Working on:</p>
          <p className="font-semibold text-lg">{selectedTask.text}</p>
        </div>
      )}
    </Card>
  )
}
