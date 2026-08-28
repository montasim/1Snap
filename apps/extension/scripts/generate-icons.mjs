import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const source = resolve('public/icon/source.svg');
const provenance =
  'Direct Sharp export from the authored 1Snap SVG: a bold white numeral one with a capture corner on process aubergine, finished with one registration-amber target.';

for (const size of [16, 32, 48, 128]) {
  const output = resolve(`public/icon/${size}.png`);
  await mkdir(dirname(output), { recursive: true });
  await sharp(source)
    .resize(size, size)
    .png()
    .withExif({ IFD0: { ImageDescription: provenance, Software: '1Snap icon generator' } })
    .toFile(output);
}

console.log('Generated 1Snap icons at 16, 32, 48, and 128 pixels.');
