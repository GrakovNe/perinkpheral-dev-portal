import { Facts, PageHead, Table } from '../components/Doc'
import { author, files, repo } from '../content/links'

const BASE = import.meta.env.BASE_URL

export function Credits() {
  return (
    <>
      <PageHead eyebrow="Credits" title="Credits and licenses">
        perINKpheral is open under the MIT License. It is built on the work of others, listed here with their licenses.
      </PageHead>
      <div className="wrap page-body single">
        <div className="doc">
          <section>
            <h2>The project</h2>
            <Facts
              rows={[
                ['Author', author.name],
                ['License', <a href={files.license}>MIT</a>],
                ['Firmware, SDK, hardware', <a href={repo.firmware}>perinkpheral</a>],
                ['Applications', <a href={repo.apps}>perinkpheral-apps</a>],
              ]}
            />
          </section>

          <section>
            <h2>In the firmware</h2>
            <Table
              head={['Component', 'Author', 'License']}
              rows={[
                [<a href="https://github.com/espressif/esp-idf">ESP-IDF</a>, 'Espressif Systems', 'Apache License 2.0'],
                [<a href="https://github.com/wasm3/wasm3">Wasm3</a>, 'Steven Massey, Volodymyr Shymanskyy', 'MIT'],
                [<a href="https://github.com/Mbed-TLS/mbedtls">Mbed TLS</a>, 'The Mbed TLS Contributors', 'Apache License 2.0'],
                [<a href="https://github.com/littlefs-project/littlefs">LittleFS</a>, 'Arm Limited', 'BSD 3-Clause'],
                [<a href="https://github.com/joltwallet/esp_littlefs">esp_littlefs</a>, 'Brian Pugh', 'MIT'],
                [<a href="https://github.com/espressif/esp-protocols">mDNS</a>, 'Espressif Systems', 'Apache License 2.0'],
                [<a href="https://github.com/nayuki/QR-Code-generator">QR Code generator</a>, 'Project Nayuki', 'MIT'],
              ]}
            />
          </section>

          <section>
            <h2>Typefaces</h2>
            <Table
              head={['Typeface', 'Author', 'License']}
              rows={[
                [
                  <a href="https://github.com/rektdeckard/departure-mono">Departure Mono</a>,
                  'Helena Zhang',
                  <a href={`${BASE}licenses/OFL-DepartureMono.txt`}>SIL Open Font License 1.1</a>,
                ],
                [
                  <a href="https://github.com/scfried/soft-type-jersey">Jersey</a>,
                  'The Soft Type Project Authors; Cyrillic added',
                  'SIL Open Font License 1.1',
                ],
              ]}
            />
            <p className="dim">Departure Mono is the face of the device and of this portal.</p>
          </section>

          <section>
            <h2>Hardware</h2>
            <Table
              head={['Part', 'Maker']}
              rows={[
                ['XIAO ESP32-C6', 'Seeed Studio'],
                ['4.2inch e-Paper Module V2', 'Waveshare'],
                ['FPC Antenna A-01', 'Seeed Studio'],
              ]}
            />
            <p className="dim">
              The display driver follows Waveshare's reference code; GxEPD2 by Jean-Marc Zingg was a reference for the
              same panel.
            </p>
          </section>

          <section>
            <h2>Data sources of the official applications</h2>
            <Table
              head={['Source', 'Used by']}
              rows={[
                [<a href="https://open-meteo.com">Open-Meteo</a>, 'weather'],
                [<a href="https://finance.yahoo.com">Yahoo Finance</a>, 'stocks'],
                [<a href="https://www.moex.com">Moscow Exchange</a>, 'stocks'],
                [<a href="https://spbexchange.ru">SPB Exchange</a>, 'stocks'],
                [<a href="https://photon.komoot.io">Photon</a>, 'the device page: search of places'],
                [<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, 'place data behind Photon, ODbL'],
              ]}
            />
            <p className="dim">
              sun computes sunrise and sunset with the NOAA solar equations and the moon with the methods of Jean
              Meeus, Astronomical Algorithms.
            </p>
          </section>

          <section>
            <h2>Tools</h2>
            <Table
              head={['Tool', 'Use']}
              rows={[
                [<a href="https://github.com/WebAssembly/wasi-sdk">wasi-sdk</a>, 'Compiler of applications'],
                [<a href="https://kotlinlang.org">Kotlin</a>, 'The SDK tools and the CLion plugin'],
                [<a href="https://www.blender.org">Blender</a>, 'Renders of the case'],
                [<a href="https://www.autodesk.com/products/fusion-360">Fusion</a>, 'The model of the case'],
                [<a href="https://react.dev">React</a>, 'This portal, with Vite and Sass'],
              ]}
            />
          </section>

          <section>
            <h2>Inspiration</h2>
            <p>
              Pebble, for applications on a small host with buttons and a companion page.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
