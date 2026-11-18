// SPDX-License-Identifier: MIT
import { expect, test } from '@playwright/test'
import { fixture } from '../helpers/flashFixtures.mjs'

const release = { version: '0.1.35', date: '', notes: '', builds: { release: '0.1.35/manifest.json' } }
const resets = ['bootloader', 'DTR:false', 'RTS:true', 'RTS:false', 'disconnect']

async function serial(page) {
  page.on('pageerror', (error) => { throw error })
  await page.addInitScript(() => {
    window.serialCalls = []
    Object.defineProperty(navigator, 'serial', { value: { requestPort: async () => ({}) } })
  })
  // Only fake transport is ever loaded: tests cannot request real hardware.
  await page.route('**/esptool-js.js*', (route) => route.fulfill({ contentType: 'application/javascript', body: `
    export class Transport {
      async disconnect() { window.serialCalls.push('disconnect') }
      async setDTR(value) { window.serialCalls.push('DTR:' + value) }
      async setRTS(value) { window.serialCalls.push('RTS:' + value) }
    }
    export class ESPLoader {
      chip = { CHIP_NAME: 'ESP32-C6', readMac: async () => 'aa:bb:cc:dd:ee:ff' }
      async main() { window.serialCalls.push('bootloader') }
      async writeFlash() {
        window.serialCalls.push('write:start')
        await new Promise(resolve => { window.finishWrite = resolve })
        if (window.failWrite) throw new Error('USB disconnected during write')
        window.serialCalls.push('write:end')
      }
    }
  ` }))
  await page.route('https://grakovne.github.io/perinkpheral/flash/**', async (route) => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('index.json')) return route.fulfill({ json: [release] })
    const data = fixture('fresh')
    if (path.endsWith('manifest.json')) return route.fulfill({ json: data.manifest })
    const part = data.parts.findIndex((part) => path.endsWith('/' + part.path))
    if (part < 0) return route.abort()
    return route.fulfill({ body: Buffer.from(data.files[part].data) })
  })
}

async function connect(page) {
  await page.getByRole('button', { name: 'Connect', exact: true }).click()
  await expect(page.getByText('aa:bb:cc:dd:ee:ff')).toBeVisible()
}

for (const way of ['next', 'back', 'language']) {
  test(`leaving a connected board via ${way} restarts before disconnecting`, async ({ page }) => {
    await serial(page)
    await page.goto('/start')
    await page.getByRole('link', { name: /Flash/ }).first().click()
    await expect(page).toHaveURL(/\/flash$/)
    await connect(page)
    if (way === 'next') await page.getByRole('link', { name: /Set up the device/ }).click()
    if (way === 'back') await page.goBack()
    if (way === 'language') await page.getByRole('button', { name: 'Русский', exact: true }).first().click()
    await expect.poll(() => page.evaluate(() => window.serialCalls)).toEqual(resets)
    await expect(page).toHaveURL(way === 'next' ? /\/setup$/ : way === 'back' ? /\/start$/ : /\/ru\/flash$/)
    if (way === 'language') await expect(page.getByRole('button', { name: 'Подключить', exact: true })).toBeVisible()
  })
}

test('navigation and tab close cannot interrupt writing; successful completion resets once', async ({ page }) => {
  await serial(page)
  await page.goto('/start')
  await page.getByRole('link', { name: /Flash/ }).first().click()
  await connect(page)
  await page.getByRole('combobox', { name: 'Install', exact: true }).selectOption('fresh')
  await page.getByRole('button', { name: 'Install', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.serialCalls)).toEqual(['bootloader', 'write:start'])
  await page.getByRole('link', { name: 'Firmware', exact: true }).first().click()
  await expect(page.getByRole('alert')).toContainText('Wait for the operation')
  await expect(page).toHaveURL(/\/flash$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/flash$/)
  await expect.poll(() => page.evaluate(() => window.serialCalls)).toEqual(['bootloader', 'write:start'])
  // A reload or closing the tab is outside router control and needs a browser prompt.
  const dialog = page.waitForEvent('dialog')
  await page.close({ runBeforeUnload: true })
  await (await dialog).dismiss()
  expect(await page.evaluate(() => window.serialCalls)).toEqual(['bootloader', 'write:start'])
  await page.evaluate(() => window.finishWrite())
  await expect.poll(() => page.evaluate(() => window.serialCalls)).toEqual([
    'bootloader', 'write:start', 'write:end', ...resets.slice(1),
  ])
  await page.getByRole('link', { name: 'Firmware', exact: true }).first().click()
  await expect(page).toHaveURL(/\/firmware$/)
})

test('failed writing releases the port without attempting to boot an incomplete image', async ({ page }) => {
  await serial(page)
  await page.goto('/flash')
  await connect(page)
  await page.getByRole('combobox', { name: 'Install', exact: true }).selectOption('fresh')
  await page.getByRole('button', { name: 'Install', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.serialCalls)).toEqual(['bootloader', 'write:start'])
  await page.evaluate(() => { window.failWrite = true; window.finishWrite() })
  await expect(page.getByText('Writing stopped. Connect again.')).toBeVisible()
  expect(await page.evaluate(() => window.serialCalls)).toEqual(['bootloader', 'write:start', 'disconnect'])
})

for (const failure of ['network', 'http', 'empty']) {
  test(`release index ${failure} is distinguished and retry works`, async ({ page }) => {
    await serial(page)
    await page.route('**/flash/index.json', (route) => failure === 'network'
      ? route.abort()
      : route.fulfill(failure === 'http' ? { status: 503 } : { json: [] }))
    await page.goto('/flash')
    if (failure === 'empty') {
      await expect(page.getByText('No firmware is published yet.')).toBeVisible()
    } else {
      await expect(page.getByRole('alert')).toContainText('Could not load firmware versions')
      await expect(page.getByText('No firmware is published yet.')).toHaveCount(0)
      await page.unroute('**/flash/index.json')
      await page.getByRole('button', { name: 'Try again', exact: true }).click()
      await expect(page.getByRole('button', { name: 'Connect', exact: true })).toBeEnabled()
    }
  })
}
