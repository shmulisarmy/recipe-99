# Purpose

Define the repository-wide contract for Recipe-99, a SolidJS meal-planning application backed by Convex.

# Ownership

- `src/` owns the browser application, UI composition, client-side projections, and shared frontend domain utilities.
- `convex/` owns persisted data, authentication-aware queries and mutations, schema validators, and the generated client API boundary.
- `docs/` owns durable product behavior and design specifications that guide the browser application.
- `learnings/` owns non-runtime tutorials, references, and learning records derived from work on the application.
- `public/` owns static browser assets, including the installable-app icons referenced by the PWA manifest.
- `resources/` owns source artifacts used for local investigation or prototyping; application code must not depend on them at runtime.
- `.agents/skills/` and `.claude/skills/` contain tool-generated, repo-local Convex guidance for supported coding agents.
- Root configuration files own build tooling, dependency versions, and environment wiring; root Markdown files own repository-level project notes.

# Local Contracts

- Read this file and every nearer `AGENTS.md` before changing a governed path; the nearest file adds local rules without weakening its parents.
- Treat `src` and `convex` as one typed system: schema or function changes must be reflected through generated Convex APIs rather than handwritten parallel interfaces.
- Keep `solid-js` in Vite's `resolve.dedupe` list so the application and Solid-aware dependencies share one reactive runtime.
- Preserve user-owned work already present in a dirty worktree and keep unrelated edits out of the current task.
- Never edit files under `convex/_generated/` by hand.
- Do not hand-edit the generated Convex skill bundles under `.agents/skills/` or `.claude/skills/`; refresh both through `npx convex ai-files install`.

# Work Guidance

- After every meaningful application change, perform a DOX pass: update the closest owning `AGENTS.md`, refresh affected parent indexes, and remove stale contracts.
- Create a child `AGENTS.md` only for a durable ownership boundary with rules that are more specific than its parent.
- Keep durable behavior and architecture here; keep implementation details in the closest child contract.

# Verification

- Run `npm run build` after application code changes.
- When changing PWA configuration or icons, confirm the production build emits the manifest and that every referenced `public/` asset exists at its configured path.
- Add the verification required by the nearest child `AGENTS.md` for the paths changed.

# Child DOX Index

- `convex/AGENTS.md` — Convex schema, functions, authentication, and generated API conventions.
- `docs/AGENTS.md` — product behavior, redesign specifications, and static design examples.
- `learnings/AGENTS.md` — non-runtime tutorials, references, and learning records.
- `src/AGENTS.md` — browser application, shared frontend modules, and feature boundaries.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
