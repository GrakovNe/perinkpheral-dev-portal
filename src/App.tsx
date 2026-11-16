import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Contacts } from './pages/Contacts'
import { Credits } from './pages/Credits'
import { Firmware } from './pages/Firmware'
import { Hardware } from './pages/Hardware'
import { Home } from './pages/Home'
import { Sdk } from './pages/Sdk'

import { PAGES } from './content/pages'
import { useLang, useT } from './i18n'

// A new page starts at its top, or at the section its address names; the
// title of the tab says which page it is.
function Navigation() {
  const { pathname, hash } = useLocation()
  const { lang } = useLang()
  useEffect(() => {
    const page = PAGES.find((one) => one.to === pathname)
    document.title = pathname === '/' ? 'perINKpheral' : `${page ? page[lang] : lang === 'ru' ? 'Не найдено' : 'Not found'} - perINKpheral`
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

function NotFound() {
  const t = useT()
  return (
    <div className="wrap not-found">
      <h1>{t('Not found', 'Не найдено')}</h1>
      <p>{t('There is no page at this address.', 'По этому адресу ничего нет.')}</p>
      <Link className="button" to="/">
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
        <Route path="/" element={<Home />} />
        <Route path="/sdk" element={<Sdk />} />
        <Route path="/hardware" element={<Hardware />} />
        <Route path="/firmware" element={<Firmware />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
