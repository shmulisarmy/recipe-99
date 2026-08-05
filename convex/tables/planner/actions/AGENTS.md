# Purpose

Own authenticated mutations for planner days, planned recipe occurrences, and shopping carts.

# Ownership

- `day.ts` updates the day multiplier used as the people-eating default.
- `recipe.ts` finds planned occurrences by stable `id`, moves them, removes them, and updates optional recipe multipliers.
- `cart.ts` sets, adds, or pushes shopping-cart measurements between days.

# Local Contracts

- Every mutation derives `userId` with `authenticatedUserId` and may only query or patch that user's planner documents.
- `updateDayMultiplier` accepts the date and persisted people-eating multiplier.
- `updateRecipeOverrideMultiplier` accepts a positive UI multiplier or `null`; `null` removes `overrideDayMultiplier` so the recipe inherits the day default.
- Moving a recipe must remove exactly one occurrence from its source and insert that same occurrence at the requested destination position.
- `BulkSetCartToGet` exactly replaces only the supplied `toGet` entries and is the atomic save path for cart-modal drafts.
- `BulkUpdateCartToGet` accepts an ingredient-name-to-measurement record, adds each amount to the existing `toGet` entry, and remains semantically distinct from the exact-set mutation.
- Pushing cart items forward moves only the still-needed amount after `alreadyGot` and preserves measurement conversion semantics.

# Work Guidance

- Reuse shared validators and measurement operations instead of reproducing their shapes or unit math.
- Return `null` explicitly from client-facing mutations.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit`.
- Run `npm run build` after changing an exported mutation signature.
- Verify mutations through generated `api.planner_exports.*` references rather than direct client paths into this folder.

# Child DOX Index
