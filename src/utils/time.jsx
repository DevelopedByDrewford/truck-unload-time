// Display a 24h hour value ("00"–"23") as a 12-hour clock label.
export function formatHour12(hh) {
  const h = Number(hh)
  return (
    <span>
      {h % 12 || 12}<small className="ampm">{h < 12 ? 'AM' : 'PM'}</small>
    </span>
  )
}
