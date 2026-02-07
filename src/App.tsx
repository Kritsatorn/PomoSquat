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
import { Header } from '@/components/Header'
import { FocusPanel } from '@/components/FocusPanel'
import { TaskList } from '@/components/TaskList'
import { SquatPanel } from '@/components/SquatPanel'
import { AlarmOverlay } from '@/components/AlarmOverlay'
import { Statistics } from '@/components/Statistics'
import { TimerSettings } from '@/components/TimerSettings'
import type { Task } from '@/types'

function App() {
  const { isDark, toggleTheme } = useTheme()

  const [showStats, setShowStats] = useState(false)
  const [showTimerSettings, setShowTimerSettings] = useState(false)

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

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [addTaskFn, setAddTaskFn] = useState<(() => void) | null>(null)
  const [incrementPomodoroFn, setIncrementPomodoroFn] = useState<(() => void) | null>(null)

  const handleTimerComplete = useCallback((completedMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    showAlarm(completedMode)
    notifyTimerComplete(completedMode)

    const durationMinutes = Math.round(timerConfig[completedMode] / 60)
    recordSession(completedMode, durationMinutes)

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
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header
        completed={todayStats?.pomodoros ?? 0}
        dailyTarget={dailyTarget}
        showDailyGoal={showDailyGoal}
        isDark={isDark}
        onTargetChange={setDailyTarget}
        onToggleTheme={toggleTheme}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowTimerSettings(true)}
      />

      {/* Centered page container */}
      <main className="flex-1 w-full px-8 py-8 flex justify-center">
        {/* Desktop: 2 columns with fixed widths, centered. Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[520px_360px] gap-8 items-start w-full max-w-[920px]">
          {/* Left column: Timer + Tasks */}
          <div className="space-y-8 order-1 w-full">
            <FocusPanel
              formattedTime={formattedTime}
              isRunning={isRunning}
              mode={mode}
              progress={progress}
              selectedTask={selectedTask}
              onToggle={handleToggle}
              onReset={reset}
              onModeChange={switchMode}
            />
            {/* Tasks - show after Squat on mobile */}
            <div className="hidden lg:block">
              <TaskList
                onSelectedTaskChange={handleSelectedTaskChange}
                onAddTaskRef={handleAddTaskRef}
                onIncrementPomodoroRef={handleIncrementPomodoroRef}
              />
            </div>
          </div>

          {/* Right column: Squat (sticky on desktop) */}
          <div className="order-2 lg:sticky lg:top-6">
            <SquatPanel
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

          {/* Tasks - mobile only (after Squat) */}
          <div className="order-3 lg:hidden">
            <TaskList
              onSelectedTaskChange={handleSelectedTaskChange}
              onAddTaskRef={handleAddTaskRef}
              onIncrementPomodoroRef={handleIncrementPomodoroRef}
            />
          </div>
        </div>
      </main>

      <Statistics
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        totalPomodoros={statistics.totalPomodoros}
        totalFocusMinutes={statistics.totalFocusMinutes}
        currentStreak={statistics.currentStreak}
        longestStreak={statistics.longestStreak}
        todayStats={todayStats}
        weekStats={weekStats}
      />

      <TimerSettings
        isOpen={showTimerSettings}
        onClose={() => setShowTimerSettings(false)}
        settings={timerSettings}
        onPomodoroDurationChange={setPomodoroDuration}
        onShortBreakDurationChange={setShortBreakDuration}
        onLongBreakDurationChange={setLongBreakDuration}
        onPomodorosUntilLongBreakChange={setPomodorosUntilLongBreak}
        onResetToDefaults={resetTimerSettings}
      />

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
