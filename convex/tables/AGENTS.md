# Purpose

Own the domain modules that define Recipe-99's persisted tables and the server behavior operating on them.

# Ownership

- Each direct child directory owns one persisted domain and its table shape, reads, and writes.
- `table.ts` owns the domain validators, `defineTable` definitions, and indexes composed by `convex/schema.ts`.
- `queries.ts` owns the domain's registered read functions.
- `actions.ts` owns the domain's registered mutations; use an `actions/` directory when distinct mutation concerns need their own modules.
- `types.ts` owns domain validators and inferred types shared across table, query, and mutation modules when a separate type boundary is warranted.

# Local Contracts

- Keep table definitions close to their domain and export them to `convex/schema.ts` for schema composition.
- Keep registered reads and writes out of `convex/data.ts`; expose intentional client APIs through the top-level `*_exports.ts` modules.
- Derive TypeScript types from validators or generated `Doc<...>` types rather than maintaining parallel interfaces.
- Keep cross-domain imports limited to shared validators, value operations, generated document types, and deliberate server behavior.

# Work Guidance

- Create a direct child directory when a persisted domain gains its own table, query, or mutation responsibilities.
- Keep child contracts focused on domain semantics; inherit the shared file layout and Convex verification rules from this contract and `convex/AGENTS.md`.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit` after changing a table module.
- Run `npm run build` when a public function, validator, or return shape changes.
- Regenerate Convex bindings when a table module changes the exported client surface.

# Child DOX Index

- `customUnits/AGENTS.md` — ingredient-associated custom-unit definitions, lookup, and creation.
- `ingredientBulkAddFormDraft/AGENTS.md` — authenticated bulk-add drafts and their agent-tool adapters.
- `pantryItems/AGENTS.md` — pantry-item schema, authenticated reads, and additive or replacement writes.
- `planner/AGENTS.md` — planner-day data model, queries, and mutation semantics.
- `recipes/AGENTS.md` — recipe and latest-version tables, recipe reads, and recipe creation.
