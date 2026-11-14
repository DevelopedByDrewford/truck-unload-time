/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

// UI text in English and Spanish. "CPH" and "Pod" are intentionally left untranslated.
// Use {name} placeholders for values filled in by t(key, { name: value }).
const STRINGS = {
  en: {
    appName: 'Truck Tools',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainMenu: 'Main menu',
    menu: 'Menu',
    language: 'Language',

    'nav.truck': 'Truck Calculator',
    'nav.productivity': 'Productivity',
    'nav.pod': 'Pod Calculator',

    'cat.apparel': 'Apparel',
    'cat.shoes': 'Shoes',
    'cat.freight': 'Freight',

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

    'freight.subtitle': 'cartons per hour',
    'freight.actual': 'Actual CPH',
    'freight.totalTime': 'Total time: {hours} hours',

    'pod.title': '{name} Pod',
    'pod.rate': '{rate} {unit} per person per hour',
    'pod.countBy': 'Count by',
    'pod.people': 'People',
    'pod.fewer': 'Fewer people',
    'pod.more': 'More people',
    'pod.personBreak': 'Person {n} break (−{min} min)',
    'pod.hours': '{hours} hours',
    'pod.pod': 'pod',
    'pod.pods': 'pods',
  },
  es: {
    appName: 'Herramientas de Camión',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainMenu: 'Menú principal',
    menu: 'Menú',
    language: 'Idioma',

    'nav.truck': 'Calculadora de Camión',
    'nav.productivity': 'Productividad',
    'nav.pod': 'Calculadora de Pod',

    'cat.apparel': 'Ropa',
    'cat.shoes': 'Zapatos',
    'cat.freight': 'Carga',

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
    'freight.totalTime': 'Tiempo total: {hours} horas',

    'pod.title': 'Pod de {name}',
    'pod.rate': '{rate} {unit} por persona por hora',
    'pod.countBy': 'Contar por',
    'pod.people': 'Personas',
    'pod.fewer': 'Menos personas',
    'pod.more': 'Más personas',
    'pod.personBreak': 'Descanso persona {n} (−{min} min)',
    'pod.hours': '{hours} horas',
    'pod.pod': 'pod',
    'pod.pods': 'pods',
  },
}

export const LANGUAGES = ['en', 'es']
const STORAGE_KEY = 'lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGUAGES.includes(saved)) return saved
  } catch { /* storage unavailable */ }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

const I18nContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* storage unavailable */ }
  }, [lang])

  const t = (key, vars = {}) => {
    const text = STRINGS[lang][key] ?? STRINGS.en[key] ?? key
    return text.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '')
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
