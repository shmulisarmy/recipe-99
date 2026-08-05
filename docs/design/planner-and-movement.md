# Planner and meal movement

## Planner hierarchy

1. Current month and year, such as `August 2026`.
2. One support sentence: `Plan meals from what is on hand.`
3. Current-month calendar with leading and trailing dates.
4. Selected-day Day Ticket.
5. Route-owned recipe drawer or cart modal when open.

Do not imply month navigation until product behavior supports it.

## Calendar

Each day has one calendar-focus target: its date button. Meal summaries, cart count, and people count are read-only presentation within the cell. All actions occur in the selected Day Ticket, creating one coherent calendar focus model.

Desktop cells show:

- day number;
- at most two one-line meal summaries with Ready/Missing shape and text;
- `+n more` when additional meals exist;
- cart item count and people count when the day exists.

Cells are compact, about 102-112px high. Full meal names truncate visually but remain in the date button's accessible summary. Leading/trailing days use lower contrast. Today uses an enamel outline around the date. Selection uses a quiet enamel background and solid enamel date treatment; today and selection remain distinguishable.

Mobile cells are at least 52px high, and their single date target is at least 44 by 44px even at a 320px viewport. The calendar may extend through the mobile page gutters to preserve seven equal columns without horizontal page scrolling; the Day Ticket retains the normal page gutters. Cells contain the day number plus complete Ready and Missing shape/count totals, for example a check with `4` and a warning with `1`. Do not add `+n` to mobile totals because Ready and Missing already account for every meal. Use 10-11px text. The date button accessible name includes the full date, today/selected state, the same complete meal-status totals, people, and shopping count; visual marks are decorative and hidden from assistive technology.

Arrow keys move date-button focus by day. Home and End move to the week's first and last dates. Month keys are not assigned because month navigation is not provided.

## Day Ticket

The Day Ticket is authoritative for the selected day. It shows all meals in persisted order, not a duplicate truncated list. The header contains a short date and the People control. Each row contains:

- order number without a leading zero;
- full recipe title;
- Ready or Missing status;
- serving override only when it differs from the day amount;
- one `More actions` button.

Desktop pointer movement may expose a drag handle on row hover/focus, but do not show both drag and more controls constantly. On touch, the overflow menu contains `Open details`, `Amount to make`, and `Move meal`.

The bottom of the Ticket shows either `Nothing to buy for this day.` or shopping item count, obtained percentage, progress bar, and `Open shopping cart`.

No planned day: `No meals planned for Wednesday, August 5.` Do not invent people or cart values. On mobile, the Ticket follows the calendar after a subtle 10-12px handoff gap and restrained enamel top accent; it keeps ordinary page padding and does not become a new card metaphor. Its authoritative short date is about 15px, with `Today` subordinate. Scroll its heading into view only when it is below the viewport.

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

The Day Ticket has a quiet `How readiness works` disclosure:

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

1. Drag starts from the handle revealed on row hover or focus.
2. Preview shows recipe title and current date; origin keeps a quiet placeholder.
3. Valid days receive a dashed outline; the active target receives a 2px enamel outline and quiet enamel fill.
4. Dropping on day space moves the meal to the beginning of that date.
5. Hovering a meal exposes an insertion line immediately before it; dropping there moves directly before that meal.
6. Meal targets take precedence over their day target and prevent bubbling.
7. Self and existing-location drops are no-ops and issue no move.
8. Within 48px of the scroll edge, scroll at no more than 12px per frame.
9. Escape or dropping outside a valid target cancels.
10. Show a local pending marker after drop. Failure restores confirmed order and offers `Retry move`.

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

Do not use long-press drag. `Move meal` opens a bottom sheet with recipe title, seven-day strip, native date choice, and positions `First` or `Before {meal}`. Desktop and keyboard users can open the same move surface as a compact centered modal. It uses the same move result, feedback, and announcements as drag-and-drop.
