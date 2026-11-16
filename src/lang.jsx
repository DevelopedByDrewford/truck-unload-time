/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

// UI text in English, Spanish and Urdu. "CPH" and "Pod" are intentionally left untranslated.
// Use {name} placeholders for values filled in by t(key, { name: value }).
const STRINGS = {
  en: {
    appName: 'Truck Tools',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainMenu: 'Main menu',
    menu: 'Menu',
    language: 'Language',
    clear: 'Clear',
    typeTime: 'Type {title}',
    typeValue: 'Type {title} ({min}–{max})',

    'nav.truck': 'Truck Calculator',
    'nav.productivity': 'Productivity',
    'nav.pod': 'Pod Calculator',

    'cat.apparel': 'Apparel',
    'cat.shoes': 'Shoes',
    'cat.freight': 'Freight',
    'cat.hummers': 'Mini Hummers',
    'cat.zracks': 'Z Racks',
    'cat.bluebins': 'Blue Bins',
    'runs.subtitle': '{n} minutes per run',
    'runs.runs': 'Runs',
    'runs.runsLower': 'runs',
    'runs.actual': 'Avg minutes per run',
    'runs.goalRate': '{n} min/run',
    'runs.pass': 'Meets goal',
    'runs.fail': 'Misses goal',
    'goal.shoesHandbags': 'Shoes / Handbags',
    'goal.homeBedBath': 'Home / Bed & Bath',
    'goal.zracks': 'Z Racks',
    'goal.bluebins': 'Blue Bins',

    'unit.boxes': 'Boxes',
    'unit.items': 'Items',
    'unit.pairs': 'Pairs',

    startTime: 'Start Time',
    endTime: 'End Time',
    boxes: 'Boxes',
    boxesLower: 'boxes',
    breakLabel: 'Break (−{min} min)',
    lunchLabel: 'Lunch (−{min} min)',

    'unload.title': 'Unload Finish Time',
    'unload.doneBy': 'Done by {time}',
    'unload.pick': 'Pick a start time and box count',
    'unload.minutes': '{n} min',

    'freight.subtitle': 'cartons per hour',
    'freight.actual': 'Actual CPH',
    'freight.expectation': 'Minimum Expectations',
    'freight.totalTime': 'Total time: {hours} hours',
    'freight.span': 'Start {start} · Finish {end}',
    'freight.pass': 'Meets CPH',
    'freight.fail': 'Below CPH',

    'pod.title': '{name} Pod',
    'pod.countBy': 'Count by',
    'pod.people': 'People',
    'pod.fewer': 'Fewer people',
    'pod.more': 'More people',
    'pod.lowerCph': 'Lower CPH',
    'pod.raiseCph': 'Raise CPH',
    'pod.personBreak': 'Person {n} break (−{min} min)',
    'pod.hours': '{hours} hours',
    'pod.pod': 'pod',
    'pod.pods': 'pods',
  },
  es: {
    appName: 'Herramientas del Tráiler',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainMenu: 'Menú principal',
    menu: 'Menú',
    language: 'Idioma',
    clear: 'Borrar',
    typeTime: 'Escribir {title}',
    typeValue: 'Escribir {title} ({min}–{max})',

    'nav.truck': 'Calculadora de Camión',
    'nav.productivity': 'Productividad',
    'nav.pod': 'Calculadora de Pod',

    'cat.apparel': 'Ropa',
    'cat.shoes': 'Zapatos',
    'cat.freight': 'Carga',
    'cat.hummers': 'Mini Hummers',
    'cat.zracks': 'Z Racks',
    'cat.bluebins': 'Blue Bins',
    'runs.subtitle': '{n} minutos por viaje',
    'runs.runs': 'Viajes',
    'runs.runsLower': 'viajes',
    'runs.actual': 'Promedio de minutos por viaje',
    'runs.goalRate': '{n} min/viaje',
    'runs.pass': 'Cumple la meta',
    'runs.fail': 'No cumple la meta',
    'goal.shoesHandbags': 'Zapatos / Bolsos',
    'goal.homeBedBath': 'Hogar / Cama y Baño',
    'goal.zracks': 'Z Racks',
    'goal.bluebins': 'Blue Bins',

    'unit.boxes': 'Cajas',
    'unit.items': 'Artículos',
    'unit.pairs': 'Pares',

    startTime: 'Hora de Inicio',
    endTime: 'Hora de Fin',
    boxes: 'Cajas',
    boxesLower: 'cajas',
    breakLabel: 'Descanso (−{min} min)',
    lunchLabel: 'Almuerzo (−{min} min)',

    'unload.title': 'Hora de Fin de Descarga',
    'unload.doneBy': 'Termina a las {time}',
    'unload.pick': 'Elige la hora de inicio y el número de cajas',

    'freight.subtitle': 'cajas por hora',
    'freight.actual': 'CPH Real',
    'freight.expectation': 'Metas Mínimas',
    'freight.totalTime': 'Tiempo total: {hours} horas',
    'freight.span': 'Inicio {start} · Fin {end}',
    'freight.pass': 'Cumple el CPH',
    'freight.fail': 'Por debajo del CPH',

    'pod.title': 'Pod de {name}',
    'pod.countBy': 'Contar por',
    'pod.people': 'Personas',
    'pod.fewer': 'Menos personas',
    'pod.more': 'Más personas',
    'pod.lowerCph': 'Bajar CPH',
    'pod.raiseCph': 'Subir CPH',
    'pod.personBreak': 'Descanso persona {n} (−{min} min)',
    'pod.hours': '{hours} horas',
    'pod.pod': 'pod',
    'pod.pods': 'pods',
  },
  // Urdu (right-to-left). Please have a native speaker review these.
  ur: {
    appName: 'ٹرک ٹولز',
    openMenu: 'مینو کھولیں',
    closeMenu: 'مینو بند کریں',
    mainMenu: 'مرکزی مینو',
    menu: 'مینو',
    language: 'زبان',
    clear: 'صاف کریں',
    typeTime: '{title} ٹائپ کریں',
    typeValue: '{title} ٹائپ کریں ({min}–{max})',

    'nav.truck': 'ٹرک کیلکولیٹر',
    'nav.productivity': 'پیداواری صلاحیت',
    'nav.pod': 'Pod کیلکولیٹر',

    'cat.apparel': 'ملبوسات',
    'cat.shoes': 'جوتے',
    'cat.freight': 'فریٹ',
    'cat.hummers': 'Mini Hummers',
    'cat.zracks': 'Z Racks',
    'cat.bluebins': 'Blue Bins',
    'runs.subtitle': '{n} منٹ فی چکر',
    'runs.runs': 'چکر',
    'runs.runsLower': 'چکر',
    'runs.actual': 'اوسط منٹ فی چکر',
    'runs.goalRate': '{n} منٹ/چکر',
    'runs.pass': 'ہدف پورا',
    'runs.fail': 'ہدف پورا نہیں',
    'goal.shoesHandbags': 'جوتے / ہینڈ بیگ',
    'goal.homeBedBath': 'گھر / بستر اور غسل',
    'goal.zracks': 'Z Racks',
    'goal.bluebins': 'Blue Bins',

    'unit.boxes': 'ڈبے',
    'unit.items': 'اشیاء',
    'unit.pairs': 'جوڑے',

    startTime: 'شروع کا وقت',
    endTime: 'ختم کا وقت',
    boxes: 'ڈبے',
    boxesLower: 'ڈبے',
    breakLabel: 'وقفہ (−{min} منٹ)',
    lunchLabel: 'لنچ (−{min} منٹ)',

    'unload.title': 'ان لوڈ ختم ہونے کا وقت',
    'unload.doneBy': '{time} تک مکمل',
    'unload.pick': 'شروع کا وقت اور ڈبوں کی تعداد منتخب کریں',
    'unload.minutes': '{n} منٹ',

    'freight.subtitle': 'ڈبے فی گھنٹہ',
    'freight.actual': 'اصل CPH',
    'freight.expectation': 'کم از کم توقعات',
    'freight.totalTime': 'کل وقت: {hours} گھنٹے',
    'freight.span': 'شروع {start} · ختم {end}',
    'freight.pass': 'CPH پورا ہے',
    'freight.fail': 'CPH سے کم',

    'pod.title': '{name} Pod',
    'pod.countBy': 'گنتی بذریعہ',
    'pod.people': 'افراد',
    'pod.fewer': 'کم افراد',
    'pod.more': 'زیادہ افراد',
    'pod.lowerCph': 'CPH کم کریں',
    'pod.raiseCph': 'CPH بڑھائیں',
    'pod.personBreak': 'فرد {n} کا وقفہ (−{min} منٹ)',
    'pod.hours': '{hours} گھنٹے',
    'pod.pod': 'pod',
    'pod.pods': 'pods',
  },
}

