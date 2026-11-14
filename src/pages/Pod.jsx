import { useEffect, useState } from 'react'
import { FaCoffee, FaMinus, FaPlus } from 'react-icons/fa'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import {
  POD_TYPES, DEFAULT_PEOPLE, MAX_PEOPLE, POD_BREAK_MINUTES, podHours,
} from '../utils/podMath'
import { formatDuration } from '../utils/productivityMath'
import { useI18n } from '../i18n'

function BreakCheckbox({ checked, onChange, label }) {
  const Box = checked ? MdCheckBox : MdCheckBoxOutlineBlank
  return (
    <label className={`icon-check${checked ? ' checked' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <Box className="box" aria-hidden />
      <FaCoffee aria-hidden />
      <span>{label}</span>
    </label>
  )
}

const STORAGE_KEY = 'podState'

function blankPodState(pod) {
  return {
    unitId: pod.units[0].id,
    quantities: Object.fromEntries(pod.units.map(u => [u.id, ''])),
    people: DEFAULT_PEOPLE,
    breaks: Array(MAX_PEOPLE).fill(false),
  }
}

// Saved values for every pod page, e.g. { apparel: {...}, shoes: {...} }.
function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

// Each pod page keeps its own unit, per-unit counts, people and breaks,
// saved in localStorage so they survive switching pages, units, or reloading.
function Pod({ podId }) {
  const pod = POD_TYPES.find(p => p.id === podId) ?? POD_TYPES[0]
  const [all, setAll] = useState(loadAll)
  const { t } = useI18n()

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)) } catch { /* storage unavailable */ }
  }, [all])

  const blank = blankPodState(pod)
  const saved = all[pod.id] ?? {}
  const state = { ...blank, ...saved, quantities: { ...blank.quantities, ...saved.quantities } }
  const update = patch => setAll(a => ({ ...a, [pod.id]: { ...state, ...patch } }))

  const { people, breaks } = state
  const unit = pod.units.find(u => u.id === state.unitId) ?? pod.units[0]
  const quantity = state.quantities[unit.id]
  const setQuantity = val => update({ quantities: { ...state.quantities, [unit.id]: val } })
  const setPeople = fn => update({ people: fn(people) })
  const breakCount = breaks.slice(0, people).filter(Boolean).length
  const hours = podHours(Number(quantity), unit.rate, people, breakCount)
  const pods = pod.peoplePerPod ? people / pod.peoplePerPod : null

  const setBreak = (i, val) => update({ breaks: breaks.map((x, j) => (j === i ? val : x)) })

  return (
    <>
      <pod.Icon className="hero-icon" aria-hidden />
      <h1>{t('pod.title', { name: t(`cat.${pod.id}`) })}</h1>
      <p className="rate">{t('pod.rate', { rate: unit.rate, unit: t(`unit.${unit.id}`).toLowerCase() })}</p>

      <div className="pod-form">
        <div className="segmented" role="radiogroup" aria-label={t('pod.countBy')}>
          {pod.units.map(u => (
            <button
              key={u.id}
              role="radio"
              aria-checked={u.id === unit.id}
              className={u.id === unit.id ? 'active' : ''}
              onClick={() => update({ unitId: u.id })}
            >
              {t(`unit.${u.id}`)}
            </button>
          ))}
        </div>

        <label className="field">
          <h2>{t(`unit.${unit.id}`)}</h2>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="0"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>

        <div className="field">
          <h2>{t('pod.people')}</h2>
          <div className="stepper">
            <button className="icon-btn" onClick={() => setPeople(p => Math.max(1, p - 1))}
              disabled={people <= 1} aria-label={t('pod.fewer')}>
              <FaMinus aria-hidden />
            </button>
            <output aria-live="polite">{people}</output>
            <button className="icon-btn" onClick={() => setPeople(p => Math.min(MAX_PEOPLE, p + 1))}
              disabled={people >= MAX_PEOPLE} aria-label={t('pod.more')}>
              <FaPlus aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="checks">
        {Array.from({ length: people }, (_, i) => (
          <BreakCheckbox
            key={i}
            checked={breaks[i]}
            onChange={val => setBreak(i, val)}
            label={t('pod.personBreak', { n: i + 1, min: POD_BREAK_MINUTES })}
          />
        ))}
      </div>

      <div className="result">
        <h2>{t('pod.hours', { hours: (Math.round(hours * 100) / 100).toFixed(2) })}</h2>
        <p>{formatDuration(Math.round(hours * 60))}</p>
        {pods !== null && <p className="pods">{pods} {t(pods === 1 ? 'pod.pod' : 'pod.pods')}</p>}
      </div>
    </>
  )
}

export default Pod
