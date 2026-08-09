# Purpose

Own persisted recipes, latest-version references, and the server functions that read or create recipes.

# Ownership

- Recipe persistence owns recipe versions and each title's latest-version reference.
- Recipe reads list recipes or resolve one by document ID or title/version.
- Recipe writes create recipe versions.

# Local Contracts

- A recipe is identified by `title` and `version`; preserve the existing `versionedRecipe` lookup index for that pair.
- `recipesVersions` maps one `recipeTitle` to its `mostRecentVersion` through the existing `recipeTitle` index.
- `getRecipeByTitle` uses the requested version when supplied and otherwise resolves the latest-version reference; it returns `null` when no version can be resolved.
- Validate recipe documents and public return values from the shared `recipeValidator` source.
- Keep the client-facing recipe surface exported through `api.recipe_exports.*`.

# Work Guidance

- Preserve title/version lookup semantics when changing recipe creation or version tracking.

# Verification

# Child DOX Index
