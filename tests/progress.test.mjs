import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyEntry,
  validateEntry,
  summarize,
  phaseDates,
  isDateString,
} from '../lib/progress.ts';

test('skipped topics do not inflate completion', () => {
  assert.deepEqual(
    summarize(['a', 'b', 'c', 'd'], {
      a: { status: 'done' },
      b: { status: 'skipped' },
      c: { status: 'learning' },
    }),
    { done: 1, active: 1, skipped: 1, total: 4, percent: 25 },
  );
  assert.equal(summarize([], {}).percent, 0);
});
test('untrusted evidence links and oversized notes are rejected', () => {
  assert.throws(() =>
    validateEntry(
      { ...emptyEntry('a'), evidence_url: 'javascript:alert(1)' },
      3,
    ),
  );
  assert.throws(() =>
    validateEntry({ ...emptyEntry('a'), notes: 'x'.repeat(20001) }, 3),
  );
  assert.equal(
    validateEntry(
      {
        ...emptyEntry('a'),
        evidence_url: ' https://github.com/example/project ',
      },
      3,
    ).evidence_url,
    'https://github.com/example/project',
  );
});
test('checklists cannot reference nonexistent items and normalize duplicates', () => {
  assert.throws(() =>
    validateEntry({ ...emptyEntry('a'), checked_steps: [-1] }, 3),
  );
  assert.throws(() =>
    validateEntry({ ...emptyEntry('a'), checked_steps: [3] }, 3),
  );
  assert.throws(() =>
    validateEntry({ ...emptyEntry('a'), checked_steps: [1.5] }, 3),
  );
  assert.deepEqual(
    validateEntry({ ...emptyEntry('a'), checked_steps: [2, 0, 2] }, 3)
      .checked_steps,
    [0, 2],
  );
});
test('invalid statuses and impossible dates cannot enter saved progress', () => {
  assert.throws(() => validateEntry({ ...emptyEntry('a'), status: 'fake' }, 3));
  assert.throws(() =>
    validateEntry({ ...emptyEntry('a'), review_date: '2026-02-30' }, 3),
  );
  assert.equal(isDateString('2028-02-29'), true);
  assert.equal(isDateString('2026-02-29'), false);
});
test('phase dates preserve intended months for end-of-month starts', () => {
  assert.equal(phaseDates('2026-01-31', 0), 'Jan 2026 – Apr 2026');
  assert.equal(phaseDates('2026-09-06', 5), 'Mar 2028 – Sep 2028');
});
