// Build check: start the app exactly as Railway does (npm start) and require /health to answer.
import { spawn } from 'node:child_process';

const port = 4174;
const app = spawn('npm', ['start'], { env: { ...process.env, PORT: String(port) }, stdio: 'inherit', detached: true });
let ok = false;
for (let i = 0; i < 40 && !ok; i++) {
  await new Promise((r) => setTimeout(r, 250));
  try {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    ok = res.ok && (await res.json()).ok === true;
  } catch {
    // not up yet
  }
}
process.kill(-app.pid, 'SIGTERM'); // npm and the app it started
if (!ok) {
  console.error('build check: the app did not answer /health within 10 s');
  process.exit(1);
}
console.log('build check: app starts and /health answers');
