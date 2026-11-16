import { Chapter, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { WiringDiagram } from '../components/Diagrams'
import { Gallery, Render } from '../components/Pictures'
import { files } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'parts', title: 'Parts' },
  { id: 'constraints', title: 'Constraints' },
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
      <PageHead eyebrow="Hardware" title="Build guide">
        Parts, wiring, printing and assembly. No custom PCB.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Render
            name="front34r"
            alt="The device, front right view"
            caption="Copper PLA, black wordmark inlay."
          />
          <Facts
            rows={[
              ['Size', '111.5 x 103.5 x 86.5 mm with the feet'],
              ['Frame', 'Tilted at 15 degrees, visible window 84 x 62.5 mm'],
              ['Board', 'Seeed Studio XIAO ESP32-C6'],
              ['Display', 'Waveshare 4.2" e-Paper Module V2, SSD1683, 400 x 300'],
              ['Battery', '1S Li-Ion with protection, up to 4000 mAh, charged over USB-C'],
              ['Fasteners', 'Countersunk M2.5 screws only'],
              ['Tools', 'Soldering iron, screwdriver, FDM printer'],
            ]}
          />
        </Chapter>

        <Chapter chapter={parts}>
          <Table
            head={['Part', 'Model', 'Qty', 'Notes']}
            rows={[
              ['Microcontroller', 'Seeed Studio XIAO ESP32-C6', '1', '21 x 18 mm, USB-C, Li-Ion charger, U.FL'],
              ['Display', 'Waveshare 4.2inch e-Paper Module, V2 (SSD1683)', '1', 'Board 103.5 x 78.5, glass 91 x 77, PH 8-pin cable'],
              ['Antenna', 'Seeed FPC Antenna A-01, 2.4/5 GHz', '1', '40 x 20 x 0.2, 80 mm cable, IPEX1'],
              ['Buttons', '"Independent key switch module 4P"', '1', '55 x 15 without the rail, pull-ups on board, active low'],
              ['Battery', 'Li-Ion/LiPo 1S 3.7 V, 955465, 4000 mAh, with PCM', '1', '65 x 54 x 9.5 plus a 5 mm protection board'],
              ['Screws', 'M2.5 x 4, countersunk (DIN 965)', '5', '3 display to frame, 2 back panel'],
              ['Screws', 'M2.5 x 6, countersunk (DIN 965)', '7', '4 bottom to cover, 2 sole, 1 display corner'],
              ['Wire', 'Hook-up, 0.07-0.12 mm2', '~0.3\u00a0m', 'Buttons and battery'],
              ['Heat shrink', '1.5-2 mm', '~0.1\u00a0m', 'Button V and G splices'],
              ['Tape', 'Thin double-sided', '-', 'Antenna and battery'],
            ]}
          />
        </Chapter>

        <Chapter chapter={constraints}>
          <h3>Display</h3>
          <ul>
            <li>Waveshare 4.2" V2 only (V2 sticker, SSD1683 controller). V1 (UC8176) is not supported.</li>
            <li>Remove the brass standoffs: the display is screwed directly to the frame.</li>
            <li>Connect the JST PH 8 cable before mounting: the side connector is not accessible afterwards.</li>
            <li>Do not bend the glass flex cable towards the front or at a right angle.</li>
          </ul>
          <h3>Board</h3>
          <ul>
            <li>USB-C opening: 10 x 4.5 mm in the right wall.</li>
            <li>BAT+ and BAT- pads are on the underside; the bottom has a 0.5 mm recess below them.</li>
                      </ul>
          <h3>Battery</h3>
          <ul>
            <li>1S Li-Ion or LiPo with a protection board only: the XIAO has no over-discharge cut-off.</li>
            <li>Compartment: 70 x 54 x 12.5 mm. Capacity 2000-4000 mAh, length with PCM up to 70 mm.</li>
          </ul>
          <h3>Buttons</h3>
          <ul>
            <li>Remove the 3 mm break-off rail: with it the board is 18.5 mm wide and does not fit.</li>
            <li>Mounting holes fit 2 mm pins in the bottom. Pads V G 1 2 3 4 face the XIAO.</li>
            <li>6 x 6 mm switches, 3.5 mm plunger; caps have a 4 mm socket.</li>
          </ul>
        </Chapter>

        <Chapter chapter={printing}>
          <Table
            head={['Part', 'Qty', 'Material', 'Orientation']}
            rows={[
              ['Slab: the frame', '1', 'PLA copper', 'Face down on textured PEI'],
              ['Logo: the wordmark inlay', '1', 'PLA black, 0.6 mm', 'With the frame, one object of two parts'],
              ['BackPlate: the back panel', '1', 'PLA copper', 'Outer side down'],
              ['CornerBracket', '1', 'PLA', 'Flange down'],
              ['Foot: the base cover', '1', 'PLA copper', 'Upside down, top on PEI'],
              ['FootCover: the bottom', '1', 'PLA copper', 'Bottom side down'],
              ['Cap1-4: button caps', '4', 'PLA black', 'Flange down'],
              ['Foot1-6: feet', '6', 'TPU', 'Washer down, pressed into the bottom'],
            ]}
          />
          <ul>
            <li>No supports. Minimum wall 1.5 mm, 0.4 mm chamfer on bed edges.</li>
            <li>Frame and wordmark: one 3MF, one object of two parts (multi-material).</li>
          </ul>
        </Chapter>

        <Chapter chapter={wiring}>
          <WiringDiagram />
          <Table
            head={['From', 'To the XIAO']}
            rows={[
              ['Display VCC / GND', '3V3 / GND'],
              ['Display DIN / CLK', 'D10 (GPIO18) / D8 (GPIO19)'],
              ['Display CS / DC', 'D7 (GPIO17) / D5 (GPIO23)'],
              ['Display RST / BUSY', 'D4 (GPIO22) / D6 (GPIO16)'],
              ['Buttons 1-4', 'D0 (GPIO0), D1 (GPIO1), D2 (GPIO2), D3 (GPIO21)'],
              ['Buttons V / G', 'Spliced into display VCC / GND'],
              ['Battery + / -', 'BAT+ / BAT- pads on the underside'],
              ['Antenna', 'U.FL'],
            ]}
          />
          <div className="note">
            <p>
              Reserved: GPIO3 and GPIO14 (antenna switch), GPIO9 (BOOT), GPIO12 and GPIO13 (USB). Free: D9 (GPIO20).
            </p>
          </div>
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
                Remove the standoffs, connect the cable, insert the display into the frame from below. Three corners:
                M2.5 x 4. Bottom right corner: M2.5 x 6 through the corner bracket.
              </p>
            </li>
            <li>
              <h3>Install the board, buttons and battery</h3>
              <p>
                XIAO on its two supports, USB-C in the right wall opening. Button module on its pins, pads towards the
                XIAO. Battery in its compartment, protection board towards the XIAO.
              </p>
            </li>
            <li>
              <h3>Solder</h3>
              <p>
                Display harness and buttons as in the wiring table; button wires up to 35 mm. Battery to the BAT+ and
                BAT- pads.
              </p>
            </li>
            <li>
              <h3>Antenna</h3>
              <p>
                Attach to the cover ceiling with double-sided tape, in the 40 x 20 mm zone away from the battery. Connect
                to U.FL.
              </p>
            </li>
            <li>
              <h3>Close the case</h3>
              <p>
                Back panel to frame: 2 x M2.5 x 4. Bottom to cover: 4 x M2.5 x 6. Sole to back panel: 2 x M2.5 x 6.
                Fit the button caps.
              </p>
            </li>
          </ol>
        </Chapter>

        <Chapter chapter={fasteners}>
          <Table
            head={['Where', 'Screw', 'Qty', 'Note']}
            rows={[
              ['Display to frame, three corners', 'M2.5 x 4', '3', 'Pilot hole 3 mm deep'],
              ['Display, bottom right, through the bracket', 'M2.5 x 6', '1', 'Exactly 6 mm: tip ends 2 mm from the face'],
              ['Back panel to the left boss of the frame', 'M2.5 x 4', '1', 'No longer screw'],
              ['Back panel to the corner bracket', 'M2.5 x 4', '1', 'Pilot hole 2 mm'],
              ['Bottom to the cover', 'M2.5 x 6', '4', 'Up to 8 allowed'],
              ['Sole to the back panel', 'M2.5 x 6', '2', 'No longer than 6'],
            ]}
          />
        </Chapter>

        <Chapter chapter={flashing}>
          <p>
            The first flash requires USB; later updates can be installed over Wi-Fi from the device web UI.
            Requirements: ESP-IDF, wasi-sdk.
          </p>
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
          <p>
            On first boot the device starts an open access point, <code>Perinkpheral-XXXX</code>. Connect to it and
            open <code>http://192.168.4.1</code> to configure Wi-Fi. If the board is not detected by the flasher, hold
            BOOT while connecting USB.
          </p>
        </Chapter>

        <Chapter chapter={filesChapter}>
          <div className="grid">
            <a className="panel" href={files.step}>
              <h3>STEP model</h3>
              <p className="dim">Full enclosure model, all parts.</p>
            </a>
            <a className="panel" href={files.bomPage}>
              <h3>Drawings</h3>
              <p className="dim">Dimensioned drawings of the enclosure and components.</p>
            </a>
            <a className="panel" href={files.hardwareNotes}>
              <h3>Bench notes</h3>
              <p className="dim">Display driver sequence, timings, known issues, references.</p>
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
