import fs from 'fs';
import path from 'path';

const funcDir = './.vercel/output/functions/__server.func';
const indexFile = path.join(funcDir, 'index.mjs');

if (fs.existsSync(indexFile)) {
  let content = fs.readFileSync(indexFile, 'utf8');

  // Inject a robust directory listing script at the very top
  const debugScript = `
import fs from 'fs';
import path from 'path';

function getFilesStr(dir) {
  let res = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (fs.statSync(path.join(dir, item)).isDirectory()) {
        res.push(item + "/...");
      } else {
        res.push(item);
      }
    }
  } catch(e) {
    res.push("ERROR: " + e.message);
  }
  return res.join(", ");
}

console.log("=== VERCEL DEBUG TASK FILES ===");
console.log("Root: " + getFilesStr('/var/task'));
console.log("Libs: " + getFilesStr('/var/task/_libs'));
console.log("SSR: " + getFilesStr('/var/task/_ssr'));
console.log("===============================");
`;

  fs.writeFileSync(indexFile, debugScript + '\n' + content);
  console.log("Injected Vercel debug script into index.mjs");
}
