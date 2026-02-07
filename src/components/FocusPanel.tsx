import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { TimerMode, Task } from '@/types'

interface FocusPanelProps {
  formattedTime: string
  isRunning: boolean
  mode: TimerMode
  progress: number
  selectedTask: Task | null
  onToggle: () => void
  onReset: () => void
  onModeChange: (mode: TimerMode) => void
}

const modeLabels: Record<TimerMode, string> = {
  pomodoro: 'FOCUS',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK',
}

const modeOptions: { key: TimerMode; label: string }[] = [
  { key: 'pomodoro', label: 'Pomodoro' },
  { key: 'shortBreak', label: 'Short Break' },
  { key: 'longBreak', label: 'Long Break' },
]

export function FocusPanel({
  formattedTime,
  isRunning,
  mode,
  progress,
  selectedTask,
  onToggle,
  onReset,
  onModeChange,
}: FocusPanelProps) {
  const isPaused = !isRunning && progress > 0

  return (
    <Card className="p-8">
      {/* Header with tabs */}
      <div className="flex items-center justify-center mb-6">
        <SegmentedControl
          options={modeOptions}
          value={mode}
          onChange={onModeChange}
        />
      </div>

      {/* Timer section */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
          {modeLabels[mode]}
        </p>

        <div className="relative inline-block mb-6">
          <ProgressRing progress={progress} size={260} strokeWidth={8} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl md:text-7xl font-black font-[var(--font-heading)] tracking-tight tabular-nums">
              {formattedTime}
            </div>
            {isPaused && (
              <div className="pause-indicator mt-2 px-3 py-1 bg-[var(--primary)] border-2 border-[var(--border)] rounded-xl text-xs font-bold uppercase tracking-wide">
                Paused
              </div>
            )}
          </div>
        </div>

        {/* Action buttons - aligned row with consistent height */}
        <div className="flex justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            onClick={onToggle}
            className="min-w-[140px] h-12"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className="h-12"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Selected task indicator */}
      {selectedTask && (
        <div className="mt-6 p-4 bg-[var(--surface-secondary)] border-2 border-[var(--border)] rounded-xl">
          <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wide">Working on</p>
          <p className="font-semibold">{selectedTask.text}</p>
        </div>
      )}
    </Card>
  )
}
