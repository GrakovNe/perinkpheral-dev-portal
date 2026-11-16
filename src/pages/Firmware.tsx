import { Chapter, Code, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { DeliveryDiagram, FlashDiagram, InstallDiagram, LayersDiagram } from '../components/Diagrams'
import { Screen } from '../components/Pictures'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'scenes', title: 'Scenes and the screen' },
  { id: 'delivery', title: 'Data delivery' },
  { id: 'display', title: 'The panel' },
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
      <PageHead eyebrow="Firmware" title="How the host works">
        A small, unchanging host in C on ESP-IDF, and everything else in applications. This page describes the
        layers of the host, the way data reaches an application, how the panel is refreshed and where things are kept.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              ['Platform', 'ESP-IDF 5.5, C11, FreeRTOS, on the ESP32-C6'],
              ['Applications', 'WebAssembly in wasm3 v0.9.0, one instance at a time'],
              ['System applications', 'Settings, About and Setup: built with the same SDK, part of the image'],
              ['Network', 'Wi-Fi 6, HTTP and HTTPS with the browsers’ root certificates, mDNS'],
              ['Updates', 'Over the network into the second slot, with rollback'],
              ['Fonts', 'Departure Mono and Jersey, bitmap, user-selectable; glyph packs for Latin, Cyrillic and Greek'],
              ['Languages', 'English and Russian: the host’s words and every official application'],
            ]}
          />
          <p>
            The architecture follows Pebble: the host gives the screen, the buttons, the network and storage to
            applications that are installed from catalogs without reflashing. The host stays small so that the
            interesting part can live in applications.
          </p>
        </Chapter>

        <Chapter chapter={architecture}>
          <LayersDiagram />
          <Table
            head={['Layer', 'Where', 'What it does']}
            rows={[
              ['Drivers', 'components/epd, input, board', 'The panel, the buttons, the antenna switch'],
              ['Display service', 'components/epd', 'Keeps the frame on the panel; refreshes it, or leaves it alone'],
              ['Graphics', 'components/gfx', 'Draws on a surface: the whole frame or a viewport into it'],
              ['Window manager', 'components/ui', 'Which scene has the screen; the header; the stack of scenes'],
              ['Scenes', 'main, components/appsys', 'A model and a view behind one interface: enter, leave, button, draw'],
              ['Services', 'main, components/net', 'Settings, Wi-Fi, the clock, the poller, the web server'],
            ]}
          />
          <p>
            Logic that does not need hardware is pure and tested on the computer: the refresh policy, the window manager,
            the manifest parser, the request queue, the deadlines, the Wi-Fi plan. The simulator is built from the same
            sources.
          </p>
        </Chapter>

        <Chapter chapter={scenes}>
          <p>
            A scene owns the screen and the buttons. The menu is a scene; so is every application and every question of
            the host. Moving about is a stack: what takes the screen goes on top, BACK is one step down, a long press on
            BACK empties the stack and shows the menu.
          </p>
          <ul>
            <li>
              Only the top of the stack is loaded. An application that leaves the screen is unloaded; it comes back from
              what it stored.
            </li>
            <li>
              An application never refreshes the panel. It asks for a redraw; the host calls <code>app_on_draw()</code>,
              compares the frame with the panel and decides how to refresh.
            </li>
            <li>
              The header is the host's: the Wi-Fi state on the left, the date or time on the right. An application may
              put its own text in both, and keep an icon there while it is away, as the timer does.
            </li>
            <li>
              Notices take the whole screen: questions, errors, work in progress, and notifications an application sends
              from anywhere.
            </li>
          </ul>
          <div className="grid two">
            <Screen name="menu" alt="The host's menu" caption="The menu: a scene like any other" />
            <Screen name="about" alt="The About application" caption="About: a system application" />
          </div>
        </Chapter>

        <Chapter chapter={delivery}>
          <p>
            Applications do not hold connections. They describe what they want, and the host fetches it: polls from the
            manifest at their pace, requests from the code when they are made. One request is in the network at a time
            for the whole device; applications take turns.
          </p>
          <DeliveryDiagram />
          <h3>Polls</h3>
          <ul>
            <li>Up to four in a manifest, every 10 seconds to a day, or at a pace the user chooses in a setting.</li>
            <li>
              <code>{'{{key}}'}</code> in a URL or a header is replaced with the stored setting. A poll with{' '}
              <code>each</code> is one request for every item of a list setting.
            </li>
            <li>On a battery, polls are rounded up to five minutes and the radio is up only for them.</li>
          </ul>
          <h3>Answers</h3>
          <ul>
            <li>
              With <code>pick</code>, the host reads the JSON, picks the paths and calls <code>app_on_values()</code> once.
              The application never parses JSON. <code>[*]</code> takes every element of an array.
            </li>
            <li>
              Without it, the answer arrives in 1 KB pieces through <code>app_on_data()</code>, as it comes, up to 4 MB.
            </li>
            <li>
              A failed request is one call that says why: no network, no answer, timeout, a host not allowed, a
              certificate not trusted, too large, no memory.
            </li>
          </ul>
          <h3>Off the screen</h3>
          <p>
            An application that is not on the screen is loaded for its data and unloaded after it; the scene that was on
            the screen comes back as it was, without a redraw. <code>request_focus()</code> during the delivery asks to
            stay on the screen; the host limits how often an application may take it.
          </p>
          <h3>Trust</h3>
          <p>
            HTTPS is verified against the full set of the browsers' root certificates in the firmware. An application may
            bring up to two root certificates of its own, trusted for its own requests only. Requests go only to the
            hosts of the manifest, and redirects stay inside them.
          </p>
        </Chapter>

        <Chapter chapter={display}>
          <p>
            The panel is a Waveshare 4.2" V2 on an SSD1683, driven with Waveshare's own command sequence. Bytes are
            clocked out by hand over GPIO with chip select per byte.
          </p>
          <Table
            head={['Refresh', 'Time', 'When']}
            rows={[
              ['Partial, a window', 'from 0.45 s', 'A button press, a change of data'],
              ['Partial, whole frame', '0.53 s', 'A new picture in the same scene'],
              ['Full', '2.7 s, or 2.2 s fast', 'A new scene, after 5 partial ones, once a day'],
            ]}
          />
          <ul>
            <li>Two frames: the host draws into a back buffer and sends only the window that changed.</li>
            <li>Changes driven by data are shown at most once a minute; a press is shown at once.</li>
            <li>The panel goes to deep sleep after every full refresh and 1.5 s after a partial one.</li>
            <li>The numbers of the policy are user settings.</li>
          </ul>
        </Chapter>

        <Chapter chapter={events}>
          <p>
            One host loop runs the scenes and the applications' handlers. Other tasks post into its queue and wait for
            the answer, so nothing in the host runs at the same time as anything else. Presses have a queue of their own
            and are taken first.
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
            Every deadline - timers, alarms, polls, the panel's sleep, Wi-Fi retries - lives in one table with one timer
            set for the nearest. A handler has 3 seconds; one that runs longer is stopped, and the application with it.
          </p>
        </Chapter>

        <Chapter chapter={storage}>
          <FlashDiagram />
          <Table
            head={['Partition', 'Size', 'Holds']}
            rows={[
              ['ota_0, ota_1', '1.44 MB each', 'The firmware and the update that comes next'],
              ['appcode', '320 KB', 'Modules of installed applications, run from flash in place'],
              ['apps', '640 KB', 'LittleFS: manifests, translations, files of applications'],
              ['appkv', '56 KB', 'NVS: the stores of applications'],
              ['nvs', '24 KB', 'NVS: the host’s settings'],
              ['glyphs', '64 KB', 'Glyph packs beyond ASCII, added from the page'],
            ]}
          />
          <h3>What an application is promised</h3>
          <ul>
            <li>A store of 2 KB, settings included, from the moment it is installed.</li>
            <li>32 KB of files, if its manifest says it writes them. One that only reads brings up to 64 KB.</li>
            <li>
              A device holds up to 24 applications. An install looks at the room when it comes: the store, the code in
              one piece of whole sectors, the files beside what is promised to others.
            </li>
            <li>A removed application keeps its store, settings included, until the room is needed.</li>
          </ul>
        </Chapter>

        <Chapter chapter={memory}>
          <Facts
            rows={[
              ['SRAM', '512 KB, no PSRAM'],
              ['Application area', '128 KB taken at start: the 64 KB page and the interpreter'],
              ['Two frames', '15 KB each'],
              ['Free heap, idle', 'About 80-100 KB with Wi-Fi up'],
              ['A TLS session', 'About 50 KB while it lasts'],
            ]}
          />
          <p>
            An application cannot run the host out of memory: it has its own area, reset whenever it is unloaded. The
            host's own work asks first - a request needs 60 KB free, an answer of the web server 24 KB - and a host that
            runs critically short restarts in an orderly way.
          </p>
        </Chapter>

        <Chapter chapter={network}>
          <ul>
            <li>
              A device with no network puts up an open access point and a captive portal; a QR code on its screen joins a
              phone to it.
            </li>
            <li>
              A lost connection is retried at 2, 4, 8 and up to 30 seconds. After two minutes without success the setup
              access point comes back beside it.
            </li>
            <li>Time from SNTP, in the user's time zone. The device answers to its name over mDNS.</li>
            <li>
              Firmware updates are written into the spare slot. The new image is kept only if the device comes back
              reachable within three minutes; otherwise the bootloader returns to the old one.
            </li>
            <li>An update, a factory reset and a change of network are confirmed with a button on the device.</li>
          </ul>
          <Code label="shell">{`curl --data-binary @firmware/build/perinkpheral.bin http://<address>/api/ota`}</Code>
        </Chapter>

        <Chapter chapter={catalogs}>
          <InstallDiagram />
          <p>
            A catalog is a folder of static files with an index, the way a Debian repository is. The device knows the
            official one and up to three more. Nothing restarts on an install: the host reads the list of applications
            anew and moves the new code into flash.
          </p>
        </Chapter>

        <Chapter chapter={web}>
          <p>
            The device serves one page, packed with gzip: applications and their settings, the catalogs, the device's
            state and log, firmware, settings. Behind it is a JSON API.
          </p>
          <Table
            head={['Endpoint', 'What']}
            rows={[
              [<code>GET /api/status</code>, 'Name, firmware, network, memory, storage, the last fault'],
              [<code>GET /api/apps</code>, 'Installed applications with their settings'],
              [<code>POST /api/apps/install</code>, 'Install from a catalog'],
              [<code>POST /api/apps/settings</code>, 'Save the settings of an application'],
              [<code>GET, POST /api/settings</code>, 'The host’s settings'],
              [<code>GET /api/log</code>, 'The last 4 KB of the log'],
              [<code>POST /api/ota</code>, 'A firmware image'],
              [<code>/api/dev/*</code>, 'Development builds: the screen, presses, uploads'],
            ]}
          />
        </Chapter>

        <Chapter chapter={power}>
          <Table
            head={['Profile', 'Behaviour']}
            rows={[
              ['Disabled', 'Wi-Fi always on, the page always reachable'],
              ['Always', 'Light sleep between polls; Wi-Fi up for a poll; the page for two minutes after a press'],
              ['Auto', 'Saves whenever no computer is on the USB cable'],
            ]}
          />
          <p className="dim">The current in light sleep has not been measured yet; battery life is not stated.</p>
        </Chapter>

        <Chapter chapter={security}>
          <p>
            The device is meant for a home network. Requests from other sites through a browser are refused; what cannot
            be undone is confirmed on the device itself; applications run in a sandbox and reach only the hosts they
            declare. The details, and what is not defended, are in <a href={files.security}>SECURITY.md</a>.
          </p>
          <p>
            Source: <a href={repo.firmware}>{repo.firmware.replace('https://', '')}</a>.
          </p>
        </Chapter>
      </DocBody>
    </>
  )
}
