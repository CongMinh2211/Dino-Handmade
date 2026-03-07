import { writeFileSync } from 'fs';

async function test() {
  try {
    await import('./server.js');
  } catch (err) {
    writeFileSync('crash.txt', err.stack || err.message || err.toString());
  }
}
test();
