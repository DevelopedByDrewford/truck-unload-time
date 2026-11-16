// runsMath.js — pages measured in minutes per run (lower is better): Mini Hummers, Z Racks, Blue Bins.
import { BsHandbagFill } from 'react-icons/bs'
import { FaBitbucket, FaHome } from 'react-icons/fa'
import { FaBath } from 'react-icons/fa6'
import { GiClothes, GiRunningShoe } from 'react-icons/gi'

// Goal cards per page: a run average at or under `minutesPerRun` passes.
// `theme` picks the card colors (see [data-page] rules in App.css).
export const RUN_GOALS = {
  hummers: [
    { id: 'shoesHandbags', minutesPerRun: 8, Icons: [GiRunningShoe, BsHandbagFill], theme: 'shoes' },
    { id: 'homeBedBath', minutesPerRun: 10, Icons: [FaHome, FaBath], theme: 'home' },
  ],
  zracks: [
    { id: 'zracks', minutesPerRun: 9, Icons: [GiClothes], theme: 'zracks' },
  ],
  bluebins: [
    { id: 'bluebins', minutesPerRun: 35, Icons: [FaBitbucket], theme: 'bluebins' },
  ],
}

// Average minutes per run, or null if there's no time worked or no runs yet.
export function minutesPerRun(minutes, runs) {
  return minutes > 0 && runs > 0 ? minutes / runs : null
}
