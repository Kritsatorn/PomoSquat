import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pomodoro-daily-goals'

interface DailyGoalSettings {
  dailyPomodoroTarget: number
  showGoalIndicator: boolean
}

const DEFAULT_SETTINGS: DailyGoalSettings = {
  dailyPomodoroTarget: 8,
  showGoalIndicator: true,
}

function loadSettings(): DailyGoalSettings {
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

function saveSettings(settings: DailyGoalSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function useDailyGoals() {
  const [settings, setSettingsState] = useState<DailyGoalSettings>(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setDailyTarget = useCallback((target: number) => {
    setSettingsState((prev) => ({
      ...prev,
      dailyPomodoroTarget: Math.max(1, Math.min(20, target)),
    }))
  }, [])

  const toggleShowIndicator = useCallback(() => {
    setSettingsState((prev) => ({
      ...prev,
      showGoalIndicator: !prev.showGoalIndicator,
    }))
  }, [])

  return {
    dailyTarget: settings.dailyPomodoroTarget,
    showIndicator: settings.showGoalIndicator,
    setDailyTarget,
    toggleShowIndicator,
  }
}
