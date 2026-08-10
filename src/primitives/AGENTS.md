# Purpose

Own domain values shared across the browser application and Convex functions.

# Ownership

- `measurement.ts` owns the `Measurement` wire shape, supported units, conversion, formatting, comparison, and arithmetic.

# Local Contracts

- Preserve the serializable shape `{ amount: number, unit: Unit }`.
- Keep supported units aligned with `convex/types.ts`: tagged builtin units for grams, kilograms, ounces, and pounds, plus tagged custom units with a name and grams-per-unit conversion.
- Route measurement math through the named helpers so conversion and result-unit behavior remain consistent.
- Changes here are cross-runtime changes because Convex planner mutations import these operations directly.

# Work Guidance

- Add a primitive only when both frontend and backend or multiple features share the same value semantics.

# Verification

- Run `npm run build`.
- Run `npx tsc -p convex/tsconfig.json --noEmit` after changing measurement types or operations.

# Child DOX Index
