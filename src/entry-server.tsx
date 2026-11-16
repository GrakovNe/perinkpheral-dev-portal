import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.tsx'
import { LangProvider } from './i18n.tsx'

// A page of the portal as HTML, for the files of the build: what a search
// engine and a link's preview read, and what the browser takes over.
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <LangProvider>
          <App />
        </LangProvider>
      </StaticRouter>
    </StrictMode>,
  )
}

export { DESCRIPTIONS, PAGES, pageTitle } from './content/pages.ts'
