# Purpose

Own the multistep workflow for adding a batch of acquired ingredients to the pantry and reconciling them with today's shopping cart.

# Ownership

- `index.tsx` owns the editable batch and pantry submission.
- `next_step.tsx` owns the follow-up shopping-cart reconciliation step.
- `types.ts` owns workflow input and draft shapes.
- `outside_feature_exports.ts` is the feature's public integration surface.

# Local Contracts

- Clone `ingredientsToAdd` before editing; never mutate the caller's input.
- Normalize new ingredient names to lowercase and keep names unique within the batch.
- Keep pantry additions and shopping-cart reconciliation as separate user-confirmed steps.
- The shopping-cart draft represents only the acquired amounts selected for reconciliation; do not apply it before the follow-up step.
- Persist pantry intake through `api.pantry_exports.AvailableIngredientsBulkAdd` and cart reconciliation through `api.planner_exports.*`.
- Treat the in-memory `IntakeHandoff` as route-local state: direct entry to reconciliation without it returns to Intake with guidance.
- On mobile, keep `Add ingredient` before the primary `Add to pantry` action in both DOM and visual order; row removal remains a quiet secondary action.
- New-entry validation identifies and focuses the invalid name field, and reconciliation copy distinguishes the acquired remainder from the original cart amount.

# Work Guidance

- Recompute cart selections when an edited batch amount changes.
- Preserve measurement units and use shared measurement arithmetic for comparisons and subtraction.
- Keep Intake and Reconciliation as separate full-page routes, and retain all editable rows after a failed submission.

# Verification

- Run `npm run build` after changing either workflow step or its exported types.
- Verify both the pantry submission and the shopping-cart handoff with an authenticated planner day.

# Child DOX Index
