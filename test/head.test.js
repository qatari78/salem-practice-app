import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import { server } from '../server.js';

/**
 * @param {number} port
 * @param {string} method
 * @param {string} path
 * @returns {Promise<{ status: string, headers: string[], body: string }>}
 */
function request(port, method, path) {
  return new Promise((resolve, reject) => {
    const socket = connect(port, '127.0.0.1');
    let response = '';
    socket.setEncoding('utf8');
    socket.on('connect', () => {
      socket.write(`${method} ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`);
    });
    socket.on('data', (chunk) => { response += chunk; });
    socket.on('error', reject);
    socket.on('close', () => {
      const separator = response.indexOf('\r\n\r\n');
      const [status, ...headers] = response.slice(0, separator).split('\r\n');
      resolve({ status, headers, body: response.slice(separator + 4) });
    });
  });
}

test('HEAD has every GET header and status with no bytes in the body', async (t) => {
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve(undefined));
  }));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  for (const path of ['/', '/health', '/version']) {
    await t.test(`HEAD ${path} matches GET`, async () => {
      const get = await request(address.port, 'GET', path);
      const head = await request(address.port, 'HEAD', path);
      assert.equal(get.status, 'HTTP/1.1 200 OK');
      assert.equal(head.status, get.status);
      const getDate = get.headers.find((line) => /^date:/i.test(line));
      const headDate = head.headers.find((line) => /^date:/i.test(line));
      assert.ok(getDate);
      assert.ok(headDate);
      assert.ok(Math.abs(Date.parse(headDate.slice(6)) - Date.parse(getDate.slice(6))) <= 1000);
      assert.deepEqual(
        head.headers.filter((line) => !/^date:/i.test(line)).sort(),
        get.headers.filter((line) => !/^date:/i.test(line)).sort(),
      );
      assert.ok(get.body.length > 0);
      assert.equal(head.body.length, 0);
    });
  }
});
