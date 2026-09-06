import type { Topic } from './roadmap';
const make = (
  phase: string,
  id: string,
  title: string,
  summary: string,
  hours: number,
  steps: string[],
  proof: string,
  resources: [string, string][],
  project = false,
): Topic => ({
  phase,
  id,
  title,
  summary,
  hours,
  steps,
  proof,
  resources: resources.map(([title, url]) => ({ title, url })),
  project,
});
export const extraTopics: Topic[] = [
  make(
    'flutter',
    'local-data',
    'Local data & resilience',
    'Keep useful features working through slow connections and app restarts.',
    14,
    [
      'Model local data and cache freshness.',
      'Handle loading, empty, error, and stale-data states.',
      'Test airplane mode and interrupted writes.',
    ],
    'Reopen the app offline and recover cleanly when the network returns.',
    [
      [
        'Offline-first architecture',
        'https://docs.flutter.dev/app-architecture/design-patterns/offline-first',
      ],
      [
        'SQLite persistence',
        'https://docs.flutter.dev/cookbook/persistence/sqlite',
      ],
    ],
  ),
  make(
    'flutter',
    'accessible-flutter',
    'Accessible, adaptive UI',
    'Make the same feature work for different devices and people.',
    12,
    [
      'Support large text without clipping content.',
      'Label actions for screen readers and check focus order.',
      'Adapt a feature for compact and large screens.',
    ],
    'Complete a core flow with a screen reader and with large text enabled.',
    [
      [
        'Flutter accessibility',
        'https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility',
      ],
      [
        'Adaptive and responsive design',
        'https://docs.flutter.dev/ui/adaptive-responsive',
      ],
    ],
  ),
  make(
    'flutter',
    'flutter-milestone',
    'Milestone: upgrade a real app',
    'Ship a focused improvement to an app you already understand.',
    26,
    [
      'Choose one feature with a real reliability or performance problem.',
      'Refactor, test, and measure it on a physical device.',
      'Write a short before/after explanation and record a demo.',
    ],
    'Show the feature, its tests, one measured improvement, and the tradeoffs you made.',
    [
      ['Flutter testing', 'https://docs.flutter.dev/testing/overview'],
      ['Performance guidance', 'https://docs.flutter.dev/perf'],
    ],
    true,
  ),
  make(
    'backend',
    'http-typescript',
    'HTTP, JavaScript & TypeScript',
    'Build the language and networking foundation for one backend stack.',
    18,
    [
      'Review JavaScript objects, functions, modules, promises, and errors.',
      'Use TypeScript unions, narrowing, and generics in practical code.',
      'Inspect HTTP methods, status codes, headers, TLS, and JSON.',
    ],
    'Explain a Flutter API request end to end and validate an unknown JSON response.',
    [
      [
        'TypeScript handbook',
        'https://www.typescriptlang.org/docs/handbook/intro.html',
      ],
      [
        'HTTP overview',
        'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview',
      ],
    ],
  ),
  make(
    'backend',
    'node-api',
    'Build a Node.js API',
    'Create predictable endpoints that handle valid and invalid input.',
    18,
    [
      'Build a small REST API with one framework.',
      'Validate requests and return consistent errors.',
      'Add pagination, filtering, and request-level tests.',
    ],
    'Implement a paginated endpoint with validation and tests for failure cases.',
    [
      [
        'Node.js introduction',
        'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
      ],
      ['Express routing', 'https://expressjs.com/en/guide/routing.html'],
    ],
  ),
  make(
    'backend',
    'sql-data-model',
    'PostgreSQL & data modeling',
    'Learn the relationships and constraints behind trustworthy data.',
    22,
    [
      'Model users, teams, and tasks with keys and constraints.',
      'Write joins, aggregations, and transactions in SQL.',
      'Use EXPLAIN to inspect a query and justify an index.',
    ],
    'Prevent inconsistent records with database constraints and explain a query plan.',
    [
      [
        'PostgreSQL tutorial',
        'https://www.postgresql.org/docs/current/tutorial.html',
      ],
      [
        'Using EXPLAIN',
        'https://www.postgresql.org/docs/current/using-explain.html',
      ],
    ],
  ),
  make(
    'backend',
    'auth-authorization',
    'Authentication & authorization',
    'Know who is signed in and exactly what they may access.',
    16,
    [
      'Explain sessions, access tokens, refresh tokens, and expiration.',
      'Enforce ownership and roles on the server or with database policies.',
      'Test attempts to read or modify another user’s records.',
    ],
    'Prove that a second user cannot access the first user’s private data.',
    [
      [
        'Supabase Auth architecture',
        'https://supabase.com/docs/guides/auth/architecture',
      ],
      [
        'Row-level security',
        'https://supabase.com/docs/guides/database/postgres/row-level-security',
      ],
    ],
  ),
  make(
    'backend',
    'schema-migrations',
    'Migrations & data lifecycle',
    'Change the database without losing existing records.',
    12,
    [
      'Write a repeatable schema migration.',
      'Separate schema changes from large backfills.',
      'Practice backup and restore in a development database.',
    ],
    'Apply a schema change to populated test data and recover from a failed change.',
    [
      [
        'Database migrations',
        'https://supabase.com/docs/guides/deployment/database-migrations',
      ],
      [
        'PostgreSQL backup',
        'https://www.postgresql.org/docs/current/backup.html',
      ],
    ],
  ),
  make(
    'backend',
    'api-security',
    'Practical API security',
    'Protect the boundaries where untrusted requests reach your app.',
    14,
    [
      'Use parameterized database queries and validate input.',
      'Keep privileged credentials on the server.',
      'Apply rate limits and test object-level authorization.',
    ],
    'Demonstrate blocked cross-user access and a documented secret-handling strategy.',
    [
      [
        'OWASP API Security project',
        'https://owasp.org/www-project-api-security/',
      ],
      [
        'Express security practices',
        'https://expressjs.com/en/advanced/best-practice-security.html',
      ],
    ],
  ),
  make(
    'backend',
    'backend-milestone',
    'Milestone: own the backend',
    'Connect your Flutter app to a backend you can maintain.',
    30,
    [
      'Build a team task or field-service API with PostgreSQL.',
      'Add ownership checks, migrations, and integration tests.',
      'Connect Flutter and document the API and setup steps.',
    ],
    'A fresh checkout can run the backend and its tests, and your Flutter app uses it.',
    [
      ['Backend project ideas', 'https://roadmap.sh/backend/projects'],
      [
        'Flutter networking',
        'https://docs.flutter.dev/data-and-backend/networking',
      ],
    ],
    true,
  ),
  make(
    'production',
    'offline-sync',
    'Offline sync & conflicts',
    'Make edits survive connection loss without creating duplicates.',
    18,
    [
      'Queue local changes and assign stable request identifiers.',
      'Define what happens when two devices edit the same record.',
      'Test interruptions during upload and retry.',
    ],
    'Perform the same queued operation twice without duplicating the result.',
    [
      [
        'Offline-first Flutter',
        'https://docs.flutter.dev/app-architecture/design-patterns/offline-first',
      ],
      [
        'Idempotent HTTP methods',
        'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
      ],
    ],
  ),
  make(
    'production',
    'background-work',
    'Background jobs & notifications',
    'Move slow work out of requests and notify users meaningfully.',
    16,
    [
      'Separate a user request from a background task.',
      'Add bounded retries and a failed-job path.',
      'Respect notification permissions and app lifecycle constraints.',
    ],
    'A retried job produces one intended result and records a useful failure reason.',
    [
      [
        'Firebase Cloud Messaging for Flutter',
        'https://firebase.google.com/docs/cloud-messaging/flutter/client',
      ],
      [
        'Background processes in Flutter',
        'https://docs.flutter.dev/packages-and-plugins/background-processes',
      ],
    ],
  ),
  make(
    'production',
    'delivery-pipeline',
    'Continuous integration & releases',
    'Make each release repeatable and easy to verify.',
    16,
    [
      'Run linting and relevant tests for pull requests.',
      'Separate development and production configuration.',
      'Build release artifacts and document a rollback procedure.',
    ],
    'Produce a release from a clean checkout without manual code changes.',
    [
      ['GitHub Actions documentation', 'https://docs.github.com/en/actions'],
      ['Flutter deployment', 'https://docs.flutter.dev/deployment'],
    ],
  ),
  make(
    'production',
    'monitoring',
    'Logs, crashes & useful signals',
    'Know when a user-facing feature fails and where to look next.',
    14,
    [
      'Add contextual, non-sensitive logs and request identifiers.',
      'Capture crashes and handled failures.',
      'Track error rate and latency for a core journey.',
    ],
    'Follow a failed mobile request into the backend and identify its cause.',
    [
      [
        'Firebase Crashlytics for Flutter',
        'https://firebase.google.com/docs/crashlytics/get-started?platform=flutter',
      ],
      ['OpenTelemetry concepts', 'https://opentelemetry.io/docs/concepts/'],
    ],
  ),
  make(
    'production',
    'release-quality',
    'Release quality & recovery',
    'Test the real conditions that a happy-path demo misses.',
    14,
    [
      'Cover poor networks, expired sessions, and denied permissions.',
      'Test schema and app-version compatibility.',
      'Write a short incident response and rollback checklist.',
    ],
    'Recover from a simulated bad release and explain what alerted you.',
    [
      [
        'Flutter integration testing',
        'https://docs.flutter.dev/testing/integration-tests',
      ],
      [
        'Site Reliability Engineering book',
        'https://sre.google/sre-book/table-of-contents/',
      ],
    ],
  ),
  make(
    'production',
    'ai-coding-habits',
    'Use AI with engineering judgment',
    'Use coding assistance while staying able to explain and debug your work.',
    12,
    [
      'Write acceptance criteria before requesting generated code.',
      'Review diffs, dependencies, edge cases, and access rules.',
      'Reproduce a bug and fix it without relying on the generated explanation.',
    ],
    'Explain every important line in an AI-assisted change and show how you validated it.',
    [
      [
        'Code review guidance',
        'https://google.github.io/eng-practices/review/',
      ],
      [
        'AI-assisted development research',
        'https://dora.dev/research/2025/dora-report/',
      ],
    ],
  ),
  make(
    'production',
    'production-milestone',
    'Milestone: ship to real users',
    'Deliver a small product and learn from actual usage.',
    32,
    [
      'Release the Flutter product to a small test group.',
      'Collect feedback with consent and fix the most costly problem.',
      'Document release steps, metrics, and one incident or failure scenario.',
    ],
    'A person other than you can complete the main task, and you can diagnose failures.',
    [
      ['Flutter release documentation', 'https://docs.flutter.dev/deployment'],
      [
        'Firebase App Distribution',
        'https://firebase.google.com/docs/app-distribution',
      ],
    ],
    true,
  ),
  make(
    'ai',
    'ai-foundations',
    'Model APIs & structured output',
    'Understand what model calls can do and how they fail.',
    16,
    [
      'Learn context windows, tokens, latency, and usage-based cost.',
      'Call a model from the backend and validate structured results.',
      'Handle timeouts, refusals, and malformed output explicitly.',
    ],
    'Turn a model response into validated app data without trusting arbitrary text.',
    [
      ['Gemini API overview', 'https://ai.google.dev/gemini-api/docs'],
      [
        'Structured outputs',
        'https://ai.google.dev/gemini-api/docs/structured-output',
      ],
    ],
  ),
  make(
    'ai',
    'ai-mobile-ux',
    'Streaming & mobile AI UX',
    'Make long-running responses understandable and controllable.',
    12,
    [
      'Stream useful partial output to Flutter.',
      'Allow cancellation and prevent duplicate submissions.',
      'Explain waiting, failure, and retry states in the interface.',
    ],
    'Cancel an AI request without stale content appearing in a later conversation.',
    [
      [
        'Flutter networking',
        'https://docs.flutter.dev/data-and-backend/networking',
      ],
      [
        'Generating model responses',
        'https://ai.google.dev/gemini-api/docs/text-generation',
      ],
    ],
  ),
  make(
    'ai',
    'retrieval',
    'Embeddings & grounded retrieval',
    'Answer questions using your own approved documents.',
    20,
    [
      'Split documents into useful chunks and preserve source metadata.',
      'Create embeddings and retrieve relevant passages.',
      'Return source links and handle questions with no supporting evidence.',
    ],
    'Answer a small set of document questions with inspectable supporting sources.',
    [
      ['Embeddings', 'https://ai.google.dev/gemini-api/docs/embeddings'],
      [
        'Vector search with PostgreSQL',
        'https://supabase.com/docs/guides/ai/vector-columns',
      ],
    ],
  ),
  make(
    'ai',
    'tool-calling',
    'Tool calling & action boundaries',
    'Let a model request bounded actions through your backend.',
    14,
    [
      'Define a small typed tool schema.',
      'Validate arguments and authorize each action server-side.',
      'Require user confirmation before consequential actions.',
    ],
    'A model can look up permitted records but cannot change another user’s data.',
    [
      [
        'Function calling',
        'https://ai.google.dev/gemini-api/docs/function-calling',
      ],
      ['OWASP GenAI security', 'https://genai.owasp.org/'],
    ],
  ),
  make(
    'ai',
    'ai-evaluations',
    'Evaluate quality & regressions',
    'Replace “it seems good” with repeatable evidence.',
    18,
    [
      'Create 30–50 realistic questions and expected behaviors.',
      'Track answer correctness, groundedness, latency, and cost.',
      'Compare a prompt or model change on the same evaluation set.',
    ],
    'Show a measured improvement without hiding the failures or changing the test set.',
    [
      [
        'Gen AI evaluation overview',
        'https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview',
      ],
      [
        'Model safety guidance',
        'https://ai.google.dev/gemini-api/docs/safety-guidance',
      ],
    ],
  ),
  make(
    'ai',
    'ai-safety-cost',
    'Privacy, prompt injection & cost',
    'Treat model inputs and outputs as untrusted application data.',
    14,
    [
      'Keep private content scoped to the signed-in user.',
      'Test malicious instructions inside retrieved documents.',
      'Set quotas, request limits, timeouts, and graceful fallback behavior.',
    ],
    'A malicious document cannot cause unauthorized tool use or cross-user data access.',
    [
      ['OWASP GenAI security', 'https://genai.owasp.org/'],
      ['API rate limits', 'https://ai.google.dev/gemini-api/docs/rate-limits'],
    ],
  ),
  make(
    'ai',
    'ai-milestone',
    'Milestone: one useful AI feature',
    'Add a document assistant or task-extraction feature to your Flutter product.',
    32,
    [
      'Choose one real user task and define success.',
      'Implement retrieval or structured extraction with protected backend calls.',
      'Publish a demo, evaluation results, and a cost/latency summary.',
    ],
    'Show where the feature works, where it fails, and how the app handles both.',
    [
      ['AI engineer roadmap', 'https://roadmap.sh/ai-engineer'],
      ['Gemini API documentation', 'https://ai.google.dev/gemini-api/docs'],
    ],
    true,
  ),
  make(
    'systems',
    'system-design',
    'System design from requirements',
    'Choose an architecture by following the product’s constraints.',
    22,
    [
      'Estimate users, traffic, latency goals, and storage needs.',
      'Draw the major components and failure points.',
      'Compare a simple design with a more complex alternative.',
    ],
    'Explain the design of your own app, including what you would change at 10× usage.',
    [
      ['System design roadmap', 'https://roadmap.sh/system-design'],
      ['Google SRE book', 'https://sre.google/sre-book/table-of-contents/'],
    ],
  ),
  make(
    'systems',
    'caching-queues',
    'Caching, queues & consistency',
    'Understand when faster responses create stale or duplicate data.',
    20,
    [
      'Choose a cache strategy and define invalidation.',
      'Explain at-least-once delivery and idempotent consumers.',
      'Test stale reads, retries, and simultaneous updates.',
    ],
    'Demonstrate a stale-data scenario and explain the consistency guarantee you provide.',
    [
      ['Redis documentation', 'https://redis.io/docs/latest/'],
      [
        'PostgreSQL concurrency',
        'https://www.postgresql.org/docs/current/mvcc.html',
      ],
    ],
  ),
  make(
    'systems',
    'native-mobile',
    'Native platform integration',
    'Learn Kotlin or Swift when a real Flutter feature needs it.',
    28,
    [
      'Pick one platform and learn its lifecycle and permission model.',
      'Build a small platform-channel integration.',
      'Test foreground, background, denial, and recovery cases.',
    ],
    'Explain and debug one native integration without treating the plugin as a black box.',
    [
      [
        'Flutter platform channels',
        'https://docs.flutter.dev/platform-integration/platform-channels',
      ],
      [
        'Android development fundamentals',
        'https://developer.android.com/guide',
      ],
    ],
  ),
  make(
    'systems',
    'load-reliability',
    'Performance under load',
    'Find the first bottleneck using measurements.',
    22,
    [
      'Define a realistic workload and acceptable latency.',
      'Load-test an API with representative data.',
      'Inspect queries, connections, and resource use before changing architecture.',
    ],
    'Report p50/p95 latency and failure rate for a documented load scenario.',
    [
      ['Grafana k6 documentation', 'https://grafana.com/docs/k6/latest/'],
      [
        'PostgreSQL monitoring',
        'https://www.postgresql.org/docs/current/monitoring.html',
      ],
    ],
  ),
  make(
    'systems',
    'secure-product',
    'Threat modeling & data protection',
    'Identify abuse paths before they become production incidents.',
    20,
    [
      'Map assets, trust boundaries, and likely abuse cases.',
      'Review authorization, file uploads, and sensitive logging.',
      'Practice restoring data and responding to a leaked credential.',
    ],
    'Create a short threat model and verify fixes for its highest-priority risks.',
    [
      [
        'OWASP threat modeling',
        'https://owasp.org/www-community/Threat_Modeling',
      ],
      ['OWASP mobile security', 'https://mas.owasp.org/'],
    ],
  ),
  make(
    'systems',
    'maintainability',
    'Refactoring & technical decisions',
    'Keep a growing codebase understandable to another developer.',
    20,
    [
      'Refactor a troublesome area with behavior-preserving tests.',
      'Write a concise architecture decision record.',
      'Review a pull request and explain actionable feedback.',
    ],
    'Another developer can follow your decision and safely change the refactored feature.',
    [
      ['Engineering practices', 'https://google.github.io/eng-practices/'],
      ['Architecture decision records', 'https://adr.github.io/'],
    ],
  ),
  make(
    'systems',
    'systems-milestone',
    'Milestone: own an end-to-end feature',
    'Take one substantial feature from requirements through operation.',
    42,
    [
      'Write requirements and an architecture decision.',
      'Implement mobile, backend, data, and any AI components needed.',
      'Release, monitor, collect feedback, and write a case study.',
    ],
    'Walk through a complete feature and defend the tradeoffs with evidence.',
    [
      ['System design roadmap', 'https://roadmap.sh/system-design'],
      ['Google SRE workbook', 'https://sre.google/workbook/table-of-contents/'],
    ],
    true,
  ),
  make(
    'career',
    'portfolio-evidence',
    'Two strong project case studies',
    'Make the depth of your work easy for employers to see.',
    22,
    [
      'Choose two projects with meaningful engineering decisions.',
      'Document the problem, architecture, tests, outcomes, and limitations.',
      'Create short demos and reproducible setup instructions.',
    ],
    'A reviewer can understand your contribution and run a project without messaging you.',
    [
      [
        'Writing a useful README',
        'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes',
      ],
    ],
  ),
  make(
    'career',
    'interview-fundamentals',
    'Coding & computer-science practice',
    'Build a steady problem-solving habit alongside project work.',
    32,
    [
      'Practice arrays, maps, stacks, queues, trees, and basic graphs.',
      'Explain time/space complexity and test edge cases.',
      'Solve selected problems aloud without autocomplete.',
    ],
    'Solve a realistic unfamiliar problem while explaining your approach and tradeoffs.',
    [
      [
        'Data structures and algorithms roadmap',
        'https://roadmap.sh/datastructures-and-algorithms',
      ],
      ['Practice problems', 'https://leetcode.com/problemset/'],
    ],
  ),
  make(
    'career',
    'mobile-interviews',
    'Flutter & backend interview stories',
    'Explain the engineering behind the interfaces you built.',
    22,
    [
      'Review Flutter rendering, state, async, memory, and lifecycle.',
      'Practice SQL, HTTP, authorization, and system design questions.',
      'Prepare stories about a difficult bug, incident, tradeoff, and collaboration.',
    ],
    'Explain a real failure and how you diagnosed, fixed, and prevented it.',
    [
      [
        'Flutter architectural overview',
        'https://docs.flutter.dev/resources/architectural-overview',
      ],
      ['Backend roadmap', 'https://roadmap.sh/backend'],
    ],
  ),
  make(
    'career',
    'async-communication',
    'Clear written & spoken communication',
    'Practice the communication that makes remote work effective.',
    24,
    [
      'Write concise progress updates with decisions and blockers.',
      'Explain a design in a short document and a five-minute recording.',
      'Practice clarifying requirements and responding to review feedback.',
    ],
    'A teammate can understand your status and next decision without a live meeting.',
    [
      [
        'Google technical writing courses',
        'https://developers.google.com/tech-writing',
      ],
      [
        'Code review practices',
        'https://google.github.io/eng-practices/review/',
      ],
    ],
  ),
  make(
    'career',
    'open-source',
    'Work in an unfamiliar codebase',
    'Show that you can collaborate beyond your own projects.',
    22,
    [
      'Read contribution guidelines and reproduce a small issue.',
      'Submit a focused fix or documentation improvement with evidence.',
      'Respond to review feedback and keep the change scoped.',
    ],
    'Make one useful contribution and explain how you learned the codebase.',
    [
      [
        'Contributing to open source',
        'https://opensource.guide/how-to-contribute/',
      ],
      ['GitHub pull requests', 'https://docs.github.com/en/pull-requests'],
    ],
  ),
  make(
    'career',
    'job-search',
    'Targeted applications & feedback',
    'Use real hiring feedback to guide the next learning cycle.',
    20,
    [
      'Review current roles and record recurring requirements.',
      'Tailor your CV with accurate project outcomes and relevant experience.',
      'Track applications and interview gaps; revisit the roadmap monthly.',
    ],
    'Explain why your evidence fits a target role and name the next gap to close.',
    [
      [
        'GitHub profile documentation',
        'https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile',
      ],
      ['Developer roadmap references', 'https://roadmap.sh/'],
    ],
  ),
  make(
    'career',
    'career-milestone',
    'Milestone: demonstrate your next level',
    'Present yourself as an engineer who can own and deliver a product.',
    36,
    [
      'Run two mock interviews and get specific feedback.',
      'Finish your strongest project demo and case study.',
      'Apply to suitable mobile/full-stack roles and revise your plan from results.',
    ],
    'Tell a coherent story about what you can build, how you verify it, and what you are learning next.',
    [
      ['Technical writing', 'https://developers.google.com/tech-writing'],
      ['Interview practice', 'https://roadmap.sh/questions'],
    ],
    true,
  ),
];
