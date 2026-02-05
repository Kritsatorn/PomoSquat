import { useState, useCallback } from 'react'
import type { TimerMode } from '@/types'

export type AlarmType = 'pomodoro' | 'shortBreak' | 'longBreak'

interface AlarmState {
  isActive: boolean
  type: AlarmType | null
}

export function useAlarm() {
  const [alarmState, setAlarmState] = useState<AlarmState>({
    isActive: false,
    type: null,
  })

  const showAlarm = useCallback((mode: TimerMode) => {
    const alarmType: AlarmType = mode
    setAlarmState({
      isActive: true,
      type: alarmType,
    })
  }, [])

  const dismissAlarm = useCallback(() => {
    setAlarmState({
      isActive: false,
      type: null,
    })
  }, [])

  return {
    isAlarmActive: alarmState.isActive,
    alarmType: alarmState.type,
    showAlarm,
    dismissAlarm,
  }
}
