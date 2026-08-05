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
- Use generated Convex functions for persisted pantry and planner changes.

# Work Guidance

- Recompute cart selections when an edited batch amount changes.
- Preserve measurement units and use shared measurement arithmetic for comparisons and subtraction.
- The current empty fragments are a temporary redesign boundary. Preserve and reconnect the retained batch, validation, submission, and reconciliation logic when rebuilding the workflow.

# Verification

- Run `npm run build` after changing either workflow step or its exported types.
- Verify both the pantry submission and the shopping-cart handoff with an authenticated planner day.

# Child DOX Index
