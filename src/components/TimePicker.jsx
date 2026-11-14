import Wheel from './Wheel'
import { formatHour12 } from '../utils/time'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

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

export default TimePicker
