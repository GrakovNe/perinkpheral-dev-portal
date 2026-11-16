import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import type { ESPLoader, Transport } from 'esptool-js'
import { Facts, PageHead } from '../components/Doc'
import { readWholeFlash } from '../content/flashRead'
import { useLocal, useT } from '../i18n'

// The first flash from a browser: the board on a USB cable, Web Serial and
// Espressif's esptool-js. The files are the latest firmware release's, put
// beside the portal when it is published (firmware/manifest.json, in the form
// of ESP Web Tools); the board is erased and they are written where the
// manifest says. Before that, the whole flash can be read into a file: a copy
// of what the board holds, settings and Wi-Fi password among it.

const BASE = import.meta.env.BASE_URL
const ESPRESSIF = 0x303a
const FLASH_BYTES = 4 * 1024 * 1024

type Part = { path: string; offset: number }
type Manifest = { version: string; builds: { chipFamily: string; parts: Part[] }[] }

type Phase =
  | { name: 'idle' }
  | { name: 'monitor' }
  | { name: 'connecting' }
  | { name: 'connected'; chip: string; mac: string; saved?: string }
  | { name: 'reading'; chip: string; mac: string; done: number }
  | { name: 'erasing' }
  | { name: 'writing'; done: number }
  | { name: 'done' }
  | { name: 'error'; message: string }

