# Water Reminder Web App

A beginner-friendly, Windows-focused water reminder built with React and Vite. It uses the Notification API, Web Audio API, and localStorage—no backend required.

## Features
- Start/stop reminders
- Custom interval (minutes)
- Desktop notification for each reminder
- Selectable sound alerts
- Daily water goal tracker
- “I drank water” button
- Progress bar
- History log (time of each drink)
- Working hours filter (9:00 AM–9:00 PM)
- Custom working hours range
- Activity-based reminder frequency
- Streaks and weekly summaries
- Export/import history as CSV
- Clean UI and persistent settings

## Tech Stack
- React
- Vite
- Notification API
- Web Audio API
- localStorage

## Project Structure
```
src/
	components/
		GoalTracker.jsx
		HistoryLog.jsx
		ReminderControls.jsx
		SettingsPanel.jsx
	hooks/
		useDailyState.js
		useInterval.js
		useLocalStorage.js
	utils/
		notifications.js
		sounds.js
		time.js
	App.css
	App.jsx
	index.css
	main.jsx
```

## Setup
1) Install dependencies:
	 npm install
2) Run the app:
	 npm run dev
3) Open the local URL shown in the terminal.

## How It Works
- Settings are stored in localStorage.
- The reminder uses a safe interval hook to avoid duplicate timers.
- Notifications are shown only within working hours when enabled.
- Sound is generated using the Web Audio API.
- Daily progress resets automatically when the date changes.

## Common Issues
- Notifications show as “denied”: Enable notifications for this site in browser settings.
- Sound doesn’t play: Click a button once to unlock audio in the browser.
- No reminders outside hours: This is expected when working hours are enabled.

## Best Practices for Beginners
- Keep UI state small and centralized.
- Use hooks for reusable logic (interval, local storage).
- Add comments and readable naming for clarity.
- Test notification permission flow early.
