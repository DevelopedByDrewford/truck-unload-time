import usePageState from '../hooks/usePageState'
import ClearButton from '../components/ClearButton'
import heroImg from '../assets/logo512.png'
import NumberPicker from '../components/NumberPicker'
import TimePicker from '../components/TimePicker'
import { calcGoal } from '../utils/unloadMath'
import { useI18n } from '../lang'

// 0 means "not entered yet": the result then asks for a box count.
const BOX_COUNTS = Array.from({ length: 301 }, (_, i) => i)
const UNLOAD_RATE = 2.5 // boxes per minute

function currentHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function UnloadTime() {
  const [defaultHour, defaultMinute] = currentHHMM().split(':')
  // Kept while switching pages; a refresh, closing the app, or Clear starts fresh.
  const [hour, setHour] = usePageState('unload.hour', defaultHour)
  const [minute, setMinute] = usePageState('unload.minute', defaultMinute)
  const [boxes, setBoxes] = usePageState('unload.boxes', 180) // 180 on a fresh load; Clear sets 0

  const clear = () => {
    const [h, m] = currentHHMM().split(':')
    setHour(h); setMinute(m)
    setBoxes(0)
  }
  const { t } = useI18n()

  const start = `${hour}:${minute}`
  const result = calcGoal(start, Number(boxes), UNLOAD_RATE)

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
            <p>{t('unload.minutes', { n: Math.round(result.duration) })}</p>
          </>
        ) : (
          <p>{t('unload.pick')}</p>
        )}
      </div>

      <ClearButton onClear={clear} />
    </>
  )
}

export default UnloadTime
