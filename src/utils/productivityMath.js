// productivityMath.js
import { FaTshirt, FaHome } from 'react-icons/fa'
import { GiRunningShoe } from 'react-icons/gi'

// Cartons per hour for each category. Change HOME_CPH once the rate is known.
export const HOME_CPH = 4

export const CATEGORIES = [
  { id: 'apparel', title: 'Apparel', cph: 2, Icon: FaTshirt },
  { id: 'shoes', title: 'Shoes', cph: 8, Icon: GiRunningShoe },
  { id: 'home', title: 'Home', cph: HOME_CPH, Icon: FaHome },
]

export const BREAK_MINUTES = 15
export const LUNCH_MINUTES = 30

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatDuration(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${String(m).padStart(2, '0')}m`
}

// Minutes between start and end; if end is earlier than start, assume the shift crosses midnight.
export function shiftMinutes(start, end, { breakTaken, lunchTaken }) {
  let minutes = toMinutes(end) - toMinutes(start)
  if (minutes < 0) minutes += 1440
  if (breakTaken) minutes -= BREAK_MINUTES
  if (lunchTaken) minutes -= LUNCH_MINUTES
  return Math.max(0, minutes)
}

export function calcGoal(minutes, cph) {
  return (minutes / 60) * cph
}
