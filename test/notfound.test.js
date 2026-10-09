import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { server } from '../server.js';

test('serves known routes and returns plain-text 404 for unknown paths', async (t) => {
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve(undefined));
  }));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const baseURL = `http://127.0.0.1:${address.port}`;
  const env = process.env.RAILWAY_ENVIRONMENT_NAME || 'local';
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  for (const path of ['/', '/index.html', '/?x=1']) {
    await t.test(`${path} returns the counter page`, async () => {
      const response = await fetch(`${baseURL}${path}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
      assert.match(await response.text(), /data-testid="count"/);
    });
  }

  await t.test('/health is unchanged', async () => {
    const response = await fetch(`${baseURL}/health`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json');
    assert.deepEqual(await response.json(), { ok: true, env });
  });

  await t.test('/version is unchanged', async () => {
    const response = await fetch(`${baseURL}/version`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json');
    assert.deepEqual(await response.json(), {
      version: pkg.version,
      commit: process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
      env,
    });
  });

  await t.test('/robots.txt is unchanged', async () => {
    const response = await fetch(`${baseURL}/robots.txt`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(await response.text(), 'User-agent: *\nDisallow: /\n');
  });

  for (const path of ['/nope', '/a/b', '/nope?x=1', '/index.html/']) {
    await t.test(`${path} returns Not found`, async () => {
      const response = await fetch(`${baseURL}${path}`);
      assert.equal(response.status, 404);
      assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
      assert.equal(await response.text(), 'Not found');
    });
  }
});
