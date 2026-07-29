# Mission: Add Convex to Recipe-99

## Why
Turn this existing SolidJS + TypeScript + Vite application into a Convex-backed application without adopting SolidStart or disrupting the feature structure that already works.

## Success looks like
- Explain which code belongs in `src/` and which belongs in `convex/`
- Add the Convex client boundary to the existing SPA entry point
- Migrate one domain-data slice at a time while keeping transient UI state in Solid
- Run the frontend and Convex development loops together with generated types intact

## Constraints
- Keep SolidJS and Vite; do not introduce SolidStart
- Preserve the repository's `src/features/*/outside_feature_exports.ts` boundaries
- Prefer incremental migration over a whole-app rewrite

## Out of scope
- Authentication, production deployment, and wholesale data-model design
- Migrating every current in-memory store in the first pass
