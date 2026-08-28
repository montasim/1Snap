import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(projectRoot, 'public/brand/1snap-mark.svg');
const outputs = [
  { size: 16, path: 'public/favicon-16.png' },
  { size: 32, path: 'public/favicon-32.png' },
  { size: 180, path: 'public/apple-touch-icon.png' },
];

await Promise.all(
  outputs.map(async ({ size, path }) => {
    const destination = resolve(projectRoot, path);
    await mkdir(dirname(destination), { recursive: true });
    await sharp(source, { density: 512 })
      .resize(size, size, { fit: 'contain' })
      .png({ compressionLevel: 9, palette: true })
      .toFile(destination);
  }),
);

console.log(`Generated ${outputs.length} 1Snap favicon assets.`);
