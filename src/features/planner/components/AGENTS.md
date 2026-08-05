# Purpose

Own the interactive calendar and modal UI for planner days, recipes, and shopping carts.

# Ownership

- `planner.tsx` coordinates calendar selection and open modal state.
- `day_cell.tsx` owns desktop calendar-cell interaction and the people-eating input.
- `day_detail.tsx` owns the selected-day mobile/detail view.
- `recipe_pill.tsx` owns recipe display and recipe-to-recipe drag-and-drop.
- `planner_modals.tsx` owns the shared modal shell, recipe details, recipe amount controls, and cart editing.
- `cart_button.tsx`, `_settings.ts`, and `types.ts` own small reusable planner UI pieces and projection-derived types.

# Local Contracts

- Recipe and day drag-and-drop must persist through generated planner mutations and preserve each planned recipe's stable `id`.
- The day-cell people field stays at the bottom of populated planner days, uses a people icon, accepts non-negative integers, and saves the day multiplier.
- The recipe three-dot menu labels the user-facing control `Amount to make`; it accepts a positive multiplier and offers `Use day default` to remove the recipe override.
- Cart `toGet` measurements look unchanged at rest. Hover or keyboard focus reveals edit affordance; activation changes that row to original measurement, arrow, and editable amount/unit controls.
- Cart measurement edits remain local drafts until `Save changes`; one save submits all drafts through `BulkSetCartToGet` and the modal widens while drafts exist.
- A recipe that cannot be made offers `Add missing ingredients to cart`; the action adds its projected deficits to that recipe's planner day and exposes pending, success, and failure states at the button.
- Escape closes a modal normally, but a cart modal with unsaved measurement drafts must ask for confirmation first.
- Interactive controls inside a day cell or modal must not accidentally trigger the parent selection or backdrop-close handler.
- Calendar cells have one focusable date target; the selected-day Day Ticket owns people, meal, cart, and movement actions.
- Planned-recipe and cart overlays are route-owned; amount and explicit-move surfaces remain local overlays over the selected day.

# Work Guidance

- Keep mutation loading and error state visible at the control that initiated the write.
- Maintain accessible names, focus-visible affordances, dialog semantics, and usable mobile layouts.
- Keep pointer dragging, keyboard lift/drop, and the explicit move surface wired to the same generated move mutations.

# Verification

- Run `npm run build`.
- In the authenticated browser, verify keyboard and pointer behavior for any changed control, including Escape, focus, modal width, save failure, and drag-and-drop when applicable.

# Child DOX Index
