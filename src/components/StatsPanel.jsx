function StatsPanel({ streak, weeklySummary, dailyGoal }) {
  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">Progress Summary</h2>
        <span className="pill">Streak: {streak} days</span>
      </div>

      <p className="helper">
        A streak counts days where you meet or exceed your daily goal ({dailyGoal} cups).
      </p>

      <div className="weekly">
        {weeklySummary.map((day) => (
          <div key={day.date} className="weekly__item">
            <span className="weekly__date">{day.date}</span>
            <span className={day.count >= dailyGoal ? 'weekly__count weekly__count--met' : 'weekly__count'}>
              {day.count} cups
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsPanel
