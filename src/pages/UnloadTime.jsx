import usePersistentState from '../hooks/usePersistentState'
import heroImg from '../assets/logo512.png'
import NumberPicker from '../components/NumberPicker'
import TimePicker from '../components/TimePicker'
import { calcGoal } from '../utils/unloadMath'
import { useI18n } from '../lang'

const BOX_COUNTS = Array.from({ length: 300 }, (_, i) => i + 1)

function currentHHMM() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function UnloadTime() {
  const [defaultHour, defaultMinute] = currentHHMM().split(':')
  // Saved, so the inputs are still here when you come back to this page.
  const [hour, setHour] = usePersistentState('unload.hour', defaultHour)
  const [minute, setMinute] = usePersistentState('unload.minute', defaultMinute)
  const [boxes, setBoxes] = usePersistentState('unload.boxes', 180)
  const [rate] = usePersistentState('rate', 2.5)
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
            <p>{t('unload.minutes', { n: Math.round(result.duration) })}</p>
          </>
        ) : (
          <p>{t('unload.pick')}</p>
        )}
      </div>
    </>
  )
}

export default UnloadTime
