import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(projectRoot, 'public/screenshots/1snap-result.png');
const logoSource = resolve(projectRoot, 'public/brand/1snap-mark.svg');
const width = 1268;
const height = 713;

const logo = await sharp(await readFile(logoSource), { density: 256 })
  .resize(30, 30)
  .png()
  .toBuffer();

const preview = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="proof-shadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#2f3e37" flood-opacity="0.15"/>
      </filter>
    </defs>

    <rect width="1268" height="713" fill="#f4f1ec"/>
    <rect width="1268" height="64" fill="#fffefd"/>
    <path d="M0 63.5H1268" stroke="#d9dedb"/>
    <text x="72" y="42" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="27" font-weight="760" letter-spacing="-1">1Snap</text>

    <circle cx="529" cy="32" r="5" fill="#2b7a55"/>
    <text x="545" y="37" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="14">Capture ready</text>
    <path d="M644 21V43" stroke="#9caaa3"/>
    <text x="659" y="37" fill="#c74924" font-family="Instrument Sans, Arial, sans-serif" font-size="14">900 × 2,400</text>

    <g fill="none" stroke="#c74924" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">
      <rect x="912" y="25" width="10" height="11"/>
      <path d="M916 22h10v11"/>
      <path d="M1006 22v15M1001 32l5 5 5-5M998 41h16"/>
      <path d="M1121 27h16v13h-16zM1125 27v-5h8v5M1125 31h8"/>
    </g>
    <text x="934" y="38" fill="#c74924" font-family="Instrument Sans, Arial, sans-serif" font-size="14" font-weight="560">Copy</text>
    <text x="1023" y="38" fill="#c74924" font-family="Instrument Sans, Arial, sans-serif" font-size="14" font-weight="560">Download</text>
    <path d="M1104 20V44" stroke="#d9dedb"/>
    <text x="1147" y="38" fill="#c74924" font-family="Instrument Sans, Arial, sans-serif" font-size="14" font-weight="560">Support</text>

    <g font-family="IBM Plex Mono, monospace" font-size="10" fill="#17211d">
      <text x="222" y="121">0</text>
      <text x="210" y="569">500</text>
    </g>
    <path d="M251 116V649" stroke="#9caaa3"/>
    <g stroke="#9caaa3">
      <path d="M239 116H251M244 132H251M244 148H251M244 164H251M244 180H251M244 196H251M244 212H251M244 228H251M244 244H251M244 260H251M244 276H251M244 292H251M244 308H251M244 324H251M244 340H251M244 356H251M244 372H251M244 388H251M244 404H251M244 420H251M244 436H251M244 452H251M244 468H251M244 484H251M244 500H251M244 516H251M244 532H251M239 564H251M244 580H251M244 596H251M244 612H251M244 628H251M244 644H251"/>
    </g>

    <g stroke="#17211d" fill="none">
      <path d="M234 100V83H251M1090 83h17v17"/>
    </g>

    <g filter="url(#proof-shadow)">
      <rect x="266" y="116" width="808" height="1100" fill="#fffefd"/>
      <rect x="266" y="196" width="808" height="1020" fill="#f8f4ef"/>
      <rect x="316" y="146" width="136" height="25" fill="#c74924"/>

      <text x="316" y="276" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-1">Quarterly field report</text>
      <text x="316" y="313" fill="#5d6b65" font-family="Instrument Sans, Arial, sans-serif" font-size="17">Prepared for the 1Snap result-page review</text>

      <rect x="316" y="411" width="710" height="526" fill="#fffefd" stroke="#d9dedb" stroke-width="2"/>
      <text x="342" y="458" fill="#c74924" font-family="IBM Plex Mono, monospace" font-size="14" font-weight="700">01</text>
      <text x="388" y="460" fill="#17211d" font-family="Instrument Sans, Arial, sans-serif" font-size="22" font-weight="700">Capture overview</text>
      <rect x="342" y="500" width="524" height="14" fill="#e8e3dc"/>
      <rect x="342" y="542" width="486" height="14" fill="#e8e3dc"/>
      <rect x="342" y="584" width="446" height="14" fill="#e8e3dc"/>
      <rect x="342" y="626" width="400" height="14" fill="#e8e3dc"/>
      <rect x="342" y="668" width="502" height="14" fill="#fbe2d7"/>
      <rect x="342" y="710" width="466" height="14" fill="#e8e3dc"/>
    </g>

    <g fill="none" stroke="#c74924">
      <circle cx="266" cy="116" r="7"/>
      <path d="M254 116h24M266 104v24"/>
      <circle cx="1074" cy="116" r="7"/>
      <path d="M1062 116h24M1074 104v24"/>
    </g>

    <rect y="649" width="1268" height="64" fill="#fffefd"/>
    <path d="M0 649.5H1268" stroke="#d9dedb"/>
    <g stroke="#9caaa3">
      <path d="M120 649V713M281 649V713M427 649V713M553 649V713M652 649V713M751 649V713M851 649V713M986 649V713M1136 649V713"/>
    </g>
    <g font-family="Instrument Sans, Arial, sans-serif" font-size="12">
      <text x="168" y="687" fill="#c74924">1 frame stitched</text>
      <text x="326" y="687" fill="#c74924" text-decoration="underline">example.com</text>
      <text x="456" y="687" fill="#17211d">900 × 2,400 px</text>
      <text x="582" y="687" fill="#17211d">2,400 px</text>
      <text x="690" y="687" fill="#17211d">PNG</text>
      <text x="779" y="687" fill="#17211d">75.3 KB</text>
      <text x="874" y="687" fill="#17211d">Aug 28, 4:42 PM</text>
      <text x="1164" y="687" fill="#2b7a55">Capture ready</text>
    </g>
    <g fill="none" stroke="#c74924" stroke-width="1.5">
      <rect x="146" y="678" width="10" height="9"/>
      <circle cx="306" cy="682" r="7"/>
      <path d="M299 682h14M306 675v14"/>
    </g>
    <circle cx="1154" cy="683" r="7" fill="none" stroke="#2b7a55" stroke-width="1.5"/>
    <path d="m1151 683 2 2 4-5" fill="none" stroke="#2b7a55" stroke-width="1.5"/>

    <rect x="1257" y="0" width="11" height="713" fill="#e6e9e7"/>
    <rect x="1259" y="2" width="7" height="205" rx="3.5" fill="#7a837f"/>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(preview)
  .composite([{ input: logo, left: 31, top: 17 }])
  .png()
  .toFile(output);

console.log('Generated the 1Snap orange result-page preview.');
