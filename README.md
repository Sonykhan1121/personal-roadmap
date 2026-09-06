# Nextchapter — personal learning roadmap

A personal tracker for a Flutter developer with 1.5+ years of experience, progressing toward mobile/full-stack engineering and practical AI integration. The website is a tool for tracking learning; building this website is not part of the curriculum.

Website: [My learning roadmap](https://sonykhan1121.github.io/personal-roadmap/).

Setup status: the curriculum and interface are ready. Cloud sign-in and saving will be available after the owner's Supabase project is created and connected. The browser configuration is intentionally empty until then.

## Features

- 42 learning topics, including six practical project milestones, across a suggested 24 months.
- Connected topic maps with official learning resources, practice checklists, time estimates, and completion criteria.
- Learning, practicing, completed, and skipped states; private notes, evidence links, and review dates.
- Email-code sign-in and PostgreSQL storage through Supabase, with per-user row-level access rules.
- Adjustable start date and weekly study hours; JSON progress export.
- Responsive layout, keyboard-accessible controls, and reduced-motion support.

## Development

Use Node.js 24 and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
node --experimental-strip-types --test tests/progress.test.mjs
```

## Deployment

The app uses a static Vite production entry for GitHub Pages and retains the scaffold's Vinext local preview. Both use the same React components. Supabase handles authentication and persistence separately. The workflow publishes pushes to `codex/personal-roadmap` at the `/personal-roadmap/` repository path. Enable GitHub Pages with GitHub Actions as the publishing source.

```sh
GITHUB_PAGES=true pnpm build
```

Browser configuration belongs in `lib/supabase.ts` and may contain only the project URL and a publishable key. Never include a service-role key, database password, or personal access token in the frontend or repository.

The schema is in `database/schema.sql`. Both tables use row-level security and enforce ownership for reads and writes. Progress saves use an update timestamp to detect concurrent edits rather than silently overwrite another device's changes.

Email sign-in expects the Supabase Magic Link template to include `{{ .Token }}`. Configure the correct project and allow the owner's email to receive authentication emails. The built-in Supabase email sender is limited and is intended for testing with organization members; other recipients require a configured email provider.

## Data and synchronization

Cloud data is the source of truth. Progress is refreshed after sign-in, when a tab regains focus, and every 30 seconds while visible. A failed save keeps the draft open with an error. Notes are not silently written to browser storage. Supabase manages local sign-in sessions through its client library.

The public curriculum and website source do not contain private progress. Visitors must sign in to save their own records. A public site URL does not make a user's notes public.

Supabase Free projects can pause after inactivity. The curriculum stays readable, but sign-in and syncing require an active project. Export a progress backup periodically.

## Validation

Unit tests cover completion accounting, checklist bounds, evidence-link validation, date validation, and month-end scheduling. TypeScript checks and a static export build are required before deployment. Resource link checks are recorded in `docs/resource-checks.json`.

An optional WebMCP interface exposes progress reads, topic opening, and saving a topic status using the same authenticated actions as the UI. Browsers without WebMCP ignore it. A supported live WebMCP validation context was not available during this build, so its live registration is not yet verified.

Learning estimates are planning guidance, not guarantees. Revisit priorities using project experience and feedback from interviews. Inspired by [roadmap.sh](https://roadmap.sh/); independently implemented and not affiliated with it.
