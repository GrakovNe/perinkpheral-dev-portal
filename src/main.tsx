import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { LangProvider } from './i18n.tsx'
import './styles/global.scss'

const page = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider>
        <App />
      </LangProvider>
    </BrowserRouter>
  </StrictMode>
)

// The files are named sdk.html and index.html, and a host answers those
// names too: the address becomes the page's own, /sdk and /, before the
// router reads it.
const named = window.location.pathname.match(/^(.*?)(?:\/index)?\.html$/)
if (named) {
  const path = named[1] === '' || named[1] === '/ru' ? `${named[1]}/` : named[1]
  window.history.replaceState(null, '', path + window.location.search + window.location.hash)
}

// A page rendered at build time is taken over as it is; the development
// server's empty one is drawn, and so is 404.html, which stands for any
// address in either language and is drawn for the one asked.
const root = document.getElementById('root')!
if (root.hasChildNodes() && root.dataset.page !== 'any') {
  hydrateRoot(root, page)
} else {
  root.replaceChildren()
  createRoot(root).render(page)
}
