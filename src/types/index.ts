export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak'

export interface TimerConfig {
  pomodoro: number
  shortBreak: number
  longBreak: number
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface TimerState {
  mode: TimerMode
  timeLeft: number
  isRunning: boolean
  session: number
}
