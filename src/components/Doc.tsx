import { useState, type ReactNode } from 'react'
import { useT } from '../i18n'

// The head of a page: its title, and a line under it when there is one.
export function PageHead({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="page-head">
      <div className="wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
      </div>
    </header>
  )
}

export type Chapter = { id: string; title: string }

// A long page: its contents on the left, its sections on the right.
export function DocBody({ chapters, children }: { chapters: Chapter[]; children: ReactNode }) {
  const t = useT()
  return (
    <div className="wrap page-body">
      <nav className="toc" aria-label={t('On this page', 'На этой странице')}>
        <p>{t('On this page', 'На этой странице')}</p>
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`}>{chapter.title}</a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="doc">{children}</div>
    </div>
  )
}

export function Chapter({ chapter, children }: { chapter: Chapter; children: ReactNode }) {
  return (
    <section aria-labelledby={chapter.id}>
      <h2 id={chapter.id}>{chapter.title}</h2>
      {children}
    </section>
  )
}

// A block of code, shell or C, with a button that copies it.
export function Code({ label, children }: { label: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const t = useT()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className="code">
      <div className="label">
        <span>{label}</span>
        <button type="button" className="copy" onClick={copy}>
          {copied ? t('Copied', 'Скопировано') : t('Copy', 'Копировать')}
        </button>
      </div>
      <pre>
        <code>{children.trim()}</code>
      </pre>
    </div>
  )
}

export function Facts({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <dl className="facts">
      {rows.map(([name, value], index) => (
        <div key={index} style={{ display: 'contents' }}>
          <dt>{name}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) => (
                <td key={column}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
