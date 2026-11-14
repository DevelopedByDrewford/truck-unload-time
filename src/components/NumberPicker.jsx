import { useRef, useState } from 'react'
import Wheel from './Wheel'
import { useI18n } from '../lang'

// A number wheel (e.g. box count) you can scroll, or tap to type on the number keypad.
// Works like TimePicker: the hidden input stays in the DOM so iPhone opens the keypad on tap.
function NumberPicker({ title, items, value, onChange }) {
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [digits, setDigits] = useState('')
  // Latest typed digits, read on blur (which can fire before React re-renders).
  const live = useRef('')

  const min = items[0]
  const max = items[items.length - 1]
  const maxDigits = String(max).length
  const parse = d => (d && items.includes(Number(d)) ? Number(d) : null)
  const invalid = digits !== '' && parse(digits) === null && (digits.length >= maxDigits || Number(digits) > max)

  // Must run inside the tap itself, or iPhone won't open the keyboard.
  const startTyping = () => inputRef.current?.focus()

  const onFocus = () => {
    live.current = ''
    setDigits('')
    setEditing(true)
  }

  const onBlur = () => {
    const parsed = parse(live.current)
    if (parsed !== null) onChange(parsed)
    setEditing(false)
  }

  const onInput = e => {
    const next = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, maxDigits)
    live.current = next
    setDigits(next)
    // Every digit used and it's in range: apply it and put the keypad away.
    if (next.length === maxDigits && parse(next) !== null) inputRef.current.blur()
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') inputRef.current.blur()
    if (e.key === 'Escape') {
      live.current = '' // cancel: keep the old value
      inputRef.current.blur()
    }
  }

  return (
    <div className="picker-group">
      <h2>{title}</h2>

      <div className={`picker-row${editing ? ' editing' : ''}`} onClick={startTyping}>
        <Wheel items={items} value={value} onChange={onChange} />

        <input
          ref={inputRef}
          className="time-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          enterKeyHint="done"
          aria-label={t('typeValue', { title, min, max })}
          value={digits}
          onChange={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />

        {editing && (
          <div className={`time-entry number-entry${invalid ? ' invalid' : ''}`} aria-hidden>
            <span className="time-entry-value">{digits || '–'}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default NumberPicker
