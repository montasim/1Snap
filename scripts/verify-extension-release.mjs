import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import JSZip from 'jszip';

const repositoryRoot = resolve(import.meta.dirname, '..');
const extensionPackage = JSON.parse(
  await readFile(resolve(repositoryRoot, 'apps/extension/package.json'), 'utf8'),
);
const version = extensionPackage.version;
const artifactName = `1snap-v${version}-chrome.zip`;
const artifactPath = resolve(repositoryRoot, 'release', artifactName);
const checksumPath = `${artifactPath}.sha256`;
const artifact = await readFile(artifactPath);
const expectedChecksum = (await readFile(checksumPath, 'utf8')).trim().split(/\s+/)[0];
const actualChecksum = createHash('sha256').update(artifact).digest('hex');

assert(actualChecksum === expectedChecksum, 'The release checksum does not match the ZIP.');
assert(artifact.byteLength > 0, 'The release ZIP is empty.');
assert(
  artifact.byteLength < 20 * 1024 * 1024,
  'The release ZIP is unexpectedly larger than 20 MB.',
);

const archive = await JSZip.loadAsync(artifact);
const files = Object.keys(archive.files).filter((path) => !archive.files[path].dir);
const requiredFiles = [
  'manifest.json',
  'background.js',
  'result.html',
  'icon/16.png',
  'icon/32.png',
  'icon/48.png',
  'icon/128.png',
];

for (const path of requiredFiles) {
  assert(files.includes(path), `The release ZIP is missing ${path}.`);
}

for (const path of files) {
  assert(!path.startsWith('/') && !path.split('/').includes('..'), `Unsafe ZIP path: ${path}`);
}

const manifestEntry = archive.file('manifest.json');
assert(manifestEntry, 'The release ZIP has no readable manifest.');
const manifest = JSON.parse(await manifestEntry.async('string'));

assert(manifest.name === '1Snap', 'The release manifest has the wrong extension name.');
assert(manifest.version === version, 'The release manifest version does not match package.json.');
assert(manifest.manifest_version === 3, 'The release is not Chrome Manifest V3.');
assert(
  manifest.minimum_chrome_version === '120',
  'The release manifest has the wrong minimum Chrome version.',
);

for (const permission of ['activeTab', 'clipboardWrite', 'scripting', 'unlimitedStorage']) {
  assert(
    manifest.permissions?.includes(permission),
    `The release manifest is missing ${permission}.`,
  );
}

console.log(
  `Verified ${artifactName}: ${files.length} files, manifest ${version}, SHA-256 ${actualChecksum}.`,
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
