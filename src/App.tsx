import { useState, useCallback, useMemo } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useSquatTimer } from '@/hooks/useSquatTimer'
import { useSoundSettings } from '@/hooks/useSoundSettings'
import { useAlarm } from '@/hooks/useAlarm'
import { useNotifications } from '@/hooks/useNotifications'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useTheme } from '@/hooks/useTheme'
import { useTimerSettings } from '@/hooks/useTimerSettings'
import { useStatistics } from '@/hooks/useStatistics'
import { useDailyGoals } from '@/hooks/useDailyGoals'
import { Timer } from '@/components/Timer'
import { ModeSelector } from '@/components/ModeSelector'
import { TaskList } from '@/components/TaskList'
import { SquatTimer } from '@/components/SquatTimer'
import { AlarmOverlay } from '@/components/AlarmOverlay'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TimerSettings } from '@/components/TimerSettings'
import { Statistics } from '@/components/Statistics'
import { DailyGoalIndicator } from '@/components/DailyGoalIndicator'
import type { Task } from '@/types'

function App() {
  const { isDark, toggleTheme } = useTheme()

  const {
    settings: timerSettings,
    setPomodoroDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setPomodorosUntilLongBreak,
    resetToDefaults: resetTimerSettings,
  } = useTimerSettings()

  const timerConfig = useMemo(() => ({
    pomodoro: timerSettings.pomodoro,
    shortBreak: timerSettings.shortBreak,
    longBreak: timerSettings.longBreak,
  }), [timerSettings.pomodoro, timerSettings.shortBreak, timerSettings.longBreak])

  const {
    settings: soundSettings,
    toggleEnabled,
    setVolume,
    setAlarmVolume,
    setPomodoroSound,
    setSquatSound,
    playSquatSound,
    playTick,
    previewSound,
    startPomodoroSoundLoop,
    stopSoundLoop,
  } = useSoundSettings()

  const {
    isAlarmActive,
    alarmType,
    showAlarm,
    dismissAlarm,
  } = useAlarm()

  const {
    enabled: notificationsEnabled,
    isSupported: notificationsSupported,
    toggleEnabled: toggleNotifications,
    notifyTimerComplete,
  } = useNotifications()

  const {
    statistics,
    todayStats,
    weekStats,
    recordSession,
  } = useStatistics()

  const {
    dailyTarget,
    showIndicator: showDailyGoal,
    setDailyTarget,
  } = useDailyGoals()

  // State for task management callbacks
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addTaskFn, setAddTaskFn] = useState<(() => void) | null>(null)
  const [incrementPomodoroFn, setIncrementPomodoroFn] = useState<(() => void) | null>(null)

  const handleTimerComplete = useCallback((completedMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    showAlarm(completedMode)
    notifyTimerComplete(completedMode)

    // Record the session in statistics
    const durationMinutes = Math.round(timerConfig[completedMode] / 60)
    recordSession(completedMode, durationMinutes)

    // Increment pomodoro count for selected task
    if (completedMode === 'pomodoro') {
      incrementPomodoroFn?.()
    }
  }, [showAlarm, notifyTimerComplete, timerConfig, recordSession, incrementPomodoroFn])

  const {
    mode,
    formattedTime,
    isRunning,
    progress,
    session,
    toggle,
    reset,
    switchMode,
  } = useTimer({ config: timerConfig, onComplete: handleTimerComplete })

  // Check if it's time for a long break
  const shouldSuggestLongBreak = session > 0 && session % timerSettings.pomodorosUntilLongBreak === 0

  const {
    timeUntilSquat,
    formattedTime: squatFormattedTime,
    isSquatTime,
    isDoingSquats,
    settings: squatSettings,
    startSquats,
    completeSquats,
    configureInterval,
  } = useSquatTimer({ onSquatTime: playSquatSound })

  const handleSelectedTaskChange = useCallback((task: Task | null) => {
    setSelectedTask(task)
  }, [])

  const handleAddTaskRef = useCallback((fn: () => void) => {
    setAddTaskFn(() => fn)
  }, [])

  const handleIncrementPomodoroRef = useCallback((fn: () => void) => {
    setIncrementPomodoroFn(() => fn)
  }, [])

  const handleNewTask = useCallback(() => {
    addTaskFn?.()
  }, [addTaskFn])

  const handleToggle = useCallback(() => {
    playTick()
    toggle()
  }, [playTick, toggle])

  useKeyboardShortcuts({
    onToggleTimer: handleToggle,
    onResetTimer: reset,
    onSwitchMode: switchMode,
    onNewTask: handleNewTask,
  })

  return (
    <div className="min-h-screen flex items-start justify-center pt-32 pb-12 px-4">
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

      <div className="w-full max-w-lg space-y-14">
        <header className="text-center">
          <h1 className="text-4xl mb-4">PomoSquat</h1>
          <div className="flex justify-center items-center gap-2 mb-3">
            <DailyGoalIndicator
              completed={todayStats?.pomodoros ?? 0}
              target={dailyTarget}
              showIndicator={showDailyGoal}
              onTargetChange={setDailyTarget}
            />
          </div>
          <div className="flex justify-center gap-2">
            <Statistics
              totalPomodoros={statistics.totalPomodoros}
              totalFocusMinutes={statistics.totalFocusMinutes}
              currentStreak={statistics.currentStreak}
              longestStreak={statistics.longestStreak}
              todayStats={todayStats}
              weekStats={weekStats}
            />
            <TimerSettings
              settings={timerSettings}
              onPomodoroDurationChange={setPomodoroDuration}
              onShortBreakDurationChange={setShortBreakDuration}
              onLongBreakDurationChange={setLongBreakDuration}
              onPomodorosUntilLongBreakChange={setPomodorosUntilLongBreak}
              onResetToDefaults={resetTimerSettings}
            />
          </div>
        </header>

        <ModeSelector currentMode={mode} onModeChange={switchMode} />

        <Timer
          formattedTime={formattedTime}
          isRunning={isRunning}
          mode={mode}
          progress={progress}
          selectedTask={selectedTask}
          onToggle={handleToggle}
          onReset={reset}
        />

        <TaskList
          onSelectedTaskChange={handleSelectedTaskChange}
          onAddTaskRef={handleAddTaskRef}
          onIncrementPomodoroRef={handleIncrementPomodoroRef}
        />
      </div>

      {/* Squat Timer - Fixed to right side of screen */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2">
        <SquatTimer
          formattedTime={squatFormattedTime}
          timeUntilSquat={timeUntilSquat}
          isSquatTime={isSquatTime}
          isDoingSquats={isDoingSquats}
          squatInterval={squatSettings.squatInterval}
          soundSettings={soundSettings}
          notificationsEnabled={notificationsEnabled}
          notificationsSupported={notificationsSupported}
          onStartSquats={startSquats}
          onCompleteSquats={completeSquats}
          onConfigureInterval={configureInterval}
          onToggleSoundEnabled={toggleEnabled}
          onVolumeChange={setVolume}
          onAlarmVolumeChange={setAlarmVolume}
          onPomodoroSoundChange={setPomodoroSound}
          onSquatSoundChange={setSquatSound}
          onPreviewSound={previewSound}
          onPlaySquatSound={playSquatSound}
          onToggleNotifications={toggleNotifications}
        />
      </div>

      <AlarmOverlay
        isActive={isAlarmActive}
        alarmType={alarmType}
        suggestLongBreak={shouldSuggestLongBreak}
        completedPomodoros={session}
        onDismiss={dismissAlarm}
        onStart={startPomodoroSoundLoop}
        onStop={stopSoundLoop}
        onStartLongBreak={() => switchMode('longBreak')}
      />
    </div>
  )
}

export default App
