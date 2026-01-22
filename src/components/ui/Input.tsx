import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full
        px-4 py-2.5
        font-[var(--font-body)]
        bg-white
        border-[3px] border-[var(--border)]
        shadow-[var(--shadow-sm)]
        outline-none
        focus:shadow-[var(--shadow)]
        transition-shadow duration-100
        placeholder:text-gray-400
        ${className}
      `}
      {...props}
    />
  )
}
