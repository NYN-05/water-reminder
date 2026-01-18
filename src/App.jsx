import { useEffect, useMemo, useState } from 'react'
import './App.css'
import BottomNav from './components/BottomNav'
import HomePage from './components/HomePage'
import RemindersPage from './components/RemindersPage'
import GoalsPage from './components/GoalsPage'
import HistoryPage from './components/HistoryPage'
import ProfilePage from './components/ProfilePage'
import useLocalStorage from './hooks/useLocalStorage'
import useInterval from './hooks/useInterval'
import useDailyState from './hooks/useDailyState'
import useNow from './hooks/useNow'
import { ensureNotificationPermission, sendNotification } from './utils/notifications'
import { getDateKey, isWithinWorkingHours } from './utils/time'
import { playSound } from './utils/sounds'
import {
  calculateStreak,
  calculateBestStreak,
  getWeeklySummary,
  buildDailyCounts,
  getMonthlySummary,
} from './utils/stats'
import { exportHistoryCsv, parseHistoryCsv } from './utils/csv'

const DEFAULT_SETTINGS = {
  intervalMinutes: 60,
  soundId: 'beep',
  dailyGoal: 8,
  workingHoursEnabled: true,
  workingHoursStart: '09:00',
  workingHoursEnd: '21:00',
  activityLevel: 'medium',
  smartModeEnabled: true,
  weeklyGoal: 56,
  cupSizeMl: 250,
  units: 'cups',
  theme: 'light',
  adaptiveGoalEnabled: true,
}

const ACTIVITY_MULTIPLIERS = {
  low: 1.2,
  medium: 1,
  high: 0.75,
}

