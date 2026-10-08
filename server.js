import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT) || 3000;
const env = process.env.RAILWAY_ENVIRONMENT_NAME || 'local';

export const server = createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, env }));
    return;
  }
  const html = await readFile(new URL('./public/index.html', import.meta.url), 'utf8');
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html.replace('{{ENV}}', env));
});

if (process.argv[1] === new URL(import.meta.url).pathname) {
  server.listen(port, () => console.log(`practice app on ${port} (${env})`));
}
