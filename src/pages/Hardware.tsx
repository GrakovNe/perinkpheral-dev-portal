import { Chapter, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { WiringDiagram } from '../components/Diagrams'
import { Gallery, Render } from '../components/Pictures'
import { files } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'parts', title: 'Parts' },
  { id: 'constraints', title: 'Before assembly' },
  { id: 'printing', title: 'Printed parts' },
  { id: 'wiring', title: 'Wiring' },
  { id: 'assembly', title: 'Assembly' },
  { id: 'fasteners', title: 'Fasteners' },
  { id: 'flashing', title: 'First flash' },
  { id: 'files', title: 'Files' },
  { id: 'renders', title: 'Renders' },
]

const [overview, parts, constraints, printing, wiring, assembly, fasteners, flashing, filesChapter, renders] =
  CHAPTERS

const RENDERS = [
  { name: 'front34l', caption: 'Front, left' },
  { name: 'front34r', caption: 'Front, right' },
  { name: 'front', caption: 'Front' },
  { name: 'left', caption: 'Left' },
  { name: 'right', caption: 'Right' },
  { name: 'back', caption: 'Back' },
  { name: 'back34r', caption: 'Back, right' },
  { name: 'top', caption: 'Top' },
  { name: 'buttons', caption: 'Buttons' },
]

