# Purpose

Own the multistep workflow for adding a batch of acquired ingredients to the pantry.

# Ownership

This feature owns the editable bulk-add form, its shopping-cart draft, and the transition to the next form step.

# Local Contracts

- `AvailableIngredientsBulkAddForm` receives the ingredient batch through `ingredientsToAdd` and edits a local clone.
- Users can add named amount/unit rows or remove rows before committing the batch; new names are normalized to lowercase and must be unique within the batch.
- Submission adds each batch quantity to `AvailableIngredients`, then calls `reSimulatePlannerProjection()` once.
- `shoppingCartAlreadyGot` tracks only the amounts proposed for addition to today's shopping-cart `alreadyGot`; this feature does not apply that draft yet.
- Pass `shoppingCartAlreadyGot` into `FormTemplateWithDataStructure` so the next step can continue the workflow.
- Code outside this feature imports its public values and types from `outside_feature_exports.ts`.

# Work Guidance

- Keep pantry mutation and shopping-cart mutation as separate steps.

# Verification

- Run `npm run build` after changing the workflow.

# Child DOX Index
