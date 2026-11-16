import { useEffect, useState } from 'react'

const TYPE_MS = 95 // a letter typed, on the average
const TYPE_JITTER_MS = 30 // so much sooner or later, at random: a hand, not a clock
const ERASE_MS = 40 // a letter taken back
const HOLD_MS = 2600 // a phrase typed out, read
const GAP_MS = 500 // the line empty between two phrases
const BLINK_MS = 1100 // the carriage's blink, as in the stylesheet
const FIRST_BLINKS = 1 // an empty line blinks so long before the first phrase

// A heading of a line that stands and a line below it that is typed out,
// taken back and typed again with the next phrase, round and round, a
// carriage at its end. At first the second line is empty and the carriage
// blinks once, so that the eye has found it before anything is
// typed. The phrases lie under one another unseen and the line is as tall
// as the tallest of them, so nothing below moves as they change; a reader
// that asks for less motion gets the first phrase and no more.
export function TypedHeading({
  lead,
  phrases,
  className = '',
}: {
  lead: string
  phrases: string[]
  className?: string
}) {
  const [phrase, setPhrase] = useState(0)
  const [shown, setShown] = useState(0)
  const [isBusy, setBusy] = useState(false) // typing or erasing: the carriage does not blink
  const key = phrases.join('\n')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhrase(0)
      setShown(phrases[0].length)
      return
    }
    let timer = 0
    let index = 0
    let count = 0
    const wait = (ms: number, then: () => void) => {
      timer = window.setTimeout(then, ms)
    }
    const type = () => {
      setBusy(true)
      count += 1
      setShown(count)
      if (count < phrases[index].length) {
        wait(TYPE_MS + Math.round((Math.random() * 2 - 1) * TYPE_JITTER_MS), type)
      } else {
        setBusy(false)
        wait(HOLD_MS, erase)
      }
    }
    const erase = () => {
      setBusy(true)
      count -= 1
      setShown(count)
      if (count > 0) {
        wait(ERASE_MS, erase)
      } else {
        setBusy(false)
        index = (index + 1) % phrases.length
        setPhrase(index)
        wait(GAP_MS, type)
      }
    }
    setPhrase(0)
    setShown(0)
    setBusy(false)
    wait(FIRST_BLINKS * BLINK_MS, type)
    return () => window.clearTimeout(timer)
    // the phrases are the dependency, by their contents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <h1 className={`typed ${className}`}>
      <span className="unseen">{`${lead}. ${phrases[0]}`}</span>
      <span className="typed-line" aria-hidden="true">
        {lead}
      </span>
      <span className="typed-line typed-turns" aria-hidden="true">
        {phrases.map((one) => (
          <span key={one} className="typed-room">
            {one}
          </span>
        ))}
        <span className="typed-now">
          {phrases[phrase].slice(0, shown)}
          <span className={isBusy ? 'caret steady' : 'caret'} />
        </span>
      </span>
    </h1>
  )
}
