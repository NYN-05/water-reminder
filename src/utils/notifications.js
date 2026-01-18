// Notification helpers with graceful fallbacks.
export async function ensureNotificationPermission() {
  if (typeof Notification === 'undefined') {
    return { supported: false, permission: 'unsupported' }
  }

  if (Notification.permission === 'granted') {
    return { supported: true, permission: 'granted' }
  }

  if (Notification.permission === 'denied') {
    return { supported: true, permission: 'denied' }
  }

  const permission = await Notification.requestPermission()
  return { supported: true, permission }
}

export function sendNotification(title, options = {}) {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return

  try {
    // Create the system notification.
    new Notification(title, options)
  } catch (error) {
    console.error('Notification failed', error)
  }
}
