# Planner and meal movement

## Planner hierarchy

1. Current month and year, such as `August 2026`.
2. `Plan Meal`, retained as presentation-only until an existing planner action owns it.
3. Current-month calendar with leading and trailing dates.
4. Compact shopping-list preview for the selected date.
5. Route-owned selected-day, planned-recipe, or shopping-cart modal when open.

Do not imply month navigation until product behavior supports it.

## Calendar

Each day has one calendar-focus target: its date button. Recipe thumbnails are read-only presentation within the date control except that desktop thumbnails remain drag sources. Selecting the date opens the authoritative selected-day modal, preserving one coherent calendar focus model.

Calendar cells show:

- day number;
- up to three square recipe thumbnails;
- `+n` when additional meals exist.

The visible desktop thumbnails are pointer drag sources. Selecting the date exposes every meal in the authoritative day modal; the cell never expands or resizes.

Desktop cells are about 104px high. Meal names and readiness remain in the date button's accessible summary even though the visual cell uses imagery. Leading/trailing days use lower contrast. Today uses the planner action outline around the date. Selection uses a green border and matching date treatment; today and selection remain distinguishable.

Mobile cells are about 71px high and keep the same day-number, thumbnail, and additional-count language inside the rounded calendar card. At 385px and below the calendar becomes internally horizontally scrollable at a 344px minimum width rather than forcing page-level overflow. The date button accessible name includes the full date, today/selected state, complete meal-status totals, people, and shopping count; visual thumbnails are decorative and hidden from assistive technology.

Arrow keys move date-button focus by day. Home and End move to the week's first and last dates. Month keys are not assigned because month navigation is not provided.

## Closed-planner shopping preview

The closed Planner pairs the calendar with a pale, cyan-outlined shopping preview for the selected date. It shows the item count, at most four ingredient measurements, `+ n more items` when needed, and `Nothing to buy for this day.` when empty. `Start Shopping` opens the existing cart route. `Auto Shop` remains presentation-only until an existing product behavior owns it.

The preview sits beside the calendar at 1200px and above, then follows it as a single-column card. It is a summary, not a second cart editor.

## Selected-day modal

The selected-day modal is authoritative for the open date. It shows all meals in persisted order, not a duplicate truncated list. Its overlay header contains the date and planned-recipe count; the first section contains the People control. Each meal row contains:

- square recipe image with a screen-reader-only order number;
- full recipe title;
- Ready or Missing status;
- serving override only when it differs from the day amount;
- one `More actions` button.

Desktop pointer movement may expose a drag handle on row hover/focus, but do not show both drag and more controls constantly. On touch, the overflow menu contains `Open details`, `Amount to make`, and `Move meal`.

The bottom shows either `Nothing to buy for this day.` or shopping item count, obtained percentage, progress bar, and `Open shopping cart`.

No planned day: `No meals planned for Wednesday, August 5.` Do not invent people or cart values. On desktop the modal is centered at up to 620px wide. On mobile it is a bottom sheet, no taller than 72dvh, above the fixed primary navigation; the calendar remains visible beneath the scrim as a touch drop target. A drag handle and rounded top corners communicate the sheet behavior.

## Serving amounts

The day People input accepts a non-negative whole number and saves on Enter or blur. Invalid: `Enter a whole number of 0 or more.` Failure restores the confirmed value and shows `Couldn’t update people. Try again.`

`Amount to make` uses an anchored popover on desktop and bottom sheet on mobile:

- inherited copy: `Using the day amount: 3 people.`
- override accepts a finite number greater than zero, including fractions;
- primary action: `Save amount`;
- reset action: `Use day default`;
- invalid: `Enter an amount greater than 0.`;
- failure: `Couldn’t update the amount. Try again.`

After reset, remove the override and announce `Using the day default.`

## Forward-looking readiness

Planner readiness presents the fixed chronological projection:

1. start with the pantry;
2. process planned days in calendar order;
3. add each day's not-yet-obtained cart remainder before that day's meals;
4. process meals in their visible order;
5. scale requirements by recipe override or inherited day amount;
6. use an available substitute when the primary ingredient is insufficient;
7. consume projected amounts only when the meal can be made.

The selected-day modal has a quiet `How readiness works` disclosure:

`Recipe 99 looks ahead in date and meal order. It adds what is still expected from each day’s cart, then subtracts ingredients as planned meals use them.`

## Planned-recipe detail

Use the right-drawer surface defined in [the overlay matrix](overlays-surface-matrix.md). Content order:

1. recipe title, selected date, active amount, and readiness;
2. description;
3. `What this meal uses`, scaled to the active amount;
4. covered ingredients;
5. substitutions phrased `Use {substitute} instead of {primary}`;
6. missing ingredients with Need, Available, and Missing;
7. Amount to make;
8. `Add missing ingredients to cart` when needed.

While projected availability loads, show `Checking the projected pantry…` and no false verdict. Add-to-cart pending is `Adding missing ingredients…`; success is `Added to this day’s cart.`; failure is `Couldn’t add the missing ingredients. Try again.`

## Pointer drag

The persisted meal identity remains stable through every move.

1. Drag starts from a visible desktop calendar thumbnail or the handle revealed on a selected-day modal row's hover or focus.
2. Preview shows recipe title and current date; origin keeps a quiet placeholder.
3. Valid days receive a dashed outline; the active target receives a 2px enamel outline and quiet enamel fill.
4. Dropping on day space moves the meal to the beginning of that date.
5. Hovering a meal exposes an insertion line immediately before it; dropping there moves directly before that meal.
6. Meal targets take precedence over their day target and prevent bubbling.
7. Self and existing-location drops are no-ops and issue no move.
8. Within 48px of the scroll edge, scroll at no more than 12px per frame.
9. Escape or dropping outside a valid target cancels.
10. Show a local pending marker after drop. Failure restores confirmed order and offers `Retry move`.

Hovering a calendar day only highlights it; it never expands or resizes during the drag. Dropping on its day space moves the meal to position one. The user can select that date afterward for exact reordering.

Success announcement: `Moved Tomato pasta to Tuesday, August 5, position 1 of 2.`

## Keyboard movement

1. Focus `Move {recipe}` and press Space to lift.
2. Announce: `Lifted {recipe}. Use Left and Right to change day, Up and Down to change position, Space to drop, or Escape to cancel.`
3. Left/Right changes the proposed date by one day.
4. Up/Down changes insertion position without wrapping.
5. Space or Enter drops; Escape cancels and restores original focus.
6. Success focuses the moved row in its new location.

Outside lifted mode, arrows retain calendar or page behavior.

## Touch and explicit movement

Do not use long-press drag. The mobile selected-day modal exposes the drag handle directly: dragging over a meal moves before it, dragging to the end marker places it last, and dragging onto a calendar date moves it first on that date. `Move meal` remains a precise fallback with recipe title, seven-day strip, native date choice, and positions `First`, `Before {meal}`, or `Last`. Desktop and keyboard users can open the same move surface as a compact centered modal. It uses the same move result, feedback, and announcements as drag-and-drop.
