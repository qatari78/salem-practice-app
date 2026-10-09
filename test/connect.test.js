import { test } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from 'node:net';
import { server } from '../server.js';

test('CONNECT rejects every target with a complete 405 and closes the socket', async (t) => {
  await new Promise((resolve) => server.listen(0, () => resolve(undefined)));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve(undefined));
  }));
  const address = server.address();
  assert.ok(address && typeof address === 'object');

  for (const target of ['example.com:443', '/']) {
    await t.test(`CONNECT ${target}`, async () => {
      /** @type {Promise<string>} */
      const reply = new Promise((resolve, reject) => {
        const socket = connect(address.port, '127.0.0.1');
        let response = '';
        let ended = false;
        socket.setEncoding('utf8');
        socket.on('connect', () => {
          socket.write(`CONNECT ${target} HTTP/1.1\r\nHost: example.com\r\n\r\n`);
        });
        socket.on('data', (chunk) => { response += chunk; });
        socket.on('end', () => { ended = true; });
        socket.on('error', reject);
        socket.on('close', () => {
          if (!ended) {
            reject(new Error('CONNECT socket closed without an orderly end'));
            return;
          }
          resolve(response);
        });
        t.after(() => socket.destroy());
      });
      const response = await reply;
      assert.notEqual(response, '', 'CONNECT socket closed without a reply');
      const separator = response.indexOf('\r\n\r\n');
      assert.notEqual(separator, -1, 'CONNECT response has a complete header block');
      const head = response.slice(0, separator);
      const body = response.slice(separator + 4);
      const [status, ...headerLines] = head.split('\r\n');
      assert.equal(status, 'HTTP/1.1 405 Method Not Allowed');
      const headers = Object.fromEntries(headerLines.map((line) => {
        const colon = line.indexOf(':');
        return [line.slice(0, colon).toLowerCase(), line.slice(colon + 1).trim()];
      }));
      assert.equal(headers.allow, 'GET, HEAD');
      assert.equal(headers['content-type'], 'text/plain; charset=utf-8');
      assert.equal(headers['content-length'], '18');
      assert.equal(headers.connection, 'close');
      assert.equal(headers['transfer-encoding'], undefined);
      assert.equal(body, 'Method not allowed');
      assert.equal(Buffer.byteLength(body), Number(headers['content-length']));
    });
  }
});
