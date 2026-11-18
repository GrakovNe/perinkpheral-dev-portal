// SPDX-License-Identifier: MIT
import { createHash } from 'node:crypto'

const common = [
  ['nvs', 1, 2, 0x9000, 0x6000], ['otadata', 1, 0, 0xf000, 0x2000],
  ['phy_init', 1, 1, 0x11000, 0x1000], ['appkv', 1, 2, 0x12000, 0xe000],
  ['appcode', 1, 0x40, 0x300000, 0x50000], ['apps', 1, 0x83, 0x350000, 0xa0000],
  ['glyphs', 1, 0x41, 0x3f0000, 0x10000],
]
export const recovery = [...common, ['factory', 0, 0, 0x20000, 0xe0000], ['ota_0', 0, 0x10, 0x100000, 0x200000]]
export const legacy = [...common, ['ota_0', 0, 0x10, 0x20000, 0x170000], ['ota_1', 0, 0x11, 0x190000, 0x170000]]
export function table(entries) {
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
export function fixture(mode = 'preserve', layout = recovery, flavor = 'release') {
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

