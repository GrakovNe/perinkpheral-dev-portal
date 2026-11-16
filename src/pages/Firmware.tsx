import { Chapter, DocBody, Facts, PageHead } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, LayersDiagram } from '../components/Diagrams'
import { files, repo } from '../content/links'
import { EnglishOnly, useT } from '../i18n'

const CHAPTERS = [
  { id: 'overview', en: 'Overview', ru: 'Обзор' },
  { id: 'architecture', en: 'Architecture', ru: 'Архитектура' },
  { id: 'delivery', en: 'Data delivery', ru: 'Доставка данных' },
  { id: 'storage', en: 'Storage', ru: 'Хранение' },
  { id: 'display', en: 'Display', ru: 'Экран' },
  { id: 'network', en: 'Network and updates', ru: 'Сеть и обновления' },
  { id: 'api', en: 'Web API', ru: 'Web API' },
]

export function Firmware() {
  const t = useT()
  const chapters = CHAPTERS.map((one) => ({ id: one.id, title: t(one.en, one.ru) }))
  const [overview, architecture, delivery, storage, display, network, api] = chapters
  return (
    <>
      <PageHead title="Firmware" />
      <DocBody chapters={chapters}>
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
          <EnglishOnly>
            <LayersDiagram />
          </EnglishOnly>
        </Chapter>

        <Chapter chapter={delivery}>
          <EnglishOnly>
            <DeliveryDiagram />
          </EnglishOnly>
        </Chapter>

        <Chapter chapter={storage}>
          <EnglishOnly>
            <FlashDiagram />
          </EnglishOnly>
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
