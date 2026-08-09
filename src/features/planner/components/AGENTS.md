# Purpose

Own the interactive calendar and modal UI for planner days, recipes, and shopping carts.

# Ownership

- `planner.tsx` coordinates calendar selection, open modal state, keyboard movement, and touch-drag targeting.
- `day_cell.tsx` owns calendar-cell selection, desktop meal drag sources, and calendar-date drop targets.
- `day_detail.tsx` owns the selected Day Ticket, people-eating input, and beginning/end drop targets.
- `recipe_pill.tsx` owns recipe display plus pointer, touch, and keyboard movement controls.
- `planner_modals.tsx` owns the shared modal shell, recipe details, recipe amount controls, and cart editing.
- `cart_button.tsx`, `_settings.ts`, and `types.ts` own small reusable planner UI pieces and projection-derived types.

# Local Contracts

- Recipe and day drag-and-drop must persist through generated planner mutations and preserve each planned recipe's stable `id`.
- The Day Ticket people field stays in its header, uses a people icon, accepts non-negative integers, and saves the day multiplier.
- The recipe three-dot menu labels the user-facing control `Amount to make`; it accepts a positive multiplier and offers `Use day default` to remove the recipe override.
- Cart `toGet` measurements look unchanged at rest. Hover or keyboard focus reveals edit affordance; activation changes that row to original measurement, arrow, and editable amount/unit controls.
- Cart measurement edits remain local drafts until `Save changes`; one save submits all drafts through `BulkSetCartToGet` and the modal widens while drafts exist.
- A recipe that cannot be made offers `Add missing ingredients to cart`; the action adds its projected deficits to that recipe's planner day and exposes pending, success, and failure states at the button.
- Escape closes a modal normally, but a cart modal with unsaved measurement drafts must ask for confirmation first.
- Interactive controls inside a day cell or modal must not accidentally trigger the parent selection or backdrop-close handler.
- Calendar cells have one focusable date target; the selected-day Day Ticket owns people, meal, cart, and movement actions.
- Desktop calendar cells expose at most two draggable meal summaries; `+n more` selects that date so the full ordered Day Ticket becomes authoritative.
- Cross-day hover highlights the calendar target without expanding it; dropping on a date moves the occurrence to the beginning of that day.
- Mobile calendar cells expose complete `Ready` and `Missing` meal totals without listing meal names or using an additional-count suffix; dates remain at least 44 by 44 pixels and the selected Day Ticket stays available as a non-modal bottom sheet.
- Touch dragging starts from the Day Ticket handle, supports before-meal and end-of-day reordering, and moves to the beginning of a calendar date; `Move meal` remains the precise fallback.
- The explicit move surface can target an existing or missing date and place a meal first, before another meal, or last.
- Planned-recipe and cart overlays are route-owned; amount and explicit-move surfaces remain local overlays over the selected day.

# Work Guidance

- Keep mutation loading and error state visible at the control that initiated the write.
- Maintain accessible names, focus-visible affordances, dialog semantics, and usable mobile layouts.
- Keep pointer dragging, touch dragging, keyboard lift/drop, and the explicit move surface wired to the same generated move mutations.
- Announce successful explicit moves and return focus through registered day rows rather than timing-dependent delays.

# Verification

- Run `npm run build`.
- In the authenticated browser, verify keyboard, pointer, and touch behavior for any changed control, including Escape, focus, modal width, save failure, and drag-and-drop when applicable.

# Child DOX Index
