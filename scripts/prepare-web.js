const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'www');
const requiredFiles = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'match-clock.js',
  'item-icons.js',
  'inventory-ledger.js',
  'skill-data-engine.js',
  'build-data-engine.js',
  'specializations.js',
  'patch-data-742.js',
  'statsdota-guides.json'
];

for (const file of requiredFiles) {
  const source = path.join(root, file);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`Required web asset is missing: ${file}`);
  }
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of requiredFiles) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

const iconsSource = path.join(root, 'icons');
if (!fs.existsSync(iconsSource)) {
  throw new Error('Required icons directory is missing.');
}
fs.cpSync(iconsSource, path.join(output, 'icons'), { recursive: true });

console.log(`Prepared Capacitor web bundle at ${output}`);
console.log(`Copied ${requiredFiles.length} application files and icons.`);
