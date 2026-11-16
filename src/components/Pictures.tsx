import { useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL

// A render of the case, at the width the browser needs.
function renderSources(name: string) {
  return {
    src: `${BASE}renders/${name}-1600.webp`,
    srcSet: `${BASE}renders/${name}-800.webp 800w, ${BASE}renders/${name}-1600.webp 1600w`,
  }
}

export function Render({
  name,
  alt,
  caption,
  sizes = '(max-width: 64rem) 100vw, 60vw',
  eager = false,
}: {
  name: string
  alt: string
  caption?: string
  sizes?: string
  eager?: boolean
}) {
  return (
    <figure className="figure">
      <img
        {...renderSources(name)}
        sizes={sizes}
        alt={alt}
        width={1600}
        height={1067}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

// A frame of the panel, 400 x 300, taken from the device or the simulator at
// twice the size and shown cell for cell.
export function Screen({ name, alt, caption }: { name: string; alt: string; caption?: string }) {
  return (
    <figure className="screen">
      <div className="bezel">
        <img src={`${BASE}screens/${name}.png`} alt={alt} width={800} height={600} loading="lazy" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export type Shot = { name: string; caption: string }

// Renders that open at full width on a press.
export function Gallery({ shots }: { shots: Shot[] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [shown, setShown] = useState<Shot | null>(null)
  const open = (shot: Shot) => {
    setShown(shot)
    dialog.current?.showModal()
  }
  return (
    <>
      <div className="gallery">
        {shots.map((shot) => (
          <button key={shot.name} type="button" onClick={() => open(shot)}>
            <img
              src={`${BASE}renders/${shot.name}-800.webp`}
              alt={shot.caption}
              width={800}
              height={533}
              loading="lazy"
            />
            <span>{shot.caption}</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={(event) => event.target === dialog.current && dialog.current?.close()}
        aria-label={shown?.caption}
      >
        {shown && <img {...renderSources(shown.name)} sizes="96vw" alt={shown.caption} />}
        <div className="row">
          <span>{shown?.caption}</span>
          <button type="button" onClick={() => dialog.current?.close()} autoFocus>
            Close
          </button>
        </div>
      </dialog>
    </>
  )
}
