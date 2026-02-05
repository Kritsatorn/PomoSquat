import { useEffect, useCallback } from 'react'
import type { TimerMode } from '@/types'

interface UseKeyboardShortcutsOptions {
  onToggleTimer: () => void
  onResetTimer: () => void
  onSwitchMode: (mode: TimerMode) => void
  onNewTask: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  onToggleTimer,
  onResetTimer,
  onSwitchMode,
  onNewTask,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in an input
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          onToggleTimer()
          break
        case 'KeyR':
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault()
            onResetTimer()
          }
          break
        case 'Digit1':
        case 'Numpad1':
          event.preventDefault()
          onSwitchMode('pomodoro')
          break
        case 'Digit2':
        case 'Numpad2':
          event.preventDefault()
          onSwitchMode('shortBreak')
          break
        case 'Digit3':
        case 'Numpad3':
          event.preventDefault()
          onSwitchMode('longBreak')
          break
        case 'KeyN':
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault()
            onNewTask()
          }
          break
      }
    },
    [onToggleTimer, onResetTimer, onSwitchMode, onNewTask]
  )

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, handleKeyDown])
}
