import { test } from 'node:test';
import assert from 'node:assert/strict';

for (const value of [undefined, 'on', '', 'OFF', 'false', '0', ' off', 'off ', 'off']) {
  test(`total taps switch at startup: ${JSON.stringify(value) ?? 'unset'}`, async (t) => {
    const previous = process.env.FEATURE_TOTAL_TAPS;
    t.after(() => {
      if (previous === undefined) delete process.env.FEATURE_TOTAL_TAPS;
      else process.env.FEATURE_TOTAL_TAPS = previous;
    });
    if (value === undefined) delete process.env.FEATURE_TOTAL_TAPS;
    else process.env.FEATURE_TOTAL_TAPS = value;

    // A unique module URL gives each case its own startup and server instance.
    const url = new URL('../server.js', import.meta.url);
    url.searchParams.set('flag', JSON.stringify(value) ?? 'unset');
    /** @type {typeof import('../server.js')} */
    const { server } = await import(url.href);
    // Changing the environment after startup must not change the served page.
    process.env.FEATURE_TOTAL_TAPS = value === 'off' ? 'on' : 'off';
    await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
    t.after(() => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve(undefined));
    }));
    const address = server.address();
    assert.ok(address && typeof address === 'object');
    const response = await fetch(`http://127.0.0.1:${address.port}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    if (value === 'off') {
      assert.doesNotMatch(html, /<[^>]+(?:id|data-testid)="total"/);
    } else {
      assert.match(html, /<small id="total" data-testid="total">Total taps: 0<\/small>/);
    }
  });
}
