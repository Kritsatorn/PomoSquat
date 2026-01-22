import { useState, useEffect, useCallback, useRef } from 'react'

const STORAGE_KEY = 'pomosquat-squat-interval'

interface SquatTimerSettings {
  squatInterval: number // in minutes
}

const DEFAULT_SETTINGS: SquatTimerSettings = {
  squatInterval: 30,
}

function loadSettings(): SquatTimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load squat settings:', e)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: SquatTimerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save squat settings:', e)
  }
}

interface UseSquatTimerOptions {
  onSquatTime?: () => void
}

export function useSquatTimer(options: UseSquatTimerOptions = {}) {
  const { onSquatTime } = options
  const [settings, setSettings] = useState<SquatTimerSettings>(loadSettings)
  const [timeUntilSquat, setTimeUntilSquat] = useState(settings.squatInterval * 60)
  const [isSquatTime, setIsSquatTime] = useState(false)
  const [isDoingSquats, setIsDoingSquats] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Timer countdown
  useEffect(() => {
    if (isDoingSquats) return

    intervalRef.current = window.setInterval(() => {
      setTimeUntilSquat((prev) => {
        if (prev <= 1) {
          setIsSquatTime(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isDoingSquats])

  // Trigger sound when squat time arrives
  useEffect(() => {
    if (isSquatTime) {
      onSquatTime?.()
    }
  }, [isSquatTime, onSquatTime])

  const startSquats = useCallback(() => {
    setIsDoingSquats(true)
    setIsSquatTime(false)
  }, [])

  const completeSquats = useCallback(() => {
    setIsDoingSquats(false)
    setTimeUntilSquat(settings.squatInterval * 60)
  }, [settings.squatInterval])

  const resetTimer = useCallback(() => {
    setIsSquatTime(false)
    setIsDoingSquats(false)
    setTimeUntilSquat(settings.squatInterval * 60)
  }, [settings.squatInterval])

  const configureInterval = useCallback((minutes: number) => {
    const newSettings = { ...settings, squatInterval: minutes }
    setSettings(newSettings)
    saveSettings(newSettings)
    setTimeUntilSquat(minutes * 60)
    setIsSquatTime(false)
    setIsDoingSquats(false)
  }, [settings])

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return {
    timeUntilSquat,
    formattedTime: formatTime(timeUntilSquat),
    isSquatTime,
    isDoingSquats,
    settings,
    startSquats,
    completeSquats,
    resetTimer,
    configureInterval,
  }
}