// Toggle order and labels. Urdu shows its own name so Urdu readers can find it.
export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'ur', label: 'اردو', dir: 'rtl' },
]
const CODES = LANGUAGES.map(l => l.code)
// Only a language the person picked (tapping EN / ES / اردو) is saved. Until then the app
// follows the phone/browser language settings, including if they change later.
const CHOICE_KEY = 'langChoice'

function savedChoice() {
  try {
    const saved = localStorage.getItem(CHOICE_KEY)
    return CODES.includes(saved) ? saved : null
  } catch {
    return null // storage unavailable
  }
}

// First supported language in the browser's preference list, e.g. ["en-GB", "es-MX"] → "en",
// ["fr-FR", "es-US"] → "es". English if none of them is supported.
export function browserLang(prefs = navigator.languages?.length ? navigator.languages : [navigator.language]) {
  for (const tag of prefs) {
    const code = tag?.toLowerCase().split('-')[0]
    if (CODES.includes(code)) return code
  }
  return 'en'
}

const I18nContext = createContext(null)

export function LanguageProvider({ children }) {
  const [choice, setChoice] = useState(savedChoice)
  const [browser, setBrowser] = useState(() => browserLang())
  const lang = choice ?? browser

  // Follow changes to the device language while the app is open (if nothing was picked).
  useEffect(() => {
    const onChange = () => setBrowser(browserLang())
    window.addEventListener('languagechange', onChange)
    return () => window.removeEventListener('languagechange', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    // Urdu reads right-to-left; the whole layout mirrors (see App.css for the parts that stay LTR).
    document.documentElement.dir = LANGUAGES.find(l => l.code === lang)?.dir ?? 'ltr'
  }, [lang])

  // Picking a language on the toggle saves it, and it then wins over the browser setting.
  const setLang = code => {
    setChoice(code)
    try { localStorage.setItem(CHOICE_KEY, code) } catch { /* storage unavailable */ }
  }

  const rtl = LANGUAGES.find(l => l.code === lang)?.dir === 'rtl'

  const t = (key, vars = {}) => {
    const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key
    return text.replace(/\{(\w+)\}/g, (_, name) => {
      const val = vars[name] ?? ''
      // In right-to-left text, isolate inserted values so "3:20 PM" doesn't render as "PM 3:20".
      return rtl && val !== '' ? `\u2068${val}\u2069` : val
    })
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
