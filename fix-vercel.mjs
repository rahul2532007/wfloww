import fs from 'fs';
import path from 'path';

const funcDir = './.vercel/output/functions/__server.func';
const ssrDir = path.join(funcDir, '_ssr');
if (fs.existsSync(ssrDir)) {
  const files = fs.readdirSync(ssrDir).filter(f => f.endsWith('.mjs'));
  let imports = '';
  for (const file of files) {
    imports += `import "./_ssr/${file}";\n`;
  }
  const indexFile = path.join(funcDir, 'index.mjs');
  let content = fs.readFileSync(indexFile, 'utf8');
  content = imports + content;
  fs.writeFileSync(indexFile, content);
  console.log("Patched index.mjs for Vercel NFT tracing");
}
