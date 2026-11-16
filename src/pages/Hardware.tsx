import { Link } from 'react-router-dom'
import { Chapter, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { WiringDiagram } from '../components/Diagrams'
import { Render } from '../components/Pictures'
import { files } from '../content/links'
import { useLocal, useT } from '../i18n'

const CHAPTERS = [
  { id: 'overview', en: 'Overview', ru: 'Обзор' },
  { id: 'parts', en: 'Parts', ru: 'Детали' },
  { id: 'constraints', en: 'Before assembly', ru: 'Перед сборкой' },
  { id: 'printing', en: 'Printed parts', ru: 'Детали корпуса' },
  { id: 'wiring', en: 'Wiring', ru: 'Схема сборки' },
  { id: 'assembly', en: 'Assembly', ru: 'Сборка' },
  { id: 'fasteners', en: 'Fasteners', ru: 'Крепёж' },
  { id: 'flashing', en: 'First flash', ru: 'Первая прошивка' },
  { id: 'files', en: 'Files', ru: 'Файлы' },
]

export function Hardware() {
  const t = useT()
  const local = useLocal()
  const chapters = CHAPTERS.map((one) => ({ id: one.id, title: t(one.en, one.ru) }))
  const [overview, parts, constraints, printing, wiring, assembly, fasteners, flashing, filesChapter] =
    chapters
  return (
    <>
      <PageHead title="Hardware" />
      <DocBody chapters={chapters}>
        <Chapter chapter={overview}>
          <Render name="front34r" alt={t('The device, front right view', 'Устройство спереди справа')} />
          <Facts
            rows={[
              [t('Size', 'Размер'), t('111.5 x 103.5 x 86.5 mm with the feet', '111.5 x 103.5 x 86.5 мм с ножками')],
              [t('Board', 'Плата'), 'Seeed Studio XIAO ESP32-C6'],
              [t('Display', 'Экран'), t('Waveshare 4.2" e-Paper Module V2, 400 x 300 pixels', 'Waveshare 4.2" e-Paper Module V2, 400 x 300 точек')],
              [t('Battery', 'Аккумулятор'), t('Li-Ion 3.7 V, charges over USB-C', 'Li-Ion 3.7 В, заряжается по USB-C')],
              [t('Screws', 'Винты'), 'M2.5'],
              [t('Tools', 'Инструменты'), t('Soldering iron, screwdriver, FDM printer', 'Паяльник, отвёртка, FDM-принтер')],
            ]}
          />
        </Chapter>

        <Chapter chapter={parts}>
          <Table
            head={[t('Part', 'Деталь'), t('Model', 'Модель'), t('Qty', 'Кол-во'), t('Notes', 'Примечание')]}
            rows={[
              [t('Microcontroller', 'Микроконтроллер'), 'Seeed Studio XIAO ESP32-C6', '1', t('Has a battery charger and an antenna connector', 'Со встроенной зарядкой и разъёмом антенны')],
              [t('Display', 'Экран'), 'Waveshare 4.2inch e-Paper Module, V2 (SSD1683)', '1', t('Version 2 only', 'Только версия 2')],
              [t('Antenna', 'Антенна'), 'Seeed FPC Antenna A-01, 2.4/5 GHz', '1', t('Flat antenna with an 80 mm cable', 'Плоская, кабель 80 мм')],
              [t('Buttons', 'Кнопки'), '"Independent key switch module 4P"', '1', t('A small board with four buttons, sold under this name', 'Плата с четырьмя кнопками, продаётся под этим названием')],
              [t('Battery', 'Аккумулятор'), t('Li-Ion/LiPo 3.7 V, size code 955465, 4000 mAh', 'Li-Ion/LiPo 3.7 В, типоразмер 955465, 4000 мАч'), '1', t('With a protection board', 'С платой защиты')],
              [t('Screws', 'Винты'), 'M2.5 x 4', '5', t('3 display to frame, 2 back panel', '3 экран к рамке, 2 задняя панель')],
              [t('Screws', 'Винты'), 'M2.5 x 6', '7', t('4 bottom to cover, 2 sole, 1 display corner', '4 дно к основанию, 2 основание, 1 угол экрана')],
              [t('Wire', 'Провод'), t('Thin hook-up wire', 'Тонкий монтажный'), t('~0.3 m', '~0.3 м'), t('Buttons and battery', 'Кнопки и аккумулятор')],
              [t('Heat shrink tube', 'Термоусадка'), t('1.5-2 mm', '1.5-2 мм'), t('~0.1 m', '~0.1 м'), t('Insulating the joined wires', 'Изоляция скруток')],
              [t('Tape', 'Скотч'), t('Thin double-sided', 'Тонкий двусторонний'), '-', t('Antenna and battery', 'Антенна и аккумулятор')],
            ]}
          />
        </Chapter>

        <Chapter chapter={constraints}>
          <h3>{t('Display', 'Экран')}</h3>
          <ul>
            <li>{t('Only version 2 of the display works: look for the V2 sticker on the back.', 'Подходит только вторая версия экрана: на обороте наклейка V2.')}</li>
            <li>{t('Unscrew the brass spacers: the display is screwed straight to the frame.', 'Открутите латунные стойки: экран крепится прямо к рамке.')}</li>
            <li>{t('Plug in the display cable first: the connector cannot be reached once the display is in place.', 'Сначала подключите шлейф: когда экран на месте, до разъёма не добраться.')}</li>
            <li>{t('Do not bend the thin ribbon at the glass edge sharply.', 'Не перегибайте тонкий шлейф у края стекла.')}</li>
          </ul>
          <h3>{t('Board', 'Плата')}</h3>
          <ul>
            <li>{t('The USB-C port goes into the opening in the right wall.', 'Разъём USB-C входит в окно в правой стенке.')}</li>
            <li>{t('The battery pads are on the underside of the board.', 'Площадки аккумулятора на нижней стороне платы.')}</li>
          </ul>
          <h3>{t('Battery', 'Аккумулятор')}</h3>
          <ul>
            <li>{t('Use a battery with a protection board: the XIAO does not protect the battery from deep discharge.', 'Нужен аккумулятор с платой защиты: XIAO не защищает его от глубокого разряда.')}</li>
            <li>{t('The battery compartment fits up to 70 x 54 x 12.5 mm.', 'Отсек вмещает аккумулятор до 70 x 54 x 12.5 мм.')}</li>
          </ul>
          <h3>{t('Buttons', 'Кнопки')}</h3>
          <ul>
            <li>{t('Snap off the narrow strip along the edge of the button board, or it does not fit.', 'Отломите узкую полоску по краю платы кнопок, иначе она не встанет.')}</li>
            <li>{t('The board sits on two pins in the bottom, solder pads towards the XIAO.', 'Плата садится на два штыря в дне, площадками к XIAO.')}</li>
            <li>{t('The caps fit standard 6 x 6 mm buttons.', 'Колпачки под стандартные кнопки 6 x 6 мм.')}</li>
          </ul>
        </Chapter>

        <Chapter chapter={printing}>
          <Table
            head={[t('Part', 'Деталь'), t('Qty', 'Кол-во'), t('Material', 'Материал'), t('Orientation', 'Положение')]}
            rows={[
              [t('Frame', 'Рамка'), '1', t('PLA, copper', 'PLA, медный'), t('Front side down', 'Лицом вниз')],
              [t('Logo', 'Логотип'), '1', t('PLA, black', 'PLA, чёрный'), t('Together with the frame, second color', 'Вместе с рамкой, вторым цветом')],
              [t('Back panel', 'Задняя панель'), '1', t('PLA, copper', 'PLA, медный'), t('Outer side down', 'Внешней стороной вниз')],
              [t('Corner bracket', 'Уголок'), '1', 'PLA', t('Wide side down', 'Широкой стороной вниз')],
              [t('Base', 'Основание'), '1', t('PLA, copper', 'PLA, медный'), t('Top side down', 'Верхом вниз')],
              [t('Bottom', 'Дно'), '1', t('PLA, copper', 'PLA, медный'), t('Bottom side down', 'Низом вниз')],
              [t('Button caps', 'Колпачки кнопок'), '4', t('PLA, black', 'PLA, чёрный'), t('Wide side down', 'Широкой стороной вниз')],
              [t('Feet', 'Ножки'), '6', 'TPU', t('Flat side down', 'Плоской стороной вниз')],
            ]}
          />
          <ul>
            <li>{t('No supports.', 'Без поддержек.')}</li>
            <li>{t('Logo: second color, printed with the frame.', 'Логотип: второй цвет, печатается вместе с рамкой.')}</li>
          </ul>
        </Chapter>

        <Chapter chapter={wiring}>
          <WiringDiagram />
          <Table
            head={[t('Wire', 'Провод'), t('Pin on the XIAO', 'Пин на XIAO')]}
            rows={[
              [t('Display VCC, GND', 'Экран VCC, GND'), '3V3, GND'],
              [t('Display DIN, CLK', 'Экран DIN, CLK'), 'D10, D8'],
              [t('Display CS, DC', 'Экран CS, DC'), 'D7, D5'],
              [t('Display RST, BUSY', 'Экран RST, BUSY'), 'D4, D6'],
              [t('Buttons 1, 2, 3, 4', 'Кнопки 1, 2, 3, 4'), 'D0, D1, D2, D3'],
              [t('Buttons V, G (power)', 'Кнопки V, G (питание)'), t('3V3, GND: joined to the display\'s VCC and GND wires', '3V3, GND: скруткой с проводами VCC и GND экрана')],
              [t('Battery +, -', 'Аккумулятор +, -'), t('BAT+, BAT- pads under the board', 'Площадки BAT+, BAT- под платой')],
              [t('Antenna', 'Антенна'), t('Antenna connector', 'Разъём антенны')],
            ]}
          />
        </Chapter>

        <Chapter chapter={assembly}>
          <ol className="steps">
            <li>
              <h3>{t('Print', 'Печать')}</h3>
              <p>{t('Print all parts as listed above. Press the TPU feet into the bottom.', 'Напечатайте все детали по списку выше. Вдавите ножки из TPU в дно.')}</p>
            </li>
            <li>
              <h3>{t('Mount the display', 'Экран')}</h3>
              <p>
                {t(
                  'Unscrew the spacers, plug in the cable and put the display into the frame from the back. Three corners: M2.5 x 4 screws. Bottom right corner: M2.5 x 6 through the corner bracket.',
                  'Открутите стойки, подключите шлейф и вставьте экран в рамку сзади. Три угла: винты M2.5 x 4. Правый нижний угол: M2.5 x 6 через уголок.',
                )}
              </p>
            </li>
            <li>
              <h3>{t('Install the board, buttons and battery', 'Плата, кнопки и аккумулятор')}</h3>
              <p>
                {t(
                  'Put the XIAO on its two supports with USB-C in the opening of the right wall, the button board on its pins and the battery in its compartment.',
                  'Поставьте XIAO на две опоры разъёмом USB-C в окно правой стенки, плату кнопок на её штыри, аккумулятор в отсек.',
                )}
              </p>
            </li>
            <li>
              <h3>{t('Solder', 'Пайка')}</h3>
              <p>
                {t(
                  'Solder the display and the buttons as in the wiring table, button wires no longer than 35 mm. Solder the battery to the pads under the XIAO.',
                  'Припаяйте экран и кнопки по схеме сборки, провода кнопок не длиннее 35 мм. Аккумулятор припаяйте к площадкам под XIAO.',
                )}
              </p>
            </li>
            <li>
              <h3>{t('Antenna', 'Антенна')}</h3>
              <p>
                {t(
                  'Stick the antenna inside the base cover, away from the battery, and plug it into the XIAO.',
                  'Приклейте антенну внутри крышки основания, подальше от аккумулятора, и подключите к XIAO.',
                )}
              </p>
            </li>
            <li>
              <h3>{t('Close the case', 'Закрыть корпус')}</h3>
              <p>
                {t(
                  'Screw the back panel to the frame, the bottom to the base and the base to the back panel. Put on the button caps.',
                  'Привинтите заднюю панель к рамке, дно к основанию и основание к задней панели. Наденьте колпачки кнопок.',
                )}
              </p>
            </li>
          </ol>
        </Chapter>

        <Chapter chapter={fasteners}>
          <Table
            head={[t('Where', 'Где'), t('Screw', 'Винт'), t('Qty', 'Кол-во'), t('Note', 'Примечание')]}
            rows={[
              [t('Display to frame, three corners', 'Экран к рамке, три угла'), 'M2.5 x 4', '3', ''],
              [t('Display, bottom right corner', 'Экран, правый нижний угол'), 'M2.5 x 6', '1', t('Exactly 6 mm, a longer one shows on the front', 'Ровно 6 мм, длиннее выйдет на лицевую сторону')],
              [t('Back panel to frame', 'Задняя панель к рамке'), 'M2.5 x 4', '1', t('No longer than 4 mm', 'Не длиннее 4 мм')],
              [t('Back panel to corner bracket', 'Задняя панель к уголку'), 'M2.5 x 4', '1', ''],
              [t('Bottom to base', 'Дно к основанию'), 'M2.5 x 6', '4', t('Up to 8 mm', 'До 8 мм')],
              [t('Base to back panel', 'Основание к задней панели'), 'M2.5 x 6', '2', t('No longer than 6 mm', 'Не длиннее 6 мм')],
            ]}
          />
        </Chapter>

        <Chapter chapter={flashing}>
          <Facts
            rows={[
              [t('Needs', 'Нужно'), t('Chrome or Edge on a computer, a USB-C cable', 'Chrome или Edge на компьютере, кабель USB-C')],
              [t('Board not found', 'Плата не видна'), t('Hold BOOT while plugging in', 'Держите BOOT при подключении')],
              [t('Wi-Fi setup', 'Настройка Wi-Fi'), <>{t('Join', 'Подключиться к')} <code>Perinkpheral-XXXX</code>, {t('open', 'открыть')} <code>http://192.168.4.1</code></>],
              [t('Later updates', 'Дальнейшие обновления'), t('Over Wi-Fi', 'По Wi-Fi')],
            ]}
          />
          <div className="buttons">
            <Link className="button" to={local('/flash')}>
              {t('Flash from a browser', 'Прошить из браузера')} <span className="arrow">-&gt;</span>
            </Link>
          </div>
        </Chapter>

        <Chapter chapter={filesChapter}>
          <div className="buttons">
            <a className="button quiet" href={files.step} download="perinkpheral.step">
              {t('3D model, STEP', '3D-модель, STEP')}
            </a>
            <a className="button quiet" href={files.hardwareNotes}>
              {t('Display notes', 'Заметки об экране')} <span className="arrow">-&gt;</span>
            </a>
          </div>
        </Chapter>
      </DocBody>
    </>
  )
}
