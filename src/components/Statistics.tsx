import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface DailyStats {
  date: string
  pomodoros: number
  focusMinutes: number
  shortBreaks: number
  longBreaks: number
}

interface StatisticsProps {
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
    <div
      style={{
        padding: '12px',
        backgroundColor: 'var(--card-secondary)',
        border: '2px solid var(--border)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontFamily: 'var(--font-heading)',
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
      {subValue && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          {subValue}
        </div>
      )}
    </div>
  )
}

export function Statistics({
  totalPomodoros,
  totalFocusMinutes,
  currentStreak,
  longestStreak,
  todayStats,
  weekStats,
}: StatisticsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const todayPomodoros = todayStats?.pomodoros ?? 0
  const todayFocusMinutes = todayStats?.focusMinutes ?? 0

  // Calculate week totals
  const weekPomodoros = weekStats.reduce((sum, d) => sum + d.pomodoros, 0)
  const weekFocusMinutes = weekStats.reduce((sum, d) => sum + d.focusMinutes, 0)

  return (
    <div className="relative inline-block">
      <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
        Statistics
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute left-0 top-full mt-2 z-50 min-w-[320px]"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '3px solid var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div className="p-4">
              <h3 className="font-bold text-lg mb-4">Statistics</h3>

              {/* Today's Stats */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-[var(--text-muted)]">Today</h4>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="Pomodoros" value={todayPomodoros} />
                  <StatCard label="Focus Time" value={formatMinutes(todayFocusMinutes)} />
                </div>
              </div>

              {/* Week Stats */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-[var(--text-muted)]">This Week</h4>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="Pomodoros" value={weekPomodoros} />
                  <StatCard label="Focus Time" value={formatMinutes(weekFocusMinutes)} />
                </div>
              </div>

              {/* Streaks */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-[var(--text-muted)]">Streaks</h4>
                <div className="grid grid-cols-2 gap-2">
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

              {/* All Time */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-[var(--text-muted)]">All Time</h4>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label="Total Pomodoros" value={totalPomodoros} />
                  <StatCard label="Total Focus" value={formatMinutes(totalFocusMinutes)} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
