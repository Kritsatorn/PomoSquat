import { useState, useCallback } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useSquatTimer } from '@/hooks/useSquatTimer'
import { useSoundSettings } from '@/hooks/useSoundSettings'
import { Timer } from '@/components/Timer'
import { ModeSelector } from '@/components/ModeSelector'
import { TaskList } from '@/components/TaskList'
import { SquatTimer } from '@/components/SquatTimer'
import type { Task } from '@/types'

function App() {
  const {
    settings: soundSettings,
    toggleEnabled,
    setVolume,
    setPomodoroSound,
    setSquatSound,
    playPomodoroSound,
    playSquatSound,
    previewSound,
  } = useSoundSettings()

  const {
    mode,
    formattedTime,
    isRunning,
    toggle,
    reset,
    switchMode,
  } = useTimer({ onComplete: playPomodoroSound })

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

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleSelectedTaskChange = useCallback((task: Task | null) => {
    setSelectedTask(task)
  }, [])

  return (
    <div className="min-h-screen flex items-start justify-center pt-32 pb-12 px-4">
      <div className="w-full max-w-lg space-y-14">
        <header className="text-center">
          <h1 className="text-4xl mb-4">PomoSquat</h1>
        </header>

        <ModeSelector currentMode={mode} onModeChange={switchMode} />

        <Timer
          formattedTime={formattedTime}
          isRunning={isRunning}
          mode={mode}
          selectedTask={selectedTask}
          onToggle={toggle}
          onReset={reset}
        />

        <TaskList onSelectedTaskChange={handleSelectedTaskChange} />
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
          onStartSquats={startSquats}
          onCompleteSquats={completeSquats}
          onConfigureInterval={configureInterval}
          onToggleSoundEnabled={toggleEnabled}
          onVolumeChange={setVolume}
          onPomodoroSoundChange={setPomodoroSound}
          onSquatSoundChange={setSquatSound}
          onPreviewSound={previewSound}
          onPlaySquatSound={playSquatSound}
        />
      </div>
    </div>
  )
}

export default App
