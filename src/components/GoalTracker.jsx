function GoalTracker({ dailyGoal, dailyCount, progressPercent, onGoalChange, onDrink }) {
  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">Daily Goal</h2>
        <span className="pill">
          {dailyCount} / {dailyGoal} cups
        </span>
      </div>

      <label className="field">
        <span>Goal (cups)</span>
        <input
          type="number"
          min="1"
          value={dailyGoal}
          onChange={(event) => onGoalChange(Number(event.target.value))}
        />
      </label>

      <div className="progress">
        <div className="progress__bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="helper">{progressPercent}% of your goal completed.</p>

      <button className="button button--primary" onClick={onDrink}>
        I drank water
      </button>
    </section>
  )
}
export default GoalTracker
