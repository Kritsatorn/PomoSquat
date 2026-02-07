interface SegmentOption<T extends string> {
  key: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex gap-1 p-1.5 bg-[var(--surface-secondary)] border-2 border-[var(--border)] rounded-xl">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`
            px-4 py-2 text-sm font-semibold rounded-lg
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1
            ${
              value === option.key
                ? 'bg-[var(--primary)] shadow-[2px_2px_0_var(--border)]'
                : 'bg-transparent hover:bg-[var(--card-bg)]'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
