import { test } from 'node:test';
import assert from 'node:assert/strict';
import legacy from './fixtures/legacy-progress-topics.json' with { type: 'json' };
import { topics, phases } from '../lib/roadmap.ts';
import { phaseWindow, validateEntry, emptyEntry } from '../lib/progress.ts';

test('existing cloud records retain their topic and checkbox meanings', () => {
  for (const prior of legacy) {
    const topic = topics.find((t) => t.id === prior.id);
    assert(topic, `Removed saved topic ${prior.id}`);
    assert.deepEqual(
      topic.steps,
      prior.steps,
      `Reassigned saved checklist positions in ${prior.id}`,
    );
    const entry = {
      ...emptyEntry(prior.id),
      status: 'done',
      checked_steps: prior.steps.map((_, i) => i),
      notes: 'Existing private notes',
      updated_at: '2026-09-06T00:00:00Z',
    };
    assert.deepEqual(validateEntry(entry, topic.steps.length), entry);
  }
});

test('every topic fits the existing database constraints and a reachable stage', () => {
  assert.equal(new Set(topics.map((t) => t.id)).size, topics.length);
  assert.equal(new Set(phases.map((p) => p.id)).size, phases.length);
  for (const topic of topics) {
    assert(topic.id.length > 0 && topic.id.length <= 100);
    assert(
      phases.some((p) => p.id === topic.phase),
      `Unreachable ${topic.id}`,
    );
    assert(
      topic.steps.length > 0 && topic.steps.length <= 10,
      `Checklist exceeds storage contract: ${topic.id}`,
    );
    assert(Number.isFinite(topic.hours) && topic.hours > 0);
    assert(topic.resources.length > 0);
    for (const resource of topic.resources)
      assert.equal(new URL(resource.url).protocol, 'https:');
    if (!legacy.some((t) => t.id === topic.id))
      assert(topic.guide?.trim(), `Missing new lesson: ${topic.id}`);
  }
});

test('expanded stages have valid windows and explicit optional status', () => {
  for (const phase of phases) {
    assert(topics.some((t) => t.phase === phase.id));
    if (phase.months) {
      assert(
        phase.months[0] >= 0 &&
          phase.months[1] > phase.months[0] &&
          phase.months[1] <= 24,
      );
      assert(!phaseWindow('2026-01-31', ...phase.months).includes('Invalid'));
    } else assert.equal(phase.optional, true);
  }
});
