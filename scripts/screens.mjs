// SPDX-License-Identifier: MIT
// Render the actual applications with fixed demonstration data, never live accounts.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sdk = resolve(process.env.PERINKPHERAL || join(root, '../perinkpheral-os'))
const apps = resolve(process.env.PERINKPHERAL_APPS || join(root, '../perinkpheral-apps'))
const work = mkdtempSync(join(tmpdir(), 'perinkpheral-showcase-'))
const fixtures = join(root, 'assets/showcase')
const output = join(root, 'public/screens')
try {
  mkdirSync(output, { recursive: true })
  const names = readdirSync(fixtures).filter(file => file.endsWith('.json')).map(file => file.slice(0, -5))
  for (const name of names) {
    const scenario = JSON.parse(readFileSync(join(fixtures, `${name}.json`), 'utf8'))
    const folder = join(work, name)
    mkdirSync(folder)
    writeFileSync(join(folder, 'scenario.json'), JSON.stringify({
      ...scenario, app: join(apps, 'apps', name), glyphs: join(apps, 'glyphs'),
    }))
  }
  // Only temporary marketing frames are written. Simulator regression baselines stay intact.
  execFileSync(join(sdk, 'tools/perinkpheral'), ['sim-test', work, '--update'], { stdio: 'inherit' })
  for (const name of names) {
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', join(work, name, `${name}.png`),
      '-vf', 'scale=800:600:flags=neighbor,format=rgb24',
      '-frames:v', '1', '-update', '1', join(output, `${name}.png`)], { stdio: 'inherit' })
  }
  const revision = folder => execFileSync('git', ['-C', folder, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  writeFileSync(join(output, 'sources.json'), JSON.stringify({ firmware: revision(sdk), apps: revision(apps) }, null, 2) + '\n')
} finally {
  rmSync(work, { recursive: true, force: true })
}
