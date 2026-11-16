import { useEffect, useState } from 'react'

const STEP_MS = 55
const LINE_PAUSE_MS = 350

// A heading typed out a letter at a time, a carriage after the last one.
// The whole text is laid out from the start, unseen, so that nothing moves
// as it is typed; a reader that asks for less motion gets it at once.
export function TypedHeading({ lines, className = '' }: { lines: string[]; className?: string }) {
  const total = lines.reduce((sum, line) => sum + line.length, 0)
  const [shown, setShown] = useState(0)
  const key = lines.join('\n')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(total)
      return
    }
    setShown(0)
    let count = 0
    let timer = 0
    const next = () => {
      count += 1
      setShown(count)
      if (count >= total) {
        return
      }
      const lineEnd = lines.slice(0, -1).some((_, index) =>
        count === lines.slice(0, index + 1).reduce((sum, line) => sum + line.length, 0),
      )
      timer = window.setTimeout(next, lineEnd ? LINE_PAUSE_MS : STEP_MS)
    }
    timer = window.setTimeout(next, STEP_MS)
    return () => window.clearTimeout(timer)
    // the text is the dependency, by its contents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, total])

  let left = shown
  const typed = lines.map((line) => {
    const part = line.slice(0, Math.max(0, left))
    left -= line.length
    return part
  })
  const caretLine = Math.max(0, typed.findIndex((part, index) => part.length < lines[index].length))
  const lastLine = shown >= total ? lines.length - 1 : caretLine

  return (
    <h1 className={`typed ${className}`} aria-label={lines.join(' ')}>
      <span className="typed-ghost" aria-hidden="true">
        {lines.map((line, index) => (
          <span key={index} className="typed-line">
            {line}
            {index === lines.length - 1 && <span className="caret" />}
          </span>
        ))}
      </span>
      <span className="typed-text" aria-hidden="true">
        {typed.map((part, index) => (
          <span key={index} className="typed-line">
            {part}
            {index === lastLine && <span className="caret" />}
          </span>
        ))}
      </span>
    </h1>
  )
}
