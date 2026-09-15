require('dotenv').config({ override: true });
const { execFileSync } = require('child_process');

const url = process.env.DIRECT_URL;
if (!url) {
  console.error('DIRECT_URL missing');
  process.exit(1);
}

console.log('host', new URL(url).hostname, new URL(url).port);

execFileSync(
  'npx',
  ['prisma', 'db', 'execute', '--file', process.argv[2], '--url', url],
  { stdio: 'inherit', shell: true, env: process.env },
);
