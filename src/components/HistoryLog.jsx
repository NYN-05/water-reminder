import { formatTime } from '../utils/time'

function HistoryLog({ history, totalHistoryCount, onExport, onImport }) {
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
    <section className="card card--full">
      <div className="card__header">
        <h2 className="card__title">History</h2>
        <span className="pill">{totalHistoryCount} total drinks</span>
      </div>

      {history.length === 0 ? (
        <p className="helper">No entries today. Tap “I drank water” to log your first sip.</p>
      ) : (
        <ul className="history">
          {history.map((entry, index) => (
            <li key={`${entry}-${index}`}>
              <span className="history__dot" />
              <span>{formatTime(entry)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="divider" />

      <div className="button-row">
        <button className="button" onClick={onExport}>
          Export CSV
        </button>
        <label className="button button--ghost">
          Import CSV
          <input type="file" accept=".csv" onChange={handleFileChange} hidden />
        </label>
      </div>
      <p className="helper">CSV uses a simple single-column format named “timestamp”.</p>
    </section>
  )
}
export default HistoryLog
