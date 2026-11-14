// Current local time as ["HH", "MM"] (24h), for defaulting the time wheels.
export function currentHHMM() {
  const now = new Date()
  return [String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0')]
}
