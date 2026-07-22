# Planner Style Guide — Calendar View

The planner is a **month calendar**, visually identical to a classic calendar app
(Google Calendar month view is the reference). Planned recipes appear as event
pills inside day cells. All detail lives in modals — day cells stay scannable.

## Non-negotiable rules

1. **Green pill = recipe can be made. Red pill = recipe cannot be made.** No
   amber, no third state.
2. **No inline detail.** A red pill opens a modal explaining why it can't be
   made. Green pills open a modal too (what will be used), but may be simpler.
3. **Every planned day shows a cart button** with a count of items in that day's
   shopping cart. Clicking it opens a cart modal. Days with nothing planned show
   no cart button.
4. Do **not** modify `planner_logic.tsx`, `logic.ts`, `data.ts`,
   `planner_data.ts`, `planner_types.ts`, or `primitives/`. View code only.
5. Tailwind utility classes only — no new CSS files, no inline `style=`.

## Data source

`createPlannerProjection()` (src/planner_logic.tsx) — call it once. It returns
`Record<dateString, RecipeProjection[]>` where each item is
`{ recipe, multiplier, couldMake, scratchPadOfIngredientsNeededToUse }`.
Cart contents come read-only from `planner` (src/planner_data.ts), matched by
`date.toDateString()`.

**Deriving missing ingredients for the shortfall modal** (logic files must not
change): a required ingredient of `menu.get(recipeName)` is *missing* when
neither its `name` nor its `substitute?.name` has an entry in the projection's
`scratchPadOfIngredientsNeededToUse`. Ingredients that *are* in the scratchpad
are *covered*.

## Layout

- Page: `min-h-screen bg-stone-50`; content `mx-auto max-w-6xl px-4 py-8`.
- Calendar header: current month + year (e.g. **July 2026**),
  `text-2xl font-semibold tracking-tight text-stone-900`. Subtitle line
  `text-sm text-stone-500`: "Green means you'll have the ingredients that day; red means you won't."
- Weekday header row: `grid grid-cols-7`, labels Sun–Sat,
  `py-2 text-center text-xs font-medium uppercase tracking-wide text-stone-500`.
- Month grid: `grid grid-cols-7`, wrapped in
  `overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200`, cells
  separated with `border-t border-l border-stone-100` (grid lines like a real
  calendar). Render full weeks of the **current month** (leading/trailing
  out-of-month days included, grayed).

## Day cell

- `min-h-32 p-1.5 flex flex-col gap-1 bg-white`, out-of-month: `bg-stone-50`
  and day number `text-stone-300`.
- Day number top-**right** (`self-end`), `text-xs font-medium text-stone-500`.
  **Today**: number inside a filled circle
  `flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white`.
- Order inside cell: day number row (with cart button on the left of it), then
  recipe pills stacked.

## Recipe pill

- Base: `block w-full truncate rounded-md px-1.5 py-0.5 text-left text-xs font-medium capitalize`.
- Cookable: `bg-green-100 text-green-800 hover:bg-green-200`.
- Not cookable: `bg-red-100 text-red-800 hover:bg-red-200`.
- Multiplier ≠ 1 appends `×N` (e.g. "pancakes ×1.5").
- Names longer than `MAX_PILL_CHARS` (a single constant in Planner.tsx, currently
  14) are cut to the first `MAX_PILL_CHARS` characters + "…" — in the calendar
  cell only. The modal always shows the full name and all detail.
- Rendered as `<button>`; click opens the recipe modal.

## Cart button

- Sits in the day-number row (left side), only on days present in the planner.
- `inline-flex items-center gap-1 rounded-md bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-600 hover:bg-stone-200`,
  content: a cart SVG icon (16px, stroke) + the count of entries in
  `shoppingCart.toGet`. Count may be 0 — still show the button.
- Click opens the cart modal for that day.

## Modal shell (shared component)

- Overlay: `fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4`.
- Panel: `w-full max-w-md rounded-2xl bg-white p-6 shadow-xl`.
- Title row: `text-lg font-semibold capitalize text-stone-900` + close button
  (`×`, `rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600`)
  top-right.
- Closes on: close button, overlay click (not panel click), Escape key.
- `role="dialog" aria-modal="true"`. Never use `alert/confirm/prompt`.

## Recipe modal content

- Header: recipe name + status badge — cookable:
  `rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800` "Can make";
  not cookable: same shape `bg-red-100 text-red-800` "Can't make".
- Recipe description from `menu` in `text-sm text-stone-500`.
- **Not cookable:** section "Missing" — red rows: ingredient name (capitalize,
  `text-red-700 font-medium`) + required amount right-aligned; if it has a
  substitute, a sub-line `text-xs text-stone-500` "substitute: {name} ({amount})".
  Then, if the scratchpad is non-empty, section "Covered" — green chips
  (`bg-green-50 text-green-700`) with name + amount.
- **Cookable:** single section "Will use" — the scratchpad as green chips.
- Section labels: `text-xs font-medium uppercase tracking-wide text-stone-400`.

## Cart modal content

- Title: "Shopping — {Today | Tomorrow | Weekday, Mon D}".
- Rows from `toGet`: name (capitalize) left, amount right; below in
  `text-xs text-stone-500`: "already got {amount}" when `alreadyGot` has it.
- Empty cart: centered `text-sm text-stone-500` "Nothing to buy for this day."

### Cart item progress bar

Every `toGet` row gets a fill indicator directly under the name/amount line
showing what fraction is already bought.

