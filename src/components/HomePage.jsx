import ProgressRing from './ProgressRing'

function HomePage({
  progressPercent,
  dailyCount,
  dailyGoal,
  cupSizeMl,
  units,
  onDrink,
  onQuickAdd,
  nextReminderText,
  streak,
  ringPulseKey,
  behindBy,
  streakMilestone,
  hydrationTip,
}) {
  const currentAmount = units === 'ml' ? dailyCount * cupSizeMl : dailyCount
  const goalAmount = units === 'ml' ? dailyGoal * cupSizeMl : dailyGoal
  const unitLabel = units === 'ml' ? 'ml' : 'cups'

  return (
    <section className="page">
      <div className="hero">
        <ProgressRing percent={progressPercent} pulseKey={ringPulseKey} />
        <div className="hero__stats">
          <p className="hero__big">
            {currentAmount} / {goalAmount}
          </p>
          <p className="hero__label">{unitLabel} today</p>
          <div className="badge">Streak: {streak} days</div>
        </div>
      </div>

      <button className="button button--primary button--xl" onClick={onDrink}>
        Drink water
      </button>

      <div className="quick-add">
        <button className="button" onClick={() => onQuickAdd(1)}>
          +1 cup
        </button>
        <button className="button" onClick={() => onQuickAdd(2)}>
          +2 cups
        </button>
      </div>

      {streakMilestone && (
        <div className="badge badge--success badge--pulse">{streakMilestone}</div>
      )}

      <div className="card card--soft">
        <p className="card__title">Next reminder</p>
        <p className="hero__big">{nextReminderText}</p>
      </div>

      <div className={`card card--soft ${behindBy > 0 ? 'card--warning' : 'card--success'}`}>
        <p className="card__title">Today’s status</p>
        <p className="helper">
          {behindBy > 0
            ? `You’re ${behindBy} cups away from your goal.`
            : 'You’re on track. Great job!'}
        </p>
      </div>

      <div className="card tip-card">
        <p className="card__title">Tip of the day</p>
        <p className="helper">{hydrationTip}</p>
      </div>
    </section>
  )
}

export default HomePage
