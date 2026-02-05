import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import type { TimerMode, Task } from '@/types'

interface TimerProps {
  formattedTime: string
  isRunning: boolean
  mode: TimerMode
  progress: number
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
  progress,
  selectedTask,
  onToggle,
  onReset,
}: TimerProps) {
  const isPaused = !isRunning && progress > 0

  return (
    <Card className="text-center py-10 px-8">
      <p className="text-xl mb-6 font-medium">{modeMessages[mode]}</p>

      <div className="relative inline-block mb-10">
        <ProgressRing progress={progress} size={280} strokeWidth={8} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-7xl font-[var(--font-heading)] tracking-tight">
            {formattedTime}
          </div>
          {isPaused && (
            <div className="pause-indicator mt-2 px-3 py-1 bg-[var(--primary)] border-2 border-[var(--border)] text-sm font-bold">
              PAUSED
            </div>
          )}
        </div>
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
        <div className="mt-16 p-4 bg-[var(--card-secondary)] border-[3px] border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)] mb-1">Working on:</p>
          <p className="font-semibold text-lg">{selectedTask.text}</p>
        </div>
      )}
    </Card>
  )
}
