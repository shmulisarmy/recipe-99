# Purpose

Own Recipe 99's named AI Agents and Agent-adjacent storage boundaries.

# Ownership

- `initialIngredientBulkAddFormDraftAgent.ts` owns the Claude-backed ingredient-draft Agent, its prompt and tools, draft kickoff, scheduled generation, and public draft read.
- `imageUtils.ts` owns authenticated image upload URL generation and storage metadata reads used by Agent ingestion.

# Local Contracts

- Keep each product Agent in a distinctly named module rather than accumulating unrelated Agent behavior in one file.
- Pass stored images by `Id<"_storage">`; validate storage metadata before generating a signed URL for the model.
- Delete temporary Agent input images after generation completes or fails.
- Treat `markAsDone` as the reactive completion signal and call it only after the draft completion check passes.

# Verification

- Run `npx tsc -p convex/tsconfig.json --noEmit`.
- Regenerate Convex bindings and run `npm run build` when a public or internal function path changes.

# Child DOX Index
