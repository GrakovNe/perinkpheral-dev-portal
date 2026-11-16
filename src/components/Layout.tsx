import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { author, repo } from '../content/links'
import { PAGES } from '../content/pages'
import { useLang, useT } from '../i18n'
import { Mark, Wordmark } from './Brand'

// The two flags, drawn small: the Union Flag and the Russian tricolour.
function FlagUk() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="uk-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

function FlagRu() {
  return (
    <svg viewBox="0 0 9 6" aria-hidden="true">
      <rect width="9" height="2" fill="#fff" />
      <rect y="2" width="9" height="2" fill="#0039A6" />
      <rect y="4" width="9" height="2" fill="#D52B1E" />
    </svg>
  )
}

function Languages() {
  const { lang, setLang } = useLang()
  return (
    <div className="langs" role="group" aria-label="Language">
      <button type="button" className={lang === 'en' ? 'current' : undefined} onClick={() => setLang('en')}
        aria-pressed={lang === 'en'} title="English">
        <FlagUk />
      </button>
      <button type="button" className={lang === 'ru' ? 'current' : undefined} onClick={() => setLang('ru')}
        aria-pressed={lang === 'ru'} title="Русский">
        <FlagRu />
      </button>
    </div>
  )
}

function Bar() {
  const [open, setOpen] = useState(false)
  const t = useT()
  return (
    <header className="bar">
      <div className="wrap">
        <Link to="/" className="brand" aria-label="perINKpheral, home" onClick={() => setOpen(false)}>
          <Mark />
          <Wordmark />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(!open)}
        >
          {t('Menu', 'Меню')}
        </button>
        <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Sections">
          {PAGES.map((page) => (
            <NavLink key={page.to} to={page.to} onClick={() => setOpen(false)}>
              {t(page.en, page.ru)}
            </NavLink>
          ))}
        </nav>
        <Languages />
      </div>
    </header>
  )
}

function Foot() {
  const t = useT()
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="columns">
          <div>
            <Link to="/" className="brand" aria-label="perINKpheral, home">
              <Mark />
              <Wordmark />
            </Link>
            <p>{t('An open desk e-paper display. Hardware, firmware and SDK under the MIT License.', 'Открытый настольный E-Ink дисплей. Hardware, firmware и SDK под лицензией MIT.')}</p>
          </div>
          <div>
            <h4>{t('Portal', 'Портал')}</h4>
            <ul>
              {PAGES.map((page) => (
                <li key={page.to}>
                  <Link to={page.to}>{t(page.en, page.ru)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t('Repositories', 'Репозитории')}</h4>
            <ul>
              <li>
                <a href={repo.firmware}>Firmware and SDK</a>
              </li>
              <li>
                <a href={repo.apps}>{t('Applications', 'Приложения')}</a>
              </li>
              <li>
                <a href={repo.clion}>CLion plugin</a>
              </li>
              <li>
                <a href={repo.homeAssistant}>Home Assistant</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>{t('Author', 'Автор')}</h4>
            <ul>
              <li>{author.name}</li>
              <li>
                <a href={`mailto:${author.email}`}>{author.email}</a>
              </li>
              <li>
                <a href={`https://t.me/${author.telegram}`}>@{author.telegram}</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="small">(c) 2026 {author.name}. MIT License.</p>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const t = useT()
  return (
    <>
      <a className="skip" href="#content">
        {t('Skip to content', 'К содержимому')}
      </a>
      <Bar />
      <main id="content">{children}</main>
      <Foot />
    </>
  )
}
