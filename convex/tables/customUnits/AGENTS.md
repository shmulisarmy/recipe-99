# Purpose

Own persisted custom measurement-unit definitions associated with ingredients.

# Ownership

- `table.ts` owns the custom-unit validator, document validator, table definition, and ingredient lookup index.
- `queries.ts` owns custom-unit lookup by associated ingredient.
- `actions.ts` owns custom-unit creation.

# Local Contracts

- A custom unit stores its display name and grams-per-unit conversion alongside the ingredient it describes.
- Query custom units through the `by_associatedIngredient` index.
- Expose client access only through `api.customUnit_exports.*`; frontend callers must not use nested `api.tables.customUnits.*` references.
- Derive function return shapes from the validators in `table.ts`.

# Work Guidance

- Keep custom-unit persistence and lookup in this domain; keep measurement arithmetic in `src/primitives/measurement.ts` and the shared wire validator in `convex/types.ts`.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit`.
- Regenerate Convex bindings and run `npm run build` when the public custom-unit API changes.

# Child DOX Index
