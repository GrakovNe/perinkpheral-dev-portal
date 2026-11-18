// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { manifestPath, manifestParts, releaseUrl, validateFiles, validateSource } from '../src/content/flashPlan.ts'

const common = [
  ['nvs', 1, 2, 0x9000, 0x6000], ['otadata', 1, 0, 0xf000, 0x2000],
  ['phy_init', 1, 1, 0x11000, 0x1000], ['appkv', 1, 2, 0x12000, 0xe000],
  ['appcode', 1, 0x40, 0x300000, 0x50000], ['apps', 1, 0x83, 0x350000, 0xa0000],
  ['glyphs', 1, 0x41, 0x3f0000, 0x10000],
]
const recovery = [...common, ['factory', 0, 0, 0x20000, 0xe0000], ['ota_0', 0, 0x10, 0x100000, 0x200000]]
const legacy = [...common, ['ota_0', 0, 0x10, 0x20000, 0x170000], ['ota_1', 0, 0x11, 0x190000, 0x170000]]
function table(entries) {
  const raw = Buffer.alloc(0x1000, 0xff)
  entries.forEach(([name, type, subtype, offset, size, flags = 0], index) => {
    const at = index * 32
    raw.writeUInt16LE(0x50aa, at)
    raw[at + 2] = type; raw[at + 3] = subtype
    raw.writeUInt32LE(offset, at + 4); raw.writeUInt32LE(size, at + 8)
    raw.fill(0, at + 12, at + 28); raw.write(name, at + 12)
    raw.writeUInt32LE(flags, at + 28)
  })
  const at = entries.length * 32
  raw.writeUInt16LE(0xebeb, at)
  createHash('md5').update(raw.subarray(0, at)).digest().copy(raw, at + 16)
  return raw
}
function fixture(mode = 'preserve', layout = recovery, flavor = 'release') {
  const hasRecovery = layout === recovery
  const image = () => { const raw = new Uint8Array(304); raw[0] = 0xe9; raw[12] = 13; return raw }
  const entries = [
    ['bootloader.bin', 0, image()], ['partition-table.bin', 0x8000, table(layout)],
    ['ota_data_initial.bin', 0xf000, new Uint8Array(0x2000).fill(255)],
    ...(hasRecovery ? [['perink_recovery.bin', 0x20000, image()]] : []),
    ['perinkpheral.bin', hasRecovery ? 0x100000 : 0x20000, image()],
    ...(mode === 'fresh' ? [['apps.bin', 0x350000, new Uint8Array(0xa0000)]] : []),
  ]
  const parts = entries.map(([path, offset]) => ({ path: (flavor === 'debug' ? 'debug-' : '') + path, offset }))
  const files = entries.map(([, address, data]) => ({ address, data }))
  return { parts, files, manifest: { version: '0.1.35' + (flavor === 'debug' ? '-debug' : ''),
    new_install_prompt_erase: mode === 'fresh', builds: [{ chipFamily: 'ESP32-C6', parts }] } }
}

