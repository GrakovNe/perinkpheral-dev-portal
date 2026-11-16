import { Link } from 'react-router-dom'
import { Chapter, DocBody, Facts, PageHead } from '../components/Doc'
import { PixelIcon } from '../components/PixelIcon'
import { STEP_ICONS } from '../content/start'
import { useT } from '../i18n'

// From parts to a screen with apps: the steps at a glance, then each with
// what it takes and where it is told in full.

const CHAPTERS = [
  { id: 'build', en: 'Build', ru: 'Собрать', icon: STEP_ICONS.build },
  { id: 'flash', en: 'Flash', ru: 'Прошить', icon: STEP_ICONS.flash },
  { id: 'wifi', en: 'Wi-Fi', ru: 'Wi-Fi', icon: STEP_ICONS.connect },
  { id: 'apps', en: 'Apps', ru: 'Приложения', icon: STEP_ICONS.install },
]

export function Start() {
  const t = useT()
  const chapters = CHAPTERS.map((one) => ({ id: one.id, title: t(one.en, one.ru) }))
  const [build, flash, wifi, apps] = chapters
  return (
    <>
      <PageHead title={t('Getting started', 'Как начать')} />
      <div className="start-band">
        <div className="wrap">
          <ol className="start">
            {CHAPTERS.map((step, index) => (
              <li key={step.id}>
                <a href={`#${step.id}`}>
                  <span className="start-picture">
                    <PixelIcon rows={step.icon} />
                  </span>
                  <h3>
                    <span className="start-number">{index + 1}</span>
                    {t(step.en, step.ru)}
                  </h3>
                </a>
              </li>
            ))}
            <li className="done">
              <span className="start-picture">
                <PixelIcon rows={STEP_ICONS.done} />
              </span>
              <h3>{t('Done', 'Готово')}</h3>
            </li>
          </ol>
        </div>
      </div>
      <DocBody chapters={chapters}>
        <Chapter chapter={build}>
          <Facts
            rows={[
              [
                t('Parts', 'Детали'),
                t(
                  'XIAO ESP32-C6, Waveshare 4.2" e-paper V2, a board of four buttons, a 3.7 V battery',
                  'XIAO ESP32-C6, экран Waveshare 4.2" V2, плата с четырьмя кнопками, аккумулятор 3.7 В',
                ),
              ],
              [t('Case', 'Корпус'), t('3D-printed, PLA and TPU', '3D-печать, PLA и TPU')],
              [t('Tools', 'Инструменты'), t('Soldering iron, screwdriver', 'Паяльник, отвёртка')],
            ]}
          />
          <Link className="button quiet" to="/hardware">
            {t('Assembly', 'Сборка')} <span className="arrow">-&gt;</span>
          </Link>
        </Chapter>

        <Chapter chapter={flash}>
          <Facts
            rows={[
              [t('Needs', 'Нужно'), t('A computer, a USB-C cable', 'Компьютер, кабель USB-C')],
              [t('Once', 'Один раз'), t('Over USB', 'По USB')],
              [t('Updates', 'Обновления'), t('Over Wi-Fi, from the device page', 'По Wi-Fi, со страницы устройства')],
            ]}
          />
          <Link className="button quiet" to="/hardware#flashing">
            {t('First flash', 'Первая прошивка')} <span className="arrow">-&gt;</span>
          </Link>
        </Chapter>

        <Chapter chapter={wifi}>
          <Facts
            rows={[
              [t('On the screen', 'На экране'), t('A QR code', 'QR-код')],
              [t('Phone', 'Телефон'), <>{t('Joins', 'Подключается к')} <code>Perinkpheral-XXXX</code></>],
              [t('Setup page', 'Страница настройки'), <>{t('Opens by itself, or', 'Открывается сама, или')} <code>http://192.168.4.1</code></>],
              [t('Network', 'Сеть'), t('Yours, with its password', 'Своя, с паролем')],
              [t('Confirm', 'Подтвердить'), t('OK on the device', 'OK на устройстве')],
            ]}
          />
        </Chapter>

        <Chapter chapter={apps}>
          <Facts
            rows={[
              [t('Device page', 'Страница устройства'), <code>http://perinkpheral-xxxx.local</code>],
              [t('Install', 'Установить'), t('Apps, then +', 'Приложения, затем +')],
              [t('Settings', 'Настройки'), t('The gear on the app', 'Шестерёнка на приложении')],
              [t('How many', 'Сколько'), t('Up to 24', 'До 24')],
            ]}
          />
        </Chapter>
      </DocBody>
    </>
  )
}
