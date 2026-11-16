import { useEffect, useRef, useState } from "react";
import { useT } from "../i18n";

const BASE = import.meta.env.BASE_URL;

// A render of the case, at the width the browser needs.
function renderSources(name: string) {
  return {
    src: `${BASE}renders/${name}-1600.webp`,
    srcSet: `${BASE}renders/${name}-800.webp 800w, ${BASE}renders/${name}-1600.webp 1600w`,
  };
}

export function Render({
  name,
  alt,
  caption,
  sizes = "(max-width: 64rem) 100vw, 60vw",
  eager = false,
}: {
  name: string;
  alt: string;
  caption?: string;
  sizes?: string;
  eager?: boolean;
}) {
  return (
    <figure className="figure">
      <img
        {...renderSources(name)}
        sizes={sizes}
        alt={alt}
        width={1600}
        height={1067}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

// A frame of the panel, 400 x 300, taken from the device or the simulator at
// twice the size and shown cell for cell.
export function Screen({
  name,
  alt,
  caption,
}: {
  name: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="screen">
      <div className="bezel">
        <img
          src={`${BASE}screens/${name}.png`}
          alt={alt}
          width={800}
          height={600}
          loading="lazy"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export type Shot = { name: string; caption: string };

// Renders that open at full width on a press: as tiles, or as one strip
// moved along by the arrows at its sides.
export function Gallery({
  shots,
  strip = false,
}: {
  shots: Shot[];
  strip?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const t = useT();
  const [shown, setShown] = useState<Shot | null>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const open = (shot: Shot) => {
    setShown(shot);
    dialog.current?.showModal();
  };
  const look = () => {
    const box = track.current;
    if (box) {
      setEnds({
        start: box.scrollLeft <= 8,
        end: box.scrollLeft + box.clientWidth >= box.scrollWidth - 8,
      });
    }
  };
  useEffect(() => {
    if (!strip) {
      return;
    }
    look();
    window.addEventListener("resize", look);
    return () => window.removeEventListener("resize", look);
  }, [strip]);
  const move = (direction: number) => {
    const box = track.current;
    const first = box?.firstElementChild as HTMLElement | null;
    if (box && first) {
      box.scrollBy({
        left: direction * (first.offsetWidth + 16),
        behavior: "smooth",
      });
    }
  };
  const items = (
    <div
      className={strip ? "gallery strip-track" : "gallery"}
      ref={track}
      onScroll={strip ? look : undefined}
    >
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
  );
  return (
    <>
      {strip ? (
        <div className="strip">
          <button
            type="button"
            className="strip-arrow"
            onClick={() => move(-1)}
            disabled={ends.start}
            aria-label={t("Back", "Назад")}
          >
            &lt;-
          </button>
          {items}
          <button
            type="button"
            className="strip-arrow"
            onClick={() => move(1)}
            disabled={ends.end}
            aria-label={t("Next", "Дальше")}
          >
            -&gt;
          </button>
        </div>
      ) : (
        items
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={(event) =>
          event.target === dialog.current && dialog.current?.close()
        }
        aria-label={shown?.caption}
      >
        {shown && (
          <img
            {...renderSources(shown.name)}
            sizes="96vw"
            alt={shown.caption}
          />
        )}
        <div className="row">
          <span>{shown?.caption}</span>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            autoFocus
          >
            {t("Close", "Закрыть")}
          </button>
        </div>
      </dialog>
    </>
  );
}

export type Slide = { name: string; caption: string };

const TURN_MS = 5000;

// Renders that turn by themselves, one every few seconds, and by the squares
// under them. Held while the pointer is over them, and still
// for a reader who asked for less motion.
export function Carousel({
  slides,
  sizes = "100vw",
  screens = false,
}: {
  slides: Slide[];
  sizes?: string;
  screens?: boolean;
}) {
  const [shown, setShown] = useState(0);
  const [held, setHeld] = useState(false);
  const t = useT();
  const still =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (held || still) {
      return;
    }
    const timer = setTimeout(
      () => setShown((shown + 1) % slides.length),
      TURN_MS,
    );
    return () => clearTimeout(timer);
  }, [shown, held, still, slides.length]);
  return (
    <div
      className={screens ? "carousel panel-frames" : "carousel"}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      aria-roledescription="carousel"
    >
      <div className="slides">
        {slides.map((slide, index) => (
          <img
            key={slide.name}
            {...(screens
              ? { src: `${BASE}screens/${slide.name}.png` }
              : { ...renderSources(slide.name), sizes })}
            alt={
              screens
                ? slide.caption
                : t(
                    `perINKpheral showing ${slide.caption}`,
                    `perINKpheral: ${slide.caption}`,
                  )
            }
            width={screens ? 800 : 1600}
            height={screens ? 600 : 1067}
            className={index === shown ? "shown" : undefined}
            aria-hidden={index !== shown}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
          />
        ))}
      </div>
      <div className="controls">
        <div className="dots">
          {slides.map((slide, index) => (
            <button
              key={slide.name}
              type="button"
              className={index === shown ? "dot shown" : "dot"}
              onClick={() => setShown(index)}
              aria-label={slide.caption}
              aria-current={index === shown}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
