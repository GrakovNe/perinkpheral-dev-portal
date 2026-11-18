// SPDX-License-Identifier: MIT
import { expect, test } from '@playwright/test'

for (const language of ['en', 'ru']) for (const width of [390, 1440]) {
  test(`firmware diagrams stay readable and localized: ${language}, ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(language === 'ru' ? '/ru/firmware' : '/firmware')
    const diagrams = page.locator('.diagram')
    await expect(diagrams).toHaveCount(3)
    await expect(diagrams.nth(0)).toContainText(language === 'ru' ? 'Один загруженный экземпляр' : 'One loaded app instance')
    await expect(diagrams.nth(1)).toContainText('app_on_picked')
    await expect(diagrams.nth(1)).toContainText('app_on_data')
    await expect(diagrams.nth(2)).toContainText(language === 'ru' ? 'Без масштаба' : 'Not to scale')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    // Long translated labels must fit inside their boxes, not merely the SVG viewBox.
    expect(await diagrams.locator('svg').evaluateAll((svgs) => svgs.flatMap((svg) =>
      [...svg.querySelectorAll('g')].flatMap((group) => {
        const box = group.querySelector(':scope > rect')
        if (!box) return []
        const bounds = box.getBBox()
        return [...group.querySelectorAll(':scope > text')].filter((text) => {
          const label = text.getBBox()
          return label.x < bounds.x || label.x + label.width > bounds.x + bounds.width
        }).map((text) => text.textContent)
      }),
    ))).toEqual([])
    await page.locator('section[aria-labelledby="delivery"]').screenshot({ path: testInfo.outputPath('delivery.png') })
  })
}
