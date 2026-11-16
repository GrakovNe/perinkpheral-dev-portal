// A picture of rows of '#' for ink and '.' for paper, a cell a square:
// the form the device's icons have, at any number of cells.
export function PixelIcon({ rows }: { rows: string[] }) {
  return (
    <svg className="app-icon" viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row.matchAll(/#+/g)].map((run) => (
          <rect key={`${y}-${run.index}`} x={run.index} y={y} width={run[0].length} height={1} />
        )),
      )}
    </svg>
  )
}
