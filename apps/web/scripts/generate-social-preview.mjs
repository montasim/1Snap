import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(projectRoot, '../..');
const width = 1280;
const height = 640;

const paths = {
  screenshot: resolve(projectRoot, 'public/screenshots/1snap-result.png'),
  logo: resolve(projectRoot, 'public/brand/1snap-mark.svg'),
  output: resolve(projectRoot, 'public/social-preview.png'),
  githubOutput: resolve(repositoryRoot, '.github/social-preview.png'),
};

const background = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#fcfdfc"/>
    <rect x="760" y="-96" width="590" height="780" rx="76" fill="#fbe2d7" transform="rotate(-4 760 -96)"/>
    <circle cx="1172" cy="90" r="126" fill="none" stroke="#c74924" stroke-width="2" opacity="0.2"/>
    <circle cx="1172" cy="90" r="78" fill="none" stroke="#c74924" stroke-width="2" opacity="0.16"/>
  </svg>
`);

const screenshot = await sharp(paths.screenshot).resize({ width: 568 }).png().toBuffer();

const logo = await sharp(paths.logo).resize(54, 54).png().toBuffer();

const typography = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#2f3e37" flood-opacity="0.14"/>
      </filter>
    </defs>
    <rect x="632" y="122" width="600" height="388" rx="18" fill="#ffffff" filter="url(#shadow)"/>
    <rect x="632.5" y="122.5" width="599" height="387" rx="17.5" fill="none" stroke="#b7c3bd"/>
    <text x="142" y="101" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-1">1Snap</text>
    <text x="72" y="256" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-3">Every scroll.</text>
    <text x="72" y="326" fill="#c74924" font-family="Instrument Sans, Arial, sans-serif" font-size="64" font-weight="700" letter-spacing="-3">One screenshot.</text>
    <text x="72" y="406" fill="#5d6b65" font-family="Instrument Sans, Arial, sans-serif" font-size="23" font-weight="500">Full-page screenshots for Chrome,</text>
    <text x="72" y="439" fill="#5d6b65" font-family="Instrument Sans, Arial, sans-serif" font-size="23" font-weight="500">stitched locally into one reusable PNG.</text>
    <text x="72" y="548" fill="#973317" font-family="Instrument Sans, Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="0.5">LOCAL  /  COMPLETE  /  READY</text>
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
