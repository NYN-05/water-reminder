function HistoryPage({ weeklySummary, monthlySummary, bestStreak, onExport, onImport }) {
  const maxWeekly = Math.max(1, ...weeklySummary.map((day) => day.count))
  const maxMonthly = Math.max(1, ...monthlySummary.map((day) => day.count))

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
      <div className="page__header">
        <h2>History & Analytics</h2>
        <div className="badge">Best streak: {bestStreak} days</div>
      </div>

      <div className="card">
        <p className="card__title">Weekly bar chart</p>
        <div className="bars">
          {weeklySummary.map((day) => (
            <div
              key={day.date}
              className="bars__item chart-tooltip"
              data-tip={`${day.date}: ${day.count} cups`}
            >
              <div
                className="bars__bar"
                style={{ height: `${(day.count / maxWeekly) * 100}%` }}
              />
              <span className="bars__label">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card__title">Monthly trend</p>
        <div className="sparkline">
          {monthlySummary.map((day) => (
            <div
              key={day.date}
              className="sparkline__bar"
              style={{ height: `${(day.count / maxMonthly) * 100}%` }}
              title={`${day.date}: ${day.count} cups`}
            />
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card__title">Missed days heatmap (30 days)</p>
        <div className="heatmap">
          {monthlySummary.map((day) => (
            <div
              key={day.date}
              className={`heatmap__cell ${day.count === 0 ? 'heatmap__cell--missed' : ''}`}
              title={`${day.date}: ${day.count} cups`}
            />
          ))}
        </div>
      </div>

      <details className="card">
        <summary className="card__title">Advanced: CSV import/export</summary>
        <div className="button-row">
          <button className="button" onClick={onExport}>
            Export CSV
          </button>
          <label className="button button--ghost">
            Import CSV
            <input type="file" accept=".csv" onChange={handleFileChange} hidden />
          </label>
        </div>
      </details>
    </section>
  )
}

export default HistoryPage
