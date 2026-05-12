import { useState, useEffect, useRef } from 'react'

export function useTimer(duration, { onComplete } = {}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    setTimeLeft(duration)
    setIsRunning(false)
    setIsCompleted(false)
  }, [duration])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsCompleted(true)
            onCompleteRef.current?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, timeLeft])

  const start = () => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsCompleted(false)
    }
  }

  const pause = () => setIsRunning(false)

  const reset = () => {
    setIsRunning(false)
    setIsCompleted(false)
    setTimeLeft(duration)
  }

  return { timeLeft, isRunning, isCompleted, start, pause, reset }
}
