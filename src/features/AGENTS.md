# Purpose

Keep product workflows cohesive while making their cross-feature dependencies explicit.

# Ownership

- Each direct child directory owns one user-facing workflow, including its local types, state, logic, and components.
- A feature's `outside_feature_exports.ts` is its explicit integration surface where one exists.

# Local Contracts

- Prefer imports from `outside_feature_exports.ts` when consuming a feature from another feature.
- Export only values and types that external consumers need; keep implementation helpers private.
- Cross-feature calls must preserve the owning feature's data semantics instead of mutating its internal state opportunistically.
- Backend persistence belongs in generated Convex queries and mutations, not in duplicated client action modules.
- Receipt capture uses a narrow 1:2 frame at an ideal 960 by 1920 resolution, preferring the rear camera on touch-first mobile devices and the user-facing camera on computers while allowing device fallback; callers own its displayed dimensions through `styles`.

# Work Guidance

- Evolve the integration surface in the same change as a new external consumer.
- Put shared value semantics in `src/primitives/`, not in a feature chosen arbitrarily.

# Verification

- Run `npm run build` after changing a feature, its exports, or its consumers.

# Child DOX Index

- `available_ingredients_bulk_add_form/AGENTS.md` — batch pantry intake and shopping-cart handoff.
- `planner/AGENTS.md` — planner queries, projections, calendar behavior, and planner UI ownership.
