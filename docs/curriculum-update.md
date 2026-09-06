# Full-stack Flutter curriculum update

The user's supplied learning list is integrated into 84 trackable topics across 10 stages. There are 42 new topics and 54 study guides. The original 42 topic IDs and their checklist positions remain unchanged; some topics move to more specific stages. Notes, evidence links, review dates, and status records continue using the existing Supabase schema.

| Supplied category | Where to find it |
| --- | --- |
| Dart core and advanced language features | Dart foundations: 12 detailed lessons, including the supplied examples and reference tables |
| Async and concurrency | Async & data; background work in Ship reliably; FFI in Optional explorations |
| Flutter core and UI engine | Flutter core & UI: lifecycle, context/keys, adaptive UI, accessibility, localization, rendering, custom UI, slivers, testing, and profiling |
| State management and architecture | Architecture: Provider/GetX/Riverpod/BLoC comparison, Clean Architecture/SOLID, restoration, code generation, and dependency injection |
| Backend and full-stack | Backend & SQL: REST/Dio/Retrofit, GraphQL/Ferry/Artemis, WebSocket/Socket.IO, hosted platforms, Node/Python, gRPC, PostgreSQL/MongoDB; local stores in Async & data; biometrics in Ship reliably |
| DevOps and production | Ship reliably: unit/widget/integration/golden tests, flavors, CI/CD, distribution, monitoring, Shorebird, store releases; product security in Engineering depth |
| Advanced topics | Practical AI: hosted and on-device models; Engineering depth: Web/Desktop/Wasm and plugins; Optional explorations: FFI, embedded/edge, AR, Rive/Lottie/Flame, and WalletConnect/Ethers.dart |

The existing AI evaluation, system design, reliability, and remote-career material is retained. Alternative state-management and backend platforms are compared within a single topic rather than presented as a requirement to master them all. Optional explorations have no mandatory calendar deadline.

## Corrections and editing

- Dart does not support same-name method overloads distinguished by parameter signatures. The OOP section instead distinguishes interfaces, method overrides, and supported operator overloads. [Dart methods](https://dart.dev/language/methods)
- Subtypes of `base` and `final` classes retain the appropriate modifier restrictions inside their defining library. `sealed` is implicitly abstract and restricts direct subtypes. Library privacy is distinct from class privacy. [Class modifiers](https://dart.dev/language/class-modifiers)
- The sealed-result switch is written as a valid switch statement. Object-pattern shorthand uses `User(:name, :age)`. [Patterns](https://dart.dev/language/pattern-types)
- A null-shorting cascade uses `?..` for its first section and `..` afterward. [Operators](https://dart.dev/language/operators)
- A const constructor can also be called in a non-constant context. Factory constructors do not automatically cache objects or enforce a singleton. [Constructors](https://dart.dev/language/constructors)
- Unknown device-enum values receive an explicit unknown state. The custom firstOrNull example is identified as a learning example because the SDK already provides it. [Iterable.firstOrNull](https://api.dart.dev/dart-collection/IterableExtensions/firstOrNull.html)
- Repeated constructor/record/cascade notes under Null Safety are consolidated into their own lessons. Conversational offers to generate another cheat sheet are removed.
- Rendering guidance includes the appropriate Impeller/Skia context, and on-device model guidance distinguishes LiteRT/TensorFlow Lite from ONNX and hosted APIs. Package maintenance, platform support, and service limits are evaluation criteria rather than promises.

## Verification

- Compatibility checks preserve all original topic IDs and checked-step meanings.
- New topics fit the existing database limits: IDs under 101 characters and checklists no longer than 10 steps.
- Markdown rendering checks cover real tables, escaped Dart code, blocked raw HTML, and unsafe links.
- Representative corrected Dart examples compiled and ran using the installed Dart SDK.
- The 105-term coverage check found all requested subject/tool areas in the combined new topics and study guides.
- 92 added learning-resource URLs were checked. 90 returned HTTP 200 directly. Rive and Raspberry Pi documentation were confirmed through the web source reader after local TLS/HTTP restrictions; the original probe outcomes are retained in the link report.
- No database records or authentication settings are changed by this curriculum update.
