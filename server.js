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
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, env }));
    return;
  }
  if (req.url === '/version') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ version: pkg.version, commit, env }));
    return;
  }
  if (req.url === '/robots.txt') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('User-agent: *\nDisallow: /\n');
    return;
  }
  let html = await readFile(new URL('./public/index.html', import.meta.url), 'utf8');
  if (!featureTotalTaps) {
    html = html.replace('  <small id="total" data-testid="total">Total taps: 0</small>\n', '');
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html.replace('{{ENV}}', env));
});

if (process.argv[1] === new URL(import.meta.url).pathname) {
  server.listen(port, () => console.log(`practice app on ${port} (${env})`));
}
