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
    <Card className="py-8 px-8">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl">Tasks</h2>
        {!isAdding && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            + Add Task
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="What are you working on?"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button variant="primary" size="md" onClick={addTask}>
            Add
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setIsAdding(false)
              setNewTaskText('')
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-6">
            No tasks yet. Add one to get started!
          </p>
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
