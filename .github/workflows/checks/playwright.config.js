// Check configuration: scripted browser tests against a freshly started copy of the app.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '../../../e2e',
  outputDir: '../../../test-results',
  reporter: [['list'], ['html', { outputFolder: '../../../playwright-report', open: 'never' }]],
  retries: 0,
  use: { baseURL: 'http://127.0.0.1:4173' },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: { command: 'node server.js', cwd: '../../..', url: 'http://127.0.0.1:4173/health', env: { PORT: '4173' }, timeout: 30000 },
});