function Progress({ value }: { value: number }) {
  return (
    <div className="flash-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

export function Flash() {
  const t = useT()
  const local = useLocal()
  // Web Serial, asked of the browser; a page built ahead of time assumes it
  const supported = useSyncExternalStore(
    () => () => {},
    () => 'serial' in navigator,
    () => true,
  )
  const [manifest, setManifest] = useState<Manifest | null | 'none'>(null)
  const [phase, setPhase] = useState<Phase>({ name: 'idle' })
  const [log, setLog] = useState('')
  const loader = useRef<ESPLoader | null>(null)
  const monitorPort = useRef<SerialPort | null>(null)
  const monitorReader = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const consoleView = useRef<HTMLPreElement | null>(null)

  // the console follows what comes last
  useEffect(() => {
    const view = consoleView.current
    if (view) {
      view.scrollTop = view.scrollHeight
    }
  }, [log])
  const transport = useRef<Transport | null>(null)

  useEffect(() => {
    fetch(`${BASE}firmware/manifest.json`)
      .then((answer) => (answer.ok ? answer.json() : 'none'))
      .then(setManifest)
      .catch(() => setManifest('none'))
  }, [])

  const say = (line: string) => setLog((text) => text + line)
  const terminal = {
    clean: () => setLog(''),
    writeLine: (line: string) => say(`${line}\n`),
    write: (line: string) => say(line),
  }

  const release = async () => {
    try {
      await transport.current?.disconnect()
    } catch {
      // the port is gone already
    }
    transport.current = null
    loader.current = null
  }

  const connect = async () => {
    setPhase({ name: 'connecting' })
    try {
      const { ESPLoader, Transport } = await import('esptool-js')
      const port = await navigator.serial.requestPort({ filters: [{ usbVendorId: ESPRESSIF }] })
      transport.current = new Transport(port, false)
      loader.current = new ESPLoader({ transport: transport.current, baudrate: 921600, terminal })
      await loader.current.main()
      const chip = loader.current.chip.CHIP_NAME
      if (chip !== 'ESP32-C6') {
        await release()
        setPhase({ name: 'error', message: t(`This is ${chip}, not ESP32-C6.`, `Это ${chip}, а не ESP32-C6.`) })
        return
      }
      const mac = await loader.current.chip.readMac(loader.current)
      setPhase({ name: 'connected', chip, mac })
    } catch (error) {
      await release()
      const cancelled = error instanceof DOMException && error.name === 'NotFoundError'
      setPhase(
        cancelled
          ? { name: 'idle' }
          : { name: 'error', message: t('The board does not answer.', 'Плата не отвечает.') },
      )
    }
  }

  const install = async () => {
    if (!loader.current || !manifest || manifest === 'none') {
      return
    }
    const build = manifest.builds.find((one) => one.chipFamily === 'ESP32-C6')
    if (!build) {
      return
    }
    setPhase({ name: 'erasing' })
    try {
      const files = await Promise.all(
        build.parts.map(async (part) => {
          const answer = await fetch(`${BASE}firmware/${part.path}`)
          if (!answer.ok) {
            throw new Error(part.path)
          }
          return { data: new Uint8Array(await answer.arrayBuffer()), address: part.offset }
        }),
      )
      const total = files.reduce((sum, file) => sum + file.data.length, 0)
      const before = files.map((_, index) => files.slice(0, index).reduce((sum, file) => sum + file.data.length, 0))
      await loader.current.writeFlash({
        fileArray: files,
        flashSize: 'keep',
        flashMode: 'keep',
        flashFreq: 'keep',
        eraseAll: true,
        compress: true,
        reportProgress: (index, written, size) => {
          const share = (before[index] + (written / size) * files[index].data.length) / total
          setPhase({ name: 'writing', done: Math.round(share * 100) })
        },
      })
      await loader.current.after('hard_reset')
      await release()
      setPhase({ name: 'done' })
    } catch {
      await release()
      setPhase({ name: 'error', message: t('Writing stopped. Connect again.', 'Запись прервалась. Подключите ещё раз.') })
    }
  }

  // What the board's firmware writes on its console, from a restart on: the
  // way to see why a board that does not answer does not.
  const monitor = async () => {
    try {
      const port = await navigator.serial.requestPort({ filters: [{ usbVendorId: ESPRESSIF }] })
      await port.open({ baudRate: 115200 })
      monitorPort.current = port
      setLog('')
      setPhase({ name: 'monitor' })
      // a reset into the firmware, as esptool's hard reset over USB-JTAG
      await port.setSignals({ dataTerminalReady: false, requestToSend: true })
      await new Promise((resolve) => setTimeout(resolve, 100))
      await port.setSignals({ requestToSend: false })
      const decoder = new TextDecoder()
      while (port.readable && monitorPort.current === port) {
        const reader = port.readable.getReader()
        monitorReader.current = reader
        try {
          for (;;) {
            const { value, done } = await reader.read()
            if (done) {
              break
            }
            say(decoder.decode(value, { stream: true }))
          }
        } catch {
          // the board went away, or Stop was pressed
        } finally {
          reader.releaseLock()
        }
      }
    } catch (error) {
      const cancelled = error instanceof DOMException && error.name === 'NotFoundError'
      if (!cancelled) {
        setPhase({ name: 'error', message: t('The port does not open.', 'Порт не открывается.') })
      }
    }
  }

  const stopMonitor = async () => {
    const port = monitorPort.current
    monitorPort.current = null
    try {
      await monitorReader.current?.cancel()
      await port?.close()
    } catch {
      // closed already
    }
    setPhase({ name: 'idle' })
  }

  // the whole flash into a file the browser saves
  const save = async (chip: string, mac: string) => {
    if (!loader.current) {
      return
    }
    setPhase({ name: 'reading', chip, mac, done: 0 })
    try {
      const data = await readWholeFlash(loader.current, FLASH_BYTES, (read, size) =>
        setPhase({ name: 'reading', chip, mac, done: Math.floor((read / size) * 100) }),
      )
      const name = `perinkpheral-backup-${mac.replace(/:/g, '')}-${new Date().toISOString().slice(0, 10)}.bin`
      const link = document.createElement('a')
      link.href = URL.createObjectURL(new Blob([data as BlobPart], { type: 'application/octet-stream' }))
      link.download = name
      link.click()
      URL.revokeObjectURL(link.href)
      setPhase({ name: 'connected', chip, mac, saved: name })
    } catch {
      await release()
      setPhase({ name: 'error', message: t('Reading stopped. Connect again.', 'Чтение прервалось. Подключите ещё раз.') })
    }
  }

  const version = manifest && manifest !== 'none' ? manifest.version : null
  const busy =
    phase.name === 'connecting' || phase.name === 'erasing' || phase.name === 'writing' || phase.name === 'reading'

  let body
  if (!supported) {
    body = <p>{t('Needs Chrome or Edge on a computer.', 'Нужен Chrome или Edge на компьютере.')}</p>
  } else if (manifest === 'none') {
    body = <p>{t('No firmware is published yet.', 'Прошивка ещё не опубликована.')}</p>
  } else if (phase.name === 'idle' || phase.name === 'connecting') {
    body = (
      <>
        <p>{t('Connect the board to this computer with a USB-C cable.', 'Подключите плату к компьютеру кабелем USB-C.')}</p>
        <div className="buttons">
          <button type="button" className="button" onClick={connect} disabled={busy || !version}>
            {phase.name === 'connecting' ? t('Connecting', 'Подключение') : t('Connect', 'Подключить')}
          </button>
          <button type="button" className="button quiet" onClick={monitor} disabled={busy}>
            {t('Monitor', 'Монитор')}
          </button>
        </div>
      </>
    )
  } else if (phase.name === 'monitor') {
    body = (
      <>
        <p>{t('The board restarts; what it writes is below.', 'Плата перезапускается, её вывод ниже.')}</p>
        <pre className="flash-console" ref={consoleView}>
          {log || '...'}
        </pre>
        <div className="buttons">
          <button type="button" className="button quiet" onClick={() => navigator.clipboard.writeText(log)}>
            {t('Copy', 'Копировать')}
          </button>
          <button type="button" className="button quiet" onClick={stopMonitor}>
            {t('Stop', 'Остановить')}
          </button>
        </div>
      </>
    )
  } else if (phase.name === 'connected') {
    body = (
      <>
        <Facts
          rows={[
            [t('Chip', 'Чип'), phase.chip],
            ['MAC', phase.mac],
          ]}
        />
        {phase.saved ? (
          <p>
            {t('Backup saved:', 'Резервная копия сохранена:')} <code>{phase.saved}</code>
          </p>
        ) : null}
        <p className="flash-warning">{t('Everything on the board is erased.', 'Всё на плате будет стёрто.')}</p>
        <div className="buttons">
          <button type="button" className="button" onClick={install}>
            {t('Install', 'Установить')}
          </button>
          <button type="button" className="button quiet" onClick={() => save(phase.chip, phase.mac)}>
            {t('Back up', 'Создать резервную копию')}
          </button>
          <button
            type="button"
            className="button quiet"
            onClick={async () => {
              // Connect left the board in its loader: it starts its firmware again
              try {
                await loader.current?.after('hard_reset')
              } catch {
                // the board is gone already
              }
              await release()
              setPhase({ name: 'idle' })
            }}
          >
            {t('Disconnect', 'Отключить')}
          </button>
        </div>
      </>
    )
  } else if (phase.name === 'reading') {
    body = (
      <>
        <p>
          {t('Reading the flash', 'Чтение флеша')}
          <span className="flash-percent">{phase.done}%</span>
        </p>
        <Progress value={phase.done} />
        <p className="dim">{t('Keep the board connected.', 'Не отключайте плату.')}</p>
      </>
    )
  } else if (phase.name === 'erasing' || phase.name === 'writing') {
    const done = phase.name === 'writing' ? phase.done : 0
    body = (
      <>
        <p>
          {phase.name === 'erasing' ? t('Erasing', 'Стирание') : t('Writing', 'Запись')}
          {phase.name === 'writing' && <span className="flash-percent">{done}%</span>}
        </p>
        <Progress value={done} />
        <p className="dim">{t('Keep the board connected.', 'Не отключайте плату.')}</p>
      </>
    )
  } else if (phase.name === 'done') {
    body = (
      <>
        <p>
          {t(
            'Done. The device restarts and shows a QR code.',
            'Готово. Устройство перезагрузится и покажет QR-код.',
          )}
        </p>
        <div className="buttons">
          <Link className="button" to={local('/start#wifi')}>
            {t('Connect to Wi-Fi', 'Подключить к Wi-Fi')} <span className="arrow">-&gt;</span>
          </Link>
        </div>
      </>
    )
  } else {
    body = (
      <>
        <p className="flash-warning">{phase.message}</p>
        <div className="buttons">
          <button type="button" className="button" onClick={() => setPhase({ name: 'idle' })}>
            {t('Try again', 'Ещё раз')}
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead title={t('Flash', 'Прошивка')} />
      <div className="wrap flash-page">
        <section className="flasher" aria-live="polite">
          <div className="flasher-head">
            <span>perINKpheral</span>
            <span>{version ?? ''}</span>
          </div>
          <div className="flasher-body">{body}</div>
          {log && phase.name !== 'monitor' && (
            <details className="flasher-log">
              <summary>{t('Log', 'Журнал')}</summary>
              <pre>{log}</pre>
            </details>
          )}
        </section>
        <aside>
          <Facts
            rows={[
              [t('Browser', 'Браузер'), t('Chrome or Edge on a computer', 'Chrome или Edge на компьютере')],
              [t('Cable', 'Кабель'), t('USB-C with data', 'USB-C с передачей данных')],
              [t('Board not found', 'Плата не видна'), t('Hold BOOT while plugging in', 'Держите BOOT при подключении')],
              [t('Later updates', 'Дальнейшие обновления'), t('Over Wi-Fi, from the device page', 'По Wi-Fi, со страницы устройства')],
            ]}
          />
        </aside>
      </div>
    </>
  )
}
