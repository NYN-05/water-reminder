import { SOUND_OPTIONS } from '../utils/sounds'

function SettingsPanel({
  soundId,
  onSoundChange,
  onPreviewSound,
  workingHoursEnabled,
  onToggleWorkingHours,
  workingHoursStart,
  workingHoursEnd,
  onWorkingHoursStartChange,
  onWorkingHoursEndChange,
  activityLevel,
  onActivityLevelChange,
}) {
  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">Settings</h2>
      </div>

      <label className="field">
        <span>Alert sound</span>
        <select value={soundId} onChange={(event) => onSoundChange(event.target.value)}>
          {SOUND_OPTIONS.map((sound) => (
            <option key={sound.id} value={sound.id}>
              {sound.name}
            </option>
          ))}
        </select>
      </label>

      <button className="button" onClick={onPreviewSound}>
        Preview sound
      </button>

      <div className="divider" />

      <label className="toggle">
        <input
          type="checkbox"
          checked={workingHoursEnabled}
          onChange={(event) => onToggleWorkingHours(event.target.checked)}
        />
        <span>Only notify between 9:00 AM and 9:00 PM</span>
      </label>

      <div className="two-column">
        <label className="field">
          <span>Start time</span>
          <input
            type="time"
            value={workingHoursStart}
            onChange={(event) => onWorkingHoursStartChange(event.target.value)}
            disabled={!workingHoursEnabled}
          />
        </label>

        <label className="field">
          <span>End time</span>
          <input
            type="time"
            value={workingHoursEnd}
            onChange={(event) => onWorkingHoursEndChange(event.target.value)}
            disabled={!workingHoursEnabled}
          />
        </label>
      </div>
      <p className="helper">Outside working hours, reminders are paused automatically.</p>

      <div className="divider" />

      <label className="field">
        <span>Activity level</span>
        <select value={activityLevel} onChange={(event) => onActivityLevelChange(event.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <p className="helper">Higher activity shortens the reminder interval automatically.</p>
    </section>
  )
}
export default SettingsPanel