- **Derivation — existing measurement primitives only** (never convert units
  by hand):
  - `remaining = Measurement_Minus(toGet, alreadyGot ?? ZeroedMeasurement())` —
    Minus returns its result **in `toGet`'s unit**, normalizing units.
  - `covered = Measurement_Minus(toGet, remaining)` — `alreadyGot` expressed in
    `toGet`'s unit.
  - `ratio = Measurement_Divide(covered, toGet.amount).amount` (the
    `Measurement_Divide` primitive performs the scalar division);
    `percent = Math.round(ratio * 100)`, clamped to 0–100.
  - Treat `Measurement_GTE(alreadyGot, toGet)` as exactly 100%. Guard
    `toGet.amount === 0` → 100%.
- **Track**: `h-1.5 w-full rounded-full bg-stone-100`.
- **Fill**: `h-1.5 rounded-full` with width set via Tailwind arbitrary value
  `w-[{percent}%]` (this is the one allowed dynamic-width exception; still no
  `style=` attribute if avoidable — if Tailwind can't handle a runtime
  percentage, an inline `width` style on this one element is permitted).
  Color: `bg-green-500` at 100%, `bg-sky-500` otherwise.
- **Label**: right of the sub-line, `text-xs tabular-nums text-stone-500`,
  e.g. "50%". The existing "already got {amount}" text stays.
- Accessibility: the row wraps the bar in
  `role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"`.

## Formatting helpers

- Measurements: `` `${Number(amount.toFixed(1))} ${unit}` ``.
- Day label: Today / Tomorrow / `toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })`.

## Responsive behavior

Breakpoint: Tailwind `sm` (640px). At `sm` and up everything renders per the
desktop spec above. Below `sm` (mobile):

- Header: `text-xl sm:text-2xl`.
- **Day cells go compact**: `min-h-14 sm:min-h-32`. Recipe pills and the cart
  button are hidden on mobile (`hidden sm:...`). Instead the cell shows a
  centered dot row (`flex sm:hidden justify-center gap-0.5`): one
  `h-1.5 w-1.5 rounded-full` dot per planned recipe — `bg-green-500` if
  cookable, `bg-red-500` if not.
- **Tapping a cell selects the day** (mobile interaction; desktop needs no
  selection). Selected cell gets `ring-2 ring-inset ring-stone-900` on mobile
  only (`sm:ring-0`). Default selection: today.
- **Day detail panel** — mobile only (`sm:hidden`), directly below the grid,
  `mt-4`, card `rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200`:
  - Heading row: day label (Today / Tomorrow / long form),
    `text-base font-semibold text-stone-900`, with the cart button (icon +
    count, same classes as the cell version but `text-xs px-2 py-1`) on the
    right when the day exists in the planner.
  - Then the day's recipes as stacked full-width pills (`space-y-1.5`), same
    green/red colors but roomier: `px-3 py-2 text-sm`, **untruncated** names.
    They open the same recipe modal.
  - Nothing planned: `text-sm text-stone-500` "Nothing planned."
- **Modals become bottom sheets on mobile**: overlay
  `items-end sm:items-center p-0 sm:p-4`; panel
  `rounded-t-2xl rounded-b-none sm:rounded-2xl max-w-none sm:max-w-md`.

## File layout

- `src/Planner.tsx` — page composition + state only (modal-open signals,
  selected-day signal, the month/cart lookups). Renders the grid of `DayCell`s,
  the mobile `DayDetail`, and the modals.
- `src/components/planner/types.ts` — `RecipeProjection` (derived from
  `ReturnType<typeof createPlannerProjection>`).
- `src/components/planner/recipe_pill.tsx` — `RecipePill` + `MAX_PILL_CHARS`.
- `src/components/planner/cart_button.tsx` — `CartButton` (cart icon + count).
- `src/components/planner/day_cell.tsx` — `DayCell` (one calendar cell:
  day-number row, cart button, pills, mobile dots/selection).
- `src/components/planner/day_detail.tsx` — `DayDetail` (mobile-only panel).
- `src/components/planner_modals.tsx` — `Modal` shell, `RecipeModal`,
  `CartModal`.

Component contracts:

```ts
export function RecipePill(props: {
  item: RecipeProjection;
  onOpen: () => void;
  truncate?: boolean;      // default true; DayDetail passes false
  class?: string;          // extra classes (e.g. DayDetail's roomier sizing)
}): JSX.Element;

export function CartButton(props: {
  count: number;
  onOpen: () => void;
  label: string;           // aria-label
  class?: string;
}): JSX.Element;

export function DayCell(props: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  recipes: RecipeProjection[];
  cartCount: number | undefined;   // undefined = day not in planner
  onSelectDay: () => void;
  onOpenRecipe: (item: RecipeProjection) => void;
  onOpenCart: () => void;
}): JSX.Element;

export function DayDetail(props: {
  dateStr: string;                 // toDateString() key
  recipes: RecipeProjection[];
  cartCount: number | undefined;
  onOpenRecipe: (item: RecipeProjection) => void;
  onOpenCart: () => void;
}): JSX.Element;
```

Modal contracts:

```ts
export function RecipeModal(props: {
  item: { recipe: string; multiplier: number; couldMake: boolean;
          scratchPadOfIngredientsNeededToUse: Map<string, Measurement> };
  onClose: () => void;
}): JSX.Element;

export function CartModal(props: {
  dateStr: string;          // toDateString() key
  onClose: () => void;
}): JSX.Element;            // reads the cart itself from planner_data
```
