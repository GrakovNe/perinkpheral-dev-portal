<img src="public/favicon.svg" width="96" alt="The perINKpheral mark: two corners of an empty frame">

# perINKpheral developer portal

The site about the [perINKpheral](https://github.com/GrakovNe/perinkpheral) desk e-paper display: what it is,
how to write applications for it, how to build one and how its firmware works.

https://perinkpheral.dev - in English and Russian. Pages: the landing page, Getting started, Hardware, Firmware,
SDK, Contacts, Credits.

## Development

Node 20 or later.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/
npm run check     # types and lint
```

## Hosting

GitHub Pages, at perinkpheral.dev (`public/CNAME`). The Publish workflow builds, checks and publishes the portal
when it is run by hand from the Actions tab; a push to `main` publishes nothing.

The build is static files, every page rendered into a file of its own at build time (`scripts/prerender.mjs`,
from `src/entry-server.tsx`): `sdk.html` for /sdk, `ru/sdk.html` for /ru/sdk, each with its title, description,
canonical address, the other language's address and the preview of a link (`og:*`, `public/og.jpg`). The
browser then takes the page over. Any other address is `404.html`; `sitemap.xml` and `robots.txt` are written
beside them. The addresses are made for the root of perinkpheral.dev.

The language is in the address: English at /sdk, Russian at /ru/sdk. A first visit to an English address goes on
to the Russian one when the browser asks for Russian; a language picked with the flags is remembered.

## Pictures

`public/renders` holds the renders of the case as WebP, 800 and 1600 px wide, and the front view with a screen of
the device on its panel. They are made from the original renders - 6000 x 4000 PNGs of the firmware repository's
`render` folder, which stay as they are - with ffmpeg and cwebp:

```bash
npm run images -- <folder of the original renders>
```

`public/screens` holds frames of the panel, 400 x 300 taken at twice the size, from the device and the simulator.

## Content

`src/pages` holds the pages, `src/components` what they are made of, `src/content/links.ts` every address the
portal points to. The text is English, plain and factual; a hyphen, never a dash.

## License

MIT. Departure Mono and Jersey are under the SIL Open Font License 1.1 (`public/licenses`).
