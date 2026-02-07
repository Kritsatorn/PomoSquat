import { IconButton } from '@/components/ui/IconButton'
import { DailyGoalIndicator } from '@/components/DailyGoalIndicator'

interface HeaderProps {
  completed: number
  dailyTarget: number
  showDailyGoal: boolean
  isDark: boolean
  onTargetChange: (target: number) => void
  onToggleTheme: () => void
  onOpenStats: () => void
  onOpenSettings: () => void
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="6" y="6" width="4" height="4" />
      <rect x="7" y="2" width="2" height="2" />
      <rect x="7" y="12" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" />
      <rect x="12" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="11" y="11" width="2" height="2" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="6" y="2" width="4" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="3" y="6" width="1" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="6" y="12" width="4" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="11" y="6" width="1" height="4" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="8" y="5" width="2" height="1" fill="var(--background)" />
      <rect x="9" y="6" width="1" height="4" fill="var(--background)" />
      <rect x="8" y="10" width="2" height="1" fill="var(--background)" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export function Header({
  completed,
  dailyTarget,
  showDailyGoal,
  isDark,
  onTargetChange,
  onToggleTheme,
  onOpenStats,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="w-full border-b-2 border-[var(--border)] bg-[var(--surface)]">
      <div className="w-full max-w-[920px] mx-auto px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black font-[var(--font-heading)]">
          PomoSquat
        </h1>

        <div className="flex-1 flex justify-center">
          <DailyGoalIndicator
            completed={completed}
            target={dailyTarget}
            showIndicator={showDailyGoal}
            onTargetChange={onTargetChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={<ChartIcon />}
            variant="outline"
            size="sm"
            onClick={onOpenStats}
            aria-label="View statistics"
            title="Statistics"
          />
          <IconButton
            icon={<SettingsIcon />}
            variant="outline"
            size="sm"
            onClick={onOpenSettings}
            aria-label="Open timer settings"
            title="Timer Settings"
          />
          <IconButton
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            variant="secondary"
            size="sm"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </div>
      </div>
    </header>
  )
}
