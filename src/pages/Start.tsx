import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { keepWords, PageHead } from '../components/Doc'
import { PixelIcon } from '../components/PixelIcon'
import { STEP_ICONS } from '../content/start'
import { useT } from '../i18n'

// What to do, in order: a step a row, its picture, a line and where the
// rest is told.

function Step({
  number,
  icon,
  title,
  children,
  more,
}: {
  number: number
  icon: string[]
  title: string
  children: ReactNode
  more?: ReactNode
}) {
  return (
    <li className="start-step">
      <span className="start-picture">
        <PixelIcon rows={icon} />
      </span>
      <div>
        <h2>
          <span className="start-number">{number}</span>
          {title}
        </h2>
        <p>{keepWords(children)}</p>
        {more}
      </div>
    </li>
  )
}

export function Start() {
  const t = useT()
  return (
    <>
      <PageHead title={t('Getting started', 'Начало работы')} />
      <div className="wrap">
        <ol className="start">
          <Step
            number={1}
            icon={STEP_ICONS.build}
            title={t('Build it', 'Соберите устройство')}
            more={
              <Link className="button quiet" to="/hardware">
                Hardware <span className="arrow">-&gt;</span>
              </Link>
            }
          >
            {t(
              'The parts, the printed case and the soldering are on the Hardware page.',
              'Детали, печать корпуса и пайка описаны на странице Hardware.',
            )}
          </Step>
          <Step
            number={2}
            icon={STEP_ICONS.flash}
            title={t('Flash the firmware', 'Прошейте')}
            more={
              <Link className="button quiet" to="/hardware#flashing">
                {t('First flash', 'Первая прошивка')} <span className="arrow">-&gt;</span>
              </Link>
            }
          >
            {t(
              'Connect the board to a computer over USB-C. Later updates install over Wi-Fi.',
              'Подключите плату к компьютеру по USB-C. Дальше обновления ставятся по Wi-Fi.',
            )}
          </Step>
          <Step number={3} icon={STEP_ICONS.connect} title={t('Connect to Wi-Fi', 'Подключите к Wi-Fi')}>
            {t(
              'Scan the QR code on the screen with a phone, pick your network and press OK on the device.',
              'Отсканируйте телефоном QR-код на экране, выберите свою сеть и нажмите OK на устройстве.',
            )}
          </Step>
          <Step number={4} icon={STEP_ICONS.install} title={t('Install apps', 'Установите приложения')}>
            {t('Open', 'Откройте в браузере')} <code>perinkpheral-xxxx.local</code>
            {t(' in a browser and add apps from the catalog.', ' и добавьте приложения из каталога.')}
          </Step>
        </ol>
      </div>
    </>
  )
}
