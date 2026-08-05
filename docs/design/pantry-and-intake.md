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

Supported units are grams, kilograms, ounces, and pounds.

### Pantry states

- loading: row-shaped skeletons and `Checking your pantry…`;
- empty: `Your pantry is empty.` / `Add a batch to start checking recipes.` / `Start intake`;
- error: `Your pantry couldn’t load.` and `Try again`.

## Intake step 1: review ingredients

`/intake` is a full-page workspace.

- title: `Add a batch`;
- support: `Review what came into the kitchen before updating the pantry.`;
- visible step indicator: `1 Review ingredients` and `2 Reconcile today’s cart`;
- primary action: `Add to pantry`.

The editable table contains Ingredient, Amount, Unit, Today's cart, and Remove. On mobile, each ingredient remains one labeled row.

- clone input before editing;
- normalize names to trimmed lowercase on blur and submission;
- require non-empty unique names;
- require a finite amount of zero or more;
- removing an ingredient removes its cart allocation;
- `Add ingredient` uses an inline row on desktop and bottom sheet on mobile, focusing Name;
- Enter adds a valid new row and Escape closes a blank add row;
- duplicate: `{ingredient} is already in this batch.`;
- empty name: `Enter an ingredient name.`;
- invalid amount: `Enter an amount of 0 or more.`

When an ingredient is still needed today, offer `Count up to 250 grams toward today’s cart`. Default unchecked. Allocation is the minimum of acquired amount and current remainder and updates when amount or unit changes.

Submission updates the pantry only. Pending: `Adding to pantry…`. Failure retains all rows and says `The pantry wasn’t updated. Try again.` Success keeps the cart allocation handoff and opens `/intake/reconcile`.

## Intake step 2: reconciliation

`/intake/reconcile` is another full-page workspace with step 2 active.

- title: `Finish today’s shopping list`;
- support: `Choose what should happen to each amount that is still needed.`

Each allocated ingredient shows Obtained, Still needed, and a required choice:

- `Keep on today’s cart`;
- `Move to tomorrow’s cart`;
- `Remove from today’s cart`.

Default Keep. Primary action: `Finish reconciliation`.

Keep leaves today's remainder. Move removes today's remainder and adds it to tomorrow in equivalent units. Remove deletes today's remainder without moving it.

Pending: `Updating shopping lists…`. Failure does not show completion and says `Shopping lists weren’t fully updated. Try again.` When no follow-up is needed, show `Pantry updated. Today’s shopping list needs no follow-up.` and `Back to pantry`.
