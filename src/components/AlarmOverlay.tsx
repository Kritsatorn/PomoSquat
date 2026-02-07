import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { AlarmType } from '@/hooks/useAlarm'

interface AlarmOverlayProps {
  isActive: boolean
  alarmType: AlarmType | null
  suggestLongBreak?: boolean
  completedPomodoros?: number
  onDismiss: () => void
  onStart: () => void
  onStop: () => void
  onStartLongBreak?: () => void
}

const alarmMessages: Record<AlarmType, { title: string; subtitle: string }> = {
  pomodoro: { title: "TIME'S UP!", subtitle: 'Pomodoro complete' },
  shortBreak: { title: "BREAK'S OVER!", subtitle: 'Short break complete' },
  longBreak: { title: "BREAK'S OVER!", subtitle: 'Long break complete' },
}

function PixelBellIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto mb-4"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="6" y="1" width="4" height="2" fill="currentColor" />
      <rect x="5" y="3" width="6" height="1" fill="currentColor" />
      <rect x="4" y="4" width="8" height="1" fill="currentColor" />
      <rect x="3" y="5" width="10" height="1" fill="currentColor" />
      <rect x="3" y="6" width="10" height="1" fill="currentColor" />
      <rect x="3" y="7" width="10" height="1" fill="currentColor" />
      <rect x="3" y="8" width="10" height="1" fill="currentColor" />
      <rect x="2" y="9" width="12" height="1" fill="currentColor" />
      <rect x="2" y="10" width="12" height="1" fill="currentColor" />
      <rect x="1" y="11" width="14" height="1" fill="currentColor" />
      <rect x="7" y="13" width="2" height="2" fill="currentColor" />
    </svg>
  )
}

export function AlarmOverlay({
  isActive,
  alarmType,
  suggestLongBreak = false,
  completedPomodoros = 0,
  onDismiss,
  onStart,
  onStop,
  onStartLongBreak,
}: AlarmOverlayProps) {
  useEffect(() => {
    if (isActive) {
      onStart()
    } else {
      onStop()
    }
  }, [isActive, onStart, onStop])

  if (!isActive || !alarmType) {
    return null
  }

  const message = alarmMessages[alarmType]

  const handleDismiss = () => {
    onStop()
    onDismiss()
  }

  const handleStartLongBreak = () => {
    onStop()
    onDismiss()
    onStartLongBreak?.()
  }

  const showLongBreakSuggestion = alarmType === 'pomodoro' && suggestLongBreak

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card
        variant="elevated"
        className="alarm-card bg-[var(--primary)] p-10 text-center max-w-sm w-full"
      >
        <PixelBellIcon />

        <h2 className="text-4xl font-[var(--font-heading)] mb-2">
          {message.title}
        </h2>

        <p className="text-xl mb-4 opacity-80">
          {message.subtitle}
        </p>

        {showLongBreakSuggestion && (
          <div className="mb-6 p-4 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-xl">
            <p className="text-sm font-medium">
              {completedPomodoros} pomodoros completed!
            </p>
            <p className="text-sm opacity-80">
              Time for a long break?
            </p>
          </div>
        )}

        <div className="space-y-3">
          {showLongBreakSuggestion && onStartLongBreak && (
            <Button
              size="lg"
              variant="primary"
              onClick={handleStartLongBreak}
              className="w-full text-lg bg-[var(--card-bg)] hover:bg-[var(--secondary)]"
            >
              TAKE LONG BREAK
            </Button>
          )}
          <Button
            size="lg"
            variant="secondary"
            onClick={handleDismiss}
            className="w-full text-lg"
          >
            {showLongBreakSuggestion ? 'DISMISS' : 'DISMISS ALARM'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
