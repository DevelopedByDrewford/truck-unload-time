import { useEffect, useState } from 'react'

// Page inputs live in memory for as long as the app is open: switching pages keeps them,
// but refreshing or closing the app (PWA) starts every page fresh.
const store = new Map()

// Like useState, but remembered across page switches under `key`.
// `initial` may be a function (e.g. to read the current time) and is used when nothing is stored.
export default function usePageState(key, initial) {
  const [value, setValue] = useState(() =>
    store.has(key) ? store.get(key) : typeof initial === 'function' ? initial() : initial,
  )

  useEffect(() => {
    store.set(key, value)
  }, [key, value])

  return [value, setValue]
}
