import type { ESPLoader } from 'esptool-js'

// Reading a board's flash, as esptool.py does it rather than esptool-js:
// esptool-js lets the board send 1024 packets of 4 KB unanswered, and over
// the C6's USB-JTAG some of them are lost and the read never ends. Here a
// piece of 512 KB at a time, 64 packets in flight, each piece checked
// against the MD5 the board sends after it. A piece that stops or does not
// match ends the read: the board's loader still waits for the answer to it,
// and would take a new command for that answer, so it is not asked again -
// connecting again starts the loader anew.

const PIECE = 512 * 1024
const SECTOR = 0x1000
const IN_FLIGHT = 64
const READ_FLASH = 0xd2
const PACKET_TIMEOUT_MS = 5000

const word = (value: number) => new Uint8Array(new Uint32Array([value]).buffer)

function join(...parts: Uint8Array[]): Uint8Array {
  const all = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let at = 0
  for (const part of parts) {
    all.set(part, at)
    at += part.length
  }
  return all
}

async function readPiece(loader: ESPLoader, address: number, size: number): Promise<Uint8Array> {
  const result = await loader.checkCommand(
    'read flash',
    READ_FLASH,
    join(word(address), word(size), word(SECTOR), word(IN_FLIGHT)),
  )
  if (result !== 0) {
    throw new Error(`read flash: ${result}`)
  }
  const data = new Uint8Array(size)
  let have = 0
  while (have < size) {
    const packet = await loader.transport.read(PACKET_TIMEOUT_MS)
    if (!(packet instanceof Uint8Array) || packet.length === 0) {
      throw new Error('read flash: no packet')
    }
    data.set(packet.subarray(0, size - have), have)
    have += packet.length
    await loader.transport.write(word(have))
  }
  const digest = await loader.transport.read(PACKET_TIMEOUT_MS)
  if (hex(digest) !== md5(data)) {
    throw new Error('read flash: MD5 differs')
  }
  return data
}

export async function readWholeFlash(
  loader: ESPLoader,
  size: number,
  progress: (read: number, size: number) => void,
): Promise<Uint8Array> {
  const all = new Uint8Array(size)
  for (let address = 0; address < size; address += PIECE) {
    const length = Math.min(PIECE, size - address)
    all.set(await readPiece(loader, address, length), address)
    progress(address + length, size)
  }
  return all
}

const hex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

// MD5 (RFC 1321): the digest the board sends after a read is of it.
const SHIFT = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0)

function md5(data: Uint8Array): string {
  const padded = new Uint8Array((((data.length + 8) >> 6) + 1) << 6)
  padded.set(data)
  padded[data.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, (data.length * 8) >>> 0, true)
  view.setUint32(padded.length - 4, Math.floor(data.length / 2 ** 29), true)
  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476
  for (let block = 0; block < padded.length; block += 64) {
    let [a, b, c, d] = [a0, b0, c0, d0]
    for (let i = 0; i < 64; i += 1) {
      let f: number
      let g: number
      if (i < 16) {
        f = (b & c) | (~b & d)
        g = i
      } else if (i < 32) {
        f = (d & b) | (~d & c)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        f = b ^ c ^ d
        g = (3 * i + 5) % 16
      } else {
        f = c ^ (b | ~d)
        g = (7 * i) % 16
      }
      const s = SHIFT[(i >> 4) * 4 + (i % 4)]
      const sum = (a + f + K[i] + view.getUint32(block + g * 4, true)) >>> 0
      a = d
      d = c
      c = b
      b = (b + ((sum << s) | (sum >>> (32 - s)))) >>> 0
    }
    a0 = (a0 + a) >>> 0
    b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0
    d0 = (d0 + d) >>> 0
  }
  const out = new DataView(new ArrayBuffer(16))
  ;[a0, b0, c0, d0].forEach((value, index) => out.setUint32(index * 4, value, true))
  return hex(new Uint8Array(out.buffer))
}

