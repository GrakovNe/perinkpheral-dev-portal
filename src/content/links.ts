// Where things are: the repositories, the files in them, the author.

const GITHUB = 'https://github.com/GrakovNe'

export const repo = {
  firmware: `${GITHUB}/perinkpheral`,
  apps: `${GITHUB}/perinkpheral-apps`,
  clion: `${GITHUB}/perinkpheral-clion-plugin`,
  homeAssistant: `${GITHUB}/perinkpheral-hacs`,
  portal: `${GITHUB}/perinkpheral-dev-portal`,
}

const blob = (path: string) => `${repo.firmware}/blob/main/${path}`
const raw = (path: string) => `https://raw.githubusercontent.com/GrakovNe/perinkpheral/main/${path}`

export const files = {
  hostApi: blob('sdk/host_api.h'),
  sdkLib: `${repo.firmware}/tree/main/sdk/lib`,
  hello: `${repo.firmware}/tree/main/sdk/apps/hello`,
  cmake: `${repo.firmware}/tree/main/sdk/cmake`,
  companion: blob('sdk/companion/example.html'),
  guidePdf: raw('docs/guide/perinkpheral-app-guide.pdf'),
  guidePdfRu: raw('docs/guide/perinkpheral-app-guide.ru.pdf'),
  step: raw('hardware/step/perinkpheral.step'),
  bomPage: blob('hardware/bom/index.html'),
  hardwareNotes: blob('hardware/README.md'),
  partitions: blob('firmware/partitions.csv'),
  security: blob('SECURITY.md'),
  license: blob('LICENSE'),
  releases: `${repo.firmware}/releases`,
  catalog: `${repo.apps}/tree/main/catalog`,
}

export const author = {
  name: 'Max Grakov',
  email: 'grakovne@gmail.com',
  telegram: 'maxgrakov',
  github: GITHUB,
}
