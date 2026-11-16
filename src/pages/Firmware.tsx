import { Chapter, DocBody, Facts, PageHead } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, LayersDiagram } from '../components/Diagrams'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'delivery', title: 'Data delivery' },
  { id: 'storage', title: 'Storage' },
  { id: 'display', title: 'Display' },
  { id: 'network', title: 'Network and updates' },
  { id: 'api', title: 'Web API' },
]

const [overview, architecture, delivery, storage, display, network, api] = CHAPTERS

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


        <Chapter chapter={storage}>
          <FlashDiagram />
        </Chapter>

        <Chapter chapter={display}>
          <Facts
            rows={[
              ['Frame rate', 'Up to 1.5 fps'],
              ['Delay', '0.5 s; 2.5 s when switching apps'],
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


        <Chapter chapter={api}>
          <p>
            <a href={files.openapi}>OpenAPI specification</a>
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
