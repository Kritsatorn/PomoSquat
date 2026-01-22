import type { HTMLAttributes, ReactNode } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
}

export function Badge({
  children,
  variant = 'primary',
  className = '',
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'bg-[var(--primary)] border-[var(--border)]',
    secondary: 'bg-[var(--secondary)] border-[var(--border)]',
    outline: 'bg-transparent border-[var(--border)]',
  }

  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-sm font-semibold
        border-2
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
