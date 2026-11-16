import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { author, repo } from '../content/links'
import { PAGES } from '../content/pages'
import { Mark, Wordmark } from './Brand'

function Bar() {
  const [open, setOpen] = useState(false)
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
          Menu
        </button>
        <nav id="menu" className={open ? 'menu open' : 'menu'} aria-label="Sections">
          {PAGES.map((page) => (
            <NavLink key={page.to} to={page.to} onClick={() => setOpen(false)}>
              {page.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Foot() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="columns">
          <div>
            <Link to="/" className="brand" aria-label="perINKpheral, home">
              <Mark />
              <Wordmark />
            </Link>
            <p>An open desk e-paper display. Hardware, firmware and SDK under the MIT License.</p>
          </div>
          <div>
            <h4>Portal</h4>
            <ul>
              {PAGES.map((page) => (
                <li key={page.to}>
                  <Link to={page.to}>{page.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Repositories</h4>
            <ul>
              <li>
                <a href={repo.firmware}>Firmware and SDK</a>
              </li>
              <li>
                <a href={repo.apps}>Applications</a>
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
            <h4>Author</h4>
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
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Bar />
      <main id="content">{children}</main>
      <Foot />
    </>
  )
}
