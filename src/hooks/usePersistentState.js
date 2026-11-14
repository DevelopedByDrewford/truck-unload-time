import { useEffect, useState } from 'react'

// Like useState, but the value is saved in localStorage under `key`,
// so a page's inputs are still there when you come back (or reload).
export default function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) return JSON.parse(saved)
    } catch { /* storage unavailable or bad data: fall back to the default */ }
    return typeof initial === 'function' ? initial() : initial
  })

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])

  return [value, setValue]
}
