<img src="public/favicon.svg" width="96" alt="The perINKpheral mark: two corners of an empty frame">

# perINKpheral developer portal

Source for [perinkpheral.dev](https://perinkpheral.dev), the perINKpheral site
in English and Russian. Includes documentation and the browser flasher.

[Getting started](https://perinkpheral.dev/start) -
[Hardware](https://perinkpheral.dev/hardware) -
[Web flasher](https://perinkpheral.dev/flash) -
[Device setup](https://perinkpheral.dev/setup) -
[Firmware](https://perinkpheral.dev/firmware) -
[Developer documentation](https://perinkpheral.dev/sdk).
Application guide (PDF):
[English](https://github.com/GrakovNe/perinkpheral/releases/latest/download/perinkpheral-app-guide.pdf),
[Russian](https://github.com/GrakovNe/perinkpheral/releases/latest/download/perinkpheral-app-guide.ru.pdf).

## Development

Requires Node.js 22.12 or later. CI uses Node.js 22; tests use its built-in TypeScript stripping.

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
- `src/components/` - shared interface components, including the guide's lower navigation.
- `public/` - images, domain configuration and font licenses.
- `scripts/` - page prerendering and image preparation.

The setup path is Start → Hardware → Flash → Device setup. Hardware owns assembly
instructions, Flash owns USB installation, and Device setup owns Wi-Fi and app
installation. Start is an overview. Keep a detailed instruction in its owning page
and link to it from the others. Update both languages, `src/content/pages.ts` and
internal anchors when moving a section.

## Sources and generated files

- [Firmware and SDK](https://github.com/GrakovNe/perinkpheral) own device behavior,
  recovery, API references, guide PDFs and release files. The flasher reads that
  repository's Pages index directly.
- [Applications](https://github.com/GrakovNe/perinkpheral-apps) own the catalog and
  app screenshots used as source material.
- [CLion plugin](https://github.com/GrakovNe/perinkpheral-clion-plugin) and
  [Home Assistant integration](https://github.com/GrakovNe/perinkpheral-hacs) own
  their integration instructions.

`npm run build` generates `dist/` and a temporary `dist-ssr/`; neither is committed.
`public/renders/` contains optimized source assets for this site. To rebuild them,
run `scripts/images.sh <original-render-folder>` with ffmpeg and cwebp installed;
the original PNGs are kept locally under the firmware repository's `hardware/render/`.

## License

[MIT](LICENSE). Departure Mono and Jersey use SIL OFL 1.1:
[Departure Mono](public/licenses/OFL-DepartureMono.txt),
[Jersey](public/licenses/OFL-Jersey.txt).
