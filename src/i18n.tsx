import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Two languages. Text is written where it is used, English first and
// Russian beside it; names of things - functions, commands, parts - stay as
// they are in both.

export type Lang = 'en' | 'ru'

const STORED = 'perinkpheral-lang'

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORED)
    if (stored === 'en' || stored === 'ru') {
      return stored
    }
  } catch {
    // no storage: the browser's language decides
  }
  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORED, next)
    } catch {
      // the choice lasts for this visit only
    }
  }
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

// Technical pages - the SDK, the hardware, the firmware - are English in
// both languages: they are read with the code, the datasheets and the tools.
export function EnglishOnly({ children }: { children: ReactNode }) {
  const { setLang } = useContext(LangContext)
  return <LangContext.Provider value={{ lang: 'en', setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

// t('Overview', 'Обзор'): the text in the current language.
export function useT() {
  const { lang } = useLang()
  return <T,>(en: T, ru: T): T => (lang === 'ru' ? ru : en)
}
