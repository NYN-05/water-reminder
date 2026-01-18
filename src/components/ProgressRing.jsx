function ProgressRing({ percent, pulseKey }) {
  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <div key={pulseKey} className="ring ring--pulse" aria-label={`Progress ${safePercent}%`}>
      <div
        className="ring__circle"
        style={{ background: `conic-gradient(#0b72ff ${safePercent}%, #e6eefc ${safePercent}% 100%)` }}
      />
      <div className="ring__content">
        <span className="ring__value">{safePercent}%</span>
        <span className="ring__label">Today</span>
      </div>
    </div>
  )
}

export default ProgressRing
