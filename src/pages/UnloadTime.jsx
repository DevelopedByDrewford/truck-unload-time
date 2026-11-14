import { useState, useEffect } from 'react'
import heroImg from '../assets/logo512.png'
import Wheel from '../components/Wheel'
import { formatHour12 } from '../utils/time'
import { calcGoal } from '../utils/unloadMath'
import { useI18n } from '../i18n'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const BOX_COUNTS = Array.from({ length: 300 }, (_, i) => i + 1)

function currentHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function useStoredState(key, initial) {
  const [val, setVal] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved !== null ? JSON.parse(saved) : initial
  })
  useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val])
  return [val, setVal]
}

function UnloadTime() {
  const [defaultHour, defaultMinute] = currentHHMM().split(':')
  const [hour, setHour] = useState(defaultHour)
  const [minute, setMinute] = useState(defaultMinute)
  const [boxes, setBoxes] = useState(180)
  const [rate] = useStoredState('rate', 2.5)
  const { t } = useI18n()

  const start = `${hour}:${minute}`
  const result = calcGoal(start, Number(boxes), rate)

  return (
    <>
      <img src={heroImg} alt="" className="hero" />
      <h1>{t('unload.title')}</h1>

      <div className="pickers">
        <div className="picker-group">
          <h2>{t('startTime')}</h2>
          <div className="picker-row">
            <Wheel items={HOURS} value={hour} onChange={setHour} format={formatHour12} />
            <span className="wheel-sep">:</span>
            <Wheel items={MINUTES} value={minute} onChange={setMinute} />
          </div>
        </div>

        <div className="picker-group">
          <h2>{t('boxes')}</h2>
          <div className="picker-row">
            <Wheel items={BOX_COUNTS} value={boxes} onChange={setBoxes} />
          </div>
        </div>
      </div>

      <div className="result">
        {result ? (
          <>
            <h2>{t('unload.doneBy', { time: result.goal })}</h2>
            <p>{Math.round(result.duration)} min</p>
          </>
        ) : (
          <p>{t('unload.pick')}</p>
        )}
      </div>
    </>
  )
}

export default UnloadTime
