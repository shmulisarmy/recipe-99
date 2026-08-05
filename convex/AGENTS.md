# Purpose

Own Recipe-99's persisted data model and authenticated server functions.

# Ownership

- `schema.ts` composes all persisted tables.
- `data.ts` owns pantry, recipe, identity, and top-level planner query exports.
- `planner_exports.ts` is the stable client-facing alias module for planner mutations.
- `types.ts` owns shared Convex validators.
- `utils/auth.ts` owns canonical authenticated user identification.
- `tables/` owns domain-specific table validators, indexes, queries, and mutations.
- `_generated/` is Convex-generated output and is never hand-edited.

# Local Contracts

- Read `_generated/ai/guidelines.md` before editing Convex code; its version-specific rules are binding.
- Define all tables in `schema.ts`, validate every public function argument, and add return validators when changing or adding functions.
- Derive ownership from `ctx.auth.getUserIdentity()` through `authenticatedUserId`; never trust a client-provided user identifier for authorization.
- Use indexes for user-owned document lookup and name indexes after all indexed fields in order.
- Frontend callers use generated `api.*` references. Keep `planner_exports.ts` aligned with the intentional planner mutation surface.
- Never edit `_generated` files manually; regenerate them through Convex tooling.

# Work Guidance

- Prefer Convex validator inference, `Doc<...>`, and generated function types over handwritten duplicates.
- Before a deployment-affecting Convex command, identify and state the target deployment. Do not assume production authorization.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit` after Convex code changes.
- Run `npm run build` when client-visible functions, validators, or return shapes change.
- Run `npx convex dev --once` only after confirming the intended deployment target when codegen or function sync is required.

# Child DOX Index

- `tables/planner/AGENTS.md` — planner-day data model, queries, and mutation semantics.
