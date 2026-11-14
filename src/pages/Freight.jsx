import { useState } from 'react'
import TimePicker from '../components/TimePicker'
import { currentHHMM } from '../utils/clock'
import { CATEGORIES, shiftMinutes } from '../utils/productivityMath'

const freight = CATEGORIES.find(c => c.id === 'freight')

// Freight: work out cartons per hour from start time, end time and boxes done.
function Freight() {
  const [nowH, nowM] = currentHHMM()
  const [startHour, setStartHour] = useState(nowH)
  const [startMinute, setStartMinute] = useState(nowM)
  const [endHour, setEndHour] = useState(nowH)
  const [endMinute, setEndMinute] = useState(nowM)
  const [boxes, setBoxes] = useState('')

  const minutes = shiftMinutes(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`, {})
  const hours = minutes / 60
  const cph = hours > 0 ? Number(boxes) / hours : null
  const round2 = n => (Math.round(n * 100) / 100).toFixed(2)

  return (
    <>
      <freight.Icon className="hero-icon" aria-hidden />
      <h1>{freight.title}</h1>
      <p className="rate">cartons per hour</p>

      <div className="pickers">
        <TimePicker title="Start Time" hour={startHour} minute={startMinute} setHour={setStartHour} setMinute={setStartMinute} />
        <TimePicker title="End Time" hour={endHour} minute={endMinute} setHour={setEndHour} setMinute={setEndMinute} />
      </div>

      <div className="pod-form">
        <label className="field">
          <h2>Boxes</h2>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={boxes}
            onChange={e => setBoxes(e.target.value)}
          />
        </label>
      </div>

      <div className="result">
        <h2>{cph === null ? '—' : round2(cph)} cartons per hour</h2>
        <p>Total time: {round2(hours)} hours</p>
      </div>
    </>
  )
}

export default Freight
