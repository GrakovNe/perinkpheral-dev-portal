// SPDX-License-Identifier: MIT
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  use: {
    baseURL: 'http://127.0.0.1:4181',
    launchOptions: { executablePath: process.env.BROWSER_EXECUTABLE_PATH },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4181 --strictPort',
    url: 'http://127.0.0.1:4181',
  },
})
