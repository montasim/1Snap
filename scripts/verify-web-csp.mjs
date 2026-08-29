import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const netlifyConfig = await readFile(resolve(repositoryRoot, 'netlify.toml'), 'utf8');
const supportKoriFrameSources = [
  "frame-src 'self'",
  'https://supportkori.com',
  'https://www.supportkori.com',
];

for (const source of supportKoriFrameSources) {
  assert(
    netlifyConfig.includes(source),
    `The Netlify CSP does not permit the SupportKori widget frame source: ${source}`,
  );
}

console.log('Verified Netlify CSP access for the SupportKori widget.');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
