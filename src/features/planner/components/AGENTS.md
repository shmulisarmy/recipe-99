# Purpose

Own the interactive calendar, day sheet, and modal UI for planner days, recipes, and shopping carts.

# Ownership

- `planner.tsx` coordinates the calendar range, day selection, open modal state, keyboard movement, and touch-drag targeting.
- `day_cell.tsx` owns calendar-cell selection, meal thumbnails, readiness dots, desktop meal drag sources, and calendar-date drop targets.
- `day_detail.tsx` owns the selected day's bottom sheet, people-eating input, and beginning/end drop targets.
- `recipe_pill.tsx` owns the meal card plus pointer, touch, and keyboard movement controls.
- `shopping_list_card.tsx` owns the selected day's shopping summary and the way into the cart.
- `planner_modals.tsx` owns the shared modal shell, recipe details, recipe amount controls, and cart editing.
- `types.ts` owns projection-derived types.

# Local Contracts

- Recipe and day drag-and-drop must persist through generated planner mutations and preserve each planned recipe's stable `id`.
- The day sheet's people field stays in its body, uses a people icon, accepts non-negative integers, and saves the day multiplier.
- The recipe three-dot menu labels the user-facing control `Amount to make`; it accepts a positive multiplier and offers `Use day default` to remove the recipe override.
- Cart `toGet` measurements look unchanged at rest. Hover or keyboard focus reveals edit affordance; activation changes that row to original measurement, arrow, and editable amount/unit controls.
- Cart measurement edits remain local drafts until `Save changes`; one save submits all drafts through `BulkSetCartToGet` and the modal widens while drafts exist.
- A recipe that cannot be made offers `Add missing ingredients to cart`; the action adds its projected deficits to that recipe's planner day and exposes pending, success, and failure states at the button.
- Escape closes a modal normally, but a cart modal with unsaved measurement drafts must ask for confirmation first. Escape closes the day sheet only when no modal is open above it.
- Interactive controls inside a day cell or modal must not accidentally trigger the parent selection or backdrop-close handler.
- Generic selects match object-valued selections through their rendered semantic option index, never JavaScript object identity.
- The calendar shows two weeks around the selected day; the month heading toggles the full month grid. Calendar cells have one focusable date target and the day sheet owns people, meal, and movement actions.
- A calendar cell shows at most three draggable meal thumbnails plus a `+n` count; while the day sheet is open every cell shows readiness dots instead so the calendar stays scannable behind it.
- The route owns the day sheet: `/planner/day/:date` is the open sheet for that day, and closing it returns to `/planner` and restores focus to that date's calendar cell.
- Cross-day hover highlights the calendar target without expanding it; dropping on a date moves the occurrence to the beginning of that day.
- Touch dragging starts from the meal card handle, supports before-meal and end-of-day reordering, and moves to the beginning of a calendar date; `Move meal` remains the precise fallback.
- The explicit move surface can target an existing or missing date and place a meal first, before another meal, or last.
- Planned-recipe and cart overlays are route-owned; amount and explicit-move surfaces remain local overlays over the selected day.
- Meal thumbnails degrade to a tinted plate with the meal's initial whenever a photograph is missing or fails to load.

# Work Guidance

- Keep mutation loading and error state visible at the control that initiated the write.
- Maintain accessible names, focus-visible affordances, dialog semantics, and usable mobile layouts.
- Keep pointer dragging, touch dragging, keyboard lift/drop, and the explicit move surface wired to the same generated move mutations.
- Announce successful explicit moves and return focus through registered day rows rather than timing-dependent delays.

# Verification

- Run `npm run build`.
- In the authenticated browser, verify keyboard, pointer, and touch behavior for any changed control, including Escape, focus, modal width, save failure, and drag-and-drop when applicable.

# Child DOX Index
