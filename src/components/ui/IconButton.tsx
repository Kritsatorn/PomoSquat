import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  'aria-label': string
}

export function IconButton({
  icon,
  variant = 'secondary',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const baseStyles = `
    flex items-center justify-center
    border-2 border-[var(--border)]
    rounded-xl
    transition-all duration-100
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
  `

  const variants = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-[3px_3px_0_var(--border)]',
    secondary: 'bg-[var(--secondary)] hover:bg-[var(--primary)] shadow-[3px_3px_0_var(--border)]',
    outline: 'bg-transparent hover:bg-[var(--secondary)] shadow-[3px_3px_0_var(--border)]',
    danger: 'bg-[var(--danger)] hover:opacity-90 shadow-[3px_3px_0_var(--border)] text-white',
    success: 'bg-[var(--success)] hover:opacity-90 shadow-[3px_3px_0_var(--border)] text-white',
  }

  const sizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-12 h-12',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
