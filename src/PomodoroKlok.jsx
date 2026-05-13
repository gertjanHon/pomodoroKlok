import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { MODES } from './config/modes'
import { useTimer } from './hooks/useTimer'
import { useTheme } from './hooks/useTheme'
import { useGoal } from './hooks/useGoal'


function PomodoroKlok() {
  const [mode, setMode] = useState('POMODORO')
  const [sessionCount, setSessionCount] = useState(0)
  const { theme, toggleTheme } = useTheme()
  const { goal, setGoal, plan, isLoading, resetGoal, generatePlan } = useGoal()
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi89+SfTQwMUKjj8LdjGwU5kdj0y4IvBSR3x/DdkUAKFF60zr15');
  }, [])

  const handleComplete = () => {
    if (mode === 'POMODORO') {
      setSessionCount((prev) => prev + 1)
    }
    audioRef.current?.play().catch(() => {})
  }

  const { timeLeft, isRunning, isCompleted, start, pause, reset } = useTimer(
    MODES[mode].duration,
    { onComplete: handleComplete }
  )


  const handleModeChange = (newMode) => {
    setMode(newMode)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-objective">
        <h1>What is the objective?</h1>

        {plan ? (
          <div className="plan-response">
            <ReactMarkdown>{plan.plan}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            className='objective-input'
            placeholder="Describe your goal for this session…"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        )}

        <div className="controls">
          {!plan && (
            <button className="btn btn-generate-plan" onClick={generatePlan} disabled={isLoading}>
              {isLoading ? 'Generating…' : 'Generate plan'}
            </button>
          )}
          <button className="btn btn-reset" onClick={resetGoal}>
            Reset
          </button>
        </div>
      </div>
      <div className="pomodoro-timer">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <h1 className="title">Pomodoro Klok</h1>

        <div className="mode-selector">
          <button
            className={`mode-btn ${mode === 'POMODORO' ? 'active' : ''}`}
            onClick={() => handleModeChange('POMODORO')}
            disabled={isRunning}
          >
            Pomodoro
          </button>
          <button
            className={`mode-btn ${mode === 'SHORT_BREAK' ? 'active' : ''}`}
            onClick={() => handleModeChange('SHORT_BREAK')}
            disabled={isRunning}
          >
            Short Break
          </button>
          <button
            className={`mode-btn ${mode === 'LONG_BREAK' ? 'active' : ''}`}
            onClick={() => handleModeChange('LONG_BREAK')}
            disabled={isRunning}
          >
            Long Break
          </button>
        </div>

        <div className={`timer-display ${isCompleted ? 'completed' : ''} ${isRunning ? 'running' : ''} mode-${mode.toLowerCase()}`}>
          {formatTime(timeLeft)}
        </div>

        {isCompleted && (
          <div className="completion-message">
            🎉 {MODES[mode].label} Complete!
          </div>
        )}

        <div className="controls">
          {!isRunning ? (
            <button
              className="btn btn-start"
              onClick={start}
              disabled={timeLeft === 0}
            >
              Start
            </button>
          ) : (
            <button className="btn btn-pause" onClick={pause}>
              Pause
            </button>
          )}
          <button className="btn btn-reset" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="session-info">
          <div className="session-count">
            <span className="count-label">Sessions Completed:</span>
            <span className="count-value">{sessionCount}</span>
          </div>
          <p className="mode-description">
            {mode === 'POMODORO' && '🍅 Focus for 25 minutes'}
            {mode === 'SHORT_BREAK' && '☕ Take a 5-minute break'}
            {mode === 'LONG_BREAK' && '🌴 Take a 15-minute break'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PomodoroKlok
