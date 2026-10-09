import { test } from 'node:test';
import assert from 'node:assert/strict';

test('robots.txt tells search engines not to index', async () => {
  const { server } = await import('../server.js');
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const { port } = address;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/robots.txt`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8');
    assert.equal(await res.text(), 'User-agent: *\nDisallow: /\n');
  } finally {
    server.close();
  }
});
