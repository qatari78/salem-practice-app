import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('serves the running version', async () => {
  delete process.env.RAILWAY_GIT_COMMIT_SHA;
  const { server } = await import('../server.js');
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const { port } = address;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/version`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /^application\/json/);
    const body = await res.json();
    const health = await (await fetch(`http://127.0.0.1:${port}/health`)).json();
    assert.deepEqual(body, {
      version: pkg.version,
      commit: 'local',
      env: process.env.RAILWAY_ENVIRONMENT_NAME || 'local',
    });
    assert.equal(body.env, health.env);
  } finally {
    server.close();
  }
});
