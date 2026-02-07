import { Modal } from '@/components/ui/Modal'

interface DailyStats {
  date: string
  pomodoros: number
  focusMinutes: number
  shortBreaks: number
  longBreaks: number
}

interface StatisticsProps {
  isOpen: boolean
  onClose: () => void
  totalPomodoros: number
  totalFocusMinutes: number
  currentStreak: number
  longestStreak: number
  todayStats: DailyStats | null
  weekStats: DailyStats[]
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function StatCard({
  label,
  value,
  subValue,
}: {
  label: string
  value: string | number
  subValue?: string
}) {
  return (
    <div className="p-4 bg-[var(--card-secondary)] border-2 border-[var(--border)] rounded-xl text-center">
      <div className="text-2xl font-black font-[var(--font-heading)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
      {subValue && (
        <div className="text-xs text-[var(--text-muted)] mt-1">
          {subValue}
        </div>
      )}
    </div>
  )
}

export function Statistics({
  isOpen,
  onClose,
  totalPomodoros,
  totalFocusMinutes,
  currentStreak,
  longestStreak,
  todayStats,
  weekStats,
}: StatisticsProps) {
  const todayPomodoros = todayStats?.pomodoros ?? 0
  const todayFocusMinutes = todayStats?.focusMinutes ?? 0

  const weekPomodoros = weekStats.reduce((sum, d) => sum + d.pomodoros, 0)
  const weekFocusMinutes = weekStats.reduce((sum, d) => sum + d.focusMinutes, 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">Today</h4>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Pomodoros" value={todayPomodoros} />
            <StatCard label="Focus Time" value={formatMinutes(todayFocusMinutes)} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">This Week</h4>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Pomodoros" value={weekPomodoros} />
            <StatCard label="Focus Time" value={formatMinutes(weekFocusMinutes)} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">Streaks</h4>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Current Streak"
              value={currentStreak}
              subValue={currentStreak === 1 ? 'day' : 'days'}
            />
            <StatCard
              label="Longest Streak"
              value={longestStreak}
              subValue={longestStreak === 1 ? 'day' : 'days'}
            />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-[var(--text-muted)]">All Time</h4>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Pomodoros" value={totalPomodoros} />
            <StatCard label="Total Focus" value={formatMinutes(totalFocusMinutes)} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
