import { useCallback, useEffect, useState } from 'react'
import { getDateKey, nowISOTime } from '../utils/time'

function useDailyState(storageKey) {
  const [dailyState, setDailyState] = useState(() => {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) {
      return { date: getDateKey(), count: 0, history: [], allHistory: [], lastDrinkAt: null }
    }

    try {
      const parsed = JSON.parse(stored)
      return {
        date: parsed.date || getDateKey(),
        count: parsed.count || 0,
        history: parsed.history || [],
        allHistory: parsed.allHistory || parsed.history || [],
        lastDrinkAt: parsed.lastDrinkAt || null,
      }
    } catch (error) {
      console.error('Failed to parse daily state', error)
      return { date: getDateKey(), count: 0, history: [], allHistory: [], lastDrinkAt: null }
    }
  })

  const resetIfNewDay = useCallback(() => {
    const today = getDateKey()
    setDailyState((prev) => {
      if (prev.date === today) return prev
      const todayHistory = prev.allHistory.filter((iso) => getDateKey(new Date(iso)) === today)
      return {
        date: today,
        count: todayHistory.length,
        history: todayHistory,
        allHistory: prev.allHistory,
        lastDrinkAt: prev.lastDrinkAt,
      }
    })
  }, [])

  useEffect(() => {
    resetIfNewDay()
  }, [resetIfNewDay])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(dailyState))
  }, [dailyState, storageKey])

  const addDrinkCount = (count = 1) => {
    const now = Date.now()
    const timestamps = Array.from({ length: count }, (_, index) => new Date(now + index).toISOString())

    setDailyState((prev) => ({
      ...prev,
      count: prev.count + count,
      history: [...timestamps, ...prev.history],
      allHistory: [...timestamps, ...prev.allHistory],
      lastDrinkAt: timestamps[0],
    }))
  }

  const addDrink = () => addDrinkCount(1)

  const replaceHistory = (history) => {
    const today = getDateKey()
    const todayHistory = history.filter((iso) => getDateKey(new Date(iso)) === today)
    setDailyState({
      date: today,
      count: todayHistory.length,
      history: todayHistory,
      allHistory: history,
      lastDrinkAt: todayHistory[0] || null,
    })
  }

  return {
    dailyCount: dailyState.count,
    history: dailyState.history,
    allHistory: dailyState.allHistory,
    lastDrinkAt: dailyState.lastDrinkAt,
    addDrink,
    addDrinkCount,
    replaceHistory,
    resetIfNewDay,
  }
}

export default useDailyState
