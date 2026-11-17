<img src="public/favicon.svg" width="96" alt="The perINKpheral mark: two corners of an empty frame">

# perINKpheral developer portal

Source for [perinkpheral.dev](https://perinkpheral.dev), the perINKpheral site
in English and Russian. Includes documentation and the browser flasher.

[Getting started](https://perinkpheral.dev/start) -
[Hardware](https://perinkpheral.dev/hardware) -
[Web flasher](https://perinkpheral.dev/flash) -
[Firmware](https://perinkpheral.dev/firmware) -
[Developer documentation](https://perinkpheral.dev/sdk).
Application guide (PDF):
[English](https://raw.githubusercontent.com/GrakovNe/perinkpheral/main/docs/guide/perinkpheral-app-guide.pdf),
[Russian](https://raw.githubusercontent.com/GrakovNe/perinkpheral/main/docs/guide/perinkpheral-app-guide.ru.pdf).

## Development

Requires Node.js `^20.19.0 || >=22.12.0`.

```sh
npm ci
npm run dev
npm run check
npm run build
```

The development server uses `http://localhost:5173`. The build writes static
pages for both languages to `dist/`.

CI checks and builds every push. Each successful push to `main` publishes
the site to GitHub Pages and creates a release.

## Repository

- `src/pages/` - page content; `src/content/` - navigation, metadata and external links.
- `src/components/` - shared interface components.
- `public/` - images, domain configuration and font licenses.
- `scripts/` - page prerendering and image preparation.

## License

[MIT](LICENSE). Departure Mono and Jersey use SIL OFL 1.1:
[Departure Mono](public/licenses/OFL-DepartureMono.txt),
[Jersey](public/licenses/OFL-Jersey.txt).
