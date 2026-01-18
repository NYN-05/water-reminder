function BottomNav({ currentTab, onChange }) {
  const items = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'reminders', label: 'Reminders', icon: '⏰' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'history', label: 'History', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav__item ${currentTab === item.id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
