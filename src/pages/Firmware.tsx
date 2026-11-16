import { Chapter, Code, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, InstallDiagram, LayersDiagram } from '../components/Diagrams'
import { Screen } from '../components/Pictures'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'scenes', title: 'Scenes and navigation' },
  { id: 'delivery', title: 'Data delivery' },
  { id: 'display', title: 'Display' },
  { id: 'events', title: 'Events and priorities' },
  { id: 'storage', title: 'Flash and storage' },
  { id: 'memory', title: 'Memory' },
  { id: 'network', title: 'Network and updates' },
  { id: 'catalogs', title: 'Catalogs' },
  { id: 'web', title: 'Web page and API' },
  { id: 'power', title: 'Power' },
  { id: 'security', title: 'Security' },
]

const [
  overview,
  architecture,
  scenes,
  delivery,
  display,
  events,
  storage,
  memory,
  network,
  catalogs,
  web,
  power,
  security,
] = CHAPTERS

export function Firmware() {
  return (
    <>
      <PageHead eyebrow="Firmware" title="Firmware architecture">
        How the firmware runs apps, gets their data and draws the screen.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              ['Platform', 'ESP-IDF 5.5, C11, FreeRTOS, on the ESP32-C6'],
              ['Applications', 'WebAssembly in wasm3 v0.9.0, one instance at a time'],
              ['System applications', 'Settings, About, Setup: built with the SDK, included in the image'],
              ['Network', 'Wi-Fi 6, HTTP and HTTPS with the browser root certificate set, mDNS'],
              ['Updates', 'OTA to the inactive slot, with rollback'],
              ['Fonts', 'Departure Mono and Jersey, bitmap, user-selectable. Glyph packs: Latin, Cyrillic, Greek'],
              ['Languages', 'English and Russian: system UI and official applications'],
            ]}
          />
        </Chapter>

        <Chapter chapter={architecture}>
          <LayersDiagram />
          <Table
            head={['Layer', 'Source', 'Function']}
            rows={[
              ['Drivers', 'components/epd, input, board', 'Panel, buttons, antenna switch'],
              ['Display service', 'components/epd', 'Front buffer; selects partial or full refresh, or none'],
              ['Graphics', 'components/gfx', 'Drawing on a frame or a clipped viewport'],
              ['Window manager', 'components/ui', 'Scene stack, focus, header'],
              ['Scenes', 'main, components/appsys', 'Model and view behind one interface: enter, leave, button, draw'],
              ['Services', 'main, components/net', 'Settings, Wi-Fi, clock, poller, web server'],
            ]}
          />
        </Chapter>

        <Chapter chapter={scenes}>
          <p>
            A scene owns the screen and the buttons. The menu, each application and each system dialog are scenes.
            Navigation is a stack: a new scene is pushed on top, BACK pops it, a long press on BACK clears the stack
            and shows the menu.
          </p>
          <ul>
            <li>
              Only the top scene is loaded. An application that leaves the screen is unloaded and restores its state
              from its store.
            </li>
            <li>
              Applications do not control refresh. They request a redraw; the host calls <code>app_on_draw()</code>,
              compares the frame with the panel and selects the refresh mode.
            </li>
            <li>
              The header shows Wi-Fi state and the date or time. Applications can set header text, and a status icon
              that persists in the background (used by the timer).
            </li>
            <li>
              Notices use the full screen: confirmations, errors, progress, and notifications sent by applications.
            </li>
          </ul>
          <div className="grid two">
            <Screen name="menu" alt="Menu" caption="Menu" />
            <Screen name="about" alt="The About application" caption="About, a system application" />
          </div>
        </Chapter>

        <Chapter chapter={delivery}>
          <p>
            Polls are declared in the manifest and scheduled by the host; requests are issued by application code. One
            request is in flight at a time for the whole device; applications are served in turn.
          </p>
          <DeliveryDiagram />
          <h3>Polls</h3>
          <ul>
            <li>Up to 4 per manifest, every 10 s to 1 day, or at an interval set by the user.</li>
            <li>
              <code>{'{{key}}'}</code> in a URL or header is replaced with the stored setting. A poll with{' '}
              <code>each</code> issues one request per item of a list setting.
            </li>
            <li>In power saving mode, intervals are at least 5 minutes and the radio is enabled only for polls.</li>
          </ul>
          <h3>Responses</h3>
          <ul>
            <li>
              With <code>pick</code>, the host parses the JSON and calls <code>app_on_values()</code> once with the
              selected values. <code>[*]</code> selects every element of an array.
            </li>
            <li>
              Without <code>pick</code>, the response is streamed in 1 KB chunks to <code>app_on_data()</code>, up to
              4 MB.
            </li>
            <li>
              A failed request is reported once with the cause: no network, no response, timeout, host not allowed,
              untrusted certificate, too large, out of memory.
            </li>
          </ul>
          <h3>Background delivery</h3>
          <p>
            An application that is not on screen is loaded to receive its data and unloaded afterwards; the previous
            scene is restored without a redraw. <code>request_focus()</code> during delivery requests the screen; focus
            requests are rate-limited.
          </p>
          <h3>Trust</h3>
          <p>
            HTTPS is verified against the browser root certificate set built into the firmware. An application may
            include up to two additional root certificates, trusted for its own requests only. Requests and redirects
            are limited to the hosts in the manifest.
          </p>
        </Chapter>

        <Chapter chapter={display}>
          <p>
            Waveshare 4.2" V2 panel (SSD1683), driven with Waveshare's reference command sequence over bit-banged SPI
            with per-byte chip select.
          </p>
          <Table
            head={['Refresh', 'Duration', 'Used for']}
            rows={[
              ['Partial, region', 'from 0.45 s', 'Button input, data updates'],
              ['Partial, full frame', '0.53 s', 'New content in the same scene'],
              ['Full', '2.7 s; 2.2 s in fast mode', 'Scene change, every 5 partial refreshes, daily'],
            ]}
          />
          <ul>
            <li>Double buffering: frames are composed in a back buffer; only the changed region is sent.</li>
            <li>Data-driven updates: at most once per 60 s. Button input: immediate.</li>
            <li>Deep sleep after each full refresh and 1.5 s after a partial refresh.</li>
            <li>Policy parameters are user settings.</li>
          </ul>
        </Chapter>

        <Chapter chapter={events}>
          <p>
            A single host loop runs scenes and application handlers. Other tasks post requests to its queue and wait for
            completion, so host code never runs concurrently. Button events have a separate queue with priority.
          </p>
          <Table
            head={['Tier', 'Tasks', 'Priority']}
            rows={[
              ['Radio and network', 'Wi-Fi, timers, TCP/IP', '18-23'],
              ['Input', 'Buttons', '10'],
              ['The screen', 'The host loop', '6'],
              ['Servers', 'Web server, Wi-Fi plan', '5'],
              ['Background', 'Poller, OTA probation, captive DNS', '4'],
              ['The rest', 'Development console, mDNS, idle', '0-2'],
            ]}
          />
          <p>
            All deadlines (timers, alarms, polls, panel sleep, Wi-Fi retries) are kept in one table driven by a single
            timer. Handlers are limited to 3 s; an application that exceeds the limit is stopped.
          </p>
        </Chapter>

        <Chapter chapter={storage}>
          <FlashDiagram />
          <Table
            head={['Partition', 'Size', 'Contents']}
            rows={[
              ['ota_0, ota_1', '1.44 MB each', 'Active firmware and OTA target'],
              ['appcode', '320 KB', 'Application modules, executed in place'],
              ['apps', '640 KB', 'LittleFS: manifests, translations, application files'],
              ['appkv', '56 KB', 'NVS: application key-value stores'],
              ['nvs', '24 KB', 'NVS: system settings'],
              ['glyphs', '64 KB', 'Non-ASCII glyph packs'],
            ]}
          />
          <h3>Guaranteed resources</h3>
          <ul>
            <li>2 KB key-value store per application, settings included, reserved on install.</li>
            <li>32 KB of files for applications with <code>"writes_files": true</code>. Read-only packages: up to 64 KB.</li>
            <li>
              Up to 24 applications. Installation checks free space for the store, the code (contiguous 4 KB sectors) and
              the files, including space reserved for other applications.
            </li>
            <li>Stores of removed applications are kept until the space is needed.</li>
          </ul>
        </Chapter>

        <Chapter chapter={memory}>
          <Facts
            rows={[
              ['SRAM', '512 KB, no PSRAM'],
              ['Application area', '128 KB, allocated at boot: 64 KB page and interpreter'],
              ['Two frames', '15 KB each'],
              ['Free heap, idle', 'About 80-100 KB with Wi-Fi up'],
              ['TLS session', 'About 50 KB while open'],
            ]}
          />
          <p>
            Applications run in a dedicated area that is reset on unload and cannot exhaust the host heap. Host
            operations check free memory first (60 KB for a network request, 24 KB for a web response); on a critical
            shortage the host restarts cleanly.
          </p>
        </Chapter>

        <Chapter chapter={network}>
          <ul>
            <li>
              Without stored credentials: open access point with a captive portal; the setup screen shows a QR code to
              join it.
            </li>
            <li>
              Reconnect backoff: 2, 4, 8 ... 30 s. After 2 minutes without a connection the setup access point is
              enabled again.
            </li>
            <li>Time via SNTP in the configured time zone. mDNS hostname.</li>
            <li>
              OTA updates are written to the inactive slot. The new image is confirmed only if the device is reachable
              again within 3 minutes; otherwise the bootloader rolls back.
            </li>
            <li>Firmware update, factory reset and network change require confirmation on the device.</li>
          </ul>
          <Code label="shell">{`curl --data-binary @firmware/build/perinkpheral.bin http://<address>/api/ota`}</Code>
        </Chapter>

        <Chapter chapter={catalogs}>
          <InstallDiagram />
          <p>
            A catalog is a static folder with an index file. The device uses the official catalog and up to three
            additional ones. Installation does not require a restart: the host reloads the application list and moves
            the new code to flash.
          </p>
        </Chapter>

        <Chapter chapter={web}>
          <p>
            The device serves a single gzip-compressed page (applications, settings, catalogs, status, log, firmware
            update) backed by a JSON API.
          </p>
          <Table
            head={['Endpoint', 'Description']}
            rows={[
              [<code>GET /api/status</code>, 'Name, firmware, network, memory, storage, last fault'],
              [<code>GET /api/apps</code>, 'Installed applications with their settings'],
              [<code>POST /api/apps/install</code>, 'Install from a catalog'],
              [<code>POST /api/apps/settings</code>, 'Application settings'],
              [<code>GET, POST /api/settings</code>, 'System settings'],
              [<code>GET /api/log</code>, 'Last 4 KB of the log'],
              [<code>POST /api/ota</code>, 'Firmware upload'],
              [<code>/api/dev/*</code>, 'Development builds: screen, input, uploads'],
            ]}
          />
        </Chapter>

        <Chapter chapter={power}>
          <Table
            head={['Profile', 'Behavior']}
            rows={[
              ['Disabled', 'Wi-Fi always on, web UI always available'],
              ['Always', 'Light sleep between polls; Wi-Fi on for polls; web UI for 2 minutes after a button press'],
              ['Auto', 'Power saving when no USB host is connected'],
            ]}
          />
          <p className="dim">Light sleep current has not been measured; no battery life figures are given.</p>
        </Chapter>

        <Chapter chapter={security}>
          <p>
            Designed for a trusted home network. Cross-site browser requests are rejected; irreversible actions require
            confirmation on the device; applications are sandboxed and limited to declared hosts. Details and known
            limitations: <a href={files.security}>SECURITY.md</a>.
          </p>
          <p>
            Source: <a href={repo.firmware}>{repo.firmware.replace('https://', '')}</a>.
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
