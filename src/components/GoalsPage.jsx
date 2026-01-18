function GoalsPage({
  dailyGoal,
  weeklyGoal,
  cupSizeMl,
  onDailyGoalChange,
  onWeeklyGoalChange,
  onCupSizeChange,
  behindBy,
  suggestedGoal,
  adaptiveGoalEnabled,
  onAdaptiveGoalToggle,
}) {
  return (
    <section className="page">
      <div className="page__header">
        <h2>Goals</h2>
      </div>

      <div className="card">
        <p className="card__title">Daily goal</p>
        <input
          type="range"
          min="4"
          max="16"
          value={dailyGoal}
          onChange={(event) => onDailyGoalChange(Number(event.target.value))}
        />
        <p className="hero__big">{dailyGoal} cups</p>
      </div>

      <div className="card">
        <p className="card__title">Weekly target</p>
        <input
          type="range"
          min="28"
          max="112"
          value={weeklyGoal}
          onChange={(event) => onWeeklyGoalChange(Number(event.target.value))}
        />
        <p className="hero__big">{weeklyGoal} cups</p>
      </div>

      <div className="card">
        <p className="card__title">Cup size</p>
        <input
          type="range"
          min="150"
          max="400"
          value={cupSizeMl}
          onChange={(event) => onCupSizeChange(Number(event.target.value))}
        />
        <p className="hero__big">{cupSizeMl} ml</p>
      </div>

      <div className="card">
        <p className="card__title">Motivation</p>
        <p className="helper">
          {behindBy > 0 ? `You're behind by ${behindBy} cups.` : 'You are on track today!'}
        </p>
        <label className="toggle">
          <input
            type="checkbox"
            checked={adaptiveGoalEnabled}
            onChange={(event) => onAdaptiveGoalToggle(event.target.checked)}
          />
          <span>Adaptive goals (based on last 7 days)</span>
        </label>
        <p className="helper">AI suggestion: Based on your past 7 days, set {suggestedGoal} cups.</p>
      </div>
    </section>
  )
}

export default GoalsPage
