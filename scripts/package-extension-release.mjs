import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename, resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const extensionPackage = JSON.parse(
  await readFile(resolve(repositoryRoot, 'apps/extension/package.json'), 'utf8'),
);
const version = extensionPackage.version;
const source = resolve(repositoryRoot, `apps/extension/.output/1snap-${version}-chrome.zip`);
const releaseDirectory = resolve(repositoryRoot, 'release');
const artifact = resolve(releaseDirectory, `1snap-v${version}-chrome.zip`);

await mkdir(releaseDirectory, { recursive: true });
await copyFile(source, artifact);

const digest = createHash('sha256')
  .update(await readFile(artifact))
  .digest('hex');
await writeFile(`${artifact}.sha256`, `${digest}  ${basename(artifact)}\n`, 'utf8');

console.log(`Prepared ${basename(artifact)} with SHA-256 ${digest}.`);
