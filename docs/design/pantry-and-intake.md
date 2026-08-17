# Pantry and intake

Pantry, batch intake, and reconciliation are separate page states. Do not combine them into a dashboard or nest reconciliation as a preview inside intake.

## Pantry

- title: `Pantry`;
- support: `Keep these amounts accurate so recipe readiness stays useful.`;
- primary action: `Add a batch`, linking to `/intake`.

Use a flat ledger with Ingredient, Stored amount, and Actions. Rows are separated by rules; there are no floating pantry cards. Quantities use tabular alignment.

### Replace stored amount

Activate `Edit {ingredient}` to replace the displayed amount with inline Amount and Unit controls. `Save amount` persists exactly that measurement; `Cancel` restores the confirmed value.

Reject non-numeric and negative values with `Enter an amount of 0 or more.` Enter saves. Escape cancels when no save is pending. Failure retains edit mode and shows `Couldn’t save {ingredient}. Try again.` Success shows local `Saved` briefly.

### Convert without changing quantity

`Convert unit` opens an anchored popover on desktop and bottom sheet on mobile. Show current amount, target unit, and preview such as `500 grams = 0.5 kilograms`. Disable Convert when target and current units match. Helper: `Conversion keeps the same quantity.`

Opening conversion moves focus into its named panel. Escape and the close action dismiss it and restore focus to the invoking `Convert unit` control. On mobile the sheet is modal: background content is inert, focus remains contained, and the sheet has a dismissible backdrop. On desktop the anchored popover remains contextual and non-modal.

Supported units are grams, kilograms, ounces, and pounds.

### Pantry states

- loading: row-shaped skeletons and `Checking your pantry…`;
- empty: `Your pantry is empty.` / `Add a batch to start checking recipes.` / `Start intake`;
- error: `Your pantry couldn’t load.` and `Try again`.