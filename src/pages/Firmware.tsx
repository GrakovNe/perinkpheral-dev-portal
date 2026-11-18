import { Link } from 'react-router-dom'
import { Chapter, DocBody, Facts, PageHead } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, LayersDiagram } from '../components/Diagrams'
import { files, repo } from '../content/links'
import { EnglishOnly, useLocal, useT } from '../i18n'

const CHAPTERS = [
  { id: 'overview', en: 'Overview', ru: 'Обзор' },
  { id: 'architecture', en: 'Architecture', ru: 'Архитектура OS' },
  { id: 'delivery', en: 'Data Flow', ru: 'Data Flow' },
  { id: 'storage', en: 'Storage', ru: 'Хранилище' },
  { id: 'network', en: 'Network and updates', ru: 'Сеть и обновления' },
  { id: 'api', en: 'Web API', ru: 'Web API' },
]

export function Firmware() {
  const t = useT()
  const local = useLocal()
  const chapters = CHAPTERS.map((one) => ({ id: one.id, title: t(one.en, one.ru) }))
  const [overview, architecture, delivery, storage, network, api] = chapters
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
          <p>{t(
            'Recovery has 896 KiB; the main firmware has 2 MiB. Settings, applications and their data keep the same space.',
            'Recovery занимает 896 КиБ, основная прошивка получает 2 МиБ. Объём разделов настроек, приложений и их данных не меняется.',
          )}</p>
        </Chapter>

        <Chapter chapter={network}>
          <Facts
            rows={[
              [t('First setup', 'Первый запуск'), t('From a phone, over the device’s own Wi-Fi', 'С телефона, через Wi-Fi устройства')],
              [t('Firmware updates', 'Обновление прошивки'), t('From the device’s web page', 'Со страницы устройства')],
              [t('Confirmation', 'Подтверждение'), t('OK on the recovery screen', 'OK на экране recovery')],
            ]}
          />
          <p>{t(
            'The page downloads the firmware, then restarts the device into recovery. Press OK on the device to install. Settings and apps are kept. If the new firmware fails to start or stay reachable, the device returns to recovery; the previous firmware is not kept.',
            'Страница скачивает прошивку и перезапускает устройство в recovery. Нажмите OK на устройстве для установки. Настройки и приложения сохраняются. Если новая прошивка не запускается или остаётся недоступной по сети, устройство возвращается в recovery; предыдущая прошивка не сохраняется.',
          )}</p>
          <p>{t(
            'Moving from the old two-slot firmware needs USB once. In the browser flasher, choose Keep data. It checks the existing layout before writing. After installation, press BACK on the recovery screen to start the firmware.',
            'Для перехода со старой прошивки с двумя слотами один раз нужен USB. В прошивальщике выберите «Сохранить данные». Он проверит разметку перед записью. После установки нажмите BACK на экране recovery для запуска прошивки.',
          )} <Link to={local('/flash')}>{t('Open flasher', 'Открыть прошивальщик')}</Link></p>
          <p>{t(
            'To enter recovery manually, hold BACK while restarting and keep it held for three seconds. If the device does not answer, hold UP and BACK for ten seconds to restart, then keep BACK held for another three seconds. Recovery uses the saved Wi-Fi or opens its own network; its page accepts a firmware file.',
            'Чтобы войти в recovery вручную, держите BACK при перезапуске и ещё три секунды после него. Если устройство не отвечает, держите UP и BACK десять секунд для перезапуска, затем продолжайте держать BACK ещё три секунды. Recovery использует сохранённый Wi-Fi или открывает свою сеть; на его странице можно загрузить файл прошивки.',
          )}</p>
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
