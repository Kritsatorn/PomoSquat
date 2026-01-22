import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerMode, TimerConfig } from '@/types'

const DEFAULT_CONFIG: TimerConfig = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

interface UseTimerOptions {
  onComplete?: () => void
}

export function useTimer(options: UseTimerOptions = {}) {
  const { onComplete } = options
  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(DEFAULT_CONFIG.pomodoro)
  const [isRunning, setIsRunning] = useState(false)
  const [session, setSession] = useState(1)
  const intervalRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(DEFAULT_CONFIG[mode])
  }, [mode])

  const switchMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(DEFAULT_CONFIG[newMode])
  }, [])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            if (mode === 'pomodoro') {
              setSession((s) => s + 1)
            }
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }

    return clearTimer
  }, [isRunning, mode, clearTimer, onComplete])

  return {
    mode,
    timeLeft,
    isRunning,
    session,
    formattedTime: formatTime(timeLeft),
    start,
    pause,
    toggle,
    reset,
    switchMode,
  }
}
