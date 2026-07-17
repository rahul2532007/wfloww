import fs from 'fs';
import path from 'path';

const funcDir = './.vercel/output/functions/__server.func';
const oldSsrDir = path.join(funcDir, '_ssr');
const newSsrDir = path.join(funcDir, 'ssr_build');
const oldLibsDir = path.join(funcDir, '_libs');
const newLibsDir = path.join(funcDir, 'libs_build');

if (fs.existsSync(funcDir)) {
  // Rename directories
  if (fs.existsSync(oldSsrDir)) {
    fs.renameSync(oldSsrDir, newSsrDir);
    console.log('Renamed _ssr to ssr_build');
  }
  if (fs.existsSync(oldLibsDir)) {
    fs.renameSync(oldLibsDir, newLibsDir);
    console.log('Renamed _libs to libs_build');
  }

  // Helper to recursively get all .mjs files
  function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath, files);
      } else if (fullPath.endsWith('.mjs') || fullPath.endsWith('.js')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFiles = getFiles(funcDir);

  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace various quote styles and paths
    const replacements = [
      { from: /"\_ssr\//g, to: '"ssr_build/' },
      { from: /'\_ssr\//g, to: "'ssr_build/" },
      { from: /\/\_ssr\//g, to: "/ssr_build/" },
      
      { from: /"\_libs\//g, to: '"libs_build/' },
      { from: /'\_libs\//g, to: "'libs_build/" },
      { from: /\/\_libs\//g, to: "/libs_build/" },
    ];

    for (const { from, to } of replacements) {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content);
      console.log(`Updated paths in ${file}`);
    }
  }

  console.log("Finished rewriting internal paths to avoid Vercel's underscore folder deletion.");
}
