import { useState, useEffect, useCallback } from 'react'
import type { TimerConfig } from '@/types'

const STORAGE_KEY = 'pomodoro-timer-settings'

const DEFAULT_CONFIG: TimerConfig = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export interface TimerSettings extends TimerConfig {
  pomodorosUntilLongBreak: number
}

const DEFAULT_SETTINGS: TimerSettings = {
  ...DEFAULT_CONFIG,
  pomodorosUntilLongBreak: 4,
}

function loadSettings(): TimerSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
    return DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: TimerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function useTimerSettings() {
  const [settings, setSettingsState] = useState<TimerSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setPomodoroDuration = useCallback((minutes: number) => {
    setSettingsState((prev) => ({
      ...prev,
      pomodoro: minutes * 60,
    }))
  }, [])

  const setShortBreakDuration = useCallback((minutes: number) => {
    setSettingsState((prev) => ({
      ...prev,
      shortBreak: minutes * 60,
    }))
  }, [])

  const setLongBreakDuration = useCallback((minutes: number) => {
    setSettingsState((prev) => ({
      ...prev,
      longBreak: minutes * 60,
    }))
  }, [])

  const setPomodorosUntilLongBreak = useCallback((count: number) => {
    setSettingsState((prev) => ({
      ...prev,
      pomodorosUntilLongBreak: count,
    }))
  }, [])

  const resetToDefaults = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS)
  }, [])

  return {
    settings,
    setPomodoroDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setPomodorosUntilLongBreak,
    resetToDefaults,
  }
}
