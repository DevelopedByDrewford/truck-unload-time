// podMath.js
import { PiCoatHangerBold } from 'react-icons/pi'
import { GiConverseShoe } from 'react-icons/gi'

// Rates are per person per hour, for each unit the page can toggle between.
// The first unit is the default and shows on the left of the toggle.
export const POD_TYPES = [
  {
    id: 'apparel', title: 'Apparel', Icon: PiCoatHangerBold,
    peoplePerPod: 2, // shows a pod count in the result
    units: [
      { id: 'boxes', label: 'Boxes', rate: 2 },
      { id: 'items', label: 'Items', rate: 200 },
    ],
  },
  {
    id: 'shoes', title: 'Shoes', Icon: GiConverseShoe,
    units: [
      { id: 'boxes', label: 'Boxes', rate: 8 },
      { id: 'pairs', label: 'Pairs', rate: 96 },
    ],
  },
]

export const DEFAULT_PEOPLE = 2
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
