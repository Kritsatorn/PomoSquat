import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TaskItem } from '@/components/TaskItem'
import type { Task } from '@/types'

const STORAGE_KEY = 'pomodoro-tasks'
const SELECTED_TASK_KEY = 'pomodoro-selected-task'

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadSelectedTaskId(): string | null {
  return localStorage.getItem(SELECTED_TASK_KEY)
}

function saveSelectedTaskId(id: string | null) {
  if (id) {
    localStorage.setItem(SELECTED_TASK_KEY, id)
  } else {
    localStorage.removeItem(SELECTED_TASK_KEY)
  }
}

interface TaskListProps {
  onSelectedTaskChange: (task: Task | null) => void
  onAddTaskRef?: (addTask: () => void) => void
  onIncrementPomodoroRef?: (fn: () => void) => void
}

function EmptyState() {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-[var(--surface-secondary)] border-2 border-[var(--border)] flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--text-muted)]"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </div>
      <p className="text-[var(--text-muted)] font-medium text-sm">No tasks yet</p>
      <p className="text-xs text-[var(--text-muted)] mt-1">Add a task to get started</p>
    </div>
  )
}

export function TaskList({ onSelectedTaskChange, onAddTaskRef, onIncrementPomodoroRef }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(loadSelectedTaskId)
  const [newTaskText, setNewTaskText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    saveSelectedTaskId(selectedTaskId)
    const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null
    onSelectedTaskChange(selectedTask)
  }, [selectedTaskId, tasks, onSelectedTaskChange])

  useEffect(() => {
    if (onAddTaskRef) {
      onAddTaskRef(() => setIsAdding(true))
    }
  }, [onAddTaskRef])

  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskText('')
    setIsAdding(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    if (selectedTaskId === id) {
      setSelectedTaskId(null)
    }
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const selectTask = (id: string) => {
    setSelectedTaskId((prev) => (prev === id ? null : id))
  }

  const updateTaskEstimate = (id: string, estimate: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, estimatedPomodoros: estimate } : task
      )
    )
  }

  const incrementTaskPomodoro = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completedPomodoros: (task.completedPomodoros ?? 0) + 1 }
          : task
      )
    )
  }

  useEffect(() => {
    if (onIncrementPomodoroRef) {
      onIncrementPomodoroRef(() => {
        if (selectedTaskId) {
          incrementTaskPomodoro(selectedTaskId)
        }
      })
    }
  }, [onIncrementPomodoroRef, selectedTaskId])

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    dragOverItem.current = index
  }

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) return

    const newTasks = [...tasks]
    const draggedTask = newTasks[dragItem.current]
    newTasks.splice(dragItem.current, 1)
    newTasks.splice(dragOverItem.current, 0, draggedTask)

    setTasks(newTasks)
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTaskText('')
    }
  }

  return (
    <Card className="p-6">
      {/* Header row: Tasks left, Add Task right */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        {!isAdding && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-9"
          >
            + Add Task
          </Button>
        )}
      </div>

      {/* Add task form */}
      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="What are you working on?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button variant="primary" size="sm" onClick={addTask} className="h-11">
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAdding(false)
              setNewTaskText('')
            }}
            className="h-11"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              isSelected={selectedTaskId === task.id}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onSelect={selectTask}
              onUpdateEstimate={updateTaskEstimate}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>
    </Card>
  )
}
