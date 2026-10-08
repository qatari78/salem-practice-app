import { test } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../server.js';

test('serves the counter page and health', async () => {
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const { port } = address;
  try {
    const page = await (await fetch(`http://127.0.0.1:${port}/`)).text();
    assert.match(page, /data-testid="count"/);
    const health = await (await fetch(`http://127.0.0.1:${port}/health`)).json();
    assert.equal(health.ok, true);
  } finally {
    server.close();
  }
});
