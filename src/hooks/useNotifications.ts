import { useState, useCallback, useEffect } from 'react'

type NotificationPermission = 'default' | 'granted' | 'denied'

const STORAGE_KEY = 'pomodoro-notifications-enabled'

function loadNotificationsEnabled(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : false
  } catch {
    return false
  }
}

function saveNotificationsEnabled(enabled: boolean) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled))
}

function getInitialPermission(): NotificationPermission {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission
  }
  return 'default'
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(getInitialPermission)
  const [enabled, setEnabled] = useState(loadNotificationsEnabled)

  useEffect(() => {
    saveNotificationsEnabled(enabled)
  }, [enabled])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied'
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      setEnabled(true)
    }

    return result
  }, [])

  const toggleEnabled = useCallback(async () => {
    if (!enabled) {
      // Turning on - request permission if needed
      if (permission !== 'granted') {
        const result = await requestPermission()
        if (result === 'granted') {
          setEnabled(true)
        }
      } else {
        setEnabled(true)
      }
    } else {
      // Turning off
      setEnabled(false)
    }
  }, [enabled, permission, requestPermission])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!enabled || permission !== 'granted') {
        return null
      }

      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      })
    },
    [enabled, permission]
  )

  const notifyTimerComplete = useCallback(
    (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
      const messages = {
        pomodoro: {
          title: "Time's up!",
          body: 'Pomodoro complete. Time for a break!',
        },
        shortBreak: {
          title: "Break's over!",
          body: 'Short break complete. Ready to focus?',
        },
        longBreak: {
          title: "Break's over!",
          body: 'Long break complete. Ready to focus?',
        },
      }

      const { title, body } = messages[mode]
      return sendNotification(title, { body, tag: 'timer-complete' })
    },
    [sendNotification]
  )

  return {
    permission,
    enabled,
    isSupported: 'Notification' in window,
    requestPermission,
    toggleEnabled,
    sendNotification,
    notifyTimerComplete,
  }
}
