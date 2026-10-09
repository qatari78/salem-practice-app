import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const port = Number(process.env.PORT) || 3000;
const env = process.env.RAILWAY_ENVIRONMENT_NAME || 'local';
const featureTotalTaps = process.env.FEATURE_TOTAL_TAPS !== 'off';
/** @type {{ version: string }} */
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const commit = process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) || 'local';

export const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, {
      Allow: 'GET, HEAD',
      'content-type': 'text/plain; charset=utf-8',
    });
    res.end('Method not allowed');
    return;
  }
  if (req.url === '/health') {
    const body = JSON.stringify({ ok: true, env });
    res.writeHead(200, {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    });
    res.end(body);
    return;
  }
  if (req.url === '/version') {
    const body = JSON.stringify({ version: pkg.version, commit, env });
    res.writeHead(200, {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
    });
    res.end(body);
    return;
  }
  if (req.url === '/robots.txt') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('User-agent: *\nDisallow: /\n');
    return;
  }
  const path = req.url?.split('?')[0];
  if (path !== '/' && path !== '/index.html') {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  let html = await readFile(new URL('./public/index.html', import.meta.url), 'utf8');
  if (!featureTotalTaps) {
    html = html.replace('  <small id="total" data-testid="total">Total taps: 0</small>\n', '');
  }
  const body = html.replace('{{ENV}}', env);
  res.writeHead(200, {
    'content-type': 'text/html; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });
  res.end(body);
});

server.on('connect', (_req, socket) => {
  // Node removes its HTTP socket error listener before emitting CONNECT.
  socket.on('error', () => socket.destroy());
  const body = 'Method not allowed';
  socket.end(
    'HTTP/1.1 405 Method Not Allowed\r\n' +
    'Allow: GET, HEAD\r\n' +
    'content-type: text/plain; charset=utf-8\r\n' +
    `content-length: ${Buffer.byteLength(body)}\r\n` +
    'connection: close\r\n\r\n' +
    body,
  );
});

if (process.argv[1] === new URL(import.meta.url).pathname) {
  server.listen(port, () => console.log(`practice app on ${port} (${env})`));
}
