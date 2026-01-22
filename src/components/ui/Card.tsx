import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white
        border-[3px] border-[var(--border)]
        shadow-[var(--shadow)]
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
