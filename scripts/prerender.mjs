// SPDX-License-Identifier: MIT
//
// Every page of the portal as a file of its own, in both languages, after
// `vite build` and the server build of src/entry-server.tsx: GitHub Pages
// answers /sdk with sdk.html and /ru/sdk with ru/sdk.html, with 200 and the
// page's own text, title, description and preview. Writes 404.html, the
// sitemap and robots.txt beside them.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SITE = 'https://perinkpheral.dev'
const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(HERE, 'dist')
const SSR = resolve(HERE, 'dist-ssr')

const { render, DESCRIPTIONS, pageTitle } = await import(pathToFileURL(resolve(SSR, 'entry-server.js')).href)
const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')

const PATHS = Object.keys(DESCRIPTIONS)
const LANGS = ['en', 'ru']
const LOCALE = { en: 'en_US', ru: 'ru_RU' }

const address = (path, lang) => (lang === 'en' ? path : path === '/' ? '/ru/' : `/ru${path}`)
const file = (path, lang) => {
  const local = address(path, lang)
  return local.endsWith('/') ? `${local}index.html` : `${local}.html`
}
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function page({ url, lang, title, description, head, any = false }) {
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(description)}" />`)
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"${any ? ' data-page="any"' : ''}>${render(url)}</div>`)
}

function write(name, html) {
  for (const [asset] of html.matchAll(/(?:screens|renders)\/[^"'\s,<>]+\.(?:png|webp)/g)) {
    if (!existsSync(resolve(DIST, asset))) {
      throw new Error(`${name}: missing ${asset}; run npm run images before building`)
    }
  }
  const target = resolve(DIST, `.${name}`)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
}

for (const path of PATHS) {
  for (const lang of LANGS) {
    const url = address(path, lang)
    const title = pageTitle(path, lang)
    const description = DESCRIPTIONS[path][lang]
    const other = LANGS.find((one) => one !== lang)
    const head = [
      `<link rel="canonical" href="${SITE}${url}" />`,
      ...LANGS.map((one) => `<link rel="alternate" hreflang="${one}" href="${SITE}${address(path, one)}" />`),
      `<link rel="alternate" hreflang="x-default" href="${SITE}${address(path, 'en')}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="perINKpheral" />`,
      `<meta property="og:title" content="${escape(title)}" />`,
      `<meta property="og:description" content="${escape(description)}" />`,
      `<meta property="og:url" content="${SITE}${url}" />`,
      `<meta property="og:image" content="${SITE}/og.jpg" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="perINKpheral" />`,
      `<meta property="og:locale" content="${LOCALE[lang]}" />`,
      `<meta property="og:locale:alternate" content="${LOCALE[other]}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ]
      .map((line) => `    ${line}`)
      .join('\n')
    write(file(path, lang), page({ url, lang, title, description, head }))
  }
}

// Any other address: the page that says so, not to be indexed.
write(
  '/404.html',
  page({
    url: '/404',
    lang: 'en',
    title: pageTitle('/404', 'en'),
    description: DESCRIPTIONS['/'].en,
    head: '    <meta name="robots" content="noindex" />',
    any: true,
  }),
)

const urls = PATHS.flatMap((path) =>
  LANGS.map(
    (lang) =>
      `  <url>\n    <loc>${SITE}${address(path, lang)}</loc>\n` +
      LANGS.map((one) => `    <xhtml:link rel="alternate" hreflang="${one}" href="${SITE}${address(path, one)}" />\n`).join('') +
      '  </url>',
  ),
)
write(
  '/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
)
write('/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

rmSync(SSR, { recursive: true, force: true })
console.log(`prerendered ${PATHS.length * LANGS.length} pages, 404.html, sitemap.xml, robots.txt`)
