import { Button } from '@/components/ui/Button'
import type { Task } from '@/types'

interface TaskItemProps {
  task: Task
  index: number
  isSelected: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDrop: (index: number) => void
}

export function TaskItem({
  task,
  index,
  isSelected,
  onToggle,
  onDelete,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskItemProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onClick={() => onSelect(task.id)}
      className={`
        flex items-center gap-3 p-4 bg-white border-[3px] border-[var(--border)]
        shadow-[var(--shadow-sm)] cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isSelected ? 'ring-4 ring-[var(--primary)] bg-[var(--secondary)]' : 'hover:bg-gray-50'}
      `}
    >
      <div className="flex-shrink-0 text-gray-400 cursor-grab">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(task.id)
        }}
        className={`
          w-6 h-6 flex-shrink-0
          border-[3px] border-[var(--border)]
          flex items-center justify-center
          transition-colors
          ${task.completed ? 'bg-[var(--primary)]' : 'bg-white hover:bg-[var(--secondary)]'}
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
        className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}
      >
        {task.text}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(task.id)
        }}
        aria-label="Delete task"
      >
        Delete
      </Button>
    </div>
  )
}
