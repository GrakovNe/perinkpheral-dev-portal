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

// A page rendered at build time is taken over as it is; the development
// server's empty one is drawn.
const root = document.getElementById('root')!
if (root.hasChildNodes()) {
  hydrateRoot(root, page)
} else {
  createRoot(root).render(page)
}
