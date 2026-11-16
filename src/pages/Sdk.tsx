import { Link } from 'react-router-dom'
import { Chapter, Code, DocBody, Facts, PageHead, Table } from '../components/Doc'
import { Screen } from '../components/Pictures'
import { files, repo } from '../content/links'

const CHAPTERS = [
  { id: 'overview', title: 'Overview' },
  { id: 'start', title: 'Getting started' },
  { id: 'application', title: 'An application' },
  { id: 'manifest', title: 'The manifest' },
  { id: 'model', title: 'Handlers and state' },
  { id: 'data', title: 'Data from the network' },
  { id: 'kit', title: 'Drawing and the kit' },
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
    /* The host unloads an application whenever it leaves the screen:
     * what must survive is read back from its store. */
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
    /* The host read the answer and picked the paths of "pick": the
     * application gets values, not JSON. One decimal: tenths. */
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
      <PageHead eyebrow="SDK" title="Writing applications">
        An application is C compiled to WebAssembly, a manifest beside it and nothing else. The host loads it,
        hands it events and data, and draws what it paints. This page covers the way from an empty folder to an
        application on a device and in a catalog.
      </PageHead>
      <DocBody chapters={CHAPTERS}>
        <Chapter chapter={overview}>
          <p>
            Applications run in wasm3, an interpreter built into the firmware. Each one is sandboxed: it reaches the
            device only through the calls of one header, <code>sdk/host_api.h</code>, and the network only through
            the host and only to the hosts its manifest names.
          </p>
          <Facts
            rows={[
              ['Language', 'C11, compiled with clang of wasi-sdk to wasm32'],
              ['Contract', <a href={files.hostApi}>sdk/host_api.h</a>],
              ['Memory', 'One 64 KB page: 8 KB of stack, static data, an arena for the rest'],
              ['C library', 'None. sdk/lib has text, numbers, state and settings helpers'],
              ['Numbers', 'Integers only: no floating point in the interpreter. Fixed point with app_fixed.h'],
              ['At a time', 'One application loaded. Others are loaded for their data and unloaded after it'],
              ['Package', 'app.wasm, manifest.json, translations, pictures, optional files'],
            ]}
          />
          <div className="note">
            <p>
              The contract is not frozen before the first release. It changes while applications are written, and
              applications are rebuilt with it.
            </p>
          </div>
        </Chapter>

        <Chapter chapter={start}>
          <ol className="steps">
            <li>
              <h3>Install the toolchain</h3>
              <p>
                wasi-sdk (version 34 is the one tested) with <code>WASI_SDK_PATH</code> pointing at it, Java 21 or
                later for the tools, and git. The tools build themselves with Gradle on first use.
              </p>
              <Code label="shell">{`
git clone ${repo.firmware}.git
cd perinkpheral
export WASI_SDK_PATH=$HOME/opt/wasi-sdk
tools/perinkpheral
`}</Code>
            </li>
            <li>
              <h3>Make an application</h3>
              <p>The sample application of the SDK is copied into a new folder under a new name.</p>
              <Code label="shell">{`tools/perinkpheral new ../myapp --title "My App"`}</Code>
            </li>
            <li>
              <h3>Build it</h3>
              <p>
                The build compiles, checks the module by the rules the device applies and says what it comes to
                against what the device has: the module, the code, the memory, the files and the store.
              </p>
              <Code label="shell">{`tools/perinkpheral build ../myapp --out ../myapp/build`}</Code>
            </li>
            <li>
              <h3>Run it in the simulator</h3>
              <p>
                The simulator is the firmware's own interpreter, host API and kit compiled for the computer: a frame
                there is the frame the panel shows. Its page, with the screen and the four buttons, is at{' '}
                <code>http://127.0.0.1:8401</code>.
              </p>
              <Code label="shell">{`tools/perinkpheral sim ../myapp`}</Code>
            </li>
            <li>
              <h3>Run it on the device</h3>
              <p>
                A device with development firmware takes the application over the network: build, upload, restart
                and open take about ten seconds. No cable and no reflashing.
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
            Handlers change the state and ask for a redraw. <code>app_on_draw()</code> paints the whole picture from
            the state, on a white surface, when the host needs a frame. Drawing anywhere else draws nothing.
          </p>
          <Code label="hello.c">{HELLO}</Code>
          <div className="grid two">
            <Screen name="kit-list" alt="A list drawn with the kit" caption="A list from the kit" />
            <Screen name="kit-question" alt="A question drawn with the kit" caption="A question from the kit" />
          </div>
        </Chapter>

        <Chapter chapter={manifest}>
          <p>
            The manifest says what the application is and what it may do: its name and title, the hosts it talks to,
            its polls, its settings, the news it wants. The host reads it without running the application, and so
            does the device's web page, which draws a settings form from it.
          </p>
          <Code label="manifest.json">{MANIFEST}</Code>
          <Table
            head={['Key', 'Meaning']}
            rows={[
              [<code>name</code>, '1-13 of a-z, 0-9, - and _. The folder, the catalog key and the store'],
              [<code>title</code>, 'Up to 23 characters. What the menu shows'],
              [<code>polls</code>, 'Up to four requests the host makes on its own, every 10 s to a day'],
              [<code>hosts</code>, 'Hosts that http_request() may reach. Nothing else is reachable'],
              [<code>settings</code>, 'Up to eight: text, secret, number, choice, toggle, place, url, link, list'],
              [<code>intents</code>, 'News to be loaded for: started, time_changed, network_up'],
              [<code>icon</code>, '11 rows of 11 characters, # for ink and . for paper'],
              [<code>fullscreen</code>, 'The whole 400 x 300 instead of 400 x 260 under the header'],
              [<code>writes_files</code>, 'Enables file_write(); 32 KB of files are kept free for it'],
              [<code>system</code>, 'Enables the sys_* calls: settings, clock, applications. Asked about on install'],
              [<code>certificates</code>, 'Up to two root certificates of its own, for its own requests'],
              [<code>companion</code>, 'An https page that helps set the application up'],
            ]}
          />
          <p>
            Settings are stored in the application's own store under their keys. A value is read with{' '}
            <code>kv_get()</code> and goes into URLs and headers as <code>{'{{key}}'}</code>. Secrets are written by the
            page and never read back.
          </p>
        </Chapter>

        <Chapter chapter={model}>
          <p>
            An application exports functions with fixed names; the host calls those it finds. There are no callbacks
            by pointer. One handler runs at a time and has 3 seconds.
          </p>
          <Table
            head={['Handler', 'When']}
            rows={[
              [<code>app_init()</code>, 'The instance is loaded'],
              [<code>app_on_focus() / app_on_blur()</code>, 'It gets or leaves the screen'],
              [<code>app_on_terminate()</code>, 'It is about to be unloaded, for any reason: save here'],
              [<code>app_on_button(event)</code>, 'A press: down, up, short or long, for each of the four buttons'],
              [<code>app_on_back()</code>, 'A short BACK, for an application with pages of its own'],
              [<code>app_on_draw()</code>, 'The host needs the frame'],
              [<code>app_on_timer(id)</code>, 'A timer set with timer_set() fired, while on the screen'],
              [<code>app_on_alarm(id)</code>, 'An alarm came, on the screen or off it'],
              [<code>app_on_values(poll, status)</code>, 'Values picked from an answer are ready'],
              [<code>app_on_data(...)</code>, 'A piece of a raw answer'],
              [<code>app_on_settings()</code>, 'The user saved its settings'],
              [<code>app_on_intent(type)</code>, 'News it subscribed to'],
              [<code>app_on_installed() / app_on_updated()</code>, 'Once, after an install or an update'],
            ]}
          />
          <h3>Buttons</h3>
          <p>
            The layout is the same everywhere: <span className="kbd">1</span> up, <span className="kbd">2</span> OK,{' '}
            <span className="kbd">3</span> down, <span className="kbd">4</span> back. A long press on BACK opens the
            menu from any application; it never reaches the application.
          </p>
          <h3>State</h3>
          <p>
            The host unloads an application whenever it leaves the screen and whenever it was loaded only for data. What
            must survive goes through <code>kv_get()</code> and <code>kv_set()</code>: up to 1 KB a value and 2 KB for
            all of them, settings included. Larger data goes into files: <code>file_read()</code> for the package's,{' '}
            <code>file_write()</code> with <code>"writes_files": true</code>.
          </p>
        </Chapter>

        <Chapter chapter={data}>
          <p>
            An application does not open connections. It describes requests; the host makes them one at a time for
            the whole device, over HTTP or HTTPS with the full set of browsers' root certificates, and delivers the
            answer whether the application is on the screen or not.
          </p>
          <Facts
            rows={[
              ['Polls', 'Made by the host at their pace, declared in the manifest. Each poll may go over a list'],
              ['Requests', 'http_request(tag, method, url, headers, body), up to 16 waiting'],
              ['Values', 'With "pick", the host parses the JSON and hands over values: app_on_values()'],
              ['Raw', 'Without it, the answer arrives in 1 KB pieces: app_on_data()'],
              ['Failures', 'A failed request says why: no network, no answer, timeout, not allowed, certificate'],
              ['Focus', 'request_focus() from a background delivery asks for the screen'],
            ]}
          />
          <Code label="weather.c">{VALUES}</Code>
          <p>
            Details are on the <Link to="/firmware#delivery">Firmware</Link> page.
          </p>
        </Chapter>

        <Chapter chapter={kit}>
          <p>
            The host draws in 1 bit: <code>gfx_*</code> calls for text, lines, rectangles, bitmaps, QR codes and the
            host's icons, in two typefaces the user chooses between and six sizes. On top of them is the kit: the
            parts the host's own screens are made of, open to every application.
          </p>
          <Table
            head={['Part', 'Calls']}
            rows={[
              ['Text in four styles', 'ui_text, ui_text_lines, ui_title'],
              ['A list with a scroll bar', 'ui_list_row, ui_list_visible'],
              ['A notice: two lines, an icon, the buttons', 'ui_notice'],
              ['A cell: name, picture, value', 'ui_cell, ui_cell_fit'],
              ['A chart: line, area, bars, steps', 'ui_chart'],
              ['A value with its unit', 'ui_value'],
              ['A picker and a date', 'ui_picker, ui_date'],
              ['Why there is nothing to show', 'ui_reason'],
            ]}
          />
          <div className="grid two">
            <Screen name="kit-parts" alt="Text, icons, a value and a bar drawn with the kit" caption="Text, icons, a value, a bar" />
            <Screen name="stocks" alt="A chart in the stocks application" caption="A chart in stocks" />
          </div>
        </Chapter>

        <Chapter chapter={limits}>
          <Table
            head={['What', 'Limit']}
            rows={[
              ['Module, app.wasm', '48 KB'],
              ['Memory of an instance', '64 KB: stack 8 KB, data, arena'],
              ['Interpreter memory', '64 KB: about 11 KB plus 4 bytes for every byte of code that runs'],
              ['A handler', '3 s'],
              ['Store', '1 KB a value, 2 KB all of them, keys up to 15 characters'],
              ['Files', '64 KB in a package; 32 KB for an application that writes'],
              ['Polls', '4, every 10 s to 1 day'],
              ['Requests waiting', '16 an application'],
              ['Answer', '256 KB with values picked; 4 MB in pieces'],
              ['Settings', '8, a value up to 255 bytes'],
              ['Timers and alarms', '4 and 4'],
              ['Installed on a device', 'Up to 24, as many as fit'],
            ]}
          />
        </Chapter>

        <Chapter chapter={tools}>
          <p>
            One set of tools, in Kotlin, as a command line and a library: the build, the simulator, the device over the
            network and over USB, catalogs and translations. <code>tools/perinkpheral</code> with no arguments lists
            them all.
          </p>
          <Table
            head={['Command', 'What it does']}
            rows={[
              [<code>new &lt;dir&gt;</code>, 'An application to start from'],
              [<code>build &lt;app&gt; --out &lt;dir&gt;</code>, 'Build and check, and report sizes'],
              [<code>sim &lt;app&gt;</code>, 'Run in the simulator at 127.0.0.1:8401'],
              [<code>run &lt;app&gt;</code>, 'Build, upload, restart the device and open the application'],
              [<code>serve [app]</code>, 'A page with the live screen, the buttons, the log and Run'],
              [<code>shot / press / open</code>, 'The device frame as PNG, button presses, open an application'],
              [<code>log [--follow]</code>, 'The device log'],
              [<code>set &lt;app&gt; &lt;key&gt; &lt;value&gt;</code>, 'A setting into the store'],
              [<code>catalog &lt;folder&gt; --out &lt;dir&gt;</code>, 'Build a catalog'],
              [<code>strings export / import</code>, 'Translations as one CSV table'],
              [<code>flash [image]</code>, 'A firmware image over the network'],
              [<code>usb &lt;port&gt;</code>, 'A device with no network, over the cable'],
            ]}
          />
        </Chapter>

        <Chapter chapter={clion}>
          <p>
            The plugin ties the same core to CLion: an application folder opens as a CMake project compiled with the
            device's flags, and the module the IDE builds is the module the device gets.
          </p>
          <ul>
            <li>Toolchain setup: the SDK checkout and wasi-sdk 34, downloaded into ~/.perinkpheral.</li>
            <li>Run configurations for the device and the simulator, with the live screen in a tool window.</li>
            <li>The manifest checked and completed by its JSON schema.</li>
            <li>Firmware over the network, and over USB with esptool.</li>
          </ul>
          <p>
            CLion 2026.2 or later. The simulator ships for macOS and Linux. Source and builds:{' '}
            <a href={repo.clion}>perinkpheral-clion-plugin</a>.
          </p>
        </Chapter>

        <Chapter chapter={publishing}>
          <p>
            Applications reach devices from catalogs: a folder of static files with an index,{' '}
            <code>catalog.json</code>, served over HTTPS from any host. The device's page lists what its catalogs hold
            and installs with a click; the device checks every file's size and SHA-256 against the index.
          </p>
          <Code label="shell">{`tools/perinkpheral catalog apps --out catalog`}</Code>
          <p>
            The official catalog is <a href={repo.apps}>perinkpheral-apps</a> and is always the first source of a
            device. Up to three more are added on the device's page. Translations are files of the package: one JSON
            per language in <code>strings/</code>, checked by the build.
          </p>
        </Chapter>

        <Chapter chapter={reference}>
          <div className="grid">
            <a className="panel" href={files.guidePdf}>
              <h3>Application guide</h3>
              <p className="dim">Datasheet, guide and reference in one PDF. English.</p>
            </a>
            <a className="panel" href={files.guidePdfRu}>
              <h3>Application guide, Russian</h3>
              <p className="dim">The same guide in Russian. The English one is right when they differ.</p>
            </a>
            <a className="panel" href={files.hostApi}>
              <h3>host_api.h</h3>
              <p className="dim">The whole contract, with a comment for every call.</p>
            </a>
            <a className="panel" href={files.hello}>
              <h3>The sample</h3>
              <p className="dim">sdk/apps/hello: text, a button and a value that survives.</p>
            </a>
            <a className="panel" href={files.sdkLib}>
              <h3>sdk/lib</h3>
              <p className="dim">Text, numbers, values, state, settings and the kit's buttons.</p>
            </a>
            <a className="panel" href={repo.apps}>
              <h3>Official applications</h3>
              <p className="dim">Clock, weather, calendar, stocks, Home Assistant and more, as sources.</p>
            </a>
          </div>
        </Chapter>
      </DocBody>
    </>
  )
}
