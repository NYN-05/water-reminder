function ProfilePage({
  permissionStatus,
  onRequestPermission,
  units,
  onUnitsChange,
  theme,
  onThemeChange,
  onExport,
  onImport,
  onReset,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onImport(reader.result)
      event.target.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <section className="page">
      <div className="profile-header">
        <div>
          <p className="app__eyebrow">Profile</p>
          <h2 className="app__title">Preferences & data</h2>
          <p className="app__subtitle">Manage notifications, units, theme, and backups.</p>
        </div>
        <div className="badge">Windows Web</div>
      </div>

      <div className="card">
        <p className="section-title">Notifications</p>
        <div className="list">
          <div className="list__row">
            <div>
              <p className="list__title">Browser permission</p>
              <p className="list__desc">Required for desktop reminders.</p>
            </div>
            <div className="list__actions">
              <span className="chip">{permissionStatus}</span>
              <button className="button button--ghost" onClick={onRequestPermission}>
                Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="section-title">Preferences</p>
        <div className="list">
          <div className="list__row">
            <div>
              <p className="list__title">Units</p>
              <p className="list__desc">Switch between cups and milliliters.</p>
            </div>
            <select value={units} onChange={(event) => onUnitsChange(event.target.value)}>
              <option value="cups">Cups</option>
              <option value="ml">Milliliters</option>
            </select>
          </div>
          <div className="list__row">
            <div>
              <p className="list__title">Theme</p>
              <p className="list__desc">Light or dark mode.</p>
            </div>
            <select value={theme} onChange={(event) => onThemeChange(event.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="section-title">Data & backup</p>
        <div className="list">
          <div className="list__row">
            <div>
              <p className="list__title">Export history</p>
              <p className="list__desc">Download your history as CSV.</p>
            </div>
            <button className="button" onClick={onExport}>
              Export CSV
            </button>
          </div>
          <div className="list__row">
            <div>
              <p className="list__title">Import history</p>
              <p className="list__desc">Restore data from a CSV file.</p>
            </div>
            <label className="button button--ghost">
              Import CSV
              <input type="file" accept=".csv" onChange={handleFileChange} hidden />
            </label>
          </div>
          <div className="list__row">
            <div>
              <p className="list__title">Backup</p>
              <p className="list__desc">Automatic cloud backup (coming soon).</p>
            </div>
            <button className="button" disabled>
              Enabled
            </button>
          </div>
          <div className="list__row">
            <div>
              <p className="list__title">Reset app data</p>
              <p className="list__desc">Clears history and settings from this device.</p>
            </div>
            <button className="button button--danger" onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