function App() {
  // Persist user settings across refreshes.
  const [settings, setSettings] = useLocalStorage('waterReminderSettings', DEFAULT_SETTINGS)
  const [isRunning, setIsRunning] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  )
  const [activeTab, setActiveTab] = useState('home')
  const [ringPulseKey, setRingPulseKey] = useState(0)

  const {
    dailyCount,
    history,
    allHistory,
    addDrink,
    addDrinkCount,
    replaceHistory,
    resetIfNewDay,
    lastDrinkAt,
  } = useDailyState('waterDailyState')
  const now = useNow(isRunning)

  const progressPercent = useMemo(() => {
    if (settings.dailyGoal <= 0) return 0
    return Math.min(100, Math.round((dailyCount / settings.dailyGoal) * 100))
  }, [dailyCount, settings.dailyGoal])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const activityMultiplier = ACTIVITY_MULTIPLIERS[settings.activityLevel] || 1
  const baseInterval = Math.max(1, Number(settings.intervalMinutes))
  const smartIntervalBoost = settings.smartModeEnabled && lastDrinkAt
    ? (() => {
        const minutesSinceDrink = (Date.now() - new Date(lastDrinkAt).getTime()) / 60000
        if (minutesSinceDrink < 15) return 1.3
        if (minutesSinceDrink > baseInterval * 1.5) return 0.7
        return 1
      })()
    : 1
  const effectiveIntervalMinutes = Math.max(
    1,
    Math.round(baseInterval * activityMultiplier * smartIntervalBoost)
  )

  const dailyCounts = useMemo(() => buildDailyCounts(allHistory), [allHistory])
  const weeklySummary = useMemo(() => getWeeklySummary(allHistory, 7), [allHistory])
  const monthlySummary = useMemo(() => getMonthlySummary(allHistory, 30), [allHistory])
  const streak = useMemo(
    () => calculateStreak(dailyCounts, settings.dailyGoal, getDateKey()),
    [dailyCounts, settings.dailyGoal]
  )
  const bestStreak = useMemo(
    () => calculateBestStreak(dailyCounts, settings.dailyGoal),
    [dailyCounts, settings.dailyGoal]
  )
  const suggestedGoal = useMemo(() => {
    const total = weeklySummary.reduce((sum, day) => sum + day.count, 0)
    const avg = Math.round(total / Math.max(1, weeklySummary.length))
    return Math.max(4, avg + 1)
  }, [weeklySummary])
  const behindBy = Math.max(0, settings.dailyGoal - dailyCount)

  const streakMilestone = useMemo(() => {
    if (streak >= 14) return 'Hydration pro: 14-day streak'
    if (streak >= 7) return 'Awesome! 7-day streak'
    if (streak >= 3) return 'Nice! 3-day streak'
    return ''
  }, [streak])

  const hydrationTip = useMemo(() => {
    const tips = [
      'Keep a bottle on your desk to sip regularly.',
      'Drink a glass of water right after waking up.',
      'Add fruit for flavor if plain water feels boring.',
      'Set a glass next to every meal to build a habit.',
      'Hydration helps focus—take a sip before deep work.',
    ]
    const seed = Number(getDateKey().replace(/-/g, ''))
    return tips[seed % tips.length]
  }, [])

  const [nextReminderAt, setNextReminderAt] = useState(null)

  const updateNextReminder = () => {
    if (!isRunning) return
    setNextReminderAt(Date.now() + effectiveIntervalMinutes * 60 * 1000)
  }

  const nextReminderText = useMemo(() => {
    if (!isRunning) return 'Reminders are off'
    if (!nextReminderAt) return 'Calculating...'
    const diff = Math.max(0, Math.floor((nextReminderAt - now.getTime()) / 1000))
    const minutes = Math.floor(diff / 60)
    const seconds = diff % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [isRunning, nextReminderAt, now])

  // Start the reminder loop (only once).
  const handleStart = async () => {
    resetIfNewDay()
    const result = await ensureNotificationPermission()
    setPermissionStatus(result.permission)

    if (result.permission === 'denied') {
      setIsRunning(false)
      return
    }

    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  // Runs every interval while the reminder is active.
  const reminderMessages = [
    'Hydration check 🚰',
    'Time for a sip 💧',
    'Drink now to keep your streak!',
    'You’re close — just a few more cups.',
  ]

  const handleReminderTick = () => {
    resetIfNewDay()

    if (
      settings.workingHoursEnabled &&
      !isWithinWorkingHours(new Date(), settings.workingHoursStart, settings.workingHoursEnd)
    ) {
      return
    }

    const message = reminderMessages[Math.floor(Math.random() * reminderMessages.length)]
    sendNotification(message, {
      body: 'Stay hydrated! Tap “Drink water” after you sip.',
    })
    const volumeBoost = settings.smartModeEnabled && behindBy > 0 ? 1.2 : 1
    playSound(settings.soundId, volumeBoost)
    updateNextReminder()
  }

  useInterval(handleReminderTick, isRunning ? effectiveIntervalMinutes * 60 * 1000 : null)

  useEffect(() => {
    if (isRunning) updateNextReminder()
  }, [isRunning, effectiveIntervalMinutes])

  const handleExportCsv = () => {
    const csv = exportHistoryCsv(allHistory)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'water-history.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportCsv = (csvText) => {
    const imported = parseHistoryCsv(csvText)
    const merged = Array.from(new Set([...imported, ...allHistory])).sort().reverse()
    replaceHistory(merged)
  }

  const handleResetAll = () => {
    const confirmed = window.confirm('Reset all settings and history? This cannot be undone.')
    if (!confirmed) return
    localStorage.removeItem('waterReminderSettings')
    localStorage.removeItem('waterDailyState')
    window.location.reload()
  }

  const handleDrink = () => {
    addDrink()
    setRingPulseKey((prev) => prev + 1)
    if (settings.smartModeEnabled) updateNextReminder()
  }

  const handleQuickAdd = (count) => {
    addDrinkCount(count)
    setRingPulseKey((prev) => prev + 1)
    if (settings.smartModeEnabled) updateNextReminder()
  }

  const handleRequestPermission = async () => {
    const result = await ensureNotificationPermission()
    setPermissionStatus(result.permission)
  }

  const handleApplyPreset = (presetId) => {
    if (presetId === 'office') {
      setSettings((prev) => ({
        ...prev,
        intervalMinutes: 60,
        workingHoursEnabled: true,
        workingHoursStart: '09:00',
        workingHoursEnd: '18:00',
        activityLevel: 'low',
        smartModeEnabled: true,
      }))
    }

    if (presetId === 'workout') {
      setSettings((prev) => ({
        ...prev,
        intervalMinutes: 20,
        workingHoursEnabled: true,
        workingHoursStart: '06:00',
        workingHoursEnd: '22:00',
        activityLevel: 'high',
        smartModeEnabled: true,
      }))
    }

    if (presetId === 'travel') {
      setSettings((prev) => ({
        ...prev,
        intervalMinutes: 45,
        workingHoursEnabled: false,
        activityLevel: 'medium',
        smartModeEnabled: true,
      }))
    }
  }

  const handleVibrate = () => {
    if (navigator.vibrate) navigator.vibrate([150, 60, 150])
  }

  const handleThemeChange = (value) => {
    updateSetting('theme', value)
  }

  useEffect(() => {
    document.body.dataset.theme = settings.theme
  }, [settings.theme])

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Water Reminder</p>
          <h1 className="app__title">Stay hydrated</h1>
          <p className="app__subtitle">One tap to log water. Everything else is secondary.</p>
        </div>
        <div className="app__badge">Windows Web</div>
      </header>

      <main className="app__main">
        {activeTab === 'home' && (
          <HomePage
            progressPercent={progressPercent}
            dailyCount={dailyCount}
            dailyGoal={settings.dailyGoal}
            cupSizeMl={settings.cupSizeMl}
            units={settings.units}
            onDrink={handleDrink}
            onQuickAdd={handleQuickAdd}
            nextReminderText={nextReminderText}
            streak={streak}
            ringPulseKey={ringPulseKey}
            behindBy={behindBy}
            streakMilestone={streakMilestone}
            hydrationTip={hydrationTip}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersPage
            isRunning={isRunning}
            onToggleRunning={(value) => (value ? handleStart() : handleStop())}
            intervalMinutes={settings.intervalMinutes}
            onIntervalChange={(value) => updateSetting('intervalMinutes', value)}
            effectiveIntervalMinutes={effectiveIntervalMinutes}
            workingHoursEnabled={settings.workingHoursEnabled}
            workingHoursStart={settings.workingHoursStart}
            workingHoursEnd={settings.workingHoursEnd}
            onWorkingHoursToggle={(value) => updateSetting('workingHoursEnabled', value)}
            onWorkingHoursStartChange={(value) => updateSetting('workingHoursStart', value)}
            onWorkingHoursEndChange={(value) => updateSetting('workingHoursEnd', value)}
            soundId={settings.soundId}
            onSoundChange={(value) => updateSetting('soundId', value)}
            onSoundPreview={() => playSound(settings.soundId)}
            activityLevel={settings.activityLevel}
            onActivityLevelChange={(value) => updateSetting('activityLevel', value)}
            smartModeEnabled={settings.smartModeEnabled}
            onSmartModeToggle={(value) => updateSetting('smartModeEnabled', value)}
            onApplyPreset={handleApplyPreset}
            onVibrate={handleVibrate}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsPage
            dailyGoal={settings.dailyGoal}
            weeklyGoal={settings.weeklyGoal}
            cupSizeMl={settings.cupSizeMl}
            onDailyGoalChange={(value) => updateSetting('dailyGoal', value)}
            onWeeklyGoalChange={(value) => updateSetting('weeklyGoal', value)}
            onCupSizeChange={(value) => updateSetting('cupSizeMl', value)}
            behindBy={behindBy}
            suggestedGoal={suggestedGoal}
            adaptiveGoalEnabled={settings.adaptiveGoalEnabled}
            onAdaptiveGoalToggle={(value) => updateSetting('adaptiveGoalEnabled', value)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            weeklySummary={weeklySummary}
            monthlySummary={monthlySummary}
            bestStreak={bestStreak}
            onExport={handleExportCsv}
            onImport={handleImportCsv}
          />
        )}

        {activeTab === 'profile' && (
          <ProfilePage
            permissionStatus={permissionStatus}
            onRequestPermission={handleRequestPermission}
            units={settings.units}
            onUnitsChange={(value) => updateSetting('units', value)}
            theme={settings.theme}
            onThemeChange={handleThemeChange}
            onExport={handleExportCsv}
            onImport={handleImportCsv}
            onReset={handleResetAll}
          />
        )}
      </main>

      <BottomNav currentTab={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
