import { useState } from 'react'

interface DailyGoalIndicatorProps {
  completed: number
  target: number
  showIndicator: boolean
  onTargetChange: (target: number) => void
}

const TARGET_OPTIONS = [4, 6, 8, 10, 12]

export function DailyGoalIndicator({
  completed,
  target,
  showIndicator,
  onTargetChange,
}: DailyGoalIndicatorProps) {
  const [showSettings, setShowSettings] = useState(false)

  if (!showIndicator) return null

  const progress = Math.min(1, completed / target)
  const isGoalMet = completed >= target

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-xl hover:bg-[var(--secondary)] transition-colors cursor-pointer"
        title="Daily goal progress"
      >
        <div className="flex gap-1">
          {Array.from({ length: Math.min(target, 10) }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 border-2 border-[var(--border)] rounded-sm ${
                i < completed ? 'bg-[var(--primary)]' : 'bg-transparent'
              }`}
            />
          ))}
          {target > 10 && (
            <span className="text-xs ml-0.5">+{target - 10}</span>
          )}
        </div>

        <span
          className={`text-sm font-bold ${isGoalMet ? 'text-emerald-500' : ''}`}
        >
          {completed}/{target}
        </span>

        {isGoalMet && (
          <span className="text-sm" title="Goal complete!">
            ✓
          </span>
        )}
      </button>

      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute left-0 top-full mt-2 z-50 p-4 bg-[var(--card-bg)] border-2 border-[var(--border)] rounded-xl shadow-[6px_6px_0_var(--border)] min-w-[200px]">
            <p className="text-sm font-semibold mb-3">
              Daily Goal: {target} pomodoros
            </p>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onTargetChange(opt)}
                  className={`
                    px-4 py-2 text-sm font-semibold
                    border-2 border-[var(--border)]
                    rounded-lg
                    transition-colors
                    ${
                      target === opt
                        ? 'bg-[var(--primary)]'
                        : 'bg-transparent hover:bg-[var(--secondary)]'
                    }
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              {Math.round(progress * 100)}% complete today
            </p>
          </div>
        </>
      )}
    </div>
  )
}
