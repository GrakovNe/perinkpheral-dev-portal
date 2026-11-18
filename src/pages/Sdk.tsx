import { Chapter, Code, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { Carousel } from '../components/Pictures'
import { files, repo } from '../content/links'
import { useT } from '../i18n'

const KIT = [
  { name: 'kit-parts', en: 'Text, icons, value, bar', ru: 'Текст, иконки, значение, шкала' },
  { name: 'kit-list', en: 'List', ru: 'Список' },
  { name: 'kit-options', en: 'Options', ru: 'Варианты' },
  { name: 'stocks', en: 'Chart', ru: 'График' },
  { name: 'kit-picker', en: 'Picker', ru: 'Выбор значения' },
  { name: 'kit-date', en: 'Date and time', ru: 'Дата и время' },
  { name: 'kit-time', en: 'Time', ru: 'Время' },
  { name: 'kit-message', en: 'Message', ru: 'Сообщение' },
  { name: 'kit-question', en: 'Question', ru: 'Вопрос' },
  { name: 'kit-working', en: 'Work in progress', ru: 'Ожидание' },
]

const CHAPTERS = [
  { id: 'overview', en: 'Overview', ru: 'Обзор' },
  { id: 'start', en: 'Getting started', ru: 'Начало работы' },
  { id: 'application', en: 'Example', ru: 'Пример' },
  { id: 'manifest', en: 'The manifest', ru: 'Манифест' },
  { id: 'model', en: 'Handlers and state', ru: 'Обработчики и состояние' },
  { id: 'data', en: 'Network data', ru: 'Данные из сети' },
  { id: 'kit', en: 'Graphics and UI kit', ru: 'Графика и UI kit' },
  { id: 'limits', en: 'Limits', ru: 'Ограничения' },
  { id: 'tools', en: 'Tools', ru: 'Инструменты' },
  { id: 'clion', en: 'CLion plugin', ru: 'Плагин CLion' },
  { id: 'publishing', en: 'Publishing', ru: 'Публикация' },
  { id: 'reference', en: 'Reference', ru: 'Справка' },
]

const HELLO = `
#include "app_text.h"
#include "host_api.h"

static const char PRESSES_KEY[] = "presses";
static int32_t presses;

void app_init(void)
{
    /* Restore state: the host unloads the application
     * when it leaves the screen. */
    kv_get(PRESSES_KEY, sizeof PRESSES_KEY - 1, &presses, sizeof presses);
}

void app_on_terminate(void)
{
    kv_set(PRESSES_KEY, sizeof PRESSES_KEY - 1, &presses, sizeof presses);
}

void app_on_button(int32_t event)
{
    if (event == BTN_OK_PRESSED) {
        presses++;
        request_redraw(HOST_REDRAW_NORMAL);
    }
}

void app_on_draw(void)
{
    char line[32];
    app_text_t text;
    app_text_start(&text, line, sizeof line);
    app_text_add(&text, "Presses: ");
    app_text_add_number(&text, presses);

    gfx_text(HOST_UI_MARGIN, HOST_UI_MARGIN, HOST_FONT_TEXT, "Hello from wasm", 15);
    gfx_text(HOST_UI_MARGIN, 60, HOST_FONT_TEXT, line, app_text_length(line));
}
`

const MANIFEST = `
{
  "name": "weather",
  "title": "Weather",
  "version": "0.2.5",
  "abi": 2,
  "settings": [
    { "key": "city", "type": "place", "title": "City",
      "latitude": "lat", "longitude": "lon" },
    { "key": "lat", "type": "number", "title": "Latitude" },
    { "key": "lon", "type": "number", "title": "Longitude" },
    { "key": "every", "type": "choice", "title": "Update interval",
      "options": ["15 min", "30 min", "1 hour", "3 hours"] }
  ],
  "polls": [
    {
      "url": "https://api.open-meteo.com/v1/forecast?latitude={{lat}}&longitude={{lon}}&current=temperature_2m,weather_code",
      "every": "{{every}}",
      "pick": ["current.temperature_2m", "current.weather_code"]
    }
  ]
}
`

const VALUES = `
void app_on_values(int32_t poll, int32_t http_status)
{
    /* Values of the "pick" paths, in order. 1 decimal: tenths. */
    int32_t temperature, code;
    if (http_status == 200 &&
        app_value_number(0, 1, &temperature) &&
        app_value_number(1, 0, &code)) {
        state.temperature = temperature;
        state.code = code;
        app_state_save("state", &state, sizeof state);
        request_redraw(HOST_REDRAW_NORMAL);
    }
}
`

export function Sdk() {
  const t = useT()
  const chapters = CHAPTERS.map((one) => ({ id: one.id, title: t(one.en, one.ru) }))
  const [overview, start, application, manifest, model, data, kit, limits, tools, clion, publishing, reference] =
    chapters
  return (
    <>
      <PageHead title="SDK" />
      <DocBody chapters={chapters}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              [t('Language', 'Язык'), t('C, compiled to WebAssembly', 'C, компилируется в WebAssembly')],
              ['API', <a href={files.hostApi}>sdk/host_api.h</a>],
              [t('Memory', 'Память'), t('64 KB per app', '64 КБ на приложение')],
              [t('Numbers', 'Числа'), t('Integers only, no floating point', 'Только целые, без плавающей точки')],
              [t('Package', 'Пакет'), t('app.wasm, manifest.json, translations, pictures, files', 'app.wasm, manifest.json, переводы, картинки, файлы')],
            ]}
          />
        </Chapter>

        <Chapter chapter={start}>
          <ol className="steps">
            <li>
              <h3>{t('Install the toolchain', 'Тулчейн')}</h3>
              <p>wasi-sdk, Java, git.</p>
              <Code label="shell">{`
git clone ${repo.firmware}.git
cd perinkpheral
export WASI_SDK_PATH=$HOME/opt/wasi-sdk
tools/perinkpheral
`}</Code>
            </li>
            <li>
              <h3>{t('Create an application', 'Новое приложение')}</h3>
              <Code label="shell">{`tools/perinkpheral new ../myapp --title "My App"`}</Code>
            </li>
            <li>
              <h3>{t('Build', 'Сборка')}</h3>
              <Code label="shell">{`tools/perinkpheral build ../myapp --out ../myapp/build`}</Code>
            </li>
            <li>
              <h3>{t(t('Run in the simulator', 'Запустить в симуляторе'), 'Запуск в симуляторе')}</h3>
              <Code label="shell">{`tools/perinkpheral sim ../myapp`}</Code>
            </li>
            <li>
              <h3>{t(t('Run on the device', 'Запустить на устройстве'), 'Запуск на устройстве')}</h3>
              <Code label="shell">{`
export PERINKPHERAL_HOST=perinkpheral-xxxx.local
tools/perinkpheral run ../myapp --shot screen.png
tools/perinkpheral press 2 2 --shot pressed.png
tools/perinkpheral log --follow
`}</Code>
            </li>
          </ol>
        </Chapter>

        <Chapter chapter={application}>
          <Code label="hello.c">{HELLO}</Code>
        </Chapter>

        <Chapter chapter={manifest}>
          <Code label="manifest.json">{MANIFEST}</Code>
          <Table
            head={[t('Key', 'Ключ'), t('Meaning', 'Значение')]}
            rows={[
              [<code>name</code>, t('Unique id: 1-13 characters, a-z, 0-9, - and _', 'Уникальный id: 1-13 символов, a-z, 0-9, - и _')],
              [<code>title</code>, t('Name in the menu, up to 23 characters', 'Название в меню, до 23 символов')],
              [<code>polls</code>, t('Web requests the device makes on a schedule, up to 4', 'Запросы, которые устройство делает по расписанию, до 4')],
              [<code>hosts</code>, t('Servers the app may contact', 'Серверы, к которым приложению можно обращаться')],
              [<code>settings</code>, t('Up to 8. Types: text, secret, number, choice, toggle, place, url, link, list', 'До 8. Типы: text, secret, number, choice, toggle, place, url, link, list')],
              [<code>intents</code>, t('System events to receive: device start, clock change, network back', 'Системные события: запуск устройства, смена времени, появление сети')],
              [<code>icon</code>, t('11 x 11 pixel icon: # black, . white', 'Иконка 11 x 11 точек: # чёрный, . белый')],
              [<code>fullscreen</code>, t('Use the whole screen, without the top bar', 'Весь экран, без верхней строки')],
              [<code>writes_files</code>, t('The app saves files; 32 KB are reserved for it', 'Приложение пишет файлы; под них зарезервировано 32 КБ')],
              [<code>system</code>, t('Access to device settings, clock and apps; the user confirms on install', 'Доступ к настройкам устройства, часам и приложениям; пользователь подтверждает при установке')],
              [<code>certificates</code>, t('Certificates for servers that browsers do not trust', 'Сертификаты для серверов, которым не доверяют браузеры')],
              [<code>companion</code>, t('A web page that helps the user set the app up', 'Веб-страница, которая помогает настроить приложение')],
              [<code>firmware</code>, t('The oldest firmware the app runs on; the build works it out from the calls it makes', 'Самая старая прошивка, на которой работает приложение; сборка вычисляет её по вызовам')],
            ]}
          />
        </Chapter>

        <Chapter chapter={model}>
          <Table
            head={[t('Function', 'Функция'), t('Called when', 'Когда вызывается')]}
            rows={[
              [<code>app_init()</code>, t('The app starts', 'Приложение запускается')],
              [<code>app_on_focus() / app_on_blur()</code>, t('The app appears on screen or leaves it', 'Приложение появляется на экране или уходит с него')],
              [<code>app_on_terminate()</code>, t('The app is about to close: save state here', 'Приложение сейчас закроется: здесь сохраняют состояние')],
              [<code>app_on_button(event)</code>, t('A button is pressed, released, or held', 'Кнопку нажали, отпустили или удерживают')],
              [<code>app_on_back()</code>, t('BACK is pressed, for apps with several pages', 'Нажата BACK, для приложений с несколькими страницами')],
              [<code>app_on_draw()</code>, t('The screen needs drawing', 'Нужно нарисовать экран')],
              [<code>app_on_timer(id)</code>, t('A timer fired, while the app is on screen', 'Сработал таймер, пока приложение на экране')],
              [<code>app_on_alarm(id)</code>, t('An alarm fired, even if the app is closed', 'Сработал будильник, даже если приложение закрыто')],
              [<code>app_on_values(poll, status)</code>, t('Scheduled data arrived, already parsed', 'Пришли данные по расписанию, уже разобранные')],
              [<code>app_on_data(...)</code>, t('A piece of a response arrived', 'Пришла часть ответа')],
              [<code>app_on_settings()</code>, t('The user changed the settings', 'Пользователь изменил настройки')],
              [<code>app_on_intent(type)</code>, t('A system event the app asked for', 'Системное событие, на которое приложение подписано')],
              [<code>app_on_installed() / app_on_updated()</code>, t('First start after install or update', 'Первый запуск после установки или обновления')],
            ]}
          />
          <h3>{t('Buttons and state', 'Кнопки и состояние')}</h3>
          <Facts
            rows={[
              [t('Buttons', 'Кнопки'), t('1 up, 2 OK, 3 down, 4 back; hold BACK for the menu', '1 вверх, 2 OK, 3 вниз, 4 назад; удержание BACK открывает меню')],
              [t('Saved data', 'Сохранённые данные'), 'kv_set(), kv_get()'],
            ]}
          />
        </Chapter>

        <Chapter chapter={data}>
          <Facts
            rows={[
              [t('On a schedule', 'По расписанию'), t('Requests in the manifest', 'Запросы в манифесте')],
              [t('On demand', 'По запросу'), t('http_request() from the code', 'http_request() из кода')],
              [t('Ready values', 'Готовые значения'), t('List JSON paths in "pick": app_on_values() gets the values', 'Пути JSON в "pick": app_on_values() получает значения')],
              [t('Raw response', 'Ответ как есть'), t('Without "pick": app_on_data() gets the response piece by piece', 'Без "pick": app_on_data() получает ответ частями')],
              [t('Show on screen', 'Показать на экране'), t('request_focus() asks to open the app when its data arrives; once in 30 s', 'request_focus() просит открыть приложение, когда пришли данные; раз в 30 с')],
            ]}
          />
          <Code label="weather.c">{VALUES}</Code>
        </Chapter>

        <Chapter chapter={kit}>
          <Table
            head={[t('Part', 'Часть'), t('Functions', 'Функции')]}
            rows={[
              [t('Text in four styles', 'Текст в четырёх стилях'), 'ui_text, ui_text_lines, ui_title'],
              [t('List with scroll bar', 'Список с полосой прокрутки'), 'ui_list_row, ui_list_visible'],
              [t('Dialog: text, icon, buttons', 'Диалог: текст, иконка, кнопки'), 'ui_notice'],
              [t('Tile: name, picture, value', 'Плитка: название, картинка, значение'), 'ui_cell, ui_cell_fit'],
              [t('Chart: line, area, bars, steps', 'График: линия, область, столбцы, ступени'), 'ui_chart'],
              [t('Value with unit', 'Значение с единицей'), 'ui_value'],
              [t('Choice of a value, date and time', 'Выбор значения, даты и времени'), 'ui_picker, ui_date'],
              [t('Message while there is nothing to show', 'Сообщение, пока показывать нечего'), 'ui_reason'],
            ]}
          />
          <Carousel screens slides={KIT.map((one) => ({ name: one.name, caption: t(one.en, one.ru) }))} />
        </Chapter>

        <Chapter chapter={limits}>
          <Table
            head={[t('What', 'Что'), t('Limit', 'Предел')]}
            rows={[
              [t('App size', 'Размер приложения'), '48 KB'],
              [t('Memory', 'Память'), '64 KB'],
              [t('Time per call', 'Время на вызов'), '3 s'],
              [t('Saved data', 'Сохранённые данные'), t('2 KB, up to 1 KB per value', '2 КБ, до 1 КБ на значение')],
              [t('Files', 'Файлы'), t('64 KB in the package; 32 KB if the app writes files', '64 КБ в пакете; 32 КБ, если приложение пишет файлы')],
              [t('Scheduled requests', 'Запросы по расписанию'), t('4, every 10 s to 1 day', '4, от 10 с до суток')],
              [t('Requests waiting', 'Запросов в очереди'), t('16 an app, one at a time', '16 на приложение, по одному')],
              [t('Response size', 'Размер ответа'), t('256 KB parsed, 4 MB piece by piece', '256 КБ с разбором, 4 МБ частями')],
              [t('Settings', 'Настройки'), t('8, values up to 255 bytes', '8, значения до 255 байт')],
              [t('Timers and alarms', 'Таймеры и будильники'), t('4 and 4', '4 и 4')],
              [t('Apps on a device', 'Приложений на устройстве'), t('Up to 24, while there is space', 'До 24, пока хватает места')],
            ]}
          />
        </Chapter>

        <Chapter chapter={tools}>
          <Table
            head={[t('Command', 'Команда'), t('Description', 'Описание')]}
            rows={[
              [<code>new &lt;dir&gt;</code>, t('Start a new app', 'Новое приложение')],
              [<code>build &lt;app&gt; --out &lt;dir&gt;</code>, t('Build and check', 'Собрать и проверить')],
              [<code>sim &lt;app&gt;</code>, t('Run in the simulator', 'Запустить в симуляторе')],
              [<code>run &lt;app&gt;</code>, t('Run on the device', 'Запустить на устройстве')],
              [<code>serve [app]</code>, t('A page with the device screen, buttons and log', 'Страница с экраном устройства, кнопками и логом')],
              [<code>shot / press / open</code>, t('Screenshot, press buttons, open an app', 'Скриншот, нажатия кнопок, открыть приложение')],
              [<code>log [--follow]</code>, t('Device log', 'Лог устройства')],
              [<code>set &lt;app&gt; &lt;key&gt; &lt;value&gt;</code>, t('Change an app setting', 'Изменить настройку приложения')],
              [<code>catalog &lt;folder&gt; --out &lt;dir&gt;</code>, t('Build a catalog', 'Собрать каталог')],
              [<code>strings export / import</code>, t('Translations as a spreadsheet', 'Переводы таблицей')],
              [<code>flash [image]</code>, t('Update over Wi-Fi; press OK in recovery to confirm', 'Обновить по Wi-Fi; подтвердить кнопкой OK в recovery')],
              [<code>usb &lt;port&gt;</code>, t('Control a device over USB', 'Управлять устройством по USB')],
            ]}
          />
        </Chapter>

        <Chapter chapter={clion}>
          <Facts
            rows={[
              [t('Runs on', 'Где работает'), t('Device, simulator (macOS, Linux)', 'Устройство, симулятор (macOS, Linux)')],
              [t('Includes', 'Что умеет'), t('Toolchain setup, live device screen, manifest checks, firmware upload', 'Установка тулчейна, живой экран устройства, проверка манифеста, загрузка прошивки')],
              [t('Source', 'Исходники'), <a href={repo.clion}>perinkpheral-clion-plugin</a>],
            ]}
          />
        </Chapter>

        <Chapter chapter={publishing}>
          <Code label="shell">{`tools/perinkpheral catalog apps --out catalog`}</Code>
        </Chapter>

        <Chapter chapter={reference}>
          <div className="grid">
            <a className="panel" href={repo.firmware}>
              <h3>perinkpheral</h3>
              <p className="dim">{t('SDK, tools, firmware.', 'SDK, инструменты, прошивка.')}</p>
            </a>
            <a className="panel" href={repo.apps}>
              <h3>perinkpheral-apps</h3>
              <p className="dim">{t('Official apps and their catalog.', 'Официальные приложения и каталог.')}</p>
            </a>
            <a className="panel" href={repo.clion}>
              <h3>perinkpheral-clion-plugin</h3>
              <p className="dim">{t('CLion plugin.', 'Плагин CLion.')}</p>
            </a>
          </div>
        </Chapter>
      </DocBody>
    </>
  )
}
