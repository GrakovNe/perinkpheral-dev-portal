import { useEffect, type ReactElement } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Contacts } from './pages/Contacts'
import { Credits } from './pages/Credits'
import { Firmware } from './pages/Firmware'
import { Hardware } from './pages/Hardware'
import { Home } from './pages/Home'
import { Sdk } from './pages/Sdk'
import { Start } from './pages/Start'

import { pageTitle } from './content/pages'
import { plainPath, useLang, useLocal, useT } from './i18n'

// A new page starts at its top, or at the section its address names; the
// title of the tab says which page it is.
function Navigation() {
  const { pathname, hash } = useLocation()
  const { lang } = useLang()
  useEffect(() => {
    const plain = plainPath(pathname)
    document.title = pageTitle(plain, lang)
  }, [pathname, lang])
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

// Every page, by its address with no language in it.
const ROUTES: [string, ReactElement][] = [
  ['', <Home />],
  ['/start', <Start />],
  ['/hardware', <Hardware />],
  ['/firmware', <Firmware />],
  ['/sdk', <Sdk />],
  ['/contacts', <Contacts />],
  ['/credits', <Credits />],
]

function NotFound() {
  const t = useT()
  const local = useLocal()
  return (
    <div className="wrap not-found">
      <h1>{t('Not found', 'Не найдено')}</h1>
      <p>{t('There is no page at this address.', 'По этому адресу ничего нет.')}</p>
      <Link className="button" to={local('/')}>
        {t('Home', 'На главную')}
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Navigation />
      <Routes>
        {['', '/ru'].flatMap((prefix) =>
          ROUTES.map(([path, page]) => <Route key={prefix + path} path={prefix + path || '/'} element={page} />),
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
