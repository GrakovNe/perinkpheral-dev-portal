import { Chapter, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { WiringDiagram } from '../components/Diagrams'
import { Gallery, Render } from '../components/Pictures'
import { files } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'parts', title: 'Parts' },
  { id: 'constraints', title: 'Before you start' },
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
      <PageHead eyebrow="Hardware" title="Building the device">
        Off-the-shelf modules, hand wiring and a printed case: no custom board. Everything needed to build one -
        parts, wiring, print settings and the order of assembly - is on this page and in the firmware's repository.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Render
            name="front34r"
            alt="The device from the front right: a frame tilted back over a flat base"
            caption="Enclosure v16l. PLA in copper with a black inlay of the wordmark."
          />
          <Facts
            rows={[
              ['Size', '111.5 x 103.5 x 86.5 mm with the feet'],
              ['Frame', 'Tilted back at 15 degrees, visible window 84 x 62.5 mm'],
              ['Board', 'Seeed Studio XIAO ESP32-C6, no PSRAM, 4 MB flash'],
              ['Display', 'Waveshare 4.2" e-Paper Module V2, SSD1683, 400 x 300'],
              ['Battery', '1S Li-Ion with protection, up to 4000 mAh, charged over USB-C'],
              ['Fasteners', 'Countersunk M2.5 screws only'],
              ['Tools', 'A soldering iron, a screwdriver, an FDM printer'],
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
              ['Heat shrink', '1.5-2 mm', '~0.1\u00a0m', 'Splices of the buttons’ V and G'],
              ['Tape', 'Thin double-sided', '-', 'Antenna and battery'],
            ]}
          />
        </Chapter>

        <Chapter chapter={constraints}>
          <h3>Display</h3>
          <ul>
            <li>Waveshare 4.2" V2 only, with the V2 sticker and the SSD1683 controller. V1 (UC8176) does not work with the firmware.</li>
            <li>Remove the brass standoffs: the display is screwed straight into the frame.</li>
            <li>Plug in the JST PH 8 connector before mounting. It is on the side and cannot be reached afterwards.</li>
            <li>Do not bend the glass flex cable towards the front or at a right angle.</li>
          </ul>
          <h3>Board</h3>
          <ul>
            <li>USB-C goes into an opening of 10 x 4.5 mm in the right wall.</li>
            <li>BAT+ and BAT- are pads on the underside; the bottom has a 0.5 mm recess under them.</li>
            <li>The antenna switch is set by the firmware: the external antenna is a build option.</li>
          </ul>
          <h3>Battery</h3>
          <ul>
            <li>1S Li-Ion or LiPo with a protection board only: the XIAO does not cut off deep discharge.</li>
            <li>The compartment is 70 x 54 mm, 12.5 mm high; 2000-4000 mAh, no longer than 70 mm with the PCM.</li>
          </ul>
          <h3>Buttons</h3>
          <ul>
            <li>Snap off the 3 mm rail with the fiducial: with it the board is 18.5 mm wide and does not fit.</li>
            <li>The holes sit on 2 mm pins of the bottom. Pads V G 1 2 3 4 face the XIAO.</li>
            <li>6 x 6 mm switches with a 3.5 mm plunger; the caps rest on it in a 4 mm socket.</li>
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
            <li>No supports. Walls from 1.5 mm, a 0.4 mm chamfer on edges at the bed.</li>
            <li>Export the frame and the wordmark as one 3MF and print them as one object of two parts.</li>
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
              ['Buttons V / G', 'Spliced into the display’s VCC / GND'],
              ['Battery + / -', 'BAT+ / BAT- pads on the underside'],
              ['Antenna', 'U.FL'],
            ]}
          />
          <div className="note">
            <p>
              Do not use GPIO3 and GPIO14: they drive the antenna switch. GPIO9 is BOOT, GPIO12 and GPIO13 are USB.
              D9 (GPIO20) is free.
            </p>
          </div>
        </Chapter>

        <Chapter chapter={assembly}>
          <ol className="steps">
            <li>
              <h3>Print</h3>
              <p>All parts as in the table above. The feet in TPU are pressed into the bottom.</p>
            </li>
            <li>
              <h3>Display into the frame</h3>
              <p>
                Remove the standoffs, plug in the cable, put the display into the frame from below. Three corners take
                M2.5 x 4; the bottom right one goes through the corner bracket with M2.5 x 6.
              </p>
            </li>
            <li>
              <h3>Board, buttons and battery into the base</h3>
              <p>
                The XIAO rests on two supports with its USB-C in the right wall. The button module sits on its pins
                with the pads towards the XIAO. The battery goes into its compartment with the protection board facing
                the XIAO.
              </p>
            </li>
            <li>
              <h3>Solder</h3>
              <p>
                The display harness and the buttons to the pins in the wiring table, button wires no longer than 35 mm.
                The battery to BAT+ and BAT- under the board.
              </p>
            </li>
            <li>
              <h3>Antenna</h3>
              <p>
                Glued to the ceiling of the cover in a 40 x 20 mm zone, not above the battery; its cable into the U.FL
                socket.
              </p>
            </li>
            <li>
              <h3>Close</h3>
              <p>
                The back panel to the frame with two M2.5 x 4, the bottom to the cover with four M2.5 x 6, the sole to
                the back panel with two M2.5 x 6. Caps onto the buttons.
              </p>
            </li>
          </ol>
        </Chapter>

        <Chapter chapter={fasteners}>
          <Table
            head={['Where', 'Screw', 'Qty', 'Note']}
            rows={[
              ['Display to frame, three corners', 'M2.5 x 4', '3', 'Pilot hole 3 mm deep'],
              ['Display, bottom right, through the bracket', 'M2.5 x 6', '1', 'Only 6: the tip stops 2 mm from the face'],
              ['Back panel to the left boss of the frame', 'M2.5 x 4', '1', 'Do not use a longer one'],
              ['Back panel to the corner bracket', 'M2.5 x 4', '1', 'Pilot hole 2 mm'],
              ['Bottom to the cover', 'M2.5 x 6', '4', 'Up to 8 allowed'],
              ['Sole to the back panel', 'M2.5 x 6', '2', 'No longer than 6'],
            ]}
          />
        </Chapter>

        <Chapter chapter={flashing}>
          <p>
            The first firmware goes over the USB cable; every one after it can come over the network from the device's
            own page. With ESP-IDF 5.5 and wasi-sdk installed:
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
            A new device puts up an open access point, <code>Perinkpheral-XXXX</code>. Join it and open{' '}
            <code>http://192.168.4.1</code> to give it a network. If the board does not answer the flasher, hold BOOT
            while plugging it in.
          </p>
        </Chapter>

        <Chapter chapter={filesChapter}>
          <div className="grid">
            <a className="panel" href={files.step}>
              <h3>STEP model</h3>
              <p className="dim">The whole case, every part, for any CAD.</p>
            </a>
            <a className="panel" href={files.bomPage}>
              <h3>Drawings</h3>
              <p className="dim">Dimensions, layout of the base, the stack of the frame, every component.</p>
            </a>
            <a className="panel" href={files.hardwareNotes}>
              <h3>Bench notes</h3>
              <p className="dim">The panel's driver sequence, timings, pitfalls and sources.</p>
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