test('missing migration never falls back to an erasing manifest', () => {
  const builds = { release: 'manifest.json', debug: 'debug-manifest.json' }
  assert.equal(manifestPath(builds, 'release', 'preserve'), null)
  assert.equal(manifestPath(builds, 'debug', 'preserve'), null)
  assert.equal(manifestPath(builds, 'release', 'fresh'), 'manifest.json')
  const current = { ...builds, migration: 'migration-manifest.json', debug_migration: 'debug-migration-manifest.json' }
  assert.equal(manifestPath(current, 'release', 'preserve'), 'migration-manifest.json')
  assert.equal(manifestPath(current, 'debug', 'preserve'), 'debug-migration-manifest.json')
})
for (const flavor of ['release', 'debug']) for (const mode of ['fresh', 'preserve']) {
  test(`${flavor} ${mode} uses matching files and accepts both shipped source layouts`, () => {
    const f = fixture(mode, recovery, flavor)
    assert.deepEqual(manifestParts(f.manifest, 'v0.1.35', flavor, mode), f.parts)
    for (const source of [legacy, recovery]) assert.deepEqual(validateFiles(f.parts, f.files, mode, table(source)), { recovery: true })
  })
}
test('old releases still support an explicit fresh install', () => {
  const f = fixture('fresh', legacy)
  delete f.manifest.new_install_prompt_erase
  manifestParts(f.manifest, '0.1.35', 'release', 'fresh')
  assert.deepEqual(validateFiles(f.parts, f.files, 'fresh'), { recovery: false })
  assert.throws(() => validateFiles(f.parts, f.files, 'preserve', table(legacy)))
})
for (const [name, mutate] of [
  ['missing erase policy', m => { delete m.new_install_prompt_erase }],
  ['erasing policy', m => { m.new_install_prompt_erase = true }],
  ['wrong version', m => { m.version = '0.1.34' }],
  ['wrong chip', m => { m.builds[0].chipFamily = 'ESP32-S3' }],
  ['duplicate chip', m => { m.builds.push(m.builds[0]) }],
  ['duplicate part', m => { m.builds[0].parts.push(m.builds[0].parts[0]) }],
  ['external image', m => { m.builds[0].parts[0].path = 'https://example.com/bootloader.bin' }],
  ['unaligned address', m => { m.builds[0].parts[0].offset = 1 }],
  ['out of flash', m => { m.builds[0].parts[0].offset = 0x400000 }],
]) test(`reject migration manifest: ${name}`, () => {
  const f = fixture(); mutate(f.manifest)
  assert.throws(() => manifestParts(f.manifest, '0.1.35', 'release', 'preserve'))
})
for (const [name, mutate] of [
  ['blank board', () => Buffer.alloc(0x1000, 0xff)],
  ['damaged digest', raw => { raw[32] ^= 1; return raw }],
  ['unknown user-data address', () => table(legacy.map(entry => entry[0] === 'apps' ? [...entry.slice(0, 3), 0x340000, entry[4]] : entry))],
  ['unknown flags', () => table(legacy.map(entry => [...entry, 1]))],
  ['extra partition', () => table([...legacy, ['other', 1, 0, 0x18000, 0x1000]])],
  ['duplicate partition', () => table([...legacy, legacy[0]])],
  ['truncated table', raw => raw.subarray(0, 64)],
]) test(`reject source table: ${name}`, () => {
  assert.throws(() => validateSource(mutate(table(legacy))), { message: 'source' })
})
for (const [name, mutate] of [
  ['main crosses data boundary', f => { f.files[4].data = new Uint8Array(0x200001) }],
  ['recovery crosses main boundary', f => { f.files[3].data = new Uint8Array(0xe0001) }],
  ['bootloader crosses table', f => { f.files[0].data = new Uint8Array(0x8001) }],
  ['table crosses NVS', f => { f.files[1].data = new Uint8Array(0x1001) }],
  ['nonblank OTA metadata', f => { f.files[2].data[0] = 0 }],
  ['short OTA metadata', f => { f.files[2].data = new Uint8Array(4096).fill(255) }],
  ['wrong image chip', f => { f.files[4].data[12] = 5 }],
  ['invalid image header', f => { f.files[4].data[0] = 0 }],
  ['empty image', f => { f.files[4].data = new Uint8Array() }],
  ['wrong destination layout', f => { f.files[1].data = table(legacy) }],
  ['apps included in migration', f => { f.parts.push({ path: 'apps.bin', offset: 0x350000 }); f.files.push({ address: 0x350000, data: new Uint8Array(4096) }) }],
  ['write redirected to settings', f => { f.parts[4].offset = 0x9000; f.files[4].address = 0x9000 }],
  ['mismatched download address', f => { f.files[4].address = 0x20000 }],
]) test(`reject before writing: ${name}`, () => {
  const f = fixture(); mutate(f)
  assert.throws(() => validateFiles(f.parts, f.files, 'preserve', table(legacy)))
})
test('preservation requires a source table; fresh install ignores unknown source', () => {
  const keep = fixture(); assert.throws(() => validateFiles(keep.parts, keep.files, 'preserve'), { message: 'source' })
  const fresh = fixture('fresh'); validateFiles(fresh.parts, fresh.files, 'fresh', new Uint8Array(4096))
})
test('release URLs stay in the published directory', () => {
  const base = new URL('https://grakovne.github.io/perinkpheral/flash/v0.1.35/manifest.json')
  assert.equal(releaseUrl('bootloader.bin', base).pathname, '/perinkpheral/flash/v0.1.35/bootloader.bin')
  for (const path of ['../bootloader.bin', '//example.com/bootloader.bin', 'https://example.com/file', '/file', '?x=1', '#x', '']) {
    assert.throws(() => releaseUrl(path, base))
  }
})
