# Purpose

Own persisted planner days and the server-side behavior that reads and changes them.

# Ownership

- `types.ts` defines validators and inferred types for recipe references, ingredient sets, carts, and planned days, including the planner-day document validator used as a read return validator.
- `days.ts` owns owned-day lookup, planner-day creation with the shared defaults, and the get-or-create accessor every dated write uses.
- Planner persistence owns ordered, user-scoped day documents and their date indexes.
- Planner reads shape those documents into the date-keyed map consumed by the frontend.
- `actions/` separates day, planned-recipe, and shopping-cart mutation behavior.

# Local Contracts

- A planner document contains one user's `date`, ordered `recipes`, day `multiplier`, and `shoppingCart`.
- Use `by_userId` and `by_userId_and_date` for owned planner lookups; user-scoped reads and writes must not expose another user's days.
- `usersPlanner` reads only the authenticated user's days through `by_userId`, so the date-keyed result and every planned recipe inside it belong to that user alone.
- A date the user has never written to has no planner document; it is an empty planned day, not an error.
- `recipes[].id` is the stable identity for moving, removing, or overriding one planned occurrence; `recipeId` identifies the recipe version.
- `overrideDayMultiplier` remains optional. Absence means inherit the day `multiplier`.
- Keep the frontend date-keyed planner result and the persisted `date` string in the same `toDateString()` format.
- Keep validators as the durable source for planner value shapes and derive TypeScript types from them.

# Work Guidance

- Preserve recipe order when moving items within or across days.
- Treat a missing destination date as an empty planner day; every mutation that names a date creates it through `getOrCreatePlannerDay` with the planner defaults rather than failing.
- Treat updates to a planner document as transactional and patch only the owned day or days involved.

# Verification

# Child DOX Index

- `actions/AGENTS.md` — day, recipe, and shopping-cart mutation behavior.
