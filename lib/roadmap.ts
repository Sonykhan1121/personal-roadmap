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
};
export const phases = [
  {
    id: 'flutter',
    shortTitle: 'Flutter depth',
    period: 'Months 1–3',
    title: 'Make Flutter your strongest skill.',
    description:
      'Go deeper into the apps you already build. Architecture, testing, performance, and a better understanding of Dart.',
    outcome: 'A reliable Flutter foundation',
    focus: 'Understand what happens under the UI.',
    focusNote:
      'Use an existing app as your practice ground. Improve one real feature at a time.',
  },
  {
    id: 'backend',
    shortTitle: 'Backend & SQL',
    period: 'Months 4–6',
    title: 'Build what powers your app.',
    description:
      'Own the API, the data model, and the access rules behind a Flutter product.',
    outcome: 'A backend you can explain and maintain',
    focus: 'Follow one request from app to database.',
    focusNote:
      'Choose TypeScript and Node.js as one backend stack. Make the fundamentals your priority.',
  },
  {
    id: 'production',
    shortTitle: 'Ship reliably',
    period: 'Months 7–9',
    title: 'Take a working app into the real world.',
    description:
      'Handle weak networks, background jobs, releases, and the things that happen after launch.',
    outcome: 'A product that survives real use',
    focus: 'Design for the unhappy path.',
    focusNote:
      'A finished feature includes retries, permissions, loading states, errors, and visibility into failures.',
  },
  {
    id: 'ai',
    shortTitle: 'Practical AI',
    period: 'Months 10–12',
    title: 'Add AI that earns its place.',
    description:
      'Build a useful AI feature, ground it in the right data, and measure how well it works.',
    outcome: 'One useful, evaluated AI feature',
    focus: 'Start with a user problem.',
    focusNote:
      'You can integrate existing models before learning to train models. Measure quality, speed, and cost.',
  },
  {
    id: 'systems',
    shortTitle: 'Engineering depth',
    period: 'Months 13–18',
    title: 'Make better engineering decisions.',
    description:
      'Deepen system design, mobile platform knowledge, observability, and the tradeoffs behind reliable products.',
    outcome: 'Confidence owning a whole feature',
    focus: 'Learn the tradeoff, then use it.',
    focusNote:
      'Scale the architecture to the product. Explain why a simple solution is enough, and when it stops being enough.',
  },
  {
    id: 'career',
    shortTitle: 'Remote readiness',
    period: 'Months 19–24',
    title: 'Make your work easy to trust.',
    description:
      'Turn your experience into clear case studies, strong interviews, and effective collaboration.',
    outcome: 'Strong evidence for your next role',
    focus: 'Show decisions and outcomes.',
    focusNote:
      'Start applying as early as month 6–9. Use this phase to deepen the gaps that real interviews reveal.',
  },
];
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

import { extraTopics } from './topics-extra';
export const topics: Topic[] = [...foundationTopics, ...extraTopics];
