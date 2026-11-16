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
  [
    'Peripheral, not a monitor',
    'No backlight and nothing that moves. The screen is read at a glance and ignored otherwise; the refresh policy is conservative.',
  ],
  [
    'Not a thin client',
    'The device fetches the data, runs the application and draws the frame itself. No server renders pictures for it.',
  ],
  [
    'The data stays with the user',
    'Requests go from the device straight to the source. There is no account, no telemetry and no cloud of the project in between.',
  ],
  [
    'It has buttons',
    'Applications react to presses. A long press on BACK returns to the menu from anywhere.',
  ],
  [
    'Cheap to repeat',
    'Common parts, no custom PCB, a case that prints without supports. Everything is open under the MIT License.',
  ],
  [
    'Applications decide the screen',
    'The host stays small. Applications are installed from catalogs over the network, without reflashing.',
  ],
]

const SCREENS = [
  { name: 'stocks', caption: 'Stocks: a quote and its day' },
  { name: 'clock', caption: 'Clock' },
  { name: 'menu', caption: 'The menu of the host' },
  { name: 'kit-parts', caption: 'Parts of the kit' },
  { name: 'timer', caption: 'Timer' },
  { name: 'settings', caption: 'Settings on the device' },
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
    text: 'Write an application in C, run it in the simulator, send it to the device over the network.',
  },
  {
    to: '/hardware',
    title: 'Hardware',
    text: 'Parts, wiring, the printed case and the order of assembly.',
  },
  {
    to: '/firmware',
    title: 'Firmware',
    text: 'How the host is built, how data reaches an application, how the panel is refreshed.',
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
            <p className="hero-line">A desk e-paper display with buttons and applications.</p>
            <p className="hero-lead">
              A 4.2" e-paper panel, four buttons and an ESP32-C6 in a printed case. It shows what is glanced
              at - the time, the weather, a calendar, the state of a house - and asks for nothing. Applications
              are WebAssembly modules, installed over the network.
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
              alt="The device on a desk, showing sunrise, sunset, day length and the moon"
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
            <h2>What it is</h2>
            <p>
              A separate screen for the desk that is not a second monitor: no server behind it, buttons in front of
              it, on hardware that can be built at home.
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
            <h2>On the screen</h2>
            <p>
              Frames as the panel shows them, 400 x 300 pixels, black on the panel's own grey-white. The host's
              screens and the applications are drawn with the same kit.
            </p>
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
            <h2>Where to go next</h2>
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
            <h2>The case</h2>
            <p>
              Printed in PLA without supports: a frame tilted at 15 degrees, a base with the board, the battery and
              the buttons. 111.5 x 103.5 x 86.5 mm.
            </p>
          </div>
          <Gallery shots={RENDERS} />
        </div>
      </section>
    </>
  )
}
