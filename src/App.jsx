import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import Wheel from './components/Wheel'
import { calcGoal } from './utils/unloadMath'
import './App.css'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const BOX_COUNTS = Array.from({ length: 300 }, (_, i) => i + 1)

function currentHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function App() {
  const [defaultHour, defaultMinute] = currentHHMM().split(':')
  const [hour, setHour] = useState(defaultHour)
  const [minute, setMinute] = useState(defaultMinute)
  const [boxes, setBoxes] = useState(180)
  const [rate] = useStoredState('rate', 2.5)

  const start = `${hour}:${minute}`
  const result = calcGoal(start, Number(boxes), rate)

  function useStoredState(key, initial) {
    const [val, setVal] = useState(() => {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initial
    })
    useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val])
    return [val, setVal]
  }

  return (
    <>
      <img src={heroImg} alt="" className="hero" />
      <h1>Unload Finish Time</h1>

      <div className="pickers">
        <div className="picker-group">
          <h2>Start Time</h2>
          <div className="picker-row">
            <Wheel items={HOURS} value={hour} onChange={setHour} />
            <span className="wheel-sep">:</span>
            <Wheel items={MINUTES} value={minute} onChange={setMinute} />
          </div>
        </div>

        <div className="picker-group">
          <h2>Boxes</h2>
          <div className="picker-row">
            <Wheel items={BOX_COUNTS} value={boxes} onChange={setBoxes} />
          </div>
        </div>
      </div>

      <div className="result">
        {result ? (
          <>
            <h2>Done by {result.goal}</h2>
            <p>{Math.round(result.duration)} min</p>
          </>
        ) : (
          <p>Pick a start time and box count</p>
        )}
      </div>
    </>
  )
}

export default App
