import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'elevated'
}

export function Card({ children, className = '', variant = 'default', ...props }: CardProps) {
  const variantStyles = {
    default: 'shadow-[4px_4px_0_var(--border)]',
    elevated: 'shadow-[6px_6px_0_var(--border)]',
  }

  return (
    <div
      className={`
        bg-[var(--card-bg)]
        border-2 border-[var(--border)]
        ${variantStyles[variant]}
        rounded-2xl
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
