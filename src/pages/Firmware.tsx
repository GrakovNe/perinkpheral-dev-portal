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
      <PageHead title="Firmware" />
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              ['Chip', 'ESP32-C6'],
              ['Apps', 'Up to 24'],
              ['Network', 'Wi-Fi 6, HTTP, HTTPS'],
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
          <DeliveryDiagram />
        </Chapter>

        <Chapter chapter={catalogs}>
          <InstallDiagram />
        </Chapter>

        <Chapter chapter={storage}>
          <FlashDiagram />
        </Chapter>

        <Chapter chapter={display}>
          <Facts
            rows={[
              ['Button press', '0.5 s'],
              ['Switching apps', '2.5 s'],
              ['Data updates', 'Up to once a minute'],
              ['Power to keep the picture', 'None'],
            ]}
          />
        </Chapter>

        <Chapter chapter={network}>
          <Facts
            rows={[
              ['First setup', 'From a phone, over the device’s own Wi-Fi'],
              ['Firmware updates', 'From the device’s web page'],
              ['Confirmation', 'Button on the device'],
            ]}
          />
        </Chapter>

        <Chapter chapter={power}>
          <Facts
            rows={[
              ['Power saving off', 'Wi-Fi always on'],
              ['Power saving on', 'Wi-Fi only for data updates'],
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
            <a href={files.security}>SECURITY.md</a>
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
