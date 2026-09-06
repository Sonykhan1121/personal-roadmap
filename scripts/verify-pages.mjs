import assert from 'node:assert/strict';
import { access, readFile, writeFile } from 'node:fs/promises';

const base = process.env.GITHUB_PAGES === 'true' ? '/personal-roadmap/' : '/';
const html = await readFile('build/index.html', 'utf8');
assert.match(html, /My Learning Roadmap/);
assert.match(html, /type="module"/);
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
assert(
  assets.some((asset) => asset.endsWith('.js')),
  'Missing application bundle',
);
assert(
  assets.some((asset) => asset.endsWith('.css')),
  'Missing application styles',
);
for (const asset of assets) {
  assert(
    asset.startsWith(base),
    `Asset has incorrect repository path: ${asset}`,
  );
  await access(`build/${asset.slice(base.length)}`);
}
await writeFile('build/.nojekyll', '');
console.log(`Static page verified: ${assets.length} linked assets at ${base}`);
