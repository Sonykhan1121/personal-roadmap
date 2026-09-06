export type Phase = {
  id: string;
  shortTitle: string;
  period: string;
  months?: [number, number];
  optional?: boolean;
  title: string;
  description: string;
  outcome: string;
  focus: string;
  focusNote: string;
};

export const phases: Phase[] = [
  {
    id: 'dart',
    shortTitle: 'Dart foundations',
    period: 'Month 1',
    months: [0, 1],
    title: 'Know the language behind your widgets.',
    description:
      'Your Dart notes, organized into practical lessons: OOP, modifiers, mixins, generics, null safety, and modern syntax.',
    outcome: 'A clear, type-safe Dart foundation',
    focus: 'Explain it, then build a small example.',
    focusNote:
      'You already have Flutter experience. Use the checklists to confirm what you know and spend time on the gaps.',
  },
  {
    id: 'async',
    shortTitle: 'Async & data',
    period: 'Months 2–3',
    months: [1, 3],
    title: 'Control time, events, and local data.',
    description:
      'Futures, streams, RxDart, isolates, persistence, and migrations. Make asynchronous behavior predictable.',
    outcome: 'Responsive features with durable data',
    focus: 'Test the order you did not expect.',
    focusNote:
      'Simulate cancellation, reordered responses, app restarts, and a weak connection. Pick one local database.',
  },
  {
    id: 'flutter',
    shortTitle: 'Flutter core & UI',
    period: 'Months 3–5',
    months: [2, 5],
    title: 'Understand the UI from widget to pixel.',
    description:
      'Lifecycle, BuildContext, keys, responsive layouts, accessibility, localization, rendering, custom UI, slivers, testing, and profiling.',
    outcome: 'A reliable, accessible Flutter feature',
    focus: 'Understand what happens under the UI.',
    focusNote:
      'Improve an existing app. These stages overlap: apply language and async knowledge as you build and measure real features.',
  },
  {
    id: 'architecture',
    shortTitle: 'Architecture',
    period: 'Months 4–6',
    months: [3, 6],
    title: 'Make features easier to change.',
    description:
      'Compare state-management tools, then practice one. Add clean boundaries, restoration, code generation, and dependency injection.',
    outcome: 'Testable state and clear dependencies',
    focus: 'Choose one approach and learn it deeply.',
    focusNote:
      'Provider, GetX, Riverpod, and BLoC are alternatives. Avoid turning the roadmap into four rewrites of the same app.',
  },
  {
    id: 'backend',
    shortTitle: 'Backend & SQL',
    period: 'Months 6–9',
    months: [5, 9],
    title: 'Build what powers your app.',
    description:
      'Own APIs, data models, and access rules. Add REST clients, GraphQL, realtime, gRPC, and platform comparisons where they solve a real need.',
    outcome: 'A backend you can explain and maintain',
    focus: 'Follow one request from app to database.',
    focusNote:
      'Keep TypeScript/Node.js and PostgreSQL as the main path. Compare Python, MongoDB, and hosted platforms before choosing alternatives.',
  },
  {
    id: 'production',
    shortTitle: 'Ship reliably',
    period: 'Months 9–12',
    months: [8, 12],
    title: 'Take a working app into the real world.',
    description:
      'Background work, tests, flavors, CI/CD, monitoring, secure device access, updates, and store releases.',
    outcome: 'A product that survives real use',
    focus: 'Design for the unhappy path.',
    focusNote:
      'A finished feature includes retries, permissions, loading states, errors, and visibility into failures.',
  },
  {
    id: 'ai',
    shortTitle: 'Practical AI',
    period: 'Months 12–15',
    months: [11, 15],
    title: 'Add AI that earns its place.',
    description:
      'Integrate useful hosted or on-device models, ground them in the right data, and measure quality, latency, and cost.',
    outcome: 'One useful, evaluated AI feature',
    focus: 'Start with a user problem.',
    focusNote:
      'Integration comes before model training. Compare hosted APIs with LiteRT/TensorFlow Lite and ONNX for a specific device and use case.',
  },
  {
    id: 'systems',
    shortTitle: 'Engineering depth',
    period: 'Months 15–19',
    months: [14, 19],
    title: 'Make better engineering decisions.',
    description:
      'System design, native plugins, security, observability, and Flutter Web/Desktop/Wasm tradeoffs.',
    outcome: 'Confidence owning a whole feature',
    focus: 'Learn the tradeoff, then use it.',
    focusNote:
      'Scale the architecture to the product. Explain why a simple solution is enough, and when it stops being enough.',
  },
  {
    id: 'career',
    shortTitle: 'Remote readiness',
    period: 'Months 19–24',
    months: [18, 24],
    title: 'Make your work easy to trust.',
    description:
      'Turn your experience into clear case studies, strong interviews, and effective remote collaboration.',
    outcome: 'Strong evidence for your next role',
    focus: 'Show decisions and outcomes.',
    focusNote:
      'Start applying earlier when you have a strong project. Use interviews to discover gaps while continuing this path.',
  },
  {
    id: 'advanced',
    shortTitle: 'Optional explorations',
    period: 'Choose when relevant',
    optional: true,
    title: 'Explore a specialization with a purpose.',
    description:
      'Dart FFI, embedded/edge devices, ARKit/ARCore, Rive/Lottie/Flame, and WalletConnect/Ethers.dart. These are optional directions, not prerequisites for your next role.',
    outcome: 'One specialization supported by a real prototype',
    focus: 'Choose from product needs and curiosity.',
    focusNote:
      'You do not need to finish every exploration. Keep your core Flutter, backend, reliability, and AI skills as the priority.',
  },
];
