export type Topic = {
  id: string;
  phase: string;
  title: string;
  summary: string;
  hours: number;
  steps: string[];
  proof: string;
  resources: { title: string; url: string }[];
  project?: boolean;
  guide?: string;
};
export { phases } from './phases.ts';

const foundationTopics: Topic[] = [
  {
    id: 'dart-concurrency',
    phase: 'flutter',
    title: 'Dart async & concurrency',
    summary:
      'Understand futures, streams, cancellation, and when an isolate helps.',
    hours: 14,
    steps: [
      'Trace the event loop and explain a Future versus a Stream.',
      'Handle errors, dispose subscriptions, and avoid stale requests.',
      'Move a CPU-heavy task to an isolate and compare responsiveness.',
    ],
    proof:
      'Build a cancellable search feature and explain why network I/O does not need an isolate.',
    resources: [
      {
        title: 'Concurrency in Dart',
        url: 'https://dart.dev/language/concurrency',
      },
      {
        title: 'Asynchronous programming',
        url: 'https://dart.dev/libraries/async/async-await',
      },
    ],
  },
  {
    id: 'flutter-architecture',
    phase: 'flutter',
    title: 'Architecture & state',
    summary:
      'Keep widgets, business rules, and data access easy to change independently.',
    hours: 18,
    steps: [
      'Separate a feature into UI and data responsibilities.',
      'Use one state-management approach consistently.',
      'Introduce repositories and inject dependencies where they help testing.',
    ],
    proof: 'Swap a real repository for a fake without rewriting the UI.',
    resources: [
      {
        title: 'Flutter architecture recommendations',
        url: 'https://docs.flutter.dev/app-architecture/recommendations',
      },
      {
        title: 'Architecture case study',
        url: 'https://docs.flutter.dev/app-architecture/case-study',
      },
    ],
  },
  {
    id: 'flutter-testing',
    phase: 'flutter',
    title: 'Test the important behavior',
    summary: 'Make your core user journeys safe to change.',
    hours: 16,
    steps: [
      'Write unit tests for business rules and failure cases.',
      'Test widget states and user interactions.',
      'Add an integration test for one critical flow.',
    ],
    proof:
      'Change a core feature confidently because tests catch a deliberately introduced regression.',
    resources: [
      {
        title: 'Testing Flutter apps',
        url: 'https://docs.flutter.dev/testing/overview',
      },
    ],
  },
  {
    id: 'flutter-performance',
    phase: 'flutter',
    title: 'Profile before optimizing',
    summary:
      'Find slow frames, unnecessary work, and memory problems with evidence.',
    hours: 12,
    steps: [
      'Profile on a physical device in profile mode.',
      'Inspect slow frames and rebuilds in DevTools.',
      'Measure an improvement and document the before/after.',
    ],
    proof:
      'Show a repeatable performance improvement on the same device and scenario.',
    resources: [
      { title: 'Flutter performance', url: 'https://docs.flutter.dev/perf' },
      {
        title: 'DevTools performance view',
        url: 'https://docs.flutter.dev/tools/devtools/performance',
      },
    ],
  },
];

import { extraTopics } from './topics-extra.ts';
import additions from './curriculum-additions.json' with { type: 'json' };
import guideContent from './study-notes.json' with { type: 'json' };
import { phases } from './phases.ts';

const guides: Record<string, string> = guideContent;
const relocated: Record<string, string> = {
  'dart-concurrency': 'async',
  'local-data': 'async',
  'flutter-architecture': 'architecture',
};
// IDs and checklist positions are a persistence contract. Keep the originals
// intact when moving topics; new lessons have their own stable IDs.
const allTopics: Topic[] = [
  ...foundationTopics,
  ...extraTopics,
  ...additions,
].map((topic) => ({
  ...topic,
  phase: relocated[topic.id] ?? topic.phase,
  guide: guides[topic.id],
}));
export const topics: Topic[] = phases.flatMap((phase) => {
  const items = allTopics.filter((topic) => topic.phase === phase.id);
  return [
    ...items.filter((topic) => !topic.project),
    ...items.filter((topic) => topic.project),
  ];
});
