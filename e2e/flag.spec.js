import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';

/** @type {import('node:child_process').ChildProcess | undefined} */
let app;
let offServerURL = '';

test.beforeAll(async () => {
  const portServer = createServer();
  await new Promise((resolve) => portServer.listen(0, '127.0.0.1', () => resolve(undefined)));
  const address = portServer.address();
  if (!address || typeof address === 'string') throw new Error('Could not allocate a free port');
  const port = address.port;
  await new Promise((resolve, reject) => {
    portServer.close((error) => error ? reject(error) : resolve(undefined));
  });

  offServerURL = `http://127.0.0.1:${port}`;
  app = spawn(process.execPath, ['server.js'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, FEATURE_TOTAL_TAPS: 'off', PORT: String(port) },
    stdio: 'inherit',
  });
  await once(app, 'spawn');
  await expect.poll(async () => {
    try {
      const response = await fetch(`${offServerURL}/health`);
      return response.ok && (await response.json()).ok === true;
    } catch {
      return false;
    }
  }).toBe(true);
});

test.afterAll(async () => {
  if (app && app.exitCode === null && app.signalCode === null) {
    const exited = once(app, 'exit');
    app.kill();
    await exited;
  }
});

test('with total taps off, the line is absent and Add and Reset work without errors', async ({ page }) => {
  /** @type {string[]} */
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(offServerURL);
  await expect(page.getByTestId('total')).toHaveCount(0);
  await expect(page.getByText('Total taps:')).toHaveCount(0);
  await expect(page.getByTestId('count')).toHaveText('0');
  await page.getByTestId('add').click();
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('2');
  await page.getByTestId('reset').click();
  await expect(page.getByTestId('count')).toHaveText('0');
  await page.getByTestId('add').click();
  await expect(page.getByTestId('count')).toHaveText('1');
  await expect(page.getByTestId('total')).toHaveCount(0);
  expect(errors).toEqual([]);
});
