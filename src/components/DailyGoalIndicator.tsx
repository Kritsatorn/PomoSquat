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
        className="flex items-center gap-2 px-3 py-2"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '2px solid var(--border)',
          cursor: 'pointer',
        }}
        title="Daily goal progress"
      >
        {/* Progress circles */}
        <div className="flex gap-1">
          {Array.from({ length: Math.min(target, 10) }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                border: '2px solid var(--border)',
                backgroundColor: i < completed ? 'var(--primary)' : 'transparent',
              }}
            />
          ))}
          {target > 10 && (
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                marginLeft: '2px',
              }}
            >
              +{target - 10}
            </span>
          )}
        </div>

        {/* Count display */}
        <span
          style={{
            fontSize: '14px',
            fontFamily: 'var(--font-body)',
            fontWeight: 'bold',
            color: isGoalMet ? '#22c55e' : 'var(--foreground)',
          }}
        >
          {completed}/{target}
        </span>

        {isGoalMet && (
          <span style={{ fontSize: '14px' }} title="Goal complete!">
            ✓
          </span>
        )}
      </button>

      {/* Settings dropdown */}
      {showSettings && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettings(false)}
          />
          <div
            className="absolute left-0 top-full mt-2 z-50 p-3"
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '3px solid var(--border)',
              boxShadow: 'var(--shadow)',
              minWidth: '200px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Daily Goal: {target} pomodoros
            </p>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onTargetChange(opt)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '13px',
                    backgroundColor: target === opt ? 'var(--primary)' : 'transparent',
                    border: '2px solid var(--border)',
                    cursor: 'pointer',
                    color: 'var(--foreground)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                marginTop: '8px',
              }}
            >
              {Math.round(progress * 100)}% complete today
            </p>
          </div>
        </>
      )}
    </div>
  )
}
