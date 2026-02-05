import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full
        px-4 py-2.5
        font-[var(--font-body)]
        bg-[var(--card-bg)]
        text-[var(--foreground)]
        border-[3px] border-[var(--border)]
        shadow-[var(--shadow-sm)]
        outline-none
        focus:shadow-[var(--shadow)]
        transition-shadow duration-100
        placeholder:text-[var(--text-muted)]
        ${className}
      `}
      {...props}
    />
  )
}