export function Hardware() {
  return (
    <>
      <PageHead title="Hardware" />
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Render
            name="front34r"
            alt="The device, front right view"
          />
          <Facts
            rows={[
              ['Size', '111.5 x 103.5 x 86.5 mm with the feet'],
              ['Screen tilt', '15 degrees'],
              ['Board', 'Seeed Studio XIAO ESP32-C6'],
              ['Display', 'Waveshare 4.2" e-Paper Module V2, 400 x 300 pixels'],
              ['Battery', 'Li-Ion 3.7 V with a protection board, up to 4000 mAh, charges over USB-C'],
              ['Screws', 'M2.5 countersunk'],
              ['Tools', 'Soldering iron, screwdriver, FDM printer'],
            ]}
          />
        </Chapter>

        <Chapter chapter={parts}>
          <Table
            head={['Part', 'Model', 'Qty', 'Notes']}
            rows={[
              ['Microcontroller', 'Seeed Studio XIAO ESP32-C6', '1', 'Has a battery charger and an antenna connector'],
              ['Display', 'Waveshare 4.2inch e-Paper Module, V2 (SSD1683)', '1', 'Version 2 only'],
              ['Antenna', 'Seeed FPC Antenna A-01, 2.4/5 GHz', '1', 'Flat antenna with an 80 mm cable'],
              ['Buttons', '"Independent key switch module 4P"', '1', 'A small board with four buttons, sold under this name'],
              ['Battery', 'Li-Ion/LiPo 3.7 V, size code 955465, 4000 mAh', '1', 'With a protection board'],
              ['Screws', 'M2.5 x 4, countersunk (DIN 965)', '5', '3 display to frame, 2 back panel'],
              ['Screws', 'M2.5 x 6, countersunk (DIN 965)', '7', '4 bottom to cover, 2 sole, 1 display corner'],
              ['Wire', 'Thin hook-up wire', '~0.3\u00a0m', 'Buttons and battery'],
              ['Heat shrink tube', '1.5-2 mm', '~0.1\u00a0m', 'Insulating the joined wires'],
              ['Tape', 'Thin double-sided', '-', 'Antenna and battery'],
            ]}
          />
        </Chapter>

        <Chapter chapter={constraints}>
          <h3>Display</h3>
          <ul>
            <li>Only version 2 of the display works: look for the V2 sticker on the back.</li>
            <li>Unscrew the brass spacers: the display is screwed straight to the frame.</li>
            <li>Plug in the display cable first: the connector cannot be reached once the display is in place.</li>
            <li>Do not bend the thin ribbon at the glass edge sharply.</li>
          </ul>
          <h3>Board</h3>
          <ul>
            <li>The USB-C port goes into the opening in the right wall.</li>
            <li>The battery pads are on the underside of the board.</li>
          </ul>
          <h3>Battery</h3>
          <ul>
            <li>Use a battery with a protection board: the XIAO does not protect the battery from deep discharge.</li>
            <li>The battery compartment fits up to 70 x 54 x 12.5 mm.</li>
          </ul>
          <h3>Buttons</h3>
          <ul>
            <li>Snap off the narrow strip along the edge of the button board, or it does not fit.</li>
            <li>The board sits on two pins in the bottom, solder pads towards the XIAO.</li>
            <li>The caps fit standard 6 x 6 mm buttons.</li>
          </ul>
        </Chapter>

        <Chapter chapter={printing}>
          <Table
            head={['Part', 'Qty', 'Material', 'Orientation']}
            rows={[
              ['Frame', '1', 'PLA, copper', 'Front side down'],
              ['Logo', '1', 'PLA, black', 'Together with the frame, second color'],
              ['Back panel', '1', 'PLA, copper', 'Outer side down'],
              ['Corner bracket', '1', 'PLA', 'Wide side down'],
              ['Base', '1', 'PLA, copper', 'Top side down'],
              ['Bottom', '1', 'PLA, copper', 'Bottom side down'],
              ['Button caps', '4', 'PLA, black', 'Wide side down'],
              ['Feet', '6', 'TPU', 'Flat side down'],
            ]}
          />
          <ul>
            <li>No supports.</li>
            <li>Logo: second color, printed with the frame.</li>
          </ul>
        </Chapter>

        <Chapter chapter={wiring}>
          <WiringDiagram />
          <Table
            head={['Wire', 'Pin on the XIAO']}
            rows={[
              ['Display VCC, GND', '3V3, GND'],
              ['Display DIN, CLK', 'D10, D8'],
              ['Display CS, DC', 'D7, D5'],
              ['Display RST, BUSY', 'D4, D6'],
              ['Buttons 1, 2, 3, 4', 'D0, D1, D2, D3'],
              ['Buttons V, G', 'Joined to the display\'s VCC and GND wires'],
              ['Battery +, -', 'BAT+, BAT- pads under the board'],
              ['Antenna', 'Antenna connector'],
            ]}
          />
        </Chapter>

        <Chapter chapter={assembly}>
          <ol className="steps">
            <li>
              <h3>Print</h3>
              <p>Print all parts as listed above. Press the TPU feet into the bottom.</p>
            </li>
            <li>
              <h3>Mount the display</h3>
              <p>
                Unscrew the spacers, plug in the cable and put the display into the frame from the back. Three corners:
                M2.5 x 4 screws. Bottom right corner: M2.5 x 6 through the corner bracket.
              </p>
            </li>
            <li>
              <h3>Install the board, buttons and battery</h3>
              <p>
                Put the XIAO on its two supports with USB-C in the opening of the right wall, the button board on its
                pins and the battery in its compartment.
              </p>
            </li>
            <li>
              <h3>Solder</h3>
              <p>
                Solder the display and the buttons as in the wiring table, button wires no longer than 35 mm. Solder the
                battery to the pads under the XIAO.
              </p>
            </li>
            <li>
              <h3>Antenna</h3>
              <p>
                Stick the antenna inside the base cover, away from the battery, and plug it into the XIAO.
              </p>
            </li>
            <li>
              <h3>Close the case</h3>
              <p>
                Screw the back panel to the frame, the bottom to the base and the base to the back panel. Put on the
                button caps.
              </p>
            </li>
          </ol>
        </Chapter>

        <Chapter chapter={fasteners}>
          <Table
            head={['Where', 'Screw', 'Qty', 'Note']}
            rows={[
              ['Display to frame, three corners', 'M2.5 x 4', '3', ''],
              ['Display, bottom right corner', 'M2.5 x 6', '1', 'Exactly 6 mm, a longer one shows on the front'],
              ['Back panel to frame', 'M2.5 x 4', '1', 'No longer than 4 mm'],
              ['Back panel to corner bracket', 'M2.5 x 4', '1', ''],
              ['Bottom to base', 'M2.5 x 6', '4', 'Up to 8 mm'],
              ['Base to back panel', 'M2.5 x 6', '2', 'No longer than 6 mm'],
            ]}
          />
        </Chapter>

        <Chapter chapter={flashing}>
          <div className="code">
            <div className="label">
              <span>shell</span>
            </div>
            <pre>
              <code>{`. "$IDF_PATH/export.sh"
cd firmware
idf.py set-target esp32c6
idf.py build
idf.py -p <port> flash`}</code>
            </pre>
          </div>
          <Facts
            rows={[
              ['Needs', 'ESP-IDF, wasi-sdk, USB cable'],
              ['Board not found', 'Hold BOOT while plugging in'],
              ['Wi-Fi setup', <>Join <code>Perinkpheral-XXXX</code>, open <code>http://192.168.4.1</code></>],
              ['Later updates', 'Over Wi-Fi'],
            ]}
          />
        </Chapter>

        <Chapter chapter={filesChapter}>
          <div className="grid">
            <a className="panel" href={files.step}>
              <h3>3D model</h3>
            </a>
            <a className="panel" href={files.bomPage}>
              <h3>Drawings</h3>
            </a>
            <a className="panel" href={files.hardwareNotes}>
              <h3>Display notes</h3>
            </a>
          </div>
        </Chapter>

        <Chapter chapter={renders}>
          <Gallery shots={RENDERS} />
        </Chapter>
      </DocBody>
    </>
  )
}
