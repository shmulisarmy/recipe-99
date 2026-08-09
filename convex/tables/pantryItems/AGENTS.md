# Purpose

Own persisted pantry items and the authenticated server behavior that reads or changes them.

# Ownership

- Pantry persistence owns user-scoped ingredient names and measurements.
- Pantry reads return the authenticated user's stored ingredients.
- Pantry writes replace one stored measurement or additively apply a batch intake.

# Local Contracts

- Every pantry item belongs to the authenticated `userId`; reads and writes must not expose or change another user's items.
- Persist ingredient names in `name_` and measurements through the shared `measurementT` validator.
- Use `by_userId` for pantry lists and `by_userId_and_name_` for one owned ingredient.
- `updateAvailableIngredient` replaces the stored measurement for an existing ingredient.
- `AvailableIngredientsBulkAdd` adds each incoming measurement to a matching ingredient and creates an owned item when no match exists.
- Keep the client-facing pantry surface exported through `api.pantry_exports.*`.

# Work Guidance

- Reuse shared measurement arithmetic so additive intake preserves unit-conversion semantics.
- Derive ownership through `authenticatedUserId`; never accept a client-provided user identifier.

# Verification

# Child DOX Index
