// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DESCRIPTIONS } from '../src/content/pages.ts'
import { pageMetadata, structuredDataJson } from '../src/content/seo.ts'

const find = (metadata, name, value) => metadata.tags.filter((tag) => tag.attributes[name] === value)
for (const path of Object.keys(DESCRIPTIONS)) for (const lang of ['en', 'ru']) {
  test(`SEO metadata for ${lang} ${path}`, () => {
    const metadata = pageMetadata(path, lang)
    const url = 'https://perinkpheral.dev' + (lang === 'en' ? path : path === '/' ? '/ru/' : `/ru${path}`)
    assert.equal(find(metadata, 'rel', 'canonical')[0].attributes.href, url)
    assert.equal(find(metadata, 'name', 'description')[0].attributes.content, DESCRIPTIONS[path][lang])
    assert.equal(find(metadata, 'property', 'og:url')[0].attributes.content, url)
    assert.equal(find(metadata, 'property', 'og:title')[0].attributes.content, metadata.title)
    assert.equal(find(metadata, 'name', 'robots').length, 0)
    const alternates = find(metadata, 'rel', 'alternate')
    assert.equal(alternates.length, 3)
    for (const alternate of alternates) {
      const language = alternate.attributes.hreflang === 'ru' ? 'ru' : 'en'
      const other = pageMetadata(path, language)
      assert.equal(alternate.attributes.href, find(other, 'rel', 'canonical')[0].attributes.href)
      assert.deepEqual(find(other, 'rel', 'alternate'), alternates)
    }
    const page = metadata.structuredData['@graph'].find((item) => item['@type'] === 'WebPage')
    assert.equal(page.url, url)
    assert.equal(page.inLanguage, lang)
  })
}
test('unknown routes have no canonical, social preview or structured claim', () => {
  const metadata = pageMetadata('/unknown', 'ru')
  assert.equal(find(metadata, 'name', 'robots')[0].attributes.content, 'noindex')
  assert.equal(find(metadata, 'rel', 'canonical').length, 0)
  assert.equal(find(metadata, 'property', 'og:url').length, 0)
  assert.equal(metadata.structuredData, null)
})
test('trailing slash resolves to the real page metadata', () => {
  assert.deepEqual(pageMetadata('/hardware/', 'ru'), pageMetadata('/hardware', 'ru'))
})
test('JSON-LD cannot close its script element', () => {
  const input = { description: '</script><script>alert("x")</script>&' }
  assert.ok(!structuredDataJson(input).includes('<'))
  assert.deepEqual(JSON.parse(structuredDataJson(input)), input)
})
