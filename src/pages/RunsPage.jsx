import usePageState from '../hooks/usePageState'
import ClearButton from '../components/ClearButton'
import { FaCheckCircle, FaCoffee, FaTimesCircle, FaUtensils } from 'react-icons/fa'
import TimePicker from '../components/TimePicker'
import IconCheckbox from '../components/IconCheckbox'
import { currentHHMM } from '../utils/clock'
import { useI18n } from '../lang'
import { CATEGORIES, BREAK_MINUTES, LUNCH_MINUTES, shiftMinutes } from '../utils/productivityMath'
import { formatTime, toMinutes } from '../utils/unloadMath'
import { RUN_GOALS, minutesPerRun } from '../utils/runsMath'

// Minutes-per-run pages (Mini Hummers, Z Racks): average minutes per run from start time,
// end time and runs done, checked against each goal's minutes per run (lower is better).
// `pageId` picks the title/icon (CATEGORIES), goal cards (RUN_GOALS) and saved inputs.
function RunsPage({ pageId }) {
  const category = CATEGORIES.find(c => c.id === pageId)
  const goals = RUN_GOALS[pageId]
  // Header goal, from the cards below: "9" for one goal, "8–10" for a range (Mini Hummers).
  const goalMinutes = goals.map(g => g.minutesPerRun)
  const goalLow = Math.min(...goalMinutes)
  const goalHigh = Math.max(...goalMinutes)
  const goalText = goalLow === goalHigh ? `${goalLow}` : `${goalLow}–${goalHigh}`
  const [nowH, nowM] = currentHHMM()
  // Kept while switching pages; a refresh, closing the app, or Clear starts fresh.
  const [startHour, setStartHour] = usePageState(`${pageId}.startHour`, nowH)
  const [startMinute, setStartMinute] = usePageState(`${pageId}.startMinute`, nowM)
  const [endHour, setEndHour] = usePageState(`${pageId}.endHour`, nowH)
  const [endMinute, setEndMinute] = usePageState(`${pageId}.endMinute`, nowM)
  const [runs, setRuns] = usePageState(`${pageId}.runs`, '')
  const [breakTaken, setBreakTaken] = usePageState(`${pageId}.break`, false)
  const [lunchTaken, setLunchTaken] = usePageState(`${pageId}.lunch`, false)
  const { t } = useI18n()

  const clear = () => {
    const [h, m] = currentHHMM()
    setStartHour(h); setStartMinute(m)
    setEndHour(h); setEndMinute(m)
    setRuns('')
    setBreakTaken(false); setLunchTaken(false)
  }

  const minutes = shiftMinutes(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`, { breakTaken, lunchTaken })
  const avg = minutesPerRun(minutes, Number(runs))
  const round2 = n => (Math.round(n * 100) / 100).toFixed(2)
  // Compared at the displayed precision, so a shown 8.00 against an 8-minute goal passes.
  const passes = goal => Number(round2(avg)) <= goal

  return (
    <>
      <div className='header-box'>
        <div className='header-box__contents--icon'>
          <category.Icon className="hero-icon" aria-hidden />
        </div>
        <div className='header-box__contents--titles'>
          <h1>{t(`cat.${pageId}`)}</h1>
          <p className="rate">{t('runs.subtitle', { n: goalText })}</p>
        </div>
      </div>

      <div className="pickers">
        <TimePicker title={t('startTime')} hour={startHour} minute={startMinute} setHour={setStartHour} setMinute={setStartMinute} />
        <TimePicker title={t('endTime')} hour={endHour} minute={endMinute} setHour={setEndHour} setMinute={setEndMinute} />
      </div>

      <div className="pod-form">
        <label className="field">
          <h2>{t('runs.runs')}</h2>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={runs}
            onChange={e => setRuns(e.target.value)}
          />
        </label>
      </div>

      <div className="checks">
        <IconCheckbox checked={breakTaken} onChange={setBreakTaken} Icon={FaCoffee} label={t('breakLabel', { min: BREAK_MINUTES })} />
        <IconCheckbox checked={lunchTaken} onChange={setLunchTaken} Icon={FaUtensils} label={t('lunchLabel', { min: LUNCH_MINUTES })} />
      </div>

      <div className="result">
        <p className="result-label">{t('runs.actual')}</p>
        <h2 className="result-big">{avg === null ? '—' : round2(avg)}</h2>
        <p>{t('freight.totalTime', { hours: round2(minutes / 60) })}</p>
        <p className="result-span">{t('freight.span', {
          start: formatTime(toMinutes(`${startHour}:${startMinute}`)),
          end: formatTime(toMinutes(`${endHour}:${endMinute}`)),
        })}</p>
      </div>

      <ClearButton onClear={clear} />

      <ul className="expectations">
        <h2>{t('freight.expectation')}</h2>
        {goals.map(({ id, minutesPerRun: goal, Icons, theme }) => (
          <li key={id} data-page={theme} className="expect-stacked">
            <span className="expect-icons" aria-hidden>
              {Icons.map((Icon, i) => <Icon key={i} className="expect-icon" />)}
            </span>
            <span className="expect-text">
              <span className="expect-title">{t(`goal.${id}`)}</span>
              <span className="expect-rate">{t('runs.goalRate', { n: goal })}</span>
            </span>
            {/* Runs expected in the same time at this goal */}
            <span className="expect-count">{round2(minutes / goal)} <small>{t('runs.runsLower')}</small></span>
            {/* Slot is always there, so the card doesn't shift when a mark appears */}
            <span className="expect-grade-slot">
              {avg !== null && (passes(goal)
                ? <FaCheckCircle className="expect-grade pass" role="img" aria-label={t('runs.pass')} />
                : <FaTimesCircle className="expect-grade fail" role="img" aria-label={t('runs.fail')} />)}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default RunsPage
