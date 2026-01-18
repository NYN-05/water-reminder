import { useEffect, useState } from 'react'

// Returns the current time, updating every second.
function useNow(enabled = true) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!enabled) return undefined

    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [enabled])

  return now
}

export default useNow
