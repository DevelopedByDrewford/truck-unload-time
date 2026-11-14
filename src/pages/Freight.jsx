import usePersistentState from '../hooks/usePersistentState'
import { FaCheckCircle, FaCoffee, FaTimesCircle, FaUtensils } from 'react-icons/fa'
import TimePicker from '../components/TimePicker'
import IconCheckbox from '../components/IconCheckbox'
import { currentHHMM } from '../utils/clock'
import { useI18n } from '../lang'
import { CATEGORIES, BREAK_MINUTES, LUNCH_MINUTES, shiftMinutes } from '../utils/productivityMath'

const freight = CATEGORIES.find(c => c.id === 'freight')
// Expected box counts shown for the same amount of time, at each category's goal rate.
const EXPECTATIONS = ['apparel', 'shoes'].map(id => CATEGORIES.find(c => c.id === id))

// Freight: work out cartons per hour from start time, end time and boxes done.
function Freight() {
  const [nowH, nowM] = currentHHMM()
  // Saved, so the inputs are still here when you come back to Freight.
  const [startHour, setStartHour] = usePersistentState('freight.startHour', nowH)
  const [startMinute, setStartMinute] = usePersistentState('freight.startMinute', nowM)
  const [endHour, setEndHour] = usePersistentState('freight.endHour', nowH)
  const [endMinute, setEndMinute] = usePersistentState('freight.endMinute', nowM)
  const [boxes, setBoxes] = usePersistentState('freight.boxes', '')
  const [breakTaken, setBreakTaken] = usePersistentState('freight.break', false)
  const [lunchTaken, setLunchTaken] = usePersistentState('freight.lunch', false)
  const { t } = useI18n()

  const minutes = shiftMinutes(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`, { breakTaken, lunchTaken })
  const hours = minutes / 60
  const cph = hours > 0 ? Number(boxes) / hours : null
  const round2 = n => (Math.round(n * 100) / 100).toFixed(2)
  // Pass/fail only once there's a real result to judge (time worked and boxes entered).
  // Compared at the displayed precision, so a shown 2.00 against a 2 cph goal passes.
  const graded = cph !== null && Number(boxes) > 0
  const passes = rate => Number(round2(cph)) >= rate

  return (
    <>
      <div className='header-box'>
        <div className='header-box__contents--icon'>
          <freight.Icon className="hero-icon" aria-hidden />
        </div>
        <div className='header-box__contents--titles'>
          <h1>{t('cat.freight')}</h1>
          <p className="rate">{t('freight.subtitle')}</p>
        </div>
      </div>

      <div className="pickers">
        <TimePicker title={t('startTime')} hour={startHour} minute={startMinute} setHour={setStartHour} setMinute={setStartMinute} />
        <TimePicker title={t('endTime')} hour={endHour} minute={endMinute} setHour={setEndHour} setMinute={setEndMinute} />
      </div>

      <div className="pod-form">
        <label className="field">
          <h2>{t('boxes')}</h2>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={boxes}
            onChange={e => setBoxes(e.target.value)}
          />
        </label>
      </div>

      <div className="checks">
        <IconCheckbox checked={breakTaken} onChange={setBreakTaken} Icon={FaCoffee} label={t('breakLabel', { min: BREAK_MINUTES })} />
        <IconCheckbox checked={lunchTaken} onChange={setLunchTaken} Icon={FaUtensils} label={t('lunchLabel', { min: LUNCH_MINUTES })} />
      </div>

      <div className="result">
        <p className="result-label">{t('freight.actual')}</p>
        <h2 className="result-big">{cph === null ? '—' : round2(cph)}</h2>
        <p>{t('freight.totalTime', { hours: round2(hours) })}</p>
      </div>

      <ul className="expectations">
        <h2>{t('freight.expectation')}</h2>
        {EXPECTATIONS.map(({ id, cph: rate, Icon }) => (
          <li key={id} data-page={id}>
            <Icon className="expect-icon" aria-hidden />
            <span className="expect-text">
              <span className="expect-title">{t(`cat.${id}`)}</span>
              <span className="expect-rate">{rate} cph</span>
            </span>
            <span className="expect-count">{round2(hours * rate)} <small>{t('boxesLower')}</small></span>
            {/* Slot is always there, so the card doesn't shift when a mark appears */}
            <span className="expect-grade-slot">
              {graded && (passes(rate)
                ? <FaCheckCircle className="expect-grade pass" role="img" aria-label={t('freight.pass')} />
                : <FaTimesCircle className="expect-grade fail" role="img" aria-label={t('freight.fail')} />)}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Freight
