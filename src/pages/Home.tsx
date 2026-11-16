import { Link } from 'react-router-dom'
import { Mark } from '../components/Brand'
import { Carousel, Gallery } from '../components/Pictures'
import { keepWords } from '../components/Doc'
import { APPS } from '../content/apps'
import { useT } from '../i18n'

const SPECS: [string, string, string, string][] = [
  ['Screen', 'Экран', '4.2" e-paper', '4.2" E-Ink'],
  ['Apps', 'Приложения', 'Up to 24', 'До 24'],
  ['Controls', 'Управление', '4 buttons', '4 кнопки'],
  ['Connection', 'Связь', 'Wi-Fi', 'Wi-Fi'],
  ['Power', 'Питание', 'Battery, USB-C', 'Аккумулятор, USB-C'],
  ['Case', 'Корпус', '3D-printed', '3D-печать'],
]

const HERO = [
  { name: 'hero-weather', en: 'Weather', ru: 'Погода' },
  { name: 'hero-sun', en: 'Sun and Moon', ru: 'Солнце и Луна' },
  { name: 'hero-stocks', en: 'Stocks', ru: 'Акции' },
  { name: 'hero-timer', en: 'Timer', ru: 'Таймер' },
]

const RENDERS = [
  { name: 'front34l', en: 'Front, left', ru: 'Спереди слева' },
  { name: 'front34r', en: 'Front, right', ru: 'Спереди справа' },
  { name: 'front', en: 'Front', ru: 'Спереди' },
  { name: 'buttons', en: 'Buttons', ru: 'Кнопки' },
  { name: 'top', en: 'Top', ru: 'Сверху' },
  { name: 'back', en: 'Back', ru: 'Сзади' },
  { name: 'back34r', en: 'Back, right', ru: 'Сзади справа' },
  { name: 'left', en: 'Left', ru: 'Слева' },
  { name: 'right', en: 'Right', ru: 'Справа' },
]

const DOORS = [
  { to: '/hardware', en: 'Hardware', ru: 'Hardware' },
  { to: '/sdk', en: 'SDK', ru: 'SDK' },
  { to: '/firmware', en: 'Firmware', ru: 'Firmware' },
]

function AppIcon({ rows }: { rows: string[] }) {
  return (
    <svg className="app-icon" viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((cell, x) => (cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
    </svg>
  )
}

export function Home() {
  const t = useT()
  const caption = (one: { name: string; en: string; ru: string }) => ({ name: one.name, caption: t(one.en, one.ru) })
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-text">
            <Mark className="hero-mark" title={t('The perINKpheral mark', 'Знак perINKpheral')} />
            <h1 className="hero-line">{t('A paper-like screen for your desk, with apps.', 'E-Ink экран для рабочего стола, с приложениями.')}</h1>
            <p className="hero-lead">{t('Weather, calendar, stocks, smart home and more.', 'Погода, календарь, акции, умный дом и не только.')}</p>
            <div className="buttons">
              <Link className="button" to="/hardware">
                {t('Build one', 'Собрать')} <span className="arrow">-&gt;</span>
              </Link>
            </div>
          </div>
          <div className="hero-picture">
            <Carousel slides={HERO.map(caption)} sizes="(max-width: 64rem) 100vw, 56vw" />
          </div>
        </div>
      </section>

      <section className="specs" aria-label={t('Specifications', 'Характеристики')}>
        <div className="wrap">
          <dl>
            {SPECS.map(([name, nameRu, value, valueRu]) => (
              <div key={name}>
                <dt>{t(name, nameRu)}</dt>
                <dd>{keepWords(t(value, valueRu))}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>{t('Example apps', 'Примеры приложений')}</h2>
          </div>
          <div className="apps">
            {APPS.map((app) => (
              <article key={app.name} className="app">
                <img
                  className="app-screen"
                  src={`${import.meta.env.BASE_URL}screens/${app.name}.png`}
                  alt={t(app.title, app.titleRu)}
                  width={800}
                  height={600}
                  loading="lazy"
                />
                <div className="app-name">
                  <AppIcon rows={app.icon} />
                  <div>
                    <h3>{t(app.title, app.titleRu)}</h3>
                    <p>{t(app.text, app.textRu)}</p>
                  </div>
                </div>
              </article>
            ))}
            <Link to="/sdk" className="app own">
              <span className="app-screen plus" aria-hidden="true">
                <svg viewBox="0 0 11 11" shapeRendering="crispEdges">
                  <rect x={5} y={2} width={1} height={7} />
                  <rect x={2} y={5} width={7} height={1} />
                </svg>
              </span>
              <div className="app-name">
                <div>
                  <h3>{t('Your own', 'Что угодно')}</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="band-head">
            <h2>{t('Gallery', 'Галерея')}</h2>
          </div>
          <Gallery strip shots={RENDERS.map(caption)} />
        </div>
      </section>

      <section className="band ink">
        <div className="wrap">
          <div className="doors">
            {DOORS.map((door) => (
              <Link key={door.to} to={door.to} className="door">
                <h3>
                  {t(door.en, door.ru)} <span className="arrow">-&gt;</span>
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
