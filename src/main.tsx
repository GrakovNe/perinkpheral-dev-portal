import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { LangProvider } from './i18n.tsx'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </LangProvider>
  </StrictMode>,
)
