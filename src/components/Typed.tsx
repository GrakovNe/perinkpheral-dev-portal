import { useEffect, useState } from 'react'

const STEP_MS = 95
const LINE_PAUSE_MS = 700

// A heading typed out a letter at a time, a carriage after the last one.
// The whole text is there from the start, the letters not yet typed unseen,
// so every line breaks where it will end up and nothing moves as it is
// typed; a reader that asks for less motion gets it at once.
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
    const count = Math.min(line.length, Math.max(0, left))
    left -= line.length
    return count
  })
  const caretLine = shown >= total ? lines.length - 1 : typed.findIndex((count, index) => count < lines[index].length)

  return (
    <h1 className={`typed ${className}`}>
      <span className="unseen">{lines.join('. ')}</span>
      {lines.map((line, index) => (
        <span key={index} className="typed-line" aria-hidden="true">
          {line.slice(0, typed[index])}
          {index === caretLine && <span className="caret" />}
          <span className="typed-rest">{line.slice(typed[index])}</span>
        </span>
      ))}
    </h1>
  )
}
