import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'pomodoro-statistics'

interface DailyStats {
  date: string // YYYY-MM-DD
  pomodoros: number
  focusMinutes: number
  shortBreaks: number
  longBreaks: number
}

interface Statistics {
  totalPomodoros: number
  totalFocusMinutes: number
  totalShortBreaks: number
  totalLongBreaks: number
  currentStreak: number
  longestStreak: number
  dailyStats: DailyStats[]
}

const DEFAULT_STATISTICS: Statistics = {
  totalPomodoros: 0,
  totalFocusMinutes: 0,
  totalShortBreaks: 0,
  totalLongBreaks: 0,
  currentStreak: 0,
  longestStreak: 0,
  dailyStats: [],
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayDateString(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

function loadStatistics(): Statistics {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_STATISTICS, ...parsed }
    }
    return DEFAULT_STATISTICS
  } catch {
    return DEFAULT_STATISTICS
  }
}

function saveStatistics(stats: Statistics) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useStatistics() {
  const [statistics, setStatisticsState] = useState<Statistics>(loadStatistics)

  useEffect(() => {
    saveStatistics(statistics)
  }, [statistics])

  const recordSession = useCallback((
    type: 'pomodoro' | 'shortBreak' | 'longBreak',
    durationMinutes: number
  ) => {
    setStatisticsState((prev) => {
      const today = getTodayDateString()
      const yesterday = getYesterdayDateString()

      // Find or create today's stats
      let dailyStats = [...prev.dailyStats]
      let todayIndex = dailyStats.findIndex((d) => d.date === today)

      if (todayIndex === -1) {
        // Create new entry for today
        dailyStats.push({
          date: today,
          pomodoros: 0,
          focusMinutes: 0,
          shortBreaks: 0,
          longBreaks: 0,
        })
        todayIndex = dailyStats.length - 1
      }

      // Update today's stats
      const todayStats = { ...dailyStats[todayIndex] }
      if (type === 'pomodoro') {
        todayStats.pomodoros += 1
        todayStats.focusMinutes += durationMinutes
      } else if (type === 'shortBreak') {
        todayStats.shortBreaks += 1
      } else {
        todayStats.longBreaks += 1
      }
      dailyStats[todayIndex] = todayStats

      // Calculate streak
      let currentStreak = prev.currentStreak

      // Check if this is a new day with activity
      const hadActivityToday = prev.dailyStats.some((d) => d.date === today && d.pomodoros > 0)
      const hadActivityYesterday = prev.dailyStats.some((d) => d.date === yesterday && d.pomodoros > 0)

      if (type === 'pomodoro' && !hadActivityToday) {
        // First pomodoro of the day
        if (hadActivityYesterday || prev.currentStreak === 0) {
          currentStreak += 1
        } else {
          // Streak broken, start new
          currentStreak = 1
        }
      }

      const longestStreak = Math.max(prev.longestStreak, currentStreak)

      // Keep only last 30 days of daily stats
      dailyStats = dailyStats
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30)

      return {
        totalPomodoros: prev.totalPomodoros + (type === 'pomodoro' ? 1 : 0),
        totalFocusMinutes: prev.totalFocusMinutes + (type === 'pomodoro' ? durationMinutes : 0),
        totalShortBreaks: prev.totalShortBreaks + (type === 'shortBreak' ? 1 : 0),
        totalLongBreaks: prev.totalLongBreaks + (type === 'longBreak' ? 1 : 0),
        currentStreak,
        longestStreak,
        dailyStats,
      }
    })
  }, [])

  const getTodayStats = useCallback((): DailyStats | null => {
    const today = getTodayDateString()
    return statistics.dailyStats.find((d) => d.date === today) || null
  }, [statistics.dailyStats])

  const getWeekStats = useCallback((): DailyStats[] => {
    const now = new Date()
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]

    return statistics.dailyStats.filter((d) => d.date >= weekAgoStr)
  }, [statistics.dailyStats])

  const resetStatistics = useCallback(() => {
    setStatisticsState(DEFAULT_STATISTICS)
  }, [])

  return {
    statistics,
    todayStats: getTodayStats(),
    weekStats: getWeekStats(),
    recordSession,
    resetStatistics,
  }
}
