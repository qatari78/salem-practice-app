import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { server } from '../server.js';

test('only GET and HEAD are allowed on every path', async (t) => {
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve(undefined));
  }));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const baseURL = `http://127.0.0.1:${address.port}`;
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

  for (const [method, path] of [
    ['POST', '/'],
    ['PUT', '/health'],
    ['DELETE', '/version'],
    ['POST', '/nope'],
    ['OPTIONS', '/robots.txt'],
    ['PATCH', '/index.html?x=1'],
  ]) {
    await t.test(`${method} ${path} returns 405`, async () => {
      const response = await fetch(`${baseURL}${path}`, { method });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get('allow'), 'GET, HEAD');
      assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8');
      assert.equal(await response.text(), 'Method not allowed');
    });
  }

  for (const [path, status, contentType] of [
    ['/', 200, 'text/html; charset=utf-8'],
    ['/health', 200, 'application/json'],
    ['/version', 200, 'application/json'],
    ['/robots.txt', 200, 'text/plain; charset=utf-8'],
    ['/nope', 404, 'text/plain; charset=utf-8'],
  ]) {
    await t.test(`GET ${path} is unchanged`, async () => {
      const response = await fetch(`${baseURL}${path}`);
      assert.equal(response.status, status);
      assert.equal(response.headers.get('content-type'), contentType);
      assert.equal(response.headers.get('allow'), null);
      if (path === '/') {
        assert.match(await response.text(), /<div id="count" data-testid="count">0<\/div>/);
      } else if (path === '/health') {
        const body = await response.json();
        assert.equal(body.ok, true);
        assert.equal(typeof body.env, 'string');
        assert.deepEqual(Object.keys(body).sort(), ['env', 'ok']);
      } else if (path === '/version') {
        const body = await response.json();
        assert.equal(body.version, pkg.version);
        assert.equal(typeof body.commit, 'string');
        assert.equal(typeof body.env, 'string');
        assert.deepEqual(Object.keys(body).sort(), ['commit', 'env', 'version']);
      } else {
        assert.equal(await response.text(), path === '/robots.txt' ? 'User-agent: *\nDisallow: /\n' : 'Not found');
      }
    });

    await t.test(`HEAD ${path} keeps the GET status and response headers without a body`, async () => {
      const response = await fetch(`${baseURL}${path}`, { method: 'HEAD' });
      assert.equal(response.status, status);
      assert.equal(response.headers.get('content-type'), contentType);
      assert.equal(response.headers.get('allow'), null);
      assert.equal(await response.text(), '');
    });
  }
});
