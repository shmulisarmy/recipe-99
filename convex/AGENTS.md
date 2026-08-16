# Purpose

Own Recipe-99's persisted data model and authenticated server functions.

# Ownership

- `schema.ts` composes all persisted tables.
- `agents/` owns named AI Agents and their Agent-adjacent image-storage utilities.
- `auth.ts` owns the current-user identity query exposed as `api.auth.*`.
- `customUnit_exports.ts` is the stable client-facing alias module for custom-unit reads and creation.
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
- Keep LLM credentials in typed Convex environment variables and authenticate public agent functions before accessing the Agent component.
- Pass captured images to Agent generation through `Id<"_storage">`, validate their media type in the background action, and delete the temporary upload after the Agent ingests it.
- Schedule background Agent generation through a registered internal action; await scheduling in the public action and await model generation inside the worker.
- Use indexes for user-owned document lookup and name indexes after all indexed fields in order.
- Frontend callers use generated `api.*` references. Keep `customUnit_exports.ts`, `pantry_exports.ts`, `planner_exports.ts`, and `recipe_exports.ts` aligned with their intentional client surfaces rather than calling nested table modules directly.
- Agent orchestration and image-upload functions intentionally use their generated `api.agents.*` paths; keep their module paths stable or update all generated callers together.
- Never edit `_generated` files manually; regenerate them through Convex tooling.

# Work Guidance

- Prefer Convex validator inference, `Doc<...>`, and generated function types over handwritten duplicates.
- Before a deployment-affecting Convex command, identify and state the target deployment. Do not assume production authorization.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit` after Convex code changes.
- Run `npm run build` when client-visible functions, validators, or return shapes change.
- Run `npx convex dev --once` only after confirming the intended deployment target when codegen or function sync is required.

# Child DOX Index

- `agents/AGENTS.md` — named Agent orchestration and Agent-adjacent storage boundaries.
- `tables/AGENTS.md` — shared table-module structure plus pantry, planner, and recipe domain boundaries.
