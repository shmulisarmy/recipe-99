# Purpose

Own persisted planner days and the server-side behavior that reads and changes them.

# Ownership

- `types.ts` defines validators and inferred types for recipe references, ingredient sets, carts, and planned days.
- `table.ts` defines `plannerTable` and its lookup indexes.
- `queries.ts` shapes planner documents into the date-keyed map consumed by the frontend.
- `actions/` owns authenticated planner mutations.

# Local Contracts

- A planner document contains one user's `date`, ordered `recipes`, day `multiplier`, and `shoppingCart`.
- Use `by_userId` and `by_userId_and_date` for owned planner lookups; user-scoped reads and writes must not expose another user's days.
- `recipes[].id` is the stable identity for moving, removing, or overriding one planned occurrence; `recipeId` identifies the recipe version.
- `overrideDayMultiplier` remains optional. Absence means inherit the day `multiplier`.
- Keep the frontend date-keyed planner result and the persisted `date` string in the same `toDateString()` format.
- Keep validators as the durable source for planner value shapes and derive TypeScript types from them.

# Work Guidance

- Preserve recipe order when moving items within or across days.
- Treat updates to a planner document as transactional and patch only the owned day or days involved.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit`.
- Run `npm run build` when a query result or public mutation signature changes.

# Child DOX Index

- `actions/AGENTS.md` — day, recipe, and shopping-cart mutation behavior.
