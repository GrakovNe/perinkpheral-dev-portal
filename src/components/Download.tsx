// SPDX-License-Identifier: MIT
import { useState, type ReactNode } from 'react'

export function Download({ href, children, quiet = true, label }: {
  href: string
  children: ReactNode
  quiet?: boolean
  label?: string
}) {
  const [busy, setBusy] = useState(false)
  return (
    <a
      className={`button${quiet ? ' quiet' : ''}`}
      href={href}
      download
      aria-label={label}
      aria-busy={busy}
      onClick={async (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        if (busy) return
        setBusy(true)
        try {
          // Cross-origin links ignore the download attribute. A local blob keeps
          // the file name and saves the model instead of opening it as text.
          const response = await fetch(href)
          if (!response.ok) throw new Error('Download failed')
          const url = URL.createObjectURL(await response.blob())
          const link = document.createElement('a')
          link.href = url
          link.download = new URL(href).pathname.split('/').pop() ?? 'download'
          document.body.appendChild(link)
          link.click()
          link.remove()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        } catch {
          window.location.assign(href)
        } finally {
          setBusy(false)
        }
      }}
    >
      {children}
    </a>
  )
}
