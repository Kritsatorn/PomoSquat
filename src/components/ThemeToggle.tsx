import { IconButton } from '@/components/ui/IconButton'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
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

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <IconButton
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      variant="secondary"
      size="md"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  )
}
