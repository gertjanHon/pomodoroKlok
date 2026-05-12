export const DEFAULT_MODES = {
  POMODORO: { duration: 25 * 60, label: 'Pomodoro' },
  SHORT_BREAK: { duration: 5 * 60, label: 'Short Break' },
  LONG_BREAK: { duration: 15 * 60, label: 'Long Break' }
}

export function buildModes(overrides = {}) {
  const result = {}
  for (const key of Object.keys(DEFAULT_MODES)) {
    result[key] = { ...DEFAULT_MODES[key], ...(overrides[key] || {}) }
  }
  return result
}

export const MODES = DEFAULT_MODES
