// The sections of the portal, in the order the bar and the footer list
// them. Flash and Credits are the footer's only.
export const PAGES = [
  { to: '/start', en: 'Getting started', ru: 'Начало работы', inBar: true },
  { to: '/flash', en: 'Flash', ru: 'Прошивка', inBar: false },
  { to: '/hardware', en: 'Hardware', ru: 'Hardware', inBar: true },
  { to: '/firmware', en: 'Firmware', ru: 'Firmware', inBar: true },
  { to: '/sdk', en: 'SDK', ru: 'SDK', inBar: true },
  { to: '/contacts', en: 'Contacts', ru: 'Контакты', inBar: true },
  { to: '/credits', en: 'Credits', ru: 'Лицензии', inBar: false },
]

// What a page is called in a tab and described as to search engines and to
// the previews of links: by its address with no language in it.
export const DESCRIPTIONS: Record<string, { en: string; ru: string }> = {
  '/': {
    en: 'An open desk E-Ink display on an ESP32-C6, with four buttons and apps: weather, calendar, stocks, Home Assistant and more.',
    ru: 'Открытый настольный E-Ink экран на ESP32-C6 с четырьмя кнопками и приложениями: погода, календарь, акции, Home Assistant и не только.',
  },
  '/start': {
    en: 'From parts to a screen with apps: build it, flash it, connect it to Wi-Fi, install apps.',
    ru: 'От деталей до экрана с приложениями: собрать, прошить, подключить к Wi-Fi, установить приложения.',
  },
  '/flash': {
    en: 'The first flash of perINKpheral from a browser: the board on a USB-C cable, Chrome or Edge, one button.',
    ru: 'Первая прошивка perINKpheral из браузера: плата на кабеле USB-C, Chrome или Edge, одна кнопка.',
  },
  '/hardware': {
    en: 'The parts, the printed case, the wiring, the assembly and the first flash of the perINKpheral display.',
    ru: 'Детали, корпус, схема сборки, сборка и первая прошивка экрана perINKpheral.',
  },
  '/firmware': {
    en: 'The perINKpheral firmware: its architecture, how data reaches apps, the storage, the network and the web API.',
    ru: 'Прошивка perINKpheral: архитектура, доставка данных приложениям, хранилище, сеть и web API.',
  },
  '/sdk': {
    en: 'Apps for perINKpheral in C compiled to WebAssembly: the manifest, the handlers, data from the network, the UI kit, the limits and the tools.',
    ru: 'Приложения для perINKpheral на C с компиляцией в WebAssembly: манифест, обработчики, данные из сети, UI kit, ограничения и инструменты.',
  },
  '/contacts': {
    en: 'The author of perINKpheral and the repositories of the project.',
    ru: 'Автор perINKpheral и репозитории проекта.',
  },
  '/credits': {
    en: 'The licenses of what perINKpheral is made with: components, fonts, data sources and tools.',
    ru: 'Лицензии того, из чего сделан perINKpheral: компоненты, шрифты, источники данных и инструменты.',
  },
}

export function pageTitle(plain: string, lang: 'en' | 'ru'): string {
  if (plain === '/') {
    return 'perINKpheral'
  }
  const page = PAGES.find((one) => one.to === plain)
  return `${page ? page[lang] : lang === 'ru' ? 'Не найдено' : 'Not found'} - perINKpheral`
}
