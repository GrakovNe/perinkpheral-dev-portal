import { Link } from 'react-router-dom'
import { Mark, Wordmark } from '../components/Brand'
import { Gallery, Render, Screen } from '../components/Pictures'

const SPECS: [string, string][] = [
  ['Display', '4.2" e-paper, 400 x 300, 1 bit'],
  ['Processor', 'ESP32-C6, RISC-V 160 MHz'],
  ['Wireless', 'Wi-Fi 6, 2.4 GHz'],
  ['Input', 'Four buttons'],
  ['Power', 'Li-Ion 4000 mAh, USB-C'],
  ['Applications', 'WebAssembly, up to 24 installed'],
]

const PRINCIPLES: [string, string][] = [
  ['No backlight, no animation', 'Static content between updates. Display refresh is rate-limited.'],
  [
    'Local processing',
    'The device fetches data, runs applications and renders frames itself. No server-side rendering.',
  ],
  [
    'Direct data access',
    'Requests go directly from the device to the data source. No accounts, no telemetry, no intermediate cloud service.',
  ],
  ['Physical buttons', 'Four buttons for application input. A long press on BACK always returns to the menu.'],
  [
    'Reproducible hardware',
    'Off-the-shelf modules, no custom PCB, a case printed without supports. MIT License.',
  ],
  [
    'Installable applications',
    'Applications are installed from catalogs over Wi-Fi, without reflashing the firmware.',
  ],
]

const SCREENS = [
  { name: 'stocks', caption: 'Stocks' },
  { name: 'clock', caption: 'Clock' },
  { name: 'menu', caption: 'Menu' },
  { name: 'kit-parts', caption: 'UI kit' },
  { name: 'timer', caption: 'Timer' },
  { name: 'settings', caption: 'Settings' },
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
  {
    to: '/sdk',
    title: 'SDK',
    text: 'Toolchain, simulator, application model, API reference.',
  },
  {
    to: '/hardware',
    title: 'Hardware',
    text: 'Bill of materials, wiring, printing, assembly.',
  },
  {
    to: '/firmware',
    title: 'Firmware',
    text: 'Architecture, data delivery, display refresh, storage, updates.',
  },
]

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
            <p className="hero-line">Open-source e-paper desk display with buttons and WebAssembly applications.</p>
            <p className="hero-lead">
              A 4.2" e-paper panel, four buttons and an ESP32-C6 in a 3D-printed case. Displays the time, weather,
              calendar events, market data and smart home state. Applications are WebAssembly modules installed over
              Wi-Fi.
            </p>
            <div className="buttons">
              <Link className="button" to="/sdk">
                Start developing <span className="arrow">-&gt;</span>
              </Link>
              <Link className="button quiet" to="/hardware">
                Build one
              </Link>
            </div>
          </div>
          <div className="hero-picture">
            <Render
              name="hero"
              alt="The device on a desk, showing the sun application"
              sizes="(max-width: 64rem) 100vw, 56vw"
              eager
            />
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
            <h2>Overview</h2>
            <p>
              An always-on secondary display for the desk. No backlight, no cloud service, no account. Built from
              off-the-shelf modules.
            </p>
          </div>
          <div className="principles">
            {PRINCIPLES.map(([title, text], index) => (
              <article key={title} className="panel">
                <span className="number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>Screens</h2>
            <p>400 x 300 px, 1 bit. System screens and applications use the same UI kit.</p>
          </div>
          <div className="screens">
            {SCREENS.map((screen) => (
              <Screen key={screen.name} name={screen.name} alt={screen.caption} caption={screen.caption} />
            ))}
          </div>
        </div>
      </section>

      <section className="band ink">
        <div className="wrap">
          <div className="band-head">
            <h2>Documentation</h2>
          </div>
          <div className="doors">
            {DOORS.map((door) => (
              <Link key={door.to} to={door.to} className="door">
                <h3>
                  {door.title} <span className="arrow">-&gt;</span>
                </h3>
                <p>{door.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>Enclosure</h2>
            <p>3D-printed PLA, no supports. Display frame tilted at 15 degrees. 111.5 x 103.5 x 86.5 mm.</p>
          </div>
          <Gallery shots={RENDERS} />
        </div>
      </section>
    </>
  )
}
