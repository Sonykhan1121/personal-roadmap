import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import guides from '../lib/study-notes.json' with { type: 'json' };
await mkdir('work', { recursive: true });
const temp = await mkdtemp('work/lesson-test-');
const { outputText } = ts.transpileModule(
  await readFile('components/study-guide.tsx', 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
    },
  },
);
await writeFile(`${temp}/study-guide.mjs`, outputText);
const { StudyGuide } = await import(
  pathToFileURL(resolve(temp, 'study-guide.mjs')).href
);
after(() => rm(temp, { recursive: true, force: true }));
const render = (content) =>
  renderToStaticMarkup(React.createElement(StudyGuide, { content }));

test('Dart lessons render actual reference tables and escaped code', () => {
  const html = render(guides['dart-oop']);
  assert.match(html, /<table>/);
  assert.match(html, /<pre><code class="language-dart">/);
  assert.match(render(guides['dart-generics']), /ApiResponse&lt;T&gt;/);
  assert.match(
    render(guides['dart-records-patterns']),
    /var User\(:name, :age\)/,
  );
});
test('study notes cannot create executable HTML or javascript links', () => {
  const html = render(
    '<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n[docs](https://dart.dev)',
  );
  assert(!html.includes('<script'));
  assert(!html.includes('href="javascript:'));
  assert.match(
    html,
    /href="https:\/\/dart.dev" target="_blank" rel="noreferrer"/,
  );
});
