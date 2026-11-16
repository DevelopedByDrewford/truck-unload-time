// podMath.js
import { PiCoatHangerBold } from 'react-icons/pi'
import { GiConverseShoe } from 'react-icons/gi'

// `cph` is the default cartons (boxes) per person per hour; it can be changed on that pod page
// in steps of `cphStep` (only that page uses the change) until Clear/refresh.
// Each unit's rate is cph × perBox, e.g. 2 CPH × 100 items per box = 200 items/hour.
// The first unit is the default and shows on the left of the toggle.
export const POD_TYPES = [
  {
    id: 'apparel', title: 'Apparel', Icon: PiCoatHangerBold,
    cph: 2, cphStep: 0.5,
    peoplePerPod: 2, // shows a pod count in the result
    units: [
      { id: 'boxes', label: 'Boxes', perBox: 1 },
      { id: 'items', label: 'Items', perBox: 100 },
    ],
  },
  {
    id: 'shoes', title: 'Shoes', Icon: GiConverseShoe,
    cph: 8, cphStep: 1,
    units: [
      { id: 'boxes', label: 'Boxes', perBox: 1 },
      { id: 'pairs', label: 'Pairs', perBox: 12 },
    ],
  },
]

export const MAX_CPH = 99

// Per person per hour, in the given unit, at the given CPH.
export function unitRate(unit, cph) {
  return cph * unit.perBox
}

export const DEFAULT_PEOPLE = 1 // starting/cleared value; 2 people make a full pod
export const MAX_PEOPLE = 10
export const POD_BREAK_MINUTES = 15

// Clock hours for the pod to finish `quantity` units.
// Each person on break loses 15 minutes of labor, which the crew makes up by working longer.
export function podHours(quantity, rate, people, breaks) {
  if (!(quantity > 0) || !(rate > 0) || !(people > 0)) return 0
  const laborHours = quantity / rate
  const breakHours = (breaks * POD_BREAK_MINUTES) / 60
  return (laborHours + breakHours) / people
}
