import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'muted'
  size?: 'sm' | 'md'
}

export function Chip({ children, variant = 'default', size = 'sm' }: ChipProps) {
  const variants = {
    default: 'bg-[var(--card-secondary)] text-[var(--foreground)]',
    success: 'bg-[var(--success)] text-white',
    warning: 'bg-[var(--primary)] text-[var(--foreground)]',
    muted: 'bg-[var(--surface-secondary)] text-[var(--text-muted)]',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`
        inline-flex items-center
        font-semibold font-[var(--font-body)]
        border border-[var(--border)]
        rounded-lg
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  )
}
