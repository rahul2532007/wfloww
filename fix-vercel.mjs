import fs from 'fs';
import path from 'path';

const funcDir = './.vercel/output/functions/__server.func';
const ssrDir = path.join(funcDir, '_ssr');
if (fs.existsSync(ssrDir)) {
  const indexFile = path.join(funcDir, 'index.mjs');
  let content = fs.readFileSync(indexFile, 'utf8');
  
  const debugCode = `
import fs from 'fs';
try {
  console.log("DEBUG: CONTENTS OF /var/task");
  console.log(fs.readdirSync('/var/task'));
  console.log("DEBUG: CONTENTS OF /var/task/_ssr");
  console.log(fs.readdirSync('/var/task/_ssr'));
} catch (e) {
  console.log("DEBUG ERROR:", e.message);
}
`;
  
  content = debugCode + content;
  fs.writeFileSync(indexFile, content);
  console.log("Patched index.mjs with debug code");
}
