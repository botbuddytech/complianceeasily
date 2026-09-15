const crypto = require('crypto');
const fs = require('fs');

const path = '.env';
let e = fs.readFileSync(path, 'utf8');
if (!e.includes('SESSION_SECRET')) {
  const s = crypto.randomBytes(32).toString('hex');
  e = `${e.trimEnd()}\n\n# App session signing (min 32 chars)\nSESSION_SECRET="${s}"\n`;
  fs.writeFileSync(path, e);
  console.log('SESSION_SECRET added');
} else {
  console.log('SESSION_SECRET already present');
}
