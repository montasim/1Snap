import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const previewPath = resolve(projectRoot, 'public/screenshots/1snap-result.png');
const expected = { format: 'png', width: 1268, height: 713 };
const metadata = await sharp(previewPath).metadata();

for (const [property, value] of Object.entries(expected)) {
  if (metadata[property] !== value) {
    throw new Error(
      `Expected the result preview ${property} to be ${value}, received ${metadata[property] ?? 'nothing'}.`,
    );
  }
}

console.log('Verified the 1268 × 713 1Snap result-page preview.');
