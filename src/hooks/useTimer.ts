import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerMode, TimerConfig } from '@/types'

const DEFAULT_CONFIG: TimerConfig = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

interface UseTimerOptions {
  config?: TimerConfig
  onComplete?: (mode: TimerMode) => void
}

export function useTimer(options: UseTimerOptions = {}) {
  const { config = DEFAULT_CONFIG, onComplete } = options
  const configRef = useRef(config)

  // Update ref in useEffect to avoid render-time mutation
  useEffect(() => {
    configRef.current = config
  }, [config])

  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(config.pomodoro)
  const [isRunning, setIsRunning] = useState(false)
  const [session, setSession] = useState(1)

  // Use timestamps for accurate timing even when tab is in background
  const startTimeRef = useRef<number | null>(null)
  const pausedTimeLeftRef = useRef<number>(config.pomodoro)
  const hasStartedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
    pausedTimeLeftRef.current = timeLeft
    setIsRunning(true)
    hasStartedRef.current = true
  }, [timeLeft])

  const pause = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      pausedTimeLeftRef.current = Math.max(0, pausedTimeLeftRef.current - elapsed)
      setTimeLeft(pausedTimeLeftRef.current)
    }
    startTimeRef.current = null
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRunning((prev) => {
      if (!prev) {
        // Starting
        startTimeRef.current = Date.now()
        pausedTimeLeftRef.current = timeLeft
        hasStartedRef.current = true
        return true
      } else {
        // Pausing
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          pausedTimeLeftRef.current = Math.max(0, pausedTimeLeftRef.current - elapsed)
          setTimeLeft(pausedTimeLeftRef.current)
        }
        startTimeRef.current = null
        return false
      }
    })
  }, [timeLeft])

  const reset = useCallback(() => {
    setIsRunning(false)
    startTimeRef.current = null
    hasStartedRef.current = false
    const newTime = configRef.current[mode]
    pausedTimeLeftRef.current = newTime
    setTimeLeft(newTime)
  }, [mode])

  const switchMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    startTimeRef.current = null
    hasStartedRef.current = false
    setMode(newMode)
    const newTime = configRef.current[newMode]
    pausedTimeLeftRef.current = newTime
    setTimeLeft(newTime)
  }, [])

  // Update timeLeft when config changes, but only if timer hasn't started
  const prevConfigRef = useRef(config)
  useEffect(() => {
    const prevConfig = prevConfigRef.current
    prevConfigRef.current = config

    if (!hasStartedRef.current && prevConfig[mode] !== config[mode]) {
      pausedTimeLeftRef.current = config[mode]
      setTimeLeft(config[mode])
    }
  }, [config, mode])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Timer effect using timestamps for accuracy
  useEffect(() => {
    if (!isRunning) return

    const updateTimer = () => {
      if (!startTimeRef.current) return

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, pausedTimeLeftRef.current - elapsed)

      setTimeLeft(remaining)

      if (remaining <= 0) {
        setIsRunning(false)
        startTimeRef.current = null
        hasStartedRef.current = false
        if (mode === 'pomodoro') {
          setSession((s) => s + 1)
        }
        onCompleteRef.current?.(mode)
      }
    }

    // Update immediately
    updateTimer()

    // Then update every 100ms for smooth display (more frequent than 1s for responsiveness)
    const intervalId = window.setInterval(updateTimer, 100)

    // Also update when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTimer()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isRunning, mode])

  const totalDuration = config[mode]
  const progress = 1 - timeLeft / totalDuration

  return {
    mode,
    timeLeft,
    totalDuration,
    progress,
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
