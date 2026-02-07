import { IconButton } from '@/components/ui/IconButton'
import { Chip } from '@/components/ui/Chip'
import type { Task } from '@/types'

interface TaskItemProps {
  task: Task
  index: number
  isSelected: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onUpdateEstimate: (id: string, estimate: number) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
}

function DragIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function TaskItem({
  task,
  index,
  isSelected,
  onToggle,
  onDelete,
  onSelect,
  onUpdateEstimate,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskItemProps) {
  const estimate = task.estimatedPomodoros ?? 0
  const completed = task.completedPomodoros ?? 0
  const isComplete = completed > 0 && completed >= estimate && estimate > 0

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onClick={() => onSelect(task.id)}
      className={`
        flex items-center gap-3 p-3
        bg-[var(--surface-secondary)] border-2 border-[var(--border)]
        rounded-xl
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        min-h-[52px]
        ${isSelected ? 'ring-2 ring-[var(--primary)] bg-[var(--primary)]/20' : 'hover:bg-[var(--secondary)]'}
      `}
    >
      <div className="flex-shrink-0 text-[var(--text-muted)] cursor-grab">
        <DragIcon />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(task.id)
        }}
        className={`
          w-7 h-7 flex-shrink-0
          border-2 border-[var(--border)]
          rounded-lg
          flex items-center justify-center
          transition-colors
          ${task.completed ? 'bg-[var(--primary)]' : 'bg-[var(--card-bg)] hover:bg-[var(--secondary)]'}
        `}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 font-medium ${task.completed ? 'line-through opacity-60' : ''}`}
      >
        {task.text}
      </span>

      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onUpdateEstimate(task.id, Math.max(0, estimate - 1))}
          disabled={estimate === 0}
          className={`
            w-7 h-7 flex items-center justify-center
            border border-[var(--border)] rounded-lg
            transition-colors
            ${estimate === 0 ? 'opacity-30 cursor-default' : 'hover:bg-[var(--secondary)] cursor-pointer'}
          `}
          aria-label="Decrease estimate"
        >
          <MinusIcon />
        </button>

        <Chip
          variant={isComplete ? 'success' : completed > 0 ? 'warning' : 'muted'}
          size="md"
        >
          {completed}/{estimate || '?'}
        </Chip>

        <button
          onClick={() => onUpdateEstimate(task.id, estimate + 1)}
          className="w-7 h-7 flex items-center justify-center border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] cursor-pointer transition-colors"
          aria-label="Increase estimate"
        >
          <PlusIcon />
        </button>
      </div>

      <IconButton
        icon={<TrashIcon />}
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        aria-label="Delete task"
      />
    </div>
  )
}
