import { Chapter, DocBody, Facts, PageHead } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, LayersDiagram } from '../components/Diagrams'
import { files, repo } from '../content/links'
import { useT } from '../i18n'

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
      <PageHead title={t('Firmware', 'Прошивка')} />
      <DocBody chapters={chapters}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              [t('Chip', 'Чип'), 'ESP32-C6'],
              [t('Apps', 'Приложения'), t('Up to 24', 'До 24')],
              [t('Network', 'Сеть'), 'Wi-Fi 6, HTTP, HTTPS'],
              [t('Updates', 'Обновления'), t('Over Wi-Fi', 'По Wi-Fi')],
              [t('Languages', 'Языки'), t('English, Russian', 'Английский, русский')],
              [t('Source', 'Исходники'), <a href={repo.firmware}>GrakovNe/perinkpheral</a>],
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
              [t('Frame rate', 'Частота кадров'), t('Up to 1.5 fps', 'До 1.5 fps')],
              [t('Delay', 'Задержка'), t('0.5 s; 2.5 s when switching apps', '0.5 с; 2.5 с при смене приложения')],
            ]}
          />
        </Chapter>

        <Chapter chapter={network}>
          <Facts
            rows={[
              [t('First setup', 'Первая настройка'), t('From a phone, over the device’s own Wi-Fi', 'С телефона, через Wi-Fi самого устройства')],
              [t('Firmware updates', 'Обновления прошивки'), t('From the device’s web page', 'Со страницы устройства')],
              [t('Confirmation', 'Подтверждение'), t('Button on the device', 'Кнопкой на устройстве')],
            ]}
          />
        </Chapter>

        <Chapter chapter={api}>
          <p>
            <a href={files.openapi}>{t('OpenAPI specification', 'Спецификация OpenAPI')}</a>
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
