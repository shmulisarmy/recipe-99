# Convex + SolidJS Migration Resources

## Knowledge

- [Convex: Dev workflow](https://docs.convex.dev/understanding/workflow)
  Primary source for adding Convex to an already-running app: install `convex`, run `npx convex dev`, create backend functions in `convex/`, and commit generated code.
- [Convex CLI: `npx convex dev`](https://docs.convex.dev/cli/reference/dev)
  Primary source for the development loop and the optional `--start` command that can run Vite beside Convex.
- [Convex: Schemas](https://docs.convex.dev/database/schemas)
  Primary source for `convex/schema.ts`, validators, generated data-model types, and the fact that schemas are optional.
- [Convex: Query functions](https://docs.convex.dev/functions/query-functions)
  Primary source for query registration, file-based function names, database reads, and client-side generated references.
- [Convex API: FunctionReference](https://docs.convex.dev/api/modules/server#functionreference)
  Primary API reference explaining that `api.module.function` is a typed reference to a registered backend function.
- [Convex: Functions overview](https://docs.convex.dev/functions)
  Primary source for the roles of queries, mutations, and actions, including cached and subscribable queries.
- [`convex-solidjs` repository](https://github.com/frank-iii/convex-solidjs)
  Community-maintained Solid integration with `ConvexProvider`, `useQuery`, and `useMutation`. Use with care: it is not listed among Convex's official client libraries and its current npm release is `0.0.3`.
- [Convex: JavaScript client](https://docs.convex.dev/client/javascript)
  Official lower-level client to use if the community Solid adapter becomes a constraint or if direct subscription control is needed.

## Wisdom (Communities)

- [Convex Discord](https://convex.dev/community)
  Official community for checking current SolidJS integration practices and getting feedback from Convex practitioners.
- [SolidJS Discord](https://www.solidjs.com/community)
  Official Solid community for reviewing adapter patterns, cleanup, and fine-grained reactivity concerns.
