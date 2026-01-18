import { useEffect, useState } from 'react'

// Simple localStorage hook with JSON parsing.
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error('Failed to read localStorage', error)
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to write localStorage', error)
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
