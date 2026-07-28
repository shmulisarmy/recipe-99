# Convex uses generated name bridges

The learner recognized two non-obvious Convex boundaries: backend database queries identify a schema table with a string rather than the local `defineTable` value, and frontend `useQuery` receives a reference from `convex/_generated/api` rather than importing the backend function implementation. Future lessons can build on this understanding of separate runtimes and focus on how code generation makes those names type-safe.
