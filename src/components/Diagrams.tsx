import type { ReactNode } from 'react'

// Diagrams drawn as the device would draw them: ink lines, boxes, one face.

const INK = '#141413'
const PAPER = '#e9e7e1'
const DIM = '#6b6862'

type BoxProps = {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  filled?: boolean
  dashed?: boolean
}

function Box({ x, y, w, h, title, sub, filled = false, dashed = false }: BoxProps) {
  const fg = filled ? PAPER : INK
  const middle = y + h / 2
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={filled ? INK : PAPER}
        stroke={INK}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '6 4' : undefined}
      />
      <text x={x + w / 2} y={sub ? middle - 4 : middle + 5} textAnchor="middle" fontSize={14} fill={fg}>
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={middle + 15} textAnchor="middle" fontSize={11} fill={filled ? '#b9b5ad' : DIM}>
          {sub}
        </text>
      )}
    </g>
  )
}

function Arrow({ points, label, dashed = false, labelAt }: { points: [number, number][]; label?: string; dashed?: boolean; labelAt?: [number, number] }) {
  const [x1, y1] = points[points.length - 2]
  const [x2, y2] = points[points.length - 1]
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const head = 8
  const left: [number, number] = [x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45)]
  const right: [number, number] = [x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45)]
  return (
    <g>
      <polyline
        points={points.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <polygon points={[[x2, y2], left, right].map((p) => p.join(',')).join(' ')} fill={INK} />
      {label && labelAt && (
        <text x={labelAt[0]} y={labelAt[1]} fontSize={11} fill={DIM} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

function Diagram({ width, height, caption, label, children }: { width: number; height: number; caption: string; label: string; children: ReactNode }) {
  return (
    <figure className="diagram">
      <div className="canvas">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
          {children}
        </svg>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

// ---- the layers of the host ----

export function LayersDiagram() {
  return (
    <Diagram
      width={760}
      height={430}
      label="The layers of the firmware, from the applications down to the hardware"
      caption="Firmware layers. Services on the right."
    >
      <Box x={10} y={10} w={530} h={50} title="Apps" sub="installed from catalogs" filled />
      <Box x={10} y={74} w={530} h={50} title="App runtime" sub="what apps can call" />
      <Box x={10} y={138} w={260} h={50} title="Navigation" sub="screens, BACK, menu" />
      <Box x={280} y={138} w={260} h={50} title="Screens" sub="menu, dialogs, apps" />
      <Box x={10} y={202} w={530} h={50} title="Graphics" sub="text, icons, lists, charts" />
      <Box x={10} y={266} w={530} h={50} title="Screen refresh" />
      <Box x={10} y={330} w={530} h={50} title="Drivers" sub="display, buttons, antenna" />
      <Box x={10} y={394} w={740} h={28} title="ESP32-C6" />
      <Box x={560} y={10} w={190} h={50} title="Events" sub="buttons first" filled />
      <Box x={560} y={74} w={190} h={50} title="Timers" sub="alarms, schedules" />
      <Box x={560} y={138} w={190} h={50} title="Network" sub="data for apps" />
      <Box x={560} y={202} w={190} h={50} title="Wi-Fi and time" sub="setup, time sync" />
      <Box x={560} y={266} w={190} h={50} title="Web page" sub="settings, updates" />
      <Box x={560} y={330} w={190} h={50} title="Storage" sub="apps, settings" />
    </Diagram>
  )
}

// ---- how data reaches an application ----

export function DeliveryDiagram() {
  return (
    <Diagram
      width={820}
      height={400}
      label="How the answer to a poll or a request reaches its application"
      caption="Data reaches an app whether it is on screen or not."
    >
      <Box x={10} y={20} w={180} h={56} title="Schedule" sub="from the manifest" />
      <Box x={10} y={100} w={180} h={56} title="On demand" sub="from app code" />
      <Arrow points={[[190, 48], [235, 48], [235, 80], [260, 80]]} />
      <Arrow points={[[190, 128], [235, 128], [235, 96], [260, 96]]} />
      <Box x={260} y={60} w={180} h={56} title="Device" sub="fetches" filled />
      <Arrow points={[[440, 88], [490, 88]]} />
      <Box x={490} y={60} w={150} h={56} title="Source" sub="any web API" />
      <Arrow points={[[640, 88], [680, 88]]} />
      <Box x={680} y={60} w={130} h={56} title="Response" />
      <Arrow points={[[745, 116], [745, 176], [640, 176]]} label="pick" labelAt={[775, 150]} />
      <Box x={440} y={151} w={200} h={50} title="Values" sub="picked from JSON" />
      <Arrow points={[[440, 176], [390, 176]]} />
      <Box x={200} y={151} w={190} h={50} title="App on screen?" filled />
      <Arrow points={[[295, 201], [295, 232], [115, 232], [115, 260]]} label="yes" labelAt={[205, 225]} />
      <Arrow points={[[295, 201], [295, 232], [450, 232], [450, 260]]} label="no" labelAt={[375, 225]} />
      <Box x={10} y={260} w={210} h={56} title="App updates" />
      <Box x={290} y={260} w={320} h={56} title="App updates in background" />
      <Arrow points={[[610, 288], [670, 288]]} dashed />
      <Box x={670} y={260} w={140} h={56} title="App" sub="can take the screen" dashed />
      <Arrow points={[[450, 316], [450, 360], [400, 360]]} />
      <Box x={150} y={340} w={250} h={40} title="Back to the previous screen" />
    </Diagram>
  )
}

// ---- installing from a catalog ----

export function InstallDiagram() {
  const step = 170
  return (
    <Diagram
      width={820}
      height={160}
      label="Installing an application from a catalog"
      caption="Install from the device page. No restart."
    >
      <Box x={0} y={20} w={140} h={56} title="Catalog" sub="any HTTPS host" />
      <Arrow points={[[140, 48], [step, 48]]} />
      <Box x={step} y={20} w={140} h={56} title="Device page" sub="Install" />
      <Arrow points={[[step + 140, 48], [2 * step, 48]]} />
      <Box x={2 * step} y={20} w={140} h={56} title="Space check" filled />
      <Arrow points={[[2 * step + 140, 48], [3 * step, 48]]} />
      <Box x={3 * step} y={20} w={140} h={56} title="Download" sub="verified" />
      <Arrow points={[[3 * step + 140, 48], [4 * step, 48]]} />
      <Box x={4 * step} y={20} w={140} h={56} title="Installed" filled />
      <Arrow points={[[4 * step + 70, 76], [4 * step + 70, 125], [2 * step + 320, 125]]} />
      <Box x={2 * step + 20} y={105} w={300} h={40} title="App in the menu" />
    </Diagram>
  )
}

// ---- the flash ----

const PARTITIONS: { name: string; size: string; weight: number; filled?: boolean }[] = [
  { name: 'settings', size: '24K', weight: 1.4 },
  { name: 'app data', size: '56K', weight: 1.4 },
  { name: 'firmware', size: '1.44M', weight: 3, filled: true },
  { name: 'update', size: '1.44M', weight: 3, filled: true },
  { name: 'app code', size: '320K', weight: 1.6 },
  { name: 'app files', size: '640K', weight: 2 },
  { name: 'fonts', size: '64K', weight: 1.1 },
]

export function FlashDiagram() {
  const width = 760
  const total = PARTITIONS.reduce((sum, part) => sum + part.weight, 0)
  const lefts = PARTITIONS.map((_, index) =>
    PARTITIONS.slice(0, index).reduce((sum, part) => sum + (part.weight / total) * width, 0),
  )
  return (
    <Diagram
      width={width}
      height={120}
      label="The 4 MB flash and its partitions"
      caption="4 MB of flash. Two firmware copies for safe updates; app code, files and settings. Not to scale."
    >
      {PARTITIONS.map((part, index) => {
        const w = (part.weight / total) * width
        const x = lefts[index]
        return (
          <g key={part.name}>
            <rect x={x} y={20} width={w} height={60} fill={part.filled ? INK : PAPER} stroke={INK} strokeWidth={1.5} />
            <text x={x + w / 2} y={46} textAnchor="middle" fontSize={13} fill={part.filled ? PAPER : INK}>
              {part.name}
            </text>
            <text x={x + w / 2} y={64} textAnchor="middle" fontSize={11} fill={part.filled ? '#b9b5ad' : DIM}>
              {part.size}
            </text>
          </g>
        )
      })}
      <text x={0} y={104} fontSize={11} fill={DIM}>
        0x000000
      </text>
      <text x={width} y={104} fontSize={11} fill={DIM} textAnchor="end">
        0x400000
      </text>
    </Diagram>
  )
}

// ---- the wiring ----

const PANEL_PINS: [string, string][] = [
  ['VCC', '3V3'],
  ['GND', 'GND'],
  ['DIN', 'D10 / GPIO18'],
  ['CLK', 'D8 / GPIO19'],
  ['CS', 'D7 / GPIO17'],
  ['DC', 'D5 / GPIO23'],
  ['RST', 'D4 / GPIO22'],
  ['BUSY', 'D6 / GPIO16'],
]

const BUTTON_PINS: [string, string][] = [
  ['1 UP', 'D0 / GPIO0'],
  ['2 OK', 'D1 / GPIO1'],
  ['3 DOWN', 'D2 / GPIO2'],
  ['4 BACK', 'D3 / GPIO21'],
]

export function WiringDiagram() {
  const row = 30
  const top = 56
  const height = top + row * PANEL_PINS.length
  return (
    <Diagram
      width={760}
      height={height + 20}
      label="Wiring of the display and the buttons to the XIAO ESP32-C6"
      caption="Display on bit-banged SPI; buttons on the LP GPIO group, active low. Button module V and G spliced into display VCC and GND."
    >
      <rect x={10} y={10} width={170} height={height - 10} fill={PAPER} stroke={INK} strokeWidth={1.5} />
      <text x={95} y={32} textAnchor="middle" fontSize={13}>
        Waveshare 4.2" V2
      </text>
      <rect x={250} y={10} width={260} height={height - 10} fill={INK} stroke={INK} strokeWidth={1.5} />
      <text x={380} y={32} textAnchor="middle" fontSize={13} fill={PAPER}>
        XIAO ESP32-C6
      </text>
      <rect x={580} y={10} width={170} height={top + row * BUTTON_PINS.length - 10} fill={PAPER} stroke={INK} strokeWidth={1.5} />
      <text x={665} y={32} textAnchor="middle" fontSize={13}>
        Buttons 4P
      </text>
      {PANEL_PINS.map(([pin, xiao], index) => {
        const y = top + index * row
        return (
          <g key={pin}>
            <text x={24} y={y + 4} fontSize={12}>
              {pin}
            </text>
            <line x1={180} y1={y} x2={250} y2={y} stroke={INK} strokeWidth={1.5} />
            <text x={262} y={y + 4} fontSize={12} fill={PAPER}>
              {xiao}
            </text>
          </g>
        )
      })}
      {BUTTON_PINS.map(([pin, xiao], index) => {
        const y = top + index * row
        return (
          <g key={pin}>
            <text x={736} y={y + 4} fontSize={12} textAnchor="end">
              {pin}
            </text>
            <line x1={510} y1={y} x2={580} y2={y} stroke={INK} strokeWidth={1.5} />
            <text x={498} y={y + 4} fontSize={12} fill={PAPER} textAnchor="end">
              {xiao}
            </text>
          </g>
        )
      })}
      <text x={580} y={top + row * BUTTON_PINS.length + 22} fontSize={11} fill={DIM}>
        active low
      </text>
      <text x={580} y={top + row * BUTTON_PINS.length + 40} fontSize={11} fill={DIM}>
        pull-ups on the module
      </text>
    </Diagram>
  )
}
