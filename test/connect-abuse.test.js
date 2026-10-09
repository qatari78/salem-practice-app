import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { connect } from 'node:net';

/** @param {import('node:test').TestContext} t */
async function startServer(t) {
  // A child process makes an uncaught socket error observable as a server crash.
  const child = spawn(process.execPath, ['--input-type=module', '-e',
    "import { server } from './server.js'; server.listen(0, '127.0.0.1', () => console.log(server.address().port));",
  ], { cwd: new URL('../', import.meta.url), stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const closed = new Promise((resolve) => child.once('close', resolve));
  t.after(async () => {
    child.kill();
    await closed;
  });
  /** @type {Promise<number>} */
  const listening = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', () => reject(new Error(`Server exited before listening: ${stderr}`)));
    child.stdout.once('data', (chunk) => resolve(Number(chunk.toString().trim())));
  });
  const port = await listening;
  assert.ok(Number.isInteger(port) && port > 0);
  return { port, child, closed, stderr: () => stderr };
}

/**
 * @param {import('node:test').TestContext} t
 * @param {number} port
 * @param {string} request
 * @param {boolean} reset
 * @returns {Promise<string>}
 */
function sendConnect(t, port, request, reset = false) {
  return new Promise((resolve, reject) => {
    const socket = connect(port, '127.0.0.1');
    t.after(() => socket.destroy());
    let response = '';
    let ended = false;
    socket.setEncoding('utf8');
    socket.on('connect', () => {
      socket.write(request, () => {
        if (reset) socket.resetAndDestroy();
      });
    });
    socket.on('data', (chunk) => { response += chunk; });
    socket.on('end', () => { ended = true; });
    socket.on('error', reject);
    socket.on('close', () => {
      if (!reset && !ended) {
        reject(new Error('CONNECT socket closed without an orderly end'));
        return;
      }
      resolve(response);
    });
  });
}

/** @param {Awaited<ReturnType<typeof startServer>>} running */
async function assertHealthy(running) {
  const response = await Promise.race([
    fetch(`http://127.0.0.1:${running.port}/health`),
    running.closed.then(() => {
      throw new Error(`Server crashed after CONNECT: ${running.stderr()}`);
    }),
  ]).catch((error) => {
    throw new Error(`GET /health failed after CONNECT: ${running.stderr()}`, { cause: error });
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(running.child.exitCode, null, running.stderr());
}

test('reset after CONNECT leaves the server answering GET /health', async (t) => {
  const running = await startServer(t);
  await sendConnect(t, running.port, 'CONNECT a:1 HTTP/1.1\r\nHost: a\r\n\r\n', true);
  await assertHealthy(running);
});

for (const [name, request] of [
  ['a request body', 'CONNECT a:1 HTTP/1.1\r\nHost: a\r\nContent-Length: 4\r\n\r\nbody'],
  ['pipelined data', 'CONNECT a:1 HTTP/1.1\r\nHost: a\r\n\r\nGET /health HTTP/1.1\r\nHost: a\r\n\r\n'],
]) {
  test(`CONNECT with ${name} gets a full 405 and leaves the server healthy`, async (t) => {
    const running = await startServer(t);
    const response = await sendConnect(t, running.port, request);
    assert.equal(response,
      'HTTP/1.1 405 Method Not Allowed\r\n' +
      'Allow: GET, HEAD\r\n' +
      'content-type: text/plain; charset=utf-8\r\n' +
      'content-length: 18\r\n' +
      'connection: close\r\n\r\n' +
      'Method not allowed');
    await assertHealthy(running);
  });
}
