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

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(HERE, 'dist')
const SSR = resolve(HERE, 'dist-ssr')

const { render, DESCRIPTIONS, SITE, LANGUAGES, localizedPath, pageMetadata, structuredDataJson } = await import(pathToFileURL(resolve(SSR, 'entry-server.js')).href)
const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')

const PATHS = Object.keys(DESCRIPTIONS)
const LANGS = LANGUAGES

const address = localizedPath
const file = (path, lang) => {
  const local = address(path, lang)
  return local.endsWith('/') ? `${local}index.html` : `${local}.html`
}
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function page({ url, lang, title, head, any = false }) {
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, '')
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

function metadataHead(metadata) {
  const tags = metadata.tags.map(({ tag, attributes }) =>
    `    <${tag} ${Object.entries(attributes).map(([name, value]) => `${name}="${escape(value)}"`).join(' ')} />`,
  )
  if (metadata.structuredData) tags.push(
    `    <script id="page-structured-data" type="application/ld+json">${structuredDataJson(metadata.structuredData)}</script>`,
  )
  return tags.join('\n')
}

for (const path of PATHS) {
  for (const lang of LANGS) {
    const url = address(path, lang)
    const metadata = pageMetadata(path, lang)
    write(file(path, lang), page({ url, lang, title: metadata.title, head: metadataHead(metadata) }))
  }
}

// Any other address: the page that says so, not to be indexed.
const missing = pageMetadata('/404', 'en')
write('/404.html', page({
  url: '/404', lang: 'en', title: missing.title, head: metadataHead(missing), any: true,
}))

const urls = PATHS.flatMap((path) =>
  LANGS.map(
    (lang) =>
      `  <url>\n    <loc>${SITE}${address(path, lang)}</loc>\n` +
      [...LANGS, 'x-default'].map((one) => `    <xhtml:link rel="alternate" hreflang="${one}" href="${SITE}${address(path, one === 'x-default' ? 'en' : one)}" />\n`).join('') +
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
