import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(projectRoot, '../..');
const width = 1280;
const height = 640;

const paths = {
  background: resolve(projectRoot, 'assets/social-preview-background.png'),
  screenshot: resolve(projectRoot, 'public/screenshots/1snap-result.png'),
  logo: resolve(projectRoot, 'public/brand/1snap-mark.svg'),
  output: resolve(projectRoot, 'public/social-preview.png'),
  githubOutput: resolve(repositoryRoot, '.github/social-preview.png'),
};

const background = await sharp(paths.background)
  .resize(width, height, { fit: 'cover', position: 'center' })
  .modulate({ saturation: 0.82, brightness: 1.02 })
  .png()
  .toBuffer();

const screenshot = await sharp(paths.screenshot).resize({ width: 568 }).png().toBuffer();

const logo = await sharp(paths.logo).resize(54, 54).png().toBuffer();

const typography = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#352b3b" flood-opacity="0.16"/>
      </filter>
    </defs>
    <rect x="632" y="122" width="600" height="388" rx="18" fill="#ffffff" filter="url(#shadow)"/>
    <rect x="632.5" y="122.5" width="599" height="387" rx="17.5" fill="none" stroke="#ded9e3"/>
    <text x="142" y="101" fill="#19161f" font-family="Instrument Sans, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-1">1Snap</text>
    <text x="72" y="256" fill="#19161f" font-family="Instrument Sans, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-3">The whole page.</text>
    <text x="72" y="326" fill="#6a3fb5" font-family="Instrument Sans, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-3">One clean shot.</text>
    <text x="72" y="406" fill="#625d69" font-family="Instrument Sans, Arial, sans-serif" font-size="23" font-weight="500">Full-page screenshots for Chrome,</text>
    <text x="72" y="439" fill="#625d69" font-family="Instrument Sans, Arial, sans-serif" font-size="23" font-weight="500">stitched locally into one reusable PNG.</text>
    <text x="72" y="548" fill="#6a3fb5" font-family="Instrument Sans, Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="0.5">INSPECT  /  COPY  /  DOWNLOAD</text>
  </svg>
`);

await mkdir(dirname(paths.output), { recursive: true });
await mkdir(dirname(paths.githubOutput), { recursive: true });
await sharp(background)
  .composite([
    { input: typography, left: 0, top: 0 },
    { input: logo, left: 72, top: 60 },
    { input: screenshot, left: 648, top: 140 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(paths.output);

await copyFile(paths.output, paths.githubOutput);

const outputBytes = (await readFile(paths.output)).byteLength;
console.log(`Generated 1280 × 640 social previews (${outputBytes.toLocaleString()} bytes).`);
