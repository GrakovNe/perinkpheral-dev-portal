// SPDX-License-Identifier: MIT
// Check the emitted HTML, not just the metadata builder, before publishing.
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { DESCRIPTIONS } from '../src/content/pages.ts'
import { SITE, localizedPath } from '../src/content/seo.ts'

const sitemap = readFileSync('dist/sitemap.xml', 'utf8')
let pages = 0
for (const path of Object.keys(DESCRIPTIONS)) for (const lang of ['en', 'ru']) {
  const local = localizedPath(path, lang)
  const file = local.endsWith('/') ? `${local}index.html` : `${local}.html`
  const html = readFileSync(`dist${file}`, 'utf8')
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  assert.ok(html.includes(`<html lang="${lang}">`), `${file}: language`)
  assert.equal((head.match(/rel="canonical"/g) ?? []).length, 1, `${file}: one canonical`)
  assert.ok(head.includes(`rel="canonical" href="${SITE}${local}"`), `${file}: canonical`)
  assert.equal((head.match(/name="description"/g) ?? []).length, 1, `${file}: one description`)
  assert.ok(!head.includes('noindex'), `${file}: indexable`)
  assert.ok(/<h1[ >]/.test(html), `${file}: prerendered heading`)
  assert.ok(sitemap.includes(`<loc>${SITE}${local}</loc>`), `${file}: sitemap entry`)
  for (const other of ['en', 'ru', 'x-default']) {
    const url = SITE + localizedPath(path, other === 'x-default' ? 'en' : other)
    assert.ok(head.includes(`hreflang="${other}" href="${url}"`), `${file}: ${other} alternate`)
  }
  const json = JSON.parse(head.match(/<script id="page-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  assert.equal(json['@graph'][1].url, SITE + local, `${file}: structured page URL`)
  pages++
}
assert.equal((sitemap.match(/<loc>/g) ?? []).length, pages)
const missing = readFileSync('dist/404.html', 'utf8')
assert.ok(missing.includes('name="robots" content="noindex"'))
assert.ok(!missing.includes('rel="canonical"'))
assert.ok(!sitemap.includes('/404'))
assert.ok(readFileSync('dist/robots.txt', 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`))
assert.ok(existsSync('dist/og.jpg'))
console.log(`SEO: ${pages} prerendered pages, reciprocal alternates, sitemap and 404 checked`)
