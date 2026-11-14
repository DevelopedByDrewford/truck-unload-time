import { useRef, useState } from 'react'
import Wheel from './Wheel'
import { formatHour12 } from '../utils/time'
import { MAX_DIGITS, parseTyped, previewTyped } from '../utils/timeEntry'
import { useI18n } from '../i18n'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

// Scroll the wheels, or tap them to type the time on the number keypad.
function TimePicker({ title, hour, minute, setHour, setMinute }) {
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [digits, setDigits] = useState('')
  const [pm, setPm] = useState(Number(hour) >= 12)
  const [invalid, setInvalid] = useState(false)
  // Latest typed digits / AM-PM, read on blur (which can fire before React re-renders).
  const live = useRef({ digits: '', pm: false })

  // Must run inside the tap itself, or iPhone won't open the keyboard.
  const startTyping = () => inputRef.current?.focus()

  const commit = () => {
    const parsed = parseTyped(live.current.digits, live.current.pm)
    if (parsed) {
      setHour(parsed.hour)
      setMinute(parsed.minute)
    }
    return parsed
  }

  const choosePm = val => {
    live.current.pm = val
    setPm(val)
    setInvalid(live.current.digits.length >= 3 && !parseTyped(live.current.digits, val))
  }

  const onFocus = () => {
    live.current = { digits: '', pm: Number(hour) >= 12 }
    setDigits('')
    setPm(live.current.pm)
    setInvalid(false)
    setEditing(true)
  }

  const onBlur = () => {
    commit()
    setEditing(false)
  }

  const onChange = e => {
    const next = e.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS)
    live.current.digits = next
    setDigits(next)
    const valid = parseTyped(next, live.current.pm)
    setInvalid(next.length >= 3 && !valid)
    // A full HH:MM is done: apply it and put the keypad away.
    if (next.length === MAX_DIGITS && valid) inputRef.current.blur()
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') inputRef.current.blur()
    if (e.key === 'Escape') {
      live.current.digits = '' // cancel: keep the old time
      inputRef.current.blur()
    }
  }

  // Keep focus on the input when tapping AM/PM, so the keypad stays open.
  const keepFocus = e => e.preventDefault()

  return (
    <div className="picker-group">
      <h2>{title}</h2>

      <div className={`picker-row${editing ? ' editing' : ''}`} onClick={startTyping}>
        <Wheel items={HOURS} value={hour} onChange={setHour} format={formatHour12} />
        <span className="wheel-sep">:</span>
        <Wheel items={MINUTES} value={minute} onChange={setMinute} />

        <input
          ref={inputRef}
          className="time-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          enterKeyHint="done"
          aria-label={t('typeTime', { title })}
          value={digits}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />

        {editing && (
          <div className={`time-entry${invalid ? ' invalid' : ''}`} onPointerDown={keepFocus} onMouseDown={keepFocus}>
            <span className="time-entry-value" aria-hidden>{previewTyped(digits)}</span>
            <span className="ampm-toggle">
              <button type="button" className={!pm ? 'active' : ''}
                onClick={e => { e.stopPropagation(); choosePm(false) }}>AM</button>
              <button type="button" className={pm ? 'active' : ''}
                onClick={e => { e.stopPropagation(); choosePm(true) }}>PM</button>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimePicker
