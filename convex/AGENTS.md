# Purpose

Own Recipe-99's persisted data model and authenticated server functions.

# Ownership

- `schema.ts` composes all persisted tables.
- `auth.ts` owns the current-user identity query exposed as `api.auth.*`.
- `pantry_exports.ts` is the stable client-facing alias module for pantry reads and writes.
- `planner_exports.ts` is the stable client-facing alias module for planner reads plus add, move, day, and cart mutations.
- `recipe_exports.ts` is the stable client-facing alias module for recipe reads and creation.
- `types.ts` owns the shared measurement validator.
- `utils/auth.ts` owns canonical authenticated user identification.
- `tables/` owns domain-specific persistence modules under its local contract.
- `_generated/` is Convex-generated output and is never hand-edited.

# Local Contracts

- Read `_generated/ai/guidelines.md` before editing Convex code; its version-specific rules are binding.
- Define all tables in `schema.ts`, validate every public function argument, and add return validators when changing or adding functions.
- Derive ownership from `ctx.auth.getUserIdentity()` through `authenticatedUserId`; never trust a client-provided user identifier for authorization.
- Use indexes for user-owned document lookup and name indexes after all indexed fields in order.
- Frontend callers use generated `api.*` references. Keep `pantry_exports.ts`, `planner_exports.ts`, and `recipe_exports.ts` aligned with their intentional client surfaces rather than calling nested table modules directly.
- Never edit `_generated` files manually; regenerate them through Convex tooling.

# Work Guidance

- Prefer Convex validator inference, `Doc<...>`, and generated function types over handwritten duplicates.
- Before a deployment-affecting Convex command, identify and state the target deployment. Do not assume production authorization.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit` after Convex code changes.
- Run `npm run build` when client-visible functions, validators, or return shapes change.
- Run `npx convex dev --once` only after confirming the intended deployment target when codegen or function sync is required.

# Child DOX Index

- `tables/AGENTS.md` — shared table-module structure plus pantry, planner, and recipe domain boundaries.
