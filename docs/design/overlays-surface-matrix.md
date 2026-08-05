# Overlay surface matrix

Use surfaces by task consequence, not by component convenience.

| Task | Desktop | Mobile | Scrim |
| --- | --- | --- | --- |
| Planned-recipe detail | Right drawer, 560-620px | Full-height drawer | Light inspection scrim |
| Recipe-library detail | Right drawer, 560px | Full-height drawer | Light inspection scrim |
| Shopping-cart editing | Centered modal, 720px at rest and up to 760px with drafts | Full-height modal | Strong transaction scrim |
| Move meal | Compact centered modal, about 520px | Bottom sheet, maximum 85dvh | Strong transaction scrim |
| Amount to make | Anchored popover, about 320px | Bottom sheet | Light scrim only on mobile |
| Convert unit | Anchored popover, about 360px | Bottom sheet | Light scrim only on mobile |
| Pantry amount | Inline row editing | Inline row editing | None |
| Intake review | Full page | Full page | None |
| Reconciliation | Separate full page | Separate full page | None |
| Discard changes | Centered alert, about 420px | Centered alert with 16px margins | Strong scrim |

Inspection scrim: ink at approximately 24%. Transaction scrim: ink at approximately 44%. Do not blur either scrim.

## Shared overlay behavior

All overlays:

- have a visible title linked with `aria-labelledby`;
- use `role="dialog"` and `aria-modal="true"`, or `role="alertdialog"` for discard confirmation;
- move focus to the heading, first invalid field, or primary task control as appropriate;
- trap Tab and Shift+Tab;
- restore focus to the exact opener;
- close on Escape unless unsaved-draft protection intervenes;
- close on backdrop only when pointer down and up both occur on the backdrop;
- lock background scroll without changing page width;
- keep a 44px close icon control on mobile; never stretch the close control full width;
- keep header and footer fixed while the drawer or modal body flexes and scrolls;
- account for bottom safe area in mobile footers.

## Shopping-cart modal

Title: `Shopping for {day label}`. Summary: `{obtained count} of {item count} items complete`.

Each row shows ingredient, To get, Obtained, numeric percent, progress bar, and target edit affordance. Progress is obtained divided by target after unit normalization, clamped to 0-100%; target zero is 100%.

At rest, To get is plain measurement text. Edit mode shows:

`250 grams -> [300] [grams]`

The original remains visible. Multiple rows can be drafted. With drafts, the sticky footer shows `{n} unsaved changes`, `Cancel edits`, and `Save changes`; the desktop modal may widen from 720px to 760px.

Blank, negative, or non-numeric target amounts show `Enter a valid amount of 0 or more.` and focus the first invalid row. Failure preserves drafts: `Couldn’t save the shopping amounts. Try again.` Success clears drafts and announces `Shopping amounts saved.` Empty: `Nothing to buy for this day.`

Escape, backdrop, Close, browser Back, and route navigation all trigger the same confirmation when drafts exist:

- title: `Discard shopping changes?`;
- body: `Your edited amounts have not been saved.`;
- destructive: `Discard changes`;
- secondary: `Keep editing`.

The cart stays mounted and inert under the alert. Keep editing returns focus to the prior cart control.
