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
      {/* Sun center */}
      <rect x="6" y="6" width="4" height="4" />
      {/* Rays */}
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
      {/* Moon crescent */}
      <rect x="6" y="2" width="4" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="3" y="6" width="1" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="6" y="12" width="4" height="2" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="11" y="6" width="1" height="4" />
      <rect x="10" y="4" width="2" height="2" />
      {/* Inner cutout for crescent */}
      <rect x="8" y="5" width="2" height="1" fill="var(--background)" />
      <rect x="9" y="6" width="1" height="4" fill="var(--background)" />
      <rect x="8" y="10" width="2" height="1" fill="var(--background)" />
    </svg>
  )
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        padding: '10px',
        backgroundColor: 'var(--secondary)',
        border: '3px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--foreground)',
        zIndex: 40,
        transition: 'background-color 0.2s, transform 0.1s',
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
