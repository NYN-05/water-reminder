function RemindersPage({
  isRunning,
  onToggleRunning,
  intervalMinutes,
  onIntervalChange,
  effectiveIntervalMinutes,
  workingHoursEnabled,
  workingHoursStart,
  workingHoursEnd,
  onWorkingHoursToggle,
  onWorkingHoursStartChange,
  onWorkingHoursEndChange,
  soundId,
  onSoundChange,
  onSoundPreview,
  activityLevel,
  onActivityLevelChange,
  smartModeEnabled,
  onSmartModeToggle,
  onApplyPreset,
  onVibrate,
}) {
  const presets = [
    { id: 'office', label: 'Office mode' },
    { id: 'workout', label: 'Workout mode' },
    { id: 'travel', label: 'Travel mode' },
  ]

  return (
    <section className="page">
      <div className="page__header">
        <h2>Reminders</h2>
        <button className="button button--primary" onClick={() => onToggleRunning(!isRunning)}>
          {isRunning ? 'Turn off' : 'Turn on'}
        </button>
      </div>

      <div className="card">
        <p className="card__title">Interval</p>
        <div className="segmented">
          {[15, 30, 60].map((value) => (
            <button
              key={value}
              className={`segmented__item ${intervalMinutes === value ? 'segmented__item--active' : ''}`}
              onClick={() => onIntervalChange(value)}
            >
              {value}m
            </button>
          ))}
        </div>
        <label className="field">
          <span>Custom interval (minutes)</span>
          <input
            type="number"
            min="1"
            value={intervalMinutes}
            onChange={(event) => onIntervalChange(Number(event.target.value))}
          />
        </label>
        <p className="helper">Effective interval: {effectiveIntervalMinutes} minutes.</p>
      </div>

      <div className="card">
        <p className="card__title">Active hours</p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={workingHoursEnabled}
            onChange={(event) => onWorkingHoursToggle(event.target.checked)}
          />
          <span>Only remind during selected hours</span>
        </label>
        <div className="two-column">
          <label className="field">
            <span>Start</span>
            <input
              type="time"
              value={workingHoursStart}
              onChange={(event) => onWorkingHoursStartChange(event.target.value)}
              disabled={!workingHoursEnabled}
            />
          </label>
          <label className="field">
            <span>End</span>
            <input
              type="time"
              value={workingHoursEnd}
              onChange={(event) => onWorkingHoursEndChange(event.target.value)}
              disabled={!workingHoursEnabled}
            />
          </label>
        </div>
      </div>

      <div className="card">
        <p className="card__title">Smart mode</p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={smartModeEnabled}
            onChange={(event) => onSmartModeToggle(event.target.checked)}
          />
          <span>Adapt reminders based on activity and last drink</span>
        </label>
        <label className="field">
          <span>Activity level</span>
          <select value={activityLevel} onChange={(event) => onActivityLevelChange(event.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div className="card">
        <p className="card__title">Sound & vibration</p>
        <label className="field">
          <span>Alert sound</span>
          <select value={soundId} onChange={(event) => onSoundChange(event.target.value)}>
            <option value="beep">Beep</option>
            <option value="chime">Chime</option>
            <option value="soft">Soft pulse</option>
          </select>
        </label>
        <div className="button-row">
          <button className="button" onClick={onSoundPreview}>
            Preview sound
          </button>
          <button className="button button--ghost" onClick={onVibrate}>
            Vibrate
          </button>
        </div>
      </div>

      <div className="card">
        <p className="card__title">Presets</p>
        <div className="button-row">
          {presets.map((preset) => (
            <button key={preset.id} className="button" onClick={() => onApplyPreset(preset.id)}>
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RemindersPage
