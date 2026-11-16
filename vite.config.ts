import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// PORTAL_BASE is the path the portal is served under: "/" on a domain of its
// own - perinkpheral.dev, public/CNAME - and "/perinkpheral-dev-portal/" on
// GitHub Pages of the repository without it.
export default defineConfig({
  base: process.env.PORTAL_BASE ?? '/',
  plugins: [react()],
})
