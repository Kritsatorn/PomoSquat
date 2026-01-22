import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-[var(--font-body)] font-semibold
    border-[3px] border-[var(--border)]
    transition-all duration-100
    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0
  `

  const variants = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-[var(--shadow)]',
    secondary: 'bg-[var(--secondary)] hover:bg-[var(--primary)] shadow-[var(--shadow)]',
    outline: 'bg-transparent hover:bg-[var(--secondary)] shadow-[var(--shadow)]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
