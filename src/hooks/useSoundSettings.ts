import { useState, useCallback, useRef } from 'react'
import { playSound, playTickSound, startSoundLoop } from '@/utils/sounds'
import type { SoundType } from '@/utils/sounds'

const STORAGE_KEY = 'pomosquat-sound-settings'

export interface SoundSettings {
  enabled: boolean
  volume: number // 0-1
  alarmVolume: number // 0-1
  pomodoroSound: SoundType
  squatSound: SoundType
}

const DEFAULT_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.7,
  alarmVolume: 0.5,
  pomodoroSound: 'pixel-bell',
  squatSound: 'pixel-alert',
}

function loadSettings(): SoundSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.error('Failed to load sound settings:', e)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: SoundSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save sound settings:', e)
  }
}

export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(loadSettings)
  const loopCleanupRef = useRef<(() => void) | null>(null)

  const updateSettings = useCallback((updates: Partial<SoundSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates }
      saveSettings(newSettings)
      return newSettings
    })
  }, [])

  const toggleEnabled = useCallback(() => {
    updateSettings({ enabled: !settings.enabled })
  }, [settings.enabled, updateSettings])

  const setVolume = useCallback((volume: number) => {
    updateSettings({ volume: Math.max(0, Math.min(1, volume)) })
  }, [updateSettings])

  const setAlarmVolume = useCallback((alarmVolume: number) => {
    updateSettings({ alarmVolume: Math.max(0, Math.min(1, alarmVolume)) })
  }, [updateSettings])

  const setPomodoroSound = useCallback((sound: SoundType) => {
    updateSettings({ pomodoroSound: sound })
  }, [updateSettings])

  const setSquatSound = useCallback((sound: SoundType) => {
    updateSettings({ squatSound: sound })
  }, [updateSettings])

  const playPomodoroSound = useCallback(() => {
    if (settings.enabled) {
      playSound(settings.pomodoroSound, settings.volume)
    }
  }, [settings.enabled, settings.pomodoroSound, settings.volume])

  const playSquatSound = useCallback(() => {
    if (settings.enabled) {
      playSound(settings.squatSound, settings.volume)
    }
  }, [settings.enabled, settings.squatSound, settings.volume])

  const playTick = useCallback(() => {
    if (settings.enabled) {
      playTickSound(settings.volume)
    }
  }, [settings.enabled, settings.volume])

  const previewSound = useCallback((soundType: SoundType) => {
    playSound(soundType, settings.volume)
  }, [settings.volume])

  const startPomodoroSoundLoop = useCallback(() => {
    // Stop any existing loop first
    if (loopCleanupRef.current) {
      loopCleanupRef.current()
    }
    if (settings.enabled) {
      loopCleanupRef.current = startSoundLoop(settings.pomodoroSound, settings.alarmVolume, 3000)
    }
  }, [settings.enabled, settings.pomodoroSound, settings.alarmVolume])

  const stopSoundLoop = useCallback(() => {
    if (loopCleanupRef.current) {
      loopCleanupRef.current()
      loopCleanupRef.current = null
    }
  }, [])

  return {
    settings,
    toggleEnabled,
    setVolume,
    setAlarmVolume,
    setPomodoroSound,
    setSquatSound,
    playPomodoroSound,
    playSquatSound,
    playTick,
    previewSound,
    startPomodoroSoundLoop,
    stopSoundLoop,
  }
}
