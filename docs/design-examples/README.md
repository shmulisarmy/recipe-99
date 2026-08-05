# Recipe 99 design examples

These are disposable, static visual checkpoints for the design specification. They use sample data, contain no application code or persistence, and load no remote assets.

Open [planner.html](planner.html) directly from disk to begin. The pages link to one another:

- [planner.html](planner.html) — compact month calendar and authoritative selected-day Day Ticket.
- [recipes.html](recipes.html) — flat recipe library and progressive ingredient disclosure.
- [pantry.html](pantry.html) — flat pantry ledger and inline-action presentation.
- [intake.html](intake.html) — full-page batch review, step 1.
- [intake-reconcile.html](intake-reconcile.html) — separate full-page reconciliation, step 2.
- [overlays.html](overlays.html) — recipe inspection drawer and centered cart transaction modal.

Styles load in this order:

1. `styles/01-tokens-base.css`
2. `styles/02-shell.css`
3. `styles/03-shared.css`
4. `styles/04-destinations.css`
5. `styles/05-overlays.css`
6. `styles/06-responsive.css`

Production self-hosts Chivo, Atkinson Hyperlegible Next, and IBM Plex Mono. These examples remain offline-safe by falling back deliberately to fonts commonly available on macOS and Windows.
