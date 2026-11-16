import { Link } from 'react-router-dom'
import { Chapter, Code, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { Screen } from '../components/Pictures'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'start', title: 'Getting started' },
  { id: 'application', title: 'Example' },
  { id: 'manifest', title: 'The manifest' },
  { id: 'model', title: 'Handlers and state' },
  { id: 'data', title: 'Network data' },
  { id: 'kit', title: 'Graphics and UI kit' },
  { id: 'limits', title: 'Limits' },
  { id: 'tools', title: 'Tools' },
  { id: 'clion', title: 'CLion plugin' },
  { id: 'publishing', title: 'Publishing' },
  { id: 'reference', title: 'Reference' },
]

const [overview, start, application, manifest, model, data, kit, limits, tools, clion, publishing, reference] =
  CHAPTERS

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
  return (
    <>
      <PageHead eyebrow="SDK" title="Application development">
        Write an app in C, test it in the simulator, run it on the device.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <Facts
            rows={[
              ['Language', 'C, compiled to WebAssembly'],
              ['API', <a href={files.hostApi}>sdk/host_api.h</a>],
              ['Memory', '64 KB per app'],
              ['Numbers', 'Integers only, no floating point'],
              ['Package', 'app.wasm, manifest.json, translations, pictures, files'],
            ]}
          />
          <div className="note">
            <p>
              The API may change before the first release; apps are then rebuilt.
            </p>
          </div>
        </Chapter>

        <Chapter chapter={start}>
          <ol className="steps">
            <li>
              <h3>Install the toolchain</h3>
              <p>
                You need wasi-sdk (the C compiler for WebAssembly), Java and git.
              </p>
              <Code label="shell">{`
git clone ${repo.firmware}.git
cd perinkpheral
export WASI_SDK_PATH=$HOME/opt/wasi-sdk
tools/perinkpheral
`}</Code>
            </li>
            <li>
              <h3>Create an application</h3>
              <p>Creates an application folder from the SDK sample.</p>
              <Code label="shell">{`tools/perinkpheral new ../myapp --title "My App"`}</Code>
            </li>
            <li>
              <h3>Build</h3>
              <p>
                Compiles and checks the app, and reports its size.
              </p>
              <Code label="shell">{`tools/perinkpheral build ../myapp --out ../myapp/build`}</Code>
            </li>
            <li>
              <h3>Run in the simulator</h3>
              <p>
                Runs the app on your computer as on the device. Screen and buttons: <code>http://127.0.0.1:8401</code>.
              </p>
              <Code label="shell">{`tools/perinkpheral sim ../myapp`}</Code>
            </li>
            <li>
              <h3>Run on the device</h3>
              <p>
                Uploads the app over Wi-Fi and opens it on the device. Needs firmware with developer tools, the
                default.
              </p>
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
          <p>
            The device calls the app's functions on events. The app changes its state and asks for a redraw; the
            screen is drawn in <code>app_on_draw()</code>.
          </p>
          <Code label="hello.c">{HELLO}</Code>
          <div className="grid two">
            <Screen name="kit-list" alt="A list drawn with the kit" caption="List" />
            <Screen name="kit-question" alt="A question drawn with the kit" caption="Question" />
          </div>
        </Chapter>

        <Chapter chapter={manifest}>
          <p>
            The manifest describes the app: its name, the servers it uses, its settings. The device's web page shows the
            settings form from it.
          </p>
          <Code label="manifest.json">{MANIFEST}</Code>
          <Table
            head={['Key', 'Meaning']}
            rows={[
              [<code>name</code>, 'Unique id: 1-13 characters, a-z, 0-9, - and _'],
              [<code>title</code>, 'Name in the menu, up to 23 characters'],
              [<code>polls</code>, 'Web requests the device makes on a schedule, up to 4'],
              [<code>hosts</code>, 'Servers the app may contact'],
              [<code>settings</code>, 'Up to 8. Types: text, secret, number, choice, toggle, place, url, link, list'],
              [<code>intents</code>, 'System events to receive: device start, clock change, network back'],
              [<code>icon</code>, '11 x 11 pixel icon: # black, . white'],
              [<code>fullscreen</code>, 'Use the whole screen, without the top bar'],
              [<code>writes_files</code>, 'The app saves files; 32 KB are reserved for it'],
              [<code>system</code>, 'Access to device settings, clock and apps; the user confirms on install'],
              [<code>certificates</code>, 'Certificates for servers that browsers do not trust'],
              [<code>companion</code>, 'A web page that helps the user set the app up'],
            ]}
          />
          <p>
            The app reads a setting with <code>kv_get()</code>. In URLs and headers, <code>{'{{key}}'}</code> is replaced
            with the setting.
          </p>
        </Chapter>

        <Chapter chapter={model}>
          <p>
            Functions the app exports; the device calls them by name. Each call must finish within 3 seconds.
          </p>
          <Table
            head={['Function', 'Called when']}
            rows={[
              [<code>app_init()</code>, 'The app starts'],
              [<code>app_on_focus() / app_on_blur()</code>, 'The app appears on screen or leaves it'],
              [<code>app_on_terminate()</code>, 'The app is about to close: save state here'],
              [<code>app_on_button(event)</code>, 'A button is pressed, released, or held'],
              [<code>app_on_back()</code>, 'BACK is pressed, for apps with several pages'],
              [<code>app_on_draw()</code>, 'The screen needs drawing'],
              [<code>app_on_timer(id)</code>, 'A timer fired, while the app is on screen'],
              [<code>app_on_alarm(id)</code>, 'An alarm fired, even if the app is closed'],
              [<code>app_on_values(poll, status)</code>, 'Scheduled data arrived, already parsed'],
              [<code>app_on_data(...)</code>, 'A piece of a response arrived'],
              [<code>app_on_settings()</code>, 'The user changed the settings'],
              [<code>app_on_intent(type)</code>, 'A system event the app asked for'],
              [<code>app_on_installed() / app_on_updated()</code>, 'First start after install or update'],
            ]}
          />
          <h3>Buttons</h3>
          <p>
            The same everywhere: <span className="kbd">1</span> up, <span className="kbd">2</span> OK,{' '}
            <span className="kbd">3</span> down, <span className="kbd">4</span> back. Holding BACK opens the menu; the
            app does not get that press.
          </p>
          <h3>State</h3>
          <p>
            An app is closed whenever it leaves the screen. Save what must survive with <code>kv_set()</code> and read
            it back with <code>kv_get()</code>. Larger data goes to files.
          </p>
        </Chapter>

        <Chapter chapter={data}>
          <p>
            The app does not connect to the network itself: it asks the device, and the device delivers the response,
            even when the app is not on screen.
          </p>
          <Facts
            rows={[
              ['On a schedule', 'Requests in the manifest'],
              ['On demand', 'http_request() from the code'],
              ['Ready values', 'List JSON paths in "pick": app_on_values() gets the values'],
              ['Raw response', 'Without "pick": app_on_data() gets the response piece by piece'],
              ['Show on screen', 'request_focus() opens the app when its data arrives'],
            ]}
          />
          <Code label="weather.c">{VALUES}</Code>
          <p>
            See <Link to="/firmware#delivery">Firmware: Data delivery</Link>.
          </p>
        </Chapter>

        <Chapter chapter={kit}>
          <p>
            Black and white graphics, two typefaces, six sizes. The UI kit has ready parts: lists, dialogs, charts.
          </p>
          <Table
            head={['Part', 'Functions']}
            rows={[
              ['Text in four styles', 'ui_text, ui_text_lines, ui_title'],
              ['List with scroll bar', 'ui_list_row, ui_list_visible'],
              ['Dialog: text, icon, buttons', 'ui_notice'],
              ['Tile: name, picture, value', 'ui_cell, ui_cell_fit'],
              ['Chart: line, area, bars, steps', 'ui_chart'],
              ['Value with unit', 'ui_value'],
              ['Choice of a value, date and time', 'ui_picker, ui_date'],
              ['Message while there is nothing to show', 'ui_reason'],
            ]}
          />
          <div className="grid two">
            <Screen name="kit-parts" alt="Text, icons, a value and a bar drawn with the kit" caption="Text, icons, value, bar" />
            <Screen name="stocks" alt="A chart in the stocks application" caption="Chart" />
          </div>
        </Chapter>

        <Chapter chapter={limits}>
          <Table
            head={['What', 'Limit']}
            rows={[
              ['App size', '48 KB'],
              ['Memory', '64 KB'],
              ['Time per call', '3 s'],
              ['Saved data', '2 KB, up to 1 KB per value'],
              ['Files', '64 KB in the package; 32 KB if the app writes files'],
              ['Scheduled requests', '4, every 10 s to 1 day'],
              ['Requests at once', '16'],
              ['Response size', '256 KB parsed, 4 MB piece by piece'],
              ['Settings', '8, values up to 255 bytes'],
              ['Timers and alarms', '4 and 4'],
              ['Apps on a device', 'Up to 24, while there is space'],
            ]}
          />
        </Chapter>

        <Chapter chapter={tools}>
          <p>
            One command line tool; <code>tools/perinkpheral</code> without arguments lists all commands.
          </p>
          <Table
            head={['Command', 'Description']}
            rows={[
              [<code>new &lt;dir&gt;</code>, 'Start a new app'],
              [<code>build &lt;app&gt; --out &lt;dir&gt;</code>, 'Build and check'],
              [<code>sim &lt;app&gt;</code>, 'Run in the simulator'],
              [<code>run &lt;app&gt;</code>, 'Run on the device'],
              [<code>serve [app]</code>, 'A page with the device screen, buttons and log'],
              [<code>shot / press / open</code>, 'Screenshot, press buttons, open an app'],
              [<code>log [--follow]</code>, 'Device log'],
              [<code>set &lt;app&gt; &lt;key&gt; &lt;value&gt;</code>, 'Change an app setting'],
              [<code>catalog &lt;folder&gt; --out &lt;dir&gt;</code>, 'Build a catalog'],
              [<code>strings export / import</code>, 'Translations as a spreadsheet'],
              [<code>flash [image]</code>, 'Update the firmware over Wi-Fi'],
              [<code>usb &lt;port&gt;</code>, 'Control a device over USB'],
            ]}
          />
        </Chapter>

        <Chapter chapter={clion}>
          <p>
            Build and run apps from CLion, on the device or in the simulator.
          </p>
          <ul>
            <li>Toolchain setup in one step.</li>
            <li>Live device screen in a tool window.</li>
            <li>Manifest completion and checks.</li>
            <li>Firmware upload over Wi-Fi or USB.</li>
          </ul>
          <p>
            Simulator: macOS and Linux. Source:{' '}
            <a href={repo.clion}>perinkpheral-clion-plugin</a>.
          </p>
        </Chapter>

        <Chapter chapter={publishing}>
          <p>
            Apps are published in catalogs: a folder of files on any web server with HTTPS. Users add the catalog's
            address on the device's web page.
          </p>
          <Code label="shell">{`tools/perinkpheral catalog apps --out catalog`}</Code>
          <p>
            Official catalog: <a href={repo.apps}>perinkpheral-apps</a>. Translations: one JSON file per language in{' '}
            <code>strings/</code>.
          </p>
        </Chapter>

        <Chapter chapter={reference}>
          <div className="grid">
            <a className="panel" href={files.guidePdf}>
              <h3>Application guide</h3>
              <p className="dim">Everything above in detail, with the full API. PDF.</p>
            </a>
            <a className="panel" href={files.guidePdfRu}>
              <h3>Application guide, Russian</h3>
              <p className="dim">The same guide in Russian.</p>
            </a>
            <a className="panel" href={files.hostApi}>
              <h3>host_api.h</h3>
              <p className="dim">Every function, with a comment.</p>
            </a>
            <a className="panel" href={files.hello}>
              <h3>Sample application</h3>
              <p className="dim">A small app: text, a button, a saved counter.</p>
            </a>
            <a className="panel" href={files.sdkLib}>
              <h3>sdk/lib</h3>
              <p className="dim">Helpers for text, numbers, settings and saved state.</p>
            </a>
            <a className="panel" href={repo.apps}>
              <h3>Official applications</h3>
              <p className="dim">Source code of the official applications.</p>
            </a>
          </div>
        </Chapter>
      </DocBody>
    </>
  )
}
