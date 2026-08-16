# Purpose

Own authenticated ingredient bulk-add drafts and the AI tools that operate on them.

# Ownership

- `table.ts` owns the persisted draft shape.
- `actions.ts` owns authenticated draft creation and ingredient writes.
- `tools.ts` owns model-facing Zod schemas and thin adapters to Convex mutations.
- `queries.ts` owns draft reads when they are added.

# Local Contracts

- Derive draft ownership from the authenticated Convex identity; never accept a user ID from a tool input.
- Verify draft ownership before every update.
- Scheduled Agent tools receive the already-authenticated owner through Agent `ctx.userId` and may pass it only to internal mutations that recheck draft ownership.
- Keep database access in registered Convex functions; agent tools call them through `ctx.runMutation` or `ctx.runQuery`.
- Keep tool input schemas aligned with the validators used by their target functions.
- Agent measurement instructions require an immediate first write containing every obvious builtin-unit ingredient, then preserve the user's unit and package representation, define custom-unit conversion as grams for one unit, sequence custom-unit creation before its draft write, and require a complete-item check before finishing.
- After the complete-item check passes, the Agent calls `markAsDone` exactly once as its final tool call; the mutation rechecks draft ownership before setting `isDoneInitialGeneration`.
- Add required persisted fields through widen-migrate-narrow so existing drafts remain deployable during backfills.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit`.
- Regenerate Convex bindings and run `npm run build` when the registered function surface changes.

# Child DOX Index
