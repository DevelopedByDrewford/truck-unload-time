import { useState } from 'react'
import { FaCoffee, FaUtensils } from 'react-icons/fa'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import Wheel from '../components/Wheel'
import { formatHour12 } from '../utils/time'
import {
  CATEGORIES, BREAK_MINUTES, LUNCH_MINUTES,
  shiftMinutes, calcGoal, formatDuration,
} from '../utils/productivityMath'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function currentHHMM() {
  const now = new Date()
  return [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')]
}

function TimePicker({ title, hour, minute, setHour, setMinute }) {
  return (
    <div className="picker-group">
      <h2>{title}</h2>
      <div className="picker-row">
        <Wheel items={HOURS} value={hour} onChange={setHour} format={formatHour12} />
        <span className="wheel-sep">:</span>
        <Wheel items={MINUTES} value={minute} onChange={setMinute} />
      </div>
    </div>
  )
}

function IconCheckbox({ checked, onChange, Icon, label }) {
  const Box = checked ? MdCheckBox : MdCheckBoxOutlineBlank
  return (
    <label className={`icon-check${checked ? ' checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <Box className="box" aria-hidden />
      <Icon aria-hidden />
      <span>{label}</span>
    </label>
  )
}

// Category comes from the menu/route; shift times are kept when switching categories.
function Productivity({ categoryId }) {
  const [nowH, nowM] = currentHHMM()
  const [startHour, setStartHour] = useState(nowH)
  const [startMinute, setStartMinute] = useState(nowM)
  const [endHour, setEndHour] = useState(nowH)
  const [endMinute, setEndMinute] = useState(nowM)
  const [breakTaken, setBreakTaken] = useState(false)
  const [lunchTaken, setLunchTaken] = useState(false)

  const category = CATEGORIES.find(c => c.id === categoryId) ?? CATEGORIES[0]
  const minutes = shiftMinutes(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`, { breakTaken, lunchTaken })
  const goal = calcGoal(minutes, category.cph)

  return (
    <>
      <category.Icon className="hero-icon" aria-hidden />
      <h1>{category.title}</h1>
      <p className="rate">{category.cph} cartons per hour</p>

      <div className="pickers">
        <TimePicker title="Start Time" hour={startHour} minute={startMinute} setHour={setStartHour} setMinute={setStartMinute} />
        <TimePicker title="End Time" hour={endHour} minute={endMinute} setHour={setEndHour} setMinute={setEndMinute} />
      </div>

      <div className="checks">
        <IconCheckbox checked={breakTaken} onChange={setBreakTaken} Icon={FaCoffee} label={`Break (−${BREAK_MINUTES} min)`} />
        <IconCheckbox checked={lunchTaken} onChange={setLunchTaken} Icon={FaUtensils} label={`Lunch (−${LUNCH_MINUTES} min)`} />
      </div>

      <div className="result">
        <p>Total time: {formatDuration(minutes)}</p>
        <h2>Goal: {(Math.round(goal * 100) / 100).toFixed(2)} cartons</h2>
      </div>
    </>
  )
}

export default Productivity
