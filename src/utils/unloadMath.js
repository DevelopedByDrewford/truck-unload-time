// unloadMath.js
export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function formatTime(totalMinutes) {
// rounding up 
  const mins = ((Math.ceil(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h24 % 12 || 12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
}

export function calcGoal(start, boxes, rate) {
  if (!start || !(boxes > 0) || !(rate > 0)) return null;
  const duration = boxes / rate; // minutes
  return { duration, goal: formatTime(toMinutes(start) + duration) };
}