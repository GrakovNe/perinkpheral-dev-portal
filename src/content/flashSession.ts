// SPDX-License-Identifier: MIT
type ResetLines = { setDTR(value: boolean): Promise<unknown>; setRTS(value: boolean): Promise<unknown> }

// USB-JTAG needs the boot pin released before RTS pulses; esptool-js's default
// hard reset can leave the C6 in its ROM loader.
export async function restartTransport(line: ResetLines | null) {
  if (!line) return
  try {
    await line.setDTR(false)
    await line.setRTS(true)
    await new Promise((resolve) => setTimeout(resolve, 100))
    await line.setRTS(false)
  } catch {
    // Unplugging the board must not prevent releasing the browser's port.
  }
}
