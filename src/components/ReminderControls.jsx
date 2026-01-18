function ReminderControls({
  isRunning,
  intervalMinutes,
  effectiveIntervalMinutes,
  activityLevel,
  onIntervalChange,
  onStart,
  onStop,
  permissionStatus,
}) {
  const statusLabel = isRunning ? 'Running' : 'Stopped'

  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">Reminder</h2>
        <span className={`status ${isRunning ? 'status--on' : 'status--off'}`}>
          {statusLabel}
        </span>
      </div>

      <label className="field">
        <span>Interval (minutes)</span>
        <input
          type="number"
          min="1"
          value={intervalMinutes}
          onChange={(event) => onIntervalChange(Number(event.target.value))}
        />
      </label>

      <div className="button-row">
        <button className="button button--primary" onClick={onStart} disabled={isRunning}>
          Start reminder
        </button>
        <button className="button" onClick={onStop} disabled={!isRunning}>
          Stop
        </button>
      </div>

      <p className="helper">
        Notification permission: <strong>{permissionStatus}</strong>
      </p>
      <p className="helper">
        Effective interval: <strong>{effectiveIntervalMinutes}</strong> min (activity:{' '}
        {activityLevel})
      </p>
      <p className="helper">Prevent multiple timers: Start is disabled while running.</p>
    </section>
  )
}
export default ReminderControls
