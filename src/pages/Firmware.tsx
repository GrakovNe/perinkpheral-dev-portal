import { Chapter, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, InstallDiagram, LayersDiagram } from '../components/Diagrams'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'delivery', title: 'Data delivery' },
  { id: 'catalogs', title: 'Installing apps' },
  { id: 'storage', title: 'Storage' },
  { id: 'display', title: 'Display' },
  { id: 'network', title: 'Network and updates' },
  { id: 'power', title: 'Power' },
  { id: 'api', title: 'Web API' },
]

const [overview, architecture, delivery, catalogs, storage, display, network, power, api] = CHAPTERS

export function Firmware() {
  return (
    <>
      <PageHead eyebrow="Firmware" title="Firmware">
        How the device runs apps, gets their data and draws the screen.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              ['Chip', 'ESP32-C6'],
              ['Apps', 'WebAssembly, up to 24 installed'],
              ['Network', 'Wi-Fi 6, HTTP and HTTPS'],
              ['Updates', 'Over Wi-Fi'],
              ['Languages', 'English, Russian'],
              ['Source', <a href={repo.firmware}>GrakovNe/perinkpheral</a>],
            ]}
          />
        </Chapter>

        <Chapter chapter={architecture}>
          <LayersDiagram />
        </Chapter>

        <Chapter chapter={delivery}>
          <p>Apps say what data they need. The device fetches it and hands it to the app, even when the app is not on screen.</p>
          <DeliveryDiagram />
        </Chapter>

        <Chapter chapter={catalogs}>
          <p>Apps come from catalogs: static folders on any HTTPS host. No restart after install.</p>
          <InstallDiagram />
        </Chapter>

        <Chapter chapter={storage}>
          <p>Every app keeps its settings and data on the device. A removed app keeps its settings for next time.</p>
          <FlashDiagram />
        </Chapter>

        <Chapter chapter={display}>
          <ul>
            <li>Press a button: the screen changes in about half a second.</li>
            <li>Open another app: the screen flashes once and redraws in about 2.5 seconds.</li>
            <li>Weather, prices and other data refresh at most once a minute.</li>
            <li>The picture stays on the screen without using power.</li>
          </ul>
        </Chapter>

        <Chapter chapter={network}>
          <ul>
            <li>First setup: connect a phone to the device's own Wi-Fi and choose your network.</li>
            <li>Firmware updates: from the device's web page.</li>
            <li>Updates, factory reset and a new network are confirmed with a button on the device.</li>
          </ul>
        </Chapter>

        <Chapter chapter={power}>
          <Table
            head={['Mode', 'Wi-Fi']}
            rows={[
              ['Plugged in', 'Always on'],
              ['Power saving', 'On for updates only'],
              ['Auto', 'Power saving without a computer on USB'],
            ]}
          />
        </Chapter>

        <Chapter chapter={api}>
          <Table
            head={['Endpoint', 'Description']}
            rows={[
              [<code>GET /api/status</code>, 'Device status'],
              [<code>GET /api/apps</code>, 'Installed apps and their settings'],
              [<code>POST /api/apps/install</code>, 'Install an app'],
              [<code>POST /api/apps/settings</code>, 'App settings'],
              [<code>GET, POST /api/settings</code>, 'Device settings'],
              [<code>GET /api/log</code>, 'Log'],
              [<code>POST /api/ota</code>, 'Firmware update'],
            ]}
          />
          <p>
            Security notes: <a href={files.security}>SECURITY.md</a>.
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
