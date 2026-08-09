# Purpose

Own the meal-planning feature: Convex planner data, day-by-day projections, calendar interactions, recipes, and shopping carts.

# Ownership

- `data.ts` owns frontend planner query/result aliases.
- `types.ts` owns UI-facing planner shapes and the current planner date anchor.
- `logic.ts` owns the deterministic projection from planner days, pantry inventory, and recipes.
- `utils.ts` owns planner date helpers.
- `outside_feature_exports.ts` owns the helper surface consumed by other features.
- `components/` owns rendered planner behavior and all direct planner mutations.

# Local Contracts

- Planner map keys and mutation date arguments use `Date.prototype.toDateString()` consistently.
- A day `multiplier` means the number of people eating that day.
- A planned recipe uses its optional `overrideDayMultiplier` when present and otherwise inherits the day multiplier.
- Projection order is chronological; each day's cart is applied before simulating that day's recipes.
- Read planner days and persist planner edits through `api.planner_exports.*`; do not recreate local query or mutation wrappers under `src/features/planner/actions`.
- Use shared measurement operations for cart and ingredient math so unit conversion stays consistent with Convex.

# Work Guidance

- Keep projection calculation independent of component-local editing state.
- Keep the feature helper surface narrow; `App.tsx` remains the current composition root for mounting the planner and refreshing its projection.

# Verification

- Run `npm run build` after planner changes.
- Run `npx tsc -p convex/tsconfig.json --noEmit` when a planner change also touches its Convex function, validator, or generated API contract.
- Verify affected planner interactions with authenticated Convex data.

# Child DOX Index

- `components/AGENTS.md` — calendar cells, recipe controls, cart editing, modal behavior, and drag-and-drop.
