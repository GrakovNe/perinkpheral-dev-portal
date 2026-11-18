// SPDX-License-Identifier: MIT
import { useEffect, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'

// Mounted only in the browser: the static page has no serial session or blocker.
export function FlashNavigation({ busy, connected, disconnect, onBlocked }: {
  busy: boolean
  connected: boolean
  disconnect: () => Promise<void>
  onBlocked: () => void
}) {
  const blocker = useBlocker(busy || connected)
  const leaving = useRef(false)
  useBeforeUnload((event) => {
    if (busy || connected || leaving.current) {
      event.preventDefault()
      event.returnValue = ''
    }
  })
  useEffect(() => {
    if (blocker.state === 'unblocked') {
      leaving.current = false
      return
    }
    if (blocker.state !== 'blocked' || leaving.current) return
    if (busy) {
      onBlocked()
      blocker.reset()
      return
    }
    leaving.current = true
    void disconnect().then(() => blocker.proceed())
  }, [blocker, busy, disconnect, onBlocked])
  return null
}
