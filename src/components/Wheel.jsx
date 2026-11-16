import { useRef, useLayoutEffect } from 'react'

// `visible` rows are shown (odd number); the middle one is the selected value.
function Wheel({ items, value, onChange, itemHeight = 40, visible = 3, format = it => it }) {
  const ref = useRef(null)
  const timer = useRef()
  const mounted = useRef(false)

  // Keep the wheel on `value`: jump there on mount, and glide there when the value
  // is changed from outside (e.g. typed in). Values that came from scrolling already match.
  useLayoutEffect(() => {
    const el = ref.current
    const index = items.indexOf(value)
    const firstRun = !mounted.current
    mounted.current = true
    if (index < 0 || Math.round(el.scrollTop / itemHeight) === index) return
    const top = index * itemHeight
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!firstRun && el.scrollTo && !reduceMotion) el.scrollTo({ top, behavior: 'smooth' })
    else el.scrollTop = top
  }, [items, value, itemHeight])

  // Spacer above/below so the first and last items can reach the middle row
  const pad = itemHeight * ((visible - 1) / 2)

  const handleScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const item = items[Math.round(ref.current.scrollTop / itemHeight)]
      if (item !== undefined && item !== value) onChange(item)
    }, 80) // wait for the snap to settle
  }

  return (
    <div ref={ref} onScroll={handleScroll} className="wheel" style={{ height: itemHeight * visible }}>
      <div style={{ height: pad }} />
      {items.map(it => (
        <div key={it} className="wheel-item" style={{ height: itemHeight }}>{format(it)}</div>
      ))}
      <div style={{ height: pad }} />
    </div>
  )
}

export default Wheel
