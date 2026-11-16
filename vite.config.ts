import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// A static host answers an address it has no file for with 404.html: it is the
// page itself, so that a link to /sdk opens the portal at that page.
function notFoundIsTheApp(): Plugin {
  return {
    name: 'not-found-is-the-app',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist')
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'))
    },
  }
}

// PORTAL_BASE is the path the portal is served under: "/" on a domain of its
// own - perinkpheral.dev, public/CNAME - and "/perinkpheral-dev-portal/" on
// GitHub Pages of the repository without it.
export default defineConfig({
  base: process.env.PORTAL_BASE ?? '/',
  plugins: [react(), notFoundIsTheApp()],
})
