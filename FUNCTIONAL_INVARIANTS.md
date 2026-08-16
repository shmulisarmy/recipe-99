# Functional invariants

This is the regression contract for the Recipe 99 redesign. Presentation may change; the behavior below must remain available, discoverable, and semantically equivalent.

## Authentication and shell

- Unauthenticated users see the Google sign-in gate. Loading, missing configuration, provider failure, authentication pending, and authentication failure remain visible and recoverable.
- Successful sign-in enters the authenticated application; sign-out removes authenticated content and returns to sign-in.
- The signed-in identity remains available from the application shell.
- Primary destinations remain Planner, Recipes, Pantry, and Intake in that order.
- `/` and `/sign-in` resolve to `/planner` for an authenticated user. Unknown routes offer a path back to Planner.
- A route-owned drawer or modal updates browser history; Back closes that surface before leaving its owning route.

## Routes and navigation-owned state

- `/planner`, `/planner/day/:date`, `/planner/day/:date/recipe/:plannedRecipeId`, and `/planner/day/:date/cart` retain their current meanings.
- `/recipes` and `/recipes/:recipeKey` retain search parameters `q` and `ready`; recipe identity remains the encoded `title@version` key.
- `/pantry`, `/intake`, and `/intake/reconcile` remain distinct destinations.
- Direct entry to reconciliation without a live handoff returns to Intake with guidance.
- Recipe and cart overlays preserve their owning route and restore the correct background state when closed.

## Pantry

- The pantry lists every stored ingredient with its current measurement.
- Editing replaces the stored amount and unit with the submitted measurement.
- Negative and non-numeric amounts are rejected; valid zero remains allowed.
- Unit conversion preserves the represented quantity rather than merely relabeling the unit.
- Built-in units and ingredient-associated custom units remain selectable where currently supported.
- Save, cancel, Enter, Escape, pending, success, and failure behavior remain local to the edited ingredient.

## Recipe library

- Recipes remain searchable by title and required ingredient name, case-insensitively.
- Search and the Ready-only filter combine, update the URL, and can be cleared.
- Results continue to distinguish Ready, Missing, and pantry-checking states.
- Recipe summaries retain descriptions, ingredient requirements, missing quantities, and substitute information.
- A user can open recipe details and add a recipe to a chosen planner date from the list or detail surface.
- Adding to an existing day appends the recipe. Adding to a missing date creates it with the existing defaults: one person and an empty shopping cart.
- Empty-library, no-match, Ready-only-empty, loading, and error states remain differentiated.

## Planner calendar and selected day

- The planner renders the current month with the leading and trailing dates needed to complete its weeks. The product does not currently promise month navigation.
- Today and the selected date remain distinguishable.
- Each planned day can expose its ordered recipes, recipe readiness, people count, and shopping-item count.
- Selecting a date updates the authoritative selected-day Day Ticket and the route when appropriate.
- On mobile, calendar cells keep compact complete Ready and Missing totals while full meal names and actions remain in the Day Ticket.
- Date buttons retain keyboard calendar navigation and meaningful accessible summaries.

## Meal order and movement

- Planned recipes retain stable identities during every move.
- Dropping a recipe on a date moves it to the beginning of that date.
- Dropping on another recipe places it immediately before that recipe.
- Dropping at a day's end marker places it last.
- Dragging from desktop calendar summaries and Day Ticket rows remains supported where currently available.
- Keyboard lift/move/drop and an explicit Move meal surface remain equivalent alternatives to pointer or touch dragging.
- Invalid, self, and same-position drops are no-ops. Failed persistence restores confirmed order and remains recoverable.

## Serving amounts and readiness

- Day people count accepts non-negative whole numbers.
- Planned recipes inherit the day amount unless they have an explicit positive multiplier override; fractional recipe overrides remain valid.
- A recipe override can be restored to the day default.
- Readiness is simulated in chronological date order and visible meal order.
- Each day's not-yet-obtained cart remainder is added before that day's meals.
- Required measurements scale by the active day or recipe amount.
- Substitutes are considered when a primary ingredient is insufficient.
- A meal consumes projected quantities only when it can be made under the existing projection rules.
- Recipe details continue to explain covered, substituted, consumed, and missing quantities.
- Missing quantities can be added to the selected day's cart without changing their current calculation semantics.

## Shopping carts

- Every cart remains owned by one planner date.
- The cart exposes target, already-obtained amount, unit-aware progress, and an empty state.
- Multiple target edits remain local drafts until bulk save.
- Blank, negative, and non-numeric target amounts are rejected.
- Failed saves retain drafts. Successful saves clear them and update the planner reactively.
- Escape, backdrop, close, browser Back, and route navigation all protect unsaved drafts through the same discard confirmation.

## Intake and reconciliation

- Receipt capture keeps its narrow 1:2 target, ideal 960 by 1920 capture, and device-aware camera preference with fallback.
- Captured images continue through browser OCR, authenticated Convex storage upload, AI-assisted draft generation, and reactive draft updates.
- The generated or supplied ingredient batch remains editable before persistence: name, amount, unit, add row, remove row, normalization, uniqueness, and validation.
- When an ingredient is still needed on today's cart, the user can choose how much acquired quantity counts as obtained.
- Pantry submission and shopping-list reconciliation remain separate confirmation steps.
- Reconciliation preserves Keep remainder today, Move remainder to tomorrow, and Remove remainder from today.
- A failed reconciliation does not report completion; no-follow-up and completed states remain explicit.

## Persistence and architecture

- Pantry, recipes, planner days, ordered planned recipes, multipliers, carts, custom units, and generated intake drafts remain persisted through Convex for the authenticated user.
- Ownership continues to derive from authenticated server identity, never a client-provided user identifier.
- The browser continues to use generated `api.*` references and the existing public alias modules.
- Redesign work must not change table shapes, validators, mutation semantics, measurement arithmetic, or Agent/storage lifecycle unless strictly required to preserve an existing UI flow.

## Interaction and accessibility

- Shared overlays keep the background inert, trap focus, close on Escape when safe, and restore focus to the exact opener.
- All important actions remain usable without hover and without drag-and-drop.
- Visible focus, named icon controls, field labels, associated error text, live status announcements, reduced motion, and non-color status cues remain mandatory.
- Mobile layouts support 320 CSS pixels without page-level horizontal scrolling and keep touch targets at least 44 by 44 pixels.
