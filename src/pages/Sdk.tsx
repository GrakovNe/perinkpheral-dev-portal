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
              ['Language', 'C11, compiled with clang of wasi-sdk to wasm32'],
              ['Contract', <a href={files.hostApi}>sdk/host_api.h</a>],
              ['Memory', 'One 64 KB page: 8 KB of stack, static data, an arena for the rest'],
              ['C library', 'None. sdk/lib provides text, number, state and settings helpers'],
              ['Numbers', 'Integers only, no floating point. Fixed point: app_fixed.h'],
              ['Instances', 'One loaded at a time. Background applications are loaded for data delivery and unloaded'],
              ['Package', 'app.wasm, manifest.json, translations, pictures, optional files'],
            ]}
          />
          <div className="note">
            <p>
              The API is not frozen before the first release. Applications are rebuilt when it changes.
            </p>
          </div>
        </Chapter>

        <Chapter chapter={start}>
          <ol className="steps">
            <li>
              <h3>Install the toolchain</h3>
              <p>
                Requirements: wasi-sdk (tested with 34) with <code>WASI_SDK_PATH</code> set, Java 21 or later, git.
                The tools are built with Gradle on first run.
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
                Compiles the application, validates the module against the device rules and reports module size,
                code size, memory, files and store usage.
              </p>
              <Code label="shell">{`tools/perinkpheral build ../myapp --out ../myapp/build`}</Code>
            </li>
            <li>
              <h3>Run in the simulator</h3>
              <p>
                The simulator runs the firmware's interpreter, host API and UI kit natively, so the output matches
                the device. Web UI with the screen and the buttons: <code>http://127.0.0.1:8401</code>.
              </p>
              <Code label="shell">{`tools/perinkpheral sim ../myapp`}</Code>
            </li>
            <li>
              <h3>Run on the device</h3>
              <p>
                Requires development firmware. Builds, uploads over Wi-Fi, restarts the device and opens the
                application in about 10 seconds.
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
            Handlers update state and request a redraw. The host calls <code>app_on_draw()</code> with a blank
            surface when a frame is needed. Drawing calls outside <code>app_on_draw()</code> have no effect.
          </p>
          <Code label="hello.c">{HELLO}</Code>
          <div className="grid two">
            <Screen name="kit-list" alt="A list drawn with the kit" caption="List" />
            <Screen name="kit-question" alt="A question drawn with the kit" caption="Question" />
          </div>
        </Chapter>

        <Chapter chapter={manifest}>
          <p>
            The manifest declares the application's name, title, network hosts, polls, settings and event
            subscriptions. The host and the web UI read it without running the application; the web UI generates the
            settings form from it.
          </p>
          <Code label="manifest.json">{MANIFEST}</Code>
          <Table
            head={['Key', 'Meaning']}
            rows={[
              [<code>name</code>, '1-13 characters: a-z, 0-9, - and _. Folder, catalog key and store namespace'],
              [<code>title</code>, 'Up to 23 characters. Shown in the menu'],
              [<code>polls</code>, 'Up to 4 requests scheduled by the host, every 10 s to 1 day'],
              [<code>hosts</code>, 'Hosts allowed for http_request()'],
              [<code>settings</code>, 'Up to eight: text, secret, number, choice, toggle, place, url, link, list'],
              [<code>intents</code>, 'Event subscriptions: started, time_changed, network_up'],
              [<code>icon</code>, '11 rows of 11 characters, # for ink and . for paper'],
              [<code>fullscreen</code>, '400 x 300 without the header, instead of 400 x 260'],
              [<code>writes_files</code>, 'Enables file_write(); 32 KB of files are kept free for it'],
              [<code>system</code>, 'Enables sys_* functions: settings, clock, applications. Confirmed on install'],
              [<code>certificates</code>, 'Up to 2 root certificates, trusted only for this application'],
              [<code>companion</code>, 'HTTPS configuration page for the application'],
            ]}
          />
          <p>
            Settings are stored in the application's key-value store under their keys, read with{' '}
            <code>kv_get()</code> and substituted into URLs and headers as <code>{'{{key}}'}</code>. Secret values are
            write-only from the web UI.
          </p>
        </Chapter>

        <Chapter chapter={model}>
          <p>
            The host calls exported functions with fixed names; missing exports are skipped. No function pointers.
            One handler runs at a time, with a 3 s limit.
          </p>
          <Table
            head={['Handler', 'When']}
            rows={[
              [<code>app_init()</code>, 'Instance loaded'],
              [<code>app_on_focus() / app_on_blur()</code>, 'Screen gained or lost'],
              [<code>app_on_terminate()</code>, 'Before unload, for any reason. Save state here'],
              [<code>app_on_button(event)</code>, 'Button event: down, up, short or long press'],
              [<code>app_on_back()</code>, 'Short BACK press, for applications with their own navigation'],
              [<code>app_on_draw()</code>, 'Frame requested'],
              [<code>app_on_timer(id)</code>, 'timer_set() expired, while on screen'],
              [<code>app_on_alarm(id)</code>, 'Alarm fired, on or off screen'],
              [<code>app_on_values(poll, status)</code>, 'Picked values of a response'],
              [<code>app_on_data(...)</code>, 'Chunk of a raw response'],
              [<code>app_on_settings()</code>, 'Settings changed'],
              [<code>app_on_intent(type)</code>, 'Subscribed event'],
              [<code>app_on_installed() / app_on_updated()</code>, 'First run after install or update'],
            ]}
          />
          <h3>Buttons</h3>
          <p>
            Fixed layout: <span className="kbd">1</span> up, <span className="kbd">2</span> OK,{' '}
            <span className="kbd">3</span> down, <span className="kbd">4</span> back. A long press on BACK opens the
            menu and is not delivered to the application.
          </p>
          <h3>State</h3>
          <p>
            Applications are unloaded when they leave the screen and after background delivery. Persistent state is
            stored with <code>kv_get()</code> and <code>kv_set()</code>: up to 1 KB per value, 2 KB in total including
            settings. Larger data: <code>file_read()</code> for package files, <code>file_write()</code> with{' '}
            <code>"writes_files": true</code>.
          </p>
        </Chapter>

        <Chapter chapter={data}>
          <p>
            Applications do not open connections. The host performs requests one at a time for the whole device, over
            HTTP or HTTPS with the browser root certificate set, and delivers responses whether or not the application
            is on screen.
          </p>
          <Facts
            rows={[
              ['Polls', 'Declared in the manifest, scheduled by the host. A poll may iterate over a list setting'],
              ['Requests', 'http_request(tag, method, url, headers, body), up to 16 waiting'],
              ['Values', 'With "pick", the host parses JSON and passes values to app_on_values()'],
              ['Raw', 'Without "pick", the response arrives in 1 KB chunks: app_on_data()'],
              ['Errors', 'No network, no response, timeout, host not allowed, certificate'],
              ['Focus', 'request_focus() during background delivery requests the screen'],
            ]}
          />
          <Code label="weather.c">{VALUES}</Code>
          <p>
            See <Link to="/firmware#delivery">Firmware: Data delivery</Link>.
          </p>
        </Chapter>

        <Chapter chapter={kit}>
          <p>
            Graphics are 1-bit. <code>gfx_*</code> functions draw text, lines, rectangles, bitmaps, QR codes and system
            icons, in two user-selectable typefaces and six sizes. The UI kit provides the components used by the
            system screens.
          </p>
          <Table
            head={['Component', 'Functions']}
            rows={[
              ['Text, four styles', 'ui_text, ui_text_lines, ui_title'],
              ['List with scroll bar', 'ui_list_row, ui_list_visible'],
              ['Notice: text, icon, actions', 'ui_notice'],
              ['Cell: name, picture, value', 'ui_cell, ui_cell_fit'],
              ['Chart: line, area, bars, steps', 'ui_chart'],
              ['Value with unit', 'ui_value'],
              ['Picker, date and time', 'ui_picker, ui_date'],
              ['Empty state: loading, not set up, no network', 'ui_reason'],
            ]}
          />
          <div className="grid two">
            <Screen name="kit-parts" alt="Text, icons, a value and a bar drawn with the kit" caption="Text, icons, value, bar" />
            <Screen name="stocks" alt="A chart in the stocks application" caption="Chart" />
          </div>
        </Chapter>

        <Chapter chapter={limits}>
          <Table
            head={['Resource', 'Limit']}
            rows={[
              ['Module, app.wasm', '48 KB'],
              ['Instance memory', '64 KB: 8 KB stack, data, arena'],
              ['Interpreter memory', '64 KB: about 11 KB plus 4 bytes per byte of executed code'],
              ['Handler run time', '3 s'],
              ['Store', '1 KB per value, 2 KB total, keys up to 15 characters'],
              ['Files', '64 KB per package; 32 KB for applications that write'],
              ['Polls', '4, every 10 s to 1 day'],
              ['Queued requests', '16 per application'],
              ['Response', '256 KB with pick; 4 MB as chunks'],
              ['Settings', '8, values up to 255 bytes'],
              ['Timers and alarms', '4 and 4'],
              ['Installed applications', 'Up to 24, subject to free space'],
            ]}
          />
        </Chapter>

        <Chapter chapter={tools}>
          <p>
            A single Kotlin toolset, used as a CLI and as a library: build, simulator, device access over Wi-Fi and USB,
            catalogs, translations. Run <code>tools/perinkpheral</code> without arguments for the full list.
          </p>
          <Table
            head={['Command', 'Description']}
            rows={[
              [<code>new &lt;dir&gt;</code>, 'New application from the sample'],
              [<code>build &lt;app&gt; --out &lt;dir&gt;</code>, 'Build, validate, report sizes'],
              [<code>sim &lt;app&gt;</code>, 'Run in the simulator, 127.0.0.1:8401'],
              [<code>run &lt;app&gt;</code>, 'Build, upload, restart the device, open the application'],
              [<code>serve [app]</code>, 'Web UI: live screen, buttons, log, Run'],
              [<code>shot / press / open</code>, 'Screenshot, button presses, open an application'],
              [<code>log [--follow]</code>, 'Device log'],
              [<code>set &lt;app&gt; &lt;key&gt; &lt;value&gt;</code>, 'Write a setting'],
              [<code>catalog &lt;folder&gt; --out &lt;dir&gt;</code>, 'Build a catalog'],
              [<code>strings export / import</code>, 'Translations as CSV'],
              [<code>flash [image]</code>, 'Firmware update over Wi-Fi'],
              [<code>usb &lt;port&gt;</code>, 'Device access over USB'],
            ]}
          />
        </Chapter>

        <Chapter chapter={clion}>
          <p>
            The plugin integrates the same core into CLion. Application folders open as CMake projects compiled with
            the device build flags.
          </p>
          <ul>
            <li>Toolchain setup: SDK checkout and wasi-sdk 34 in ~/.perinkpheral.</li>
            <li>Run configurations for the device and the simulator; live screen in a tool window.</li>
            <li>Manifest validation and completion by JSON schema.</li>
            <li>Firmware upload over Wi-Fi, and over USB with esptool.</li>
          </ul>
          <p>
            CLion 2026.2 or later. Simulator: macOS and Linux. Source:{' '}
            <a href={repo.clion}>perinkpheral-clion-plugin</a>.
          </p>
        </Chapter>

        <Chapter chapter={publishing}>
          <p>
            Applications are distributed through catalogs: static folders with a <code>catalog.json</code> index, served
            over HTTPS. The device web UI lists catalog contents and installs applications; each file is verified by
            size and SHA-256.
          </p>
          <Code label="shell">{`tools/perinkpheral catalog apps --out catalog`}</Code>
          <p>
            The official catalog, <a href={repo.apps}>perinkpheral-apps</a>, is always the first source. Up to three
            additional sources can be added. Translations: one JSON file per language in <code>strings/</code>,
            validated at build time.
          </p>
        </Chapter>

        <Chapter chapter={reference}>
          <div className="grid">
            <a className="panel" href={files.guidePdf}>
              <h3>Application guide</h3>
              <p className="dim">Datasheet, guide and API reference. PDF, English.</p>
            </a>
            <a className="panel" href={files.guidePdfRu}>
              <h3>Application guide, Russian</h3>
              <p className="dim">Russian translation. The English version takes precedence.</p>
            </a>
            <a className="panel" href={files.hostApi}>
              <h3>host_api.h</h3>
              <p className="dim">Full API with documentation comments.</p>
            </a>
            <a className="panel" href={files.hello}>
              <h3>Sample application</h3>
              <p className="dim">sdk/apps/hello: text output, button input, persistent state.</p>
            </a>
            <a className="panel" href={files.sdkLib}>
              <h3>sdk/lib</h3>
              <p className="dim">Helpers for text, numbers, values, state, settings and UI input.</p>
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
