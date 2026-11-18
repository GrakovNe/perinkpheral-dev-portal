// SPDX-License-Identifier: MIT
import { DESCRIPTIONS, pageTitle } from './pages.ts'

export const SITE = 'https://perinkpheral.dev'
export const LANGUAGES = ['en', 'ru'] as const
export type Language = typeof LANGUAGES[number]
const LOCALES = { en: 'en_US', ru: 'ru_RU' }
export type HeadTag = { tag: 'meta' | 'link'; attributes: Record<string, string> }

export function localizedPath(path: string, lang: Language): string {
  return lang === 'en' ? path : path === '/' ? '/ru/' : `/ru${path}`
}

export function pageMetadata(path: string, lang: Language) {
  const plain = path === '/' ? path : path.replace(/\/+$/, '')
  const description = DESCRIPTIONS[plain]?.[lang]
  const title = pageTitle(plain, lang)
  const meta = (name: string, content: string): HeadTag => ({ tag: 'meta', attributes: { name, content } })
  const property = (property: string, content: string): HeadTag => ({ tag: 'meta', attributes: { property, content } })
  const tags: HeadTag[] = [meta('description', description ?? '')]
  if (!description) return { title, tags: [...tags, meta('robots', 'noindex')], structuredData: null }

  const url = SITE + localizedPath(plain, lang)
  tags.push(
    { tag: 'link', attributes: { rel: 'canonical', href: url } },
    ...[...LANGUAGES, 'x-default'].map((language): HeadTag => ({
      tag: 'link', attributes: {
        rel: 'alternate', hreflang: language,
        href: SITE + localizedPath(plain, language === 'x-default' ? 'en' : language as Language),
      },
    })),
    property('og:type', 'website'), property('og:site_name', 'perINKpheral'),
    property('og:title', title), property('og:description', description), property('og:url', url),
    property('og:image', `${SITE}/og.jpg`), property('og:image:width', '1200'),
    property('og:image:height', '630'), property('og:image:alt', 'perINKpheral'),
    property('og:locale', LOCALES[lang]), property('og:locale:alternate', LOCALES[lang === 'en' ? 'ru' : 'en']),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', title),
    meta('twitter:description', description), meta('twitter:image', `${SITE}/og.jpg`),
    meta('twitter:image:alt', 'perINKpheral'),
  )
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'perINKpheral', inLanguage: [...LANGUAGES] },
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
        inLanguage: lang, isPartOf: { '@id': `${SITE}/#website` } },
    ],
  }
  return { title, tags, structuredData }
}

export function structuredDataJson(value: unknown): string {
  // JSON-LD lives inside a script element; an HTML end tag must remain data.
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export function updatePageMetadata(path: string, lang: Language, document: Document) {
  const metadata = pageMetadata(path, lang)
  document.title = metadata.title
  // Replace just the page metadata, including prerendered tags on first hydration.
  document.head.querySelectorAll(
    'link[rel="canonical"], link[rel="alternate"][hreflang], meta[name="description"], ' +
    'meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], script#page-structured-data',
  ).forEach((node) => node.remove())
  for (const tag of metadata.tags) {
    const node = document.createElement(tag.tag)
    for (const [key, value] of Object.entries(tag.attributes)) node.setAttribute(key, value)
    document.head.appendChild(node)
  }
  if (metadata.structuredData) {
    const node = document.createElement('script')
    node.id = 'page-structured-data'
    node.type = 'application/ld+json'
    node.textContent = structuredDataJson(metadata.structuredData)
    document.head.appendChild(node)
  }
}
