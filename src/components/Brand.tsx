import wordmarkSource from '../assets/wordmark.svg?raw'

// The mark: two corners of an empty frame, drawn from the cells of the
// device's own update icon (11 cells square).
const MARK_CELLS: [number, number, number, number][] = [
  [4, 1, 6, 1],
  [9, 2, 1, 3],
  [1, 6, 1, 3],
  [1, 9, 6, 1],
]

export function Mark({ className = 'mark', title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 11 11"
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {MARK_CELLS.map(([x, y, width, height]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} fill="currentColor" />
      ))}
    </svg>
  )
}

// The wordmark perINKpheraL in the device's square font, as it is drawn in
// assets/mark/wordmark.svg of the firmware's repository.
const wordmarkPath = /\sd="([^"]+)"/.exec(wordmarkSource)?.[1] ?? ''
const wordmarkBox = /viewBox="([^"]+)"/.exec(wordmarkSource)?.[1] ?? '0 0 67 5'

export function Wordmark({ className = 'wordmark', title = 'perINKpheral' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={wordmarkBox} shapeRendering="crispEdges" role="img" aria-label={title}>
      <path d={wordmarkPath} fill="currentColor" />
    </svg>
  )
}
