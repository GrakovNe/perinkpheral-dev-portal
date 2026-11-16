import { Link } from 'react-router-dom'
import { Mark, Wordmark } from '../components/Brand'
import { Carousel, Gallery, Screen } from '../components/Pictures'
import { APPS } from '../content/apps'

const SPECS: [string, string][] = [
  ['Screen', '4.2" e-paper'],
  ['Apps', 'Up to 24'],
  ['Controls', '4 buttons'],
  ['Connection', 'Wi-Fi'],
  ['Power', 'Battery, USB-C'],
  ['Case', '3D-printed'],
]

const FEATURES = ['No backlight', 'No account, no cloud', 'Set up in a browser', 'Four buttons']

const HERO = [
  { name: 'hero-sun', caption: 'Sun and Moon' },
  { name: 'hero-weather', caption: 'Weather' },
  { name: 'hero-stocks', caption: 'Stocks' },
  { name: 'hero-timer', caption: 'Timer' },
]

const SCREENS = [
  { name: 'weather', caption: 'Weather' },
  { name: 'stocks', caption: 'Stocks' },
  { name: 'clock', caption: 'Clock' },
  { name: 'sun', caption: 'Sun and Moon' },
  { name: 'timer', caption: 'Timer' },
  { name: 'stopwatch', caption: 'Stopwatch' },
]

const RENDERS = [
  { name: 'front34l', caption: 'Front, left' },
  { name: 'front34r', caption: 'Front, right' },
  { name: 'front', caption: 'Front' },
  { name: 'buttons', caption: 'Buttons' },
  { name: 'top', caption: 'Top' },
  { name: 'back', caption: 'Back' },
  { name: 'back34r', caption: 'Back, right' },
  { name: 'left', caption: 'Left' },
  { name: 'right', caption: 'Right' },
]

const DOORS = [
  { to: '/hardware', title: 'Hardware' },
  { to: '/sdk', title: 'SDK' },
  { to: '/firmware', title: 'Firmware' },
]

function AppIcon({ rows }: { rows: string[] }) {
  return (
    <svg className="app-icon" viewBox="0 0 11 11" shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
    </svg>
  )
}

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-text">
            <Mark className="hero-mark" title="The perINKpheral mark" />
            <h1>
              <Wordmark className="hero-wordmark" />
            </h1>
            <p className="hero-line">A paper-like screen for your desk, with apps.</p>
            <p className="hero-lead">Weather, calendar, stocks, smart home and more.</p>
            <div className="buttons">
              <Link className="button" to="/hardware">
                Build one <span className="arrow">-&gt;</span>
              </Link>
              <Link className="button quiet" to="/sdk">
                Write an app
              </Link>
            </div>
          </div>
          <div className="hero-picture">
            <Carousel slides={HERO} sizes="(max-width: 64rem) 100vw, 56vw" />
          </div>
        </div>
      </section>

      <section className="specs" aria-label="Specifications">
        <div className="wrap">
          <dl>
            {SPECS.map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>Apps</h2>
          </div>
          <div className="apps">
            {APPS.map((app) => (
              <article key={app.name} className="panel app">
                <AppIcon rows={app.icon} />
                <h3>{app.title}</h3>
                <p>{app.text}</p>
              </article>
            ))}
            <Link to="/sdk" className="panel app own">
              <span className="plus" aria-hidden="true">
                +
              </span>
              <h3>Your own</h3>
              <p>In C</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="features">
            {FEATURES.map((title) => (
              <article key={title}>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>On the screen</h2>
          </div>
          <div className="screens">
            {SCREENS.map((screen) => (
              <Screen key={screen.name} name={screen.name} alt={screen.caption} caption={screen.caption} />
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>The case</h2>
          </div>
          <Gallery shots={RENDERS} />
        </div>
      </section>

      <section className="band ink">
        <div className="wrap">
          <div className="doors">
            {DOORS.map((door) => (
              <Link key={door.to} to={door.to} className="door">
                <h3>
                  {door.title} <span className="arrow">-&gt;</span>
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
