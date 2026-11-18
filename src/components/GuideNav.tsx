// SPDX-License-Identifier: MIT
import { Link } from 'react-router-dom'
import { useLocal, useT } from '../i18n'

type StepLink = { to: string; label: string }

export function GuideNav({ previous, next, id }: { previous?: StepLink; next?: StepLink; id?: string }) {
  const local = useLocal()
  const t = useT()
  return (
    <nav className="guide-nav" id={id} aria-label={t('Continue the guide', 'Продолжить руководство')}>
      {previous && (
        <Link className="button quiet" to={local(previous.to)}>
          <span className="arrow" aria-hidden="true">&lt;-</span> {previous.label}
        </Link>
      )}
      {next && (
        <Link className="button guide-next" to={local(next.to)}>
          {next.label} <span className="arrow" aria-hidden="true">-&gt;</span>
        </Link>
      )}
    </nav>
  )
}
