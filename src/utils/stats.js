import { getDateKey } from './time'

export function buildDailyCounts(history) {
  return history.reduce((acc, iso) => {
    const dateKey = getDateKey(new Date(iso))
    acc[dateKey] = (acc[dateKey] || 0) + 1
    return acc
  }, {})
}

export function getLastNDays(days) {
  const result = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    result.push(date)
  }

  return result
}

export function getWeeklySummary(history, days = 7) {
  const counts = buildDailyCounts(history)
  const summary = []
  const lastDays = getLastNDays(days)

  lastDays.forEach((day) => {
    const key = getDateKey(day)
    summary.push({ date: key, count: counts[key] || 0 })
  })

  return summary
}

export function getMonthlySummary(history, days = 30) {
  const counts = buildDailyCounts(history)
  const summary = []
  const lastDays = getLastNDays(days)

  lastDays.forEach((day) => {
    const key = getDateKey(day)
    summary.push({ date: key, count: counts[key] || 0 })
  })

  return summary
}

export function calculateStreak(countsByDay, dailyGoal, todayKey) {
  if (dailyGoal <= 0) return 0

  let streak = 0
  let cursor = new Date(`${todayKey}T00:00:00`)

  while (true) {
    const key = getDateKey(cursor)
    if ((countsByDay[key] || 0) < dailyGoal) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function calculateBestStreak(countsByDay, dailyGoal) {
  if (dailyGoal <= 0) return 0

  const days = Object.keys(countsByDay).sort()
  if (days.length === 0) return 0

  let best = 0
  let current = 0
  let previousDate = null

  days.forEach((key) => {
    if ((countsByDay[key] || 0) >= dailyGoal) {
      if (!previousDate) {
        current = 1
      } else {
        const prev = new Date(`${previousDate}T00:00:00`)
        const curr = new Date(`${key}T00:00:00`)
        const diff = (curr - prev) / (1000 * 60 * 60 * 24)
        current = diff === 1 ? current + 1 : 1
      }
      best = Math.max(best, current)
    } else {
      current = 0
    }
    previousDate = key
  })

  return best
}
