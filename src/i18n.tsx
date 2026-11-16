import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Two languages. Text is written where it is used, English first and
// Russian beside it; names of things - functions, commands, parts - stay as
// they are in both.
//
// The language is the address's: English at /sdk, Russian at /ru/sdk, so a
// page can be linked to in either and a search engine sees both. A first
// visit at an English address goes on to the Russian one when the browser
// asks for Russian; a language picked with the flags is remembered.

export type Lang = 'en' | 'ru'

const STORED = 'perinkpheral-lang'

// The language an address is in, and the address with no language in it.
export function langOf(pathname: string): Lang {
  return pathname === '/ru' || pathname.startsWith('/ru/') ? 'ru' : 'en'
}

export function plainPath(pathname: string): string {
  return langOf(pathname) === 'ru' ? pathname.slice(3) || '/' : pathname
}

// An address of the portal in a language: /sdk, /ru/sdk; the home pages are
// / and /ru/. A section after # stays.
export function localize(to: string, lang: Lang): string {
  if (lang === 'en') {
    return to
  }
  return to === '/' ? '/ru/' : `/ru${to}`
}

function stored(): Lang | null {
  try {
    const value = localStorage.getItem(STORED)
    return value === 'en' || value === 'ru' ? value : null
  } catch {
    return null
  }
}

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const lang = langOf(pathname)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // once, on arrival: an English address for a reader of Russian
  useEffect(() => {
    const wanted = stored() ?? (navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en')
    if (lang === 'en' && wanted === 'ru') {
      navigate(localize(plainPath(pathname), 'ru') + hash, { replace: true })
    }
    // only the address the reader came by
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLang = (next: Lang) => {
    try {
      localStorage.setItem(STORED, next)
    } catch {
      // the choice lasts for this visit only
    }
    if (next !== lang) {
      navigate(localize(plainPath(pathname), next) + hash)
    }
  }
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

// What is technical stays English in both languages - the diagrams, the
// code blocks; around them only the headings follow the language.
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

// An address of the portal in the language being read.
export function useLocal() {
  const { lang } = useLang()
  return (to: string) => localize(to, lang)
}
