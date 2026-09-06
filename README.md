# Nextchapter — personal learning roadmap

A personal tracker for a Flutter developer with 1.5+ years of experience, progressing toward mobile/full-stack engineering and practical AI integration. The website is a tool for tracking learning; building this website is not part of the curriculum.

Website: [My learning roadmap](https://sonykhan1121.github.io/personal-roadmap/).

Cloud sign-in and private progress storage use the owner's Supabase Free project, `personal-learning-roadmap`, in `portfolio_admin_panel`. Open the website, sign in using the email associated with your Supabase account, and open the emailed sign-in link on the device you want to use. Repeat with the same email on another device to access the same progress.

## Features

- 84 learning topics, including six practical milestones, across nine core stages and one optional exploration stage.
- 54 study guides, including the supplied Dart lessons with formatted code examples and reference tables.
- A single stage selector and numbered topic list, with a next-topic action and optional stage details.
- Separate Learn, Practice, and My notes tabs keep official resources, study guides, checklists, and private notes easy to navigate.
- Drag the topic drawer’s left edge to resize it on desktop; arrow keys also work, and double-click restores the default width. The width is remembered in this browser, with a full-width layout on phones.
- Completion filters, review reminders, time estimates, and completion criteria remain available.
- Learning, practicing, completed, and skipped states; private notes, evidence links, and review dates.
- Email-link sign-in and PostgreSQL storage through Supabase, with per-user row-level access rules.
- Adjustable start date and weekly study hours; JSON progress export.
- Responsive layout, keyboard-accessible controls, and reduced-motion support.

## Development

Use Node.js 24 and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm exec tsc --noEmit
pnpm test
```

## Deployment

The app uses a static Vite production entry for GitHub Pages and retains the scaffold's Vinext local preview. Both use the same React components. Supabase handles authentication and persistence separately. The workflow publishes pushes to `codex/personal-roadmap` at the `/personal-roadmap/` repository path. Enable GitHub Pages with GitHub Actions as the publishing source.

```sh
GITHUB_PAGES=true pnpm build
```

Browser configuration belongs in `lib/supabase.ts` and may contain only the project URL and a publishable key. Never include a service-role key, database password, or personal access token in the frontend or repository.

The schema is in `database/schema.sql`. Both tables use row-level security and enforce ownership for reads and writes. Progress saves use an update timestamp to detect concurrent edits rather than silently overwrite another device's changes.

The project was created with automatic RLS enabled. `database/harden-auto-rls.sql` restricts Supabase's generated helper to database administrators; apply it only when that helper exists.

Email sign-in uses Supabase's default Magic Link template. The authentication Site URL is `https://sonykhan1121.github.io/personal-roadmap/`. The free built-in email sender accepts project organization members and has a low sending limit; use the account's member email and keep the signed-in session on each device. Other recipients or higher email volume require a separately configured email provider. No custom SMTP or paid Supabase plan is configured.

## Data and synchronization

Cloud data is the source of truth. Progress is refreshed after sign-in, when a tab regains focus, and every 30 seconds while visible. A failed save keeps the draft open with an error. Notes are not silently written to browser storage. Supabase manages local sign-in sessions through its client library.

The public curriculum and website source do not contain private progress. Visitors must sign in to save their own records. A public site URL does not make a user's notes public.

Supabase Free projects can pause after inactivity. The curriculum stays readable, but sign-in and syncing require an active project. Export a progress backup periodically.

## Validation

Tests cover completion accounting, checklist bounds, evidence-link validation, date validation, month-end scheduling, lesson rendering, and unsafe Markdown handling. A compatibility fixture preserves the IDs and checkbox meanings of the original 42 topics. New topics use the existing schema without changing saved progress. TypeScript checks and a static production build are required before deployment. Resource link checks are recorded in `docs/resource-checks.json` and `docs/added-resource-checks.json`.

The expanded curriculum is mapped in `docs/curriculum-update.md`. Its schedule is a flexible guide with overlapping practice stages. Tool comparisons and optional specializations do not require mastering every listed framework. The overall completion percentage includes all 84 trackable topics; adding topics changes the denominator but preserves completed records.

`database/verify-rls.sql` checks owner reads and writes, rejected ownership reassignment, cross-user isolation, and revoked anonymous access. It passed in the connected project on September 6, 2026; all test users and records were rolled back. Live email delivery and signing in on two physical devices require the owner's inbox and are not covered by that database verification.

The connected project's Security Advisor reported zero errors and zero warnings after hardening. Public API checks confirmed both tables reject signed-out reads with HTTP 401, and Auth reports email sign-in enabled.

An optional WebMCP interface exposes progress reads, topic opening, and saving a topic status using the same authenticated actions as the UI. Browsers without WebMCP ignore it. A supported live WebMCP validation context was not available during this build, so its live registration is not yet verified.

Learning estimates are planning guidance, not guarantees. Revisit priorities using project experience and feedback from interviews. Inspired by [roadmap.sh](https://roadmap.sh/); independently implemented and not affiliated with it.
