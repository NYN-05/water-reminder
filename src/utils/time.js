// Returns YYYY-MM-DD for daily reset comparisons.
export function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0]
}

// Store time as ISO string for history.
export function nowISOTime() {
  return new Date().toISOString()
}

// Format ISO string into a readable time for UI.
export function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function timeStringToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

export function isWithinWorkingHours(date, startTime = '09:00', endTime = '21:00') {
  const minutes = date.getHours() * 60 + date.getMinutes()
  const start = timeStringToMinutes(startTime)
  const end = timeStringToMinutes(endTime)

  if (start === end) return true

  if (start < end) {
    return minutes >= start && minutes < end
  }

  // Overnight range (e.g., 22:00 -> 06:00)
  return minutes >= start || minutes < end
}
