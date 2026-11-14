// Typing a time on the number keypad, iPhone Clock style: "7" → 7:00, "930" → 9:30, "1045" → 10:45.

export const MAX_DIGITS = 4

// Split typed digits into hour/minute digit strings (either may be partial while typing).
function split(digits) {
  if (digits.length <= 1) return [digits, '']
  if (digits.length === 2) {
    // "10"/"12" read as an hour; "93" reads as 9:3_ (on its way to 9:30)
    return Number(digits) <= 23 ? [digits, ''] : [digits[0], digits[1]]
  }
  return [digits.slice(0, -2), digits.slice(-2)]
}

// What to show while typing, e.g. "9:3–".
export function previewTyped(digits) {
  const [h, m] = split(digits)
  return `${h || '–'}:${m.padEnd(2, '–')}`
}

// Turn typed digits into 24h { hour: "HH", minute: "MM" }, or null if it isn't a real time.
// Hours 1–12 use the chosen AM/PM; 0 and 13–23 are read as 24-hour times.
export function parseTyped(digits, pm) {
  if (!digits) return null
  const [hStr, mStr] = split(digits)
  const h = Number(hStr)
  const m = mStr.length === 1 ? Number(mStr) * 10 : Number(mStr || 0)
  if (!(h >= 0 && h <= 23) || !(m >= 0 && m <= 59)) return null
  const hour24 = h >= 1 && h <= 12 ? (h % 12) + (pm ? 12 : 0) : h
  return { hour: String(hour24).padStart(2, '0'), minute: String(m).padStart(2, '0') }
}
