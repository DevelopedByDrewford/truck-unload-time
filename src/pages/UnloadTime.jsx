import { useState, useEffect } from 'react'
import heroImg from '../assets/logo512.png'
import NumberPicker from '../components/NumberPicker'
import TimePicker from '../components/TimePicker'
import { calcGoal } from '../utils/unloadMath'
import { useI18n } from '../i18n'

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
        <TimePicker title={t('startTime')} hour={hour} minute={minute} setHour={setHour} setMinute={setMinute} />

        <NumberPicker title={t('boxes')} items={BOX_COUNTS} value={boxes} onChange={setBoxes} />
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
