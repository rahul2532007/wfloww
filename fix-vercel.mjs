import fs from 'fs';
import path from 'path';

const funcDir = './.vercel/output/functions/__server.func';
const ssrDir = path.join(funcDir, '_ssr');
const libsDir = path.join(funcDir, '_libs');

if (fs.existsSync(funcDir)) {
  const filesToInclude = [];

  // Helper to recursively get files
  function getFiles(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.posix.join(prefix, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath, relativePath);
      } else {
        filesToInclude.push(relativePath);
      }
    }
  }

  getFiles(ssrDir, '_ssr');
  getFiles(libsDir, '_libs');

  // Also include anything else in the function dir just in case
  const rootItems = fs.readdirSync(funcDir);
  for (const item of rootItems) {
    if (item.endsWith('.mjs') && item !== 'index.mjs') {
      filesToInclude.push(item);
    }
  }

  const nftJson = {
    version: 1,
    files: filesToInclude
  };

  const nftPath = path.join(funcDir, 'index.mjs.nft.json');
  fs.writeFileSync(nftPath, JSON.stringify(nftJson, null, 2));
  console.log(`Generated ${nftPath} with ${filesToInclude.length} files.`);
}
