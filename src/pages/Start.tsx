import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { keepWords, PageHead } from '../components/Doc'
import { GuideNav } from '../components/GuideNav'
import { PixelIcon } from '../components/PixelIcon'
import { STEP_ICONS } from '../content/start'
import { useLocal, useT } from '../i18n'

// What to do, in order: a step a row, its picture, a line and where the
// rest is told.

function Step({
  id,
  number,
  icon,
  title,
  children,
  more,
}: {
  id: string
  number: number
  icon: string[]
  title: string
  children: ReactNode
  more?: ReactNode
}) {
  return (
    <li className="start-step" id={id}>
      <span className="start-picture">
        <PixelIcon rows={icon} />
      </span>
      <div>
        <h2>
          <span className="start-number">{number}</span>
          <span>{keepWords(title)}</span>
        </h2>
        <p>{keepWords(children)}</p>
        {more}
      </div>
    </li>
  )
}

export function Start() {
  const t = useT()
  const local = useLocal()
  return (
    <>
      <PageHead title={t('Getting started', 'Начало работы')}>
        {t('From parts to your first app. Follow the steps, or start where you left off.', 'От деталей до первого приложения. Пройдите шаги по порядку или начните с того, на котором остановились.')}
      </PageHead>
      <div className="wrap">
        <ol className="start">
          <Step
            id="build"
            number={1}
            icon={STEP_ICONS.build}
            title={t('Build it', 'Соберите устройство')}
            more={
              <Link className="button quiet" to={local('/hardware')}>
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
            id="flash"
            number={2}
            icon={STEP_ICONS.flash}
            title={t('Flash the firmware', 'Прошейте')}
            more={
              <Link className="button quiet" to={local('/flash')}>
                Flash Firmware <span className="arrow">-&gt;</span>
              </Link>
            }
          >
            {t(
              'Install the firmware from your computer with a USB-C cable.',
              'Установите прошивку с компьютера через кабель USB-C.',
            )}
          </Step>
          <Step id="wifi" number={3} icon={STEP_ICONS.connect} title={t('Connect to Wi-Fi', 'Подключите к Wi-Fi')}
            more={<Link className="button quiet" to={local('/setup#wifi')}>
              {t('Set up Wi-Fi', 'Настроить Wi-Fi')} <span className="arrow">-&gt;</span>
            </Link>}
          >
            {t('Connect the device to your home network and open its web page.', 'Подключите устройство к домашней сети и откройте его веб-страницу.')}
          </Step>
          <Step id="apps" number={4} icon={STEP_ICONS.install} title={t('Install apps', 'Установите приложения')}
            more={<Link className="button quiet" to={local('/setup#apps')}>
              {t('Choose apps', 'Выбрать приложения')} <span className="arrow">-&gt;</span>
            </Link>}
          >
            {t('Choose what your device shows from the built-in catalog.', 'Выберите в готовом каталоге, что будет показывать устройство.')}
          </Step>
        </ol>
        <GuideNav next={{ to: '/hardware', label: t('Build the device', 'Собрать устройство') }} />
      </div>
    </>
  )
}
