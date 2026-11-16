import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { author, repo } from '../content/links'
import { PAGES } from '../content/pages'
import { useLang, useT } from '../i18n'
import { Mark, Wordmark } from './Brand'

// The two flags as pixel pictures, cell for cell like the screen: 20 x 12
// cells, the panel's paper for white, colours a little quieter than the
// standards'.
const FLAG_W = 20
const FLAG_H = 12
const PAPER = '#e9e7e1'
const BLUE = '#2b3f7a'
const RED = '#b0343a'

function Pixels({ colour }: { colour: (x: number, y: number) => string }) {
  const cells = []
  for (let y = 0; y < FLAG_H; y++) {
    for (let x = 0; x < FLAG_W; x++) {
      cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colour(x, y)} />)
    }
  }
  return (
    <svg viewBox={`0 0 ${FLAG_W} ${FLAG_H}`} shapeRendering="crispEdges" aria-hidden="true">
      {cells}
    </svg>
  )
}

// The Union Flag: the cross over the saltires, each a red band edged in
// white; a cell belongs to a diagonal by its distance from it.
const DIAGONAL = Math.hypot(FLAG_W, FLAG_H)

function unionFlag(x: number, y: number) {
  const cx = x + 0.5
  const cy = y + 0.5
  const fromCross = Math.min(Math.abs(cx - FLAG_W / 2), Math.abs(cy - FLAG_H / 2))
  if (fromCross < 1) return RED
  if (fromCross < 2) return PAPER
  const down = Math.abs(cy * FLAG_W - cx * FLAG_H) / DIAGONAL
  const up = Math.abs((FLAG_H - cy) * FLAG_W - cx * FLAG_H) / DIAGONAL
  const fromSaltire = Math.min(down, up)
  if (fromSaltire < 0.6) return RED
  if (fromSaltire < 1.5) return PAPER
  return BLUE
}

function russianFlag(_x: number, y: number) {
  return y < FLAG_H / 3 ? PAPER : y < (2 * FLAG_H) / 3 ? BLUE : RED
}

function FlagUk() {
  return <Pixels colour={unionFlag} />
}

function FlagRu() {
  return <Pixels colour={russianFlag} />
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
